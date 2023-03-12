import React, {useEffect} from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  Platform,
  Image
} from "react-native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { initStripe, useStripe } from "@stripe/stripe-react-native";
import {getStripeSheet} from '../../../../shared/slices/wallet/walletService';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { paypalPng, payoneerPng, stripePng } from '../../../../images/export';
import {setRootLoading} from '../../../../shared/slices/rootSlice';
import {store, BaseUrl} from '../../../../shared';
import {useIsFocused} from '@react-navigation/native';

const ApplePayMark = () => {
  return (
    <View style={[styles.selectButton, { marginRight: 16 }]}>
        <Text style={[styles.boldText, { color: "#007DFF" }]}>
          Apple
        </Text>
    </View>
  )
}
const notApply = () => {
  Toast.show({
    type: "success",
    text1: "sorry, this payment not yet implemented."
  })
}
const MethodSelector = ({ onPress, paymentMethod }) => {
  console.log(paymentMethod)
  return (
    <View style={{padding: 30, paddingBottom: 0, width: "100%", backgroundColor: 'white' }}>
      <Text
        style={{
          fontSize: 14,
          letterSpacing: 1.5,
          color: "black",
          textTransform: "uppercase",
        }}
      >
        Select payment method
      </Text>

      {!paymentMethod && (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Pressable
            onPress={onPress}
            style={{
              paddingVertical: 8,
              alignItems: "center",
            }}
          >
            {Platform.select({
              ios: <ApplePayMark height={59} />,
              android: <Image source={stripePng} style={{width: 80, height: 70}}/>,
            })}
          </Pressable>
          <Pressable
            onPress={notApply}
            style={{
              paddingVertical: 8,
              alignItems: "center",
            }}
          >
            <Image source={paypalPng} style={{width: 80, height: 80}}/>
          </Pressable>
          <Pressable
            onPress={notApply}
            style={{
              paddingVertical: 8,
              alignItems: "center",
            }}
          >
            <Image source={payoneerPng} style={{width: 80, height: 80}}/>
          </Pressable>
        </View>

      )}

      {!!paymentMethod && (
        <Pressable
          onPress={onPress}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 8,
            marginTop:10,
            padding: 20
          }}
        >
          <View style={{ marginRight: 16 }}>
            <Text style={[styles.boldText, { color: "#007DFF" }]}>
              {paymentMethod.label}
            </Text>
          </View>
          <Text style={[styles.boldText, { color: "#007DFF", flex: 1 }]}>
            Change
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const AppContent = ({product, navigation}) => {
  console.log("product", product)
  console.log((product.isMonth?(product.quantity*product.monthly):(product.quantity*product.yearly)) - product.leftPrice)
  const user_id = store.getState().authentication.userId;
  const [checkout, setCheckout] = React.useState(null);
  const [paymentMethod, setPaymentMethod] = React.useState();
  const isFocused = useIsFocused();

  const { initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment } =
    useStripe();
  useEffect(() => {setCheckout(null)}, [])
  const navigateBack = () => {
    setCheckout(null);
  };
  const navigateToCheckout = async () => {
    store.dispatch(setRootLoading(true));
    console.log(product, user_id)
    const response = await getStripeSheet({product, user_id});
    const { publishableKey, clientSecret, merchantName, ephemeralKey, customer } = response;
    await initStripe({
      publishableKey,
      merchantIdentifier: "yourMerchantIdentifier",
    });

    await initializePaymentSheet(clientSecret, merchantName, ephemeralKey, customer);
    store.dispatch(setRootLoading(false));
    setCheckout({
      publishableKey,
      clientSecret,
      merchantName,
      product,
    });
  };

  const initializePaymentSheet = async (clientSecret, merchantName, ephemeralKey, customer) => {
    const { error, paymentOption } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      customerEphemeralKeySecret: ephemeralKey,
      customerId: customer,
      customFlow: true,
      merchantDisplayName: merchantName,
      style: "alwaysDark", // If darkMode
      googlePay: true, // If implementing googlePay
      applePay: true, // If implementing applePay
      merchantCountryCode: "ES", // Countrycode of the merchant
      // testEnv: __DEV__, // Set this flag if it's a test environment
    });
    console.log(paymentOption)
    if (error) {
      console.log(error);
    } else {
      setPaymentMethod(paymentOption);
    }
  };

  const handleSelectMethod = async () => {
    const { error, paymentOption } = await presentPaymentSheet({
      confirmPayment: false,
    });
    if (error) {
      alert(`Error code: ${error.code}`, error.message);
    }    
    setPaymentMethod(paymentOption);
  };

  const handleBuyPress = async () => {
    if (paymentMethod) {
      store.dispatch(setRootLoading(true));
      const response = await confirmPaymentSheetPayment();

      if (response.error) {
        alert(`Error ${response.error.code}`);
        console.error(response.error.message);
      } else {
        const response = await axios({
          method: 'POST',
          url: `${BaseUrl}/logged-in-user/purchaseMembership`,
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
          data: {
            user_id,
            m_id: product.id,
            quantity: product.quantity,
            isMonth: product.isMonth,
            offer: product.offer
          },
        });
        if (response.status === 200) {
          Toast.show({
            type: 'success',
            text1: response.data.msg
          })
          navigation.navigate("BuySpace")
          setCheckout(null);
        } else {
          Toast.show({
            type: 'error',
            text1: "response.data.msg"
          })
        }
      }
      store.dispatch(setRootLoading(false));
    }
  };
  const formatDate = () => {
    let now = new Date();
    let day = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();
    if (day < 10)  day = '0' + day; 
    if (month < 10)  month = `0${month}`; 
    //next date
    let nmonth = 0;
    let nyear = 0;
    if (product.isMonth) {
      let temp = month*1 + product.quantity;
      nyear = year*1 + Math.trunc(temp/12);
      nmonth = temp%12;
      if (nmonth < 10)  nmonth = `0${nmonth}`; 
    } else {
      nyear = year*1 + product.quantity;
      nmonth = month;
    }
    return `${year}-${month}-${day} ~ ${nyear}-${nmonth}-${day}`
  }
  return (
    <View style={styles.container}>
      {!!product.offer ? (
       <View style={{width: "90%"}}>        
        <View style={[styles.cardContainer1]}>
          <View>
            <View style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'red',
                width: 80,
                height: 50,
                borderBottomLeftRadius: 60,
                borderTopRightRadius: 20,
            }}>
                <Text style={styles.whitetext}>{product.down}%</Text>
            </View>
            <View style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text style={styles.redtext}>{product.space} Booing Space</Text>
                <Text style={styles.normaltext}>LEFTTIME</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#797D7F', fontSize: 24, textDecorationLine: 'line-through' }}> {product.before} </Text>
                    <Text style={{ color: '#797D7F', fontSize: 14, textDecorationLine: 'line-through' }}> EUR</Text>
                    <Text style={{ color: '#797D7F', fontSize: 28, }}>/</Text>
                    <Text style={{ color: 'black', fontSize: 28, fontWeight: 'bold' }}>{product.after}</Text>
                    <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}> EUR</Text>
                </View>
                <Text style={{
                    color: 'black', fontSize: 14, lineHeight: 21, fontWeight: 'bold', letterSpacing: 0.25,
                }}>
                    ON-TIME PAYMENT
                </Text>
            </View>
          </View>
        </View>
        {!checkout && (
          <View style={styles.action}>
            <Pressable style={styles.button} onPress={() => navigation.navigate(product.offer?"Offer":"BuySpace")}>
              <Text style={styles.whitetext}>
                Cancel
              </Text>
            </Pressable>  
            <Pressable style={styles.button} onPress={navigateToCheckout}>
              <Text style={styles.whitetext}>
                Buy
              </Text>
            </Pressable>  
          </View>
        )}            
      </View>
      ) : (
        <View style={{width: "90%"}}>
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.whitetext}> VALUE PLAN</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={styles.boldtext}>Plus</Text>
                <Text style={styles.boldtext}>{product.space}</Text>
              </View>
              <View style={{flexDirection:'row'}}>
              <Text style={{color:'black', fontSize:16, fontWeight:'bold', letterSpacing:0.5}}> € {product.monthly}/ </Text>
               <Text style={styles.normaltext}> Month </Text> 
               <Text style={{color:'black', fontSize:16, fontWeight:'bold', letterSpacing:0.5}}> Or {product.yearly}€ /Year </Text>
              </View>
              <View style={{marginTop:8}}>
              <Text style={styles.normaltext}>Sync Across Unlimited Devices</Text>
              <Text style={styles.normaltext}>Auto-Upload More Photos With Ease</Text>
              <Text style={styles.normaltext}>Revert Any Change Within 30 Days</Text>
              </View>
            </View>
          </View>
          <View style={{backgroundColor: 'white', marginTop: 10, padding: 10}}>
            <View style={{flexDirection: "row", marginTop: 4}}>
              <Text style={[styles.normaltext, {width: "35%"}]}>Period: </Text>
              <Text style={[styles.normaltext, {width: "60%"}]}>{product.quantity}{product.isMonth?" month(s)":" year(s)"}</Text>
            </View>
            <View style={{flexDirection: "row", marginTop: 4}}>
              <Text style={[styles.normaltext, {width: "35%"}]}></Text>
              <Text style={[styles.normaltext, {width: "60%"}]}>{formatDate()} </Text>
            </View>
            <View style={{flexDirection: "row", marginTop: 4}}>
              <Text style={[styles.normaltext, {width: "35%"}]}>Space: </Text>
              <Text style={[styles.normaltext, {width: "60%"}]}>{product.space}</Text>
            </View>
            { product.leftPrice > 0 && (
              <>
              <View style={{flexDirection: "row", marginTop: 4}}>
                <Text style={[styles.normaltext, {width: "35%"}]}>price: </Text>
                <Text style={[styles.normaltext, {width: "60%"}]}>€ {product.isMonth?(product.quantity*product.monthly):(product.quantity*product.yearly)}</Text>
              </View>
              <View style={{flexDirection: "row", marginTop: 4}}>
                <Text style={[styles.normaltext, {width: "35%"}]}>refund: </Text>
                <Text style={[styles.normaltext, {width: "60%"}]}>€ {product.leftPrice}</Text>
              </View>
              </>
            )}
            <View style={{flexDirection: "row", marginTop: 4}}>
              <Text style={[styles.normaltext, {width: "35%"}]}>total: </Text>
              <Text style={[styles.normaltext, {width: "60%"}]}>€ {Math.trunc(((product.isMonth?(product.quantity*product.monthly):(product.quantity*product.yearly))-product.leftPrice)*100)/100}</Text>
            </View>
          </View>
          {!checkout && (
            <View style={styles.action}>
              <Pressable style={styles.button} onPress={() => navigation.navigate("BuySpace")}>
                <Text style={styles.whitetext}>
                  Cancel
                </Text>
              </Pressable>  
              <Pressable style={styles.button} onPress={navigateToCheckout}>
                <Text style={styles.whitetext}>
                  Buy
                </Text>
              </Pressable>  
            </View>
          )}
        </View> 
      )}
      {!!checkout && (
        <View 
          style={{
            width: "90%", 
            backgroundColor: 'white',
            borderWidth: 1,
            borderRadius: 5,
            borderColor: 'grey',
            marginTop: 30
          }}
        >
          <MethodSelector
            onPress={handleSelectMethod}
            paymentMethod={paymentMethod}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignSelf: "stretch",
              marginHorizontal: 24,
            }}
          >
            <Pressable onPress={navigateBack} style={[styles.button, {backgroundColor: 'white', borderColor: "grey", borderWidth: 1}]}>
              <Text style={{ width: 50, textAlign: 'center' }}>Back</Text>
            </Pressable>
            {!!paymentMethod && 
              <Pressable style={styles.button} onPress={handleBuyPress}>
                <Text style={{ color: "white", width: 50, textAlign: 'center' }}>Buy</Text>
              </Pressable>
            }
          </View>
        </View>
      )}
    </View>
  );
};

export default function StripPay({route, navigation}) {
  return (
    <StripeProvider>
      <AppContent product={route.params} navigation={navigation} />
    </StripeProvider>
  );
}


const styles = StyleSheet.create({
  selectButton: {
    height: 80
  },
  boldText: {
    color: 'black',
    fontWeight: 'bold'
  },
  cardBody: {
    flexDirection: 'column',
    padding: 20,
   backgroundColor: 'white'
  },
  cardContainer: {
    flexDirection: 'column',
    marginTop: 10,
    width: '100%',
    borderStyle:'solid',
    borderWidth: 1,
    borderColor:'#797D7F'
  },
  cardContainer1: {
      flexDirection: 'column',
      marginTop: 40,
      width: '100%',
      paddingBottom: 30,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#797D7F',
      borderRadius: 20,
      backgroundColor: '#ffffff'
  },  
  cardHeader: {
    padding: 10,
    backgroundColor: 'black',
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
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  whitetext: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  normaltext: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#797D7F',
  },
  boldtext: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  containerFolder: {
    flexDirection: 'row',
  },  
  action: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#33a1f9',
  },
  redtext: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'red',
  },  
})
