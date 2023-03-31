import React, {useEffect, useState} from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  BackHandler
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
import PayPalButton from '../Paypal/PayPalButton';
import StripeButton from '../Stripe/StripeButton';

const notApply = () => {
  Toast.show({
    type: "success",
    text1: "sorry, this payment not yet implemented."
  })
}

const AppContent = ({product, navigation}) => {
  console.log("product", product)
  const user_id = store.getState().authentication.userId;
  const [processing, setProcessing] = React.useState(null);
  const isFocused = useIsFocused();

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
  useEffect(() => {
    const backAction = (e) => {
      console.log(product.offer)
      if (processing) {
        setProcessing(null)
      } else {
        navigation.navigate(product.offer?"Offer":"BuySpace");
      }
      return true
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    setProcessing(null);
  }, [isFocused])
  const handleSuccess = () => {
    Toast.show({
      type: 'success', 
      text1: `Contratulation!, you purchased ${product.id} membership.`
    })
    setProcessing(null);
    navigation.navigate(product.offer?"Offer":"BuySpace")
  }
  const handleCancel = () => {
    Toast.show({
      type: 'info', 
      text1: `You canceled payment.`
    })
    setProcessing(null);
  }
  const handleProcessing = (val) => {
    setProcessing(val);
    console.log(val)
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={!processing?{ height: '100%', justifyContent: 'center', width: '90%' }:{}}>
        {!processing && (
          product.offer ? (
           <View>        
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
                        <Text style={{ color: '#797D7F', fontFamily: 'Rubik-Regular', fontSize: 24, textDecorationLine: 'line-through' }}> {product.before} </Text>
                        <Text style={{ color: '#797D7F', fontFamily: 'Rubik-Regular', fontSize: 14, textDecorationLine: 'line-through' }}> EUR</Text>
                        <Text style={{ color: '#797D7F', fontFamily: 'Rubik-Regular', fontSize: 28, }}>/</Text>
                        <Text style={{ color: 'black', fontFamily: 'Rubik-Bold', fontSize: 28 }}>{product.after}</Text>
                        <Text style={{ color: 'black', fontFamily: 'Rubik-Bold', fontSize: 14 }}> EUR</Text>
                    </View>
                    <Text style={{
                        color: 'black', fontFamily: 'Rubik-Bold', fontSize: 14, lineHeight: 21, letterSpacing: 0.25,
                    }}>
                        ON-TIME PAYMENT
                    </Text>
                </View>
              </View>
            </View>
          </View>
          ) : (
            <View>
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
                  <Text style={{color:'black', fontFamily: 'Rubik-Bold', fontSize:16, letterSpacing:0.5}}> € {product.monthly}/ </Text>
                   <Text style={styles.normaltext}> Month </Text> 
                   <Text style={{color:'black', fontFamily: 'Rubik-Bold', fontSize:16, letterSpacing:0.5}}> Or {product.yearly}€ /Year </Text>
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
                  <Text style={[styles.normaltext, {width: "60%"}]}>€ {product.total}</Text>
                </View>
              </View>
            </View> 
          )
        )}
        {!processing && <Text style={[styles.boldText, {marginTop: 20}]}>Select payment method: </Text>}
        <View style={!processing?styles.paymentMethod:{}}>
          {(!processing || processing==='paypal') && <PayPalButton
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            handleProcessing={handleProcessing}
            processing={processing}
            product={product}
            user_id={user_id} // This is an example of passing in a user ID prop
          />}
          {(!processing || processing==='stripe') && <StripeButton
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            handleProcessing={handleProcessing}
            processing={processing}
            product={product}
            user_id={user_id} // This is an example of passing in a user ID prop
          />}
          {(!processing || processing==='payoneer') && (
            <>
              <TouchableOpacity style={styles.paybutton} onPress={notApply}>
                <Image source={payoneerPng} style={{width: 80, height: 80}}/>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
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
    fontFamily: 'Rubik-Bold'
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
    alignItems: 'center',
    color: '#33a1f9',
    height: '100%',
    width: '100%',
  },
  containerImage: {
    backgroundColor: '#33a1f9',
    width: '100%',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Rubik-Regular', 
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  whitetext: {
    fontFamily: 'Rubik-Bold', 
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
  normaltext: {
    fontFamily: 'Rubik-Bold', 
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#797D7F',
  },
  boldtext: {
    fontFamily: 'Rubik-Bold', 
    fontSize: 18,
    lineHeight: 21,
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
  cancelBtn: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#33a1f9',
  },
  redtext: {
    fontFamily: 'Rubik-Bold', 
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'red',
  },  
  paybutton: {
    borderRadius: 5,
    borderBottomColor: '#33a1f9',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    marginBottom: 30,
    alignItems: 'center',
    width: '25%'
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 5,
  }
})
