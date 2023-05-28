import React, {useState, useEffect} from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {BuySpaceheader, offerdata} from './components';
import {AXIOS_ERROR, BaseUrl, store} from '../../../../shared';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';

const BuySpace = ({navigation}: {navigation: any}) => {
  const user_id = store.getState().authentication.userId;
  const [membership, setMembership] = useState({})
  const isFocused = useIsFocused();
  const [products, setProducts] = useState(offerdata);
  const getMembership = async () => {
      const response = await axios({
        method: 'POST',
        url: `${BaseUrl}/logged-in-user/getMembership/${user_id}`,
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      });

      if (response.status === 200) {
        const data = response.data.data;
        // data['m_id'] = "Pluse-50T"
        const info = products.filter(item => item.id===data['m_id']);
        if (info[0]) data['info'] = info[0];
        console.log("membership", data)
        setMembership(data);
      }
  }
  useEffect(() => {
    if (isFocused) {
      getMembership()
    }
  }, [isFocused]);
  const handleCheckout = (product, isMonth) => {
    product.isMonth = isMonth;
    product.offer = false;
    product.left = membership.left;
    if (membership?.m_id === "2TB-Booing-Space" || membership?.m_id === "Free") {
      product.leftPrice = 0
    } else {
      try {
        let leftPrice = membership.left*(membership.isMonth?membership.info.monthly:(membership.info.yearly/12));
        let upgate = (product.isMonth?(product.quantity*product.monthly):(product.quantity*product.yearly))-leftPrice;
        if (upgate > 0) product.leftPrice = Math.trunc(leftPrice*100)/100;
        else product.leftPrice = 0;
      } catch {
        product.leftPrice = 0;        
      }
    }
    product.total = Math.trunc(((product.isMonth?(product.quantity*product.monthly):(product.quantity*product.yearly))-product.leftPrice)*100)/100;

    navigation.navigate("Payments", product);
  }
  const setQuantity = (ind, plus) => {
    const data = [...products]
    if (plus === 'plus') {
      data[ind]['quantity'] += 1; 
    } else if (plus === 'minus') {
      if (data[ind]['quantity'] > 1) {
        data[ind]['quantity'] -= 1; 
      }
    } else {
      data[ind]['quantity'] = 1; 
    }
    setProducts(data)
  }
  const formatDate = (time) => {
    const date = new Date(time);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return  `${year}-${month}-${day}`;
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <BuySpaceheader />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.body}>
        {membership.m_id && membership?.m_id !== "Free" && membership?.m_id !== "2TB-Booing-Space" && (
          <View style={styles.cardContainer} key="membership">
            <View style={styles.cardHeader1}>
              <Text style={styles.whitetext}> CURRENT MEMBERSHIP</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={styles.boldtext}>{membership.info?.id}</Text>
                <Text style={styles.boldtext}>{membership.info?.space}</Text>
              </View>
              <View style={{flexDirection:'row'}}>
               <Text style={{color:'black', fontFamily: 'Rubik-Bold', fontSize:16, letterSpacing:0.5}}> € {membership.info?.monthly}/ </Text>
               <Text style={styles.normaltext}> Month </Text> 
               <Text style={{color:'black', fontFamily: 'Rubik-Bold', fontSize:16, letterSpacing:0.5}}> Or {membership.info?.yearly}€ / </Text>
               <Text style={styles.normaltext}> Year </Text> 
              </View>  
              <View style={{marginTop:8}}>
                <Text style={styles.normaltext}>start date:     {formatDate(membership.start)}</Text>
                <Text style={styles.normaltext}>expire date:  {formatDate(membership.expire)}</Text>
              </View>              
            </View>
          </View>      
        )}
        {membership?.m_id === "2TB-Booing-Space" && (
          <View style={styles.cardContainer} key="membership">
            <View style={styles.cardHeader1}>
              <Text style={styles.whitetext}> CURRENT MEMBERSHIP</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={styles.boldtext}>ONE-TIME PAYMENT</Text>
                <Text style={styles.boldtext}>2TB</Text>
              </View> 
              <View style={{marginTop:8}}>
                <Text style={styles.normaltext}>start date:     {formatDate(membership.start)}</Text>
              </View>              
            </View>
          </View>      
        )}
          { products.map((product, ind) => {
            return (
              <View style={styles.cardContainer} key={product.id}>
                <View style={styles.cardHeader}>
                  <Text style={styles.whitetext}> MOST POPULAR</Text>
                </View>
                <View style={styles.cardBody}>
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={styles.boldtext}>Plus</Text>
                    <Text style={styles.boldtext}>{product.space}</Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                   <Text style={{color:'black', fontFamily: 'Rubik-Bold', fontSize:16, letterSpacing:0.5}}> € {product.monthly}/ </Text>
                   <Text style={styles.normaltext}> Month </Text> 
                   <Text style={{color:'black', fontFamily: 'Rubik-Bold', fontSize:16, letterSpacing:0.5}}> Or {product.yearly}€ / </Text>
                   <Text style={styles.normaltext}> Year </Text> 
                  </View>
                  <View style={{marginTop:8}}>
                    <Text style={styles.normaltext}>Sync Across Unlimited Devices</Text>
                    <Text style={styles.normaltext}>Auto-Upload More Photos With Ease</Text>
                    <Text style={styles.normaltext}>Revert Any Change Within 30 Days</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <Text style={{ color: 'black', fontFamily: 'Rubik-Bold', fontSize: 14,  marginRight: 10}}>Period</Text>
                    <View style={{
                      justifyContent: 'center', alignItems: 'center', flexDirection: 'row',
                    }}>
                      <Pressable onPress={() => setQuantity(ind, 'minus') }
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#CDD0D1',
                          borderStyle: 'solid',
                          borderWidth: 1,
                          borderColor: '#CDD0D1',
                          width: 20,

                        }} >
                        <Text style={{ color: 'black', fontFamily: 'Rubik-Bold', fontSize: 14,  }}>-</Text>
                      </Pressable>
                      <Text style={{
                        textAlign: 'center',
                        color: 'black',
                        fontFamily: 'Rubik-Bold', fontSize: 14,
                        
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#CDD0D1',
                        width: 25
                      }}> {product.quantity} </Text>
                      <Pressable onPress={() => setQuantity(ind, 'plus') }
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#CDD0D1',
                          borderStyle: 'solid',
                          borderWidth: 1,
                          borderColor: '#CDD0D1',
                          width: 20
                        }}>
                        <Text style={{ color: 'black', fontFamily: 'Rubik-Bold', fontSize: 14,  }}>+</Text>
                      </Pressable>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ color: '#000000', fontFamily: 'Rubik-Regular', fontSize: 14, marginLeft: 10 }}> {product.quantity>1?'months/years':'month/year'} </Text>
                    </View>
                  </View>                  
                  <View style={styles.action}>
                    <Pressable style={styles.button} onPress={() => handleCheckout(product, 1)}>
                      <Text style={styles.whitetext}>
                        BUY ({product.quantity} Month{product.quantity>1?"s":""})
                      </Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => handleCheckout(product, 0)}>
                      <Text style={styles.whitetext}>
                        BUY ({product.quantity} Year{product.quantity>1?"s":""})
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  )
}

export default BuySpace

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginHorizontal: 0,
    width: '100%',
  },
  body: {
    flex: 1,
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems:'center'
   
  },
  cardBody: {
    flexDirection: 'column',
    padding: 20,
   backgroundColor: 'white'
  },
  cardContainer: {
    flexDirection: 'column',
    marginTop: 10,
    width: '90%',
    borderStyle:'solid',
    borderWidth: 1,
    borderColor:'#797D7F'
  },
  cardHeader: {
    padding: 10,
    backgroundColor: 'black',
  },
  cardHeader1: {
    padding: 10,
    backgroundColor: '#33a1f9',
  },
  container: {
    flex: 1,
    // backgroundColor: "#33a1f9",
    alignItems: 'center',
    color: '#33a1f9',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    // flexWrap: "wrap",
    // flexDirecton: "row",
  },
  containerImage: {
    backgroundColor: '#33a1f9',
    width: '100%',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Rubik-Regular', fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  whitetext: {
    fontFamily: 'Rubik-Bold', fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
  normaltext: {
    fontFamily: 'Rubik-Bold', fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#797D7F',
  },
  boldtext: {
    fontFamily: 'Rubik-Bold', fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'black',
  },
  containerFolder: {
    flexDirection: 'row',
  },
  action: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '42%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#33a1f9',
  },
});