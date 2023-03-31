import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import {store, BaseUrl} from '../../../../shared';
import {setRootLoading} from '../../../../shared/slices/rootSlice';
import WebView from 'react-native-webview';
import { paypalPng } from '../../../../images/export';

const PayPalButton = ({product, onSuccess, onCancel, user_id, handleProcessing, processing }) => {
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const WIDTH = Dimensions.get('window').width;
  const HEIGHT = Dimensions.get('window').height;
  console.log(user_id)
  const handlePayPal = async () => {
    store.dispatch(setRootLoading(true));
    try {
      const { data } = await axios.post(`${BaseUrl}/paypal/create-payment`, { amount: product.total, id: product.id });
      const paymentID = data.id;
      const redirectUrl = data.links.find(link => link.rel === 'approval_url').href;
      handleProcessing('paypal');
      store.dispatch(setRootLoading(false));
      setWebViewUrl(redirectUrl);
    } catch (error) {
      store.dispatch(setRootLoading(false));
      onCancel();
    }
  };
  const handleWebViewNavigationStateChange = async navState => {
    const { url } = navState;
    console.log(url)
    if (url.includes('cancel-payment')) {
      handleProcessing(null)
      onCancel();
    } else if (url.includes('success-payment')) {
      let data = {};
      let vars = url.split('?')[1].split('&');
      for (let i = 0; i < vars.length; i++) {
          let pair = vars[i].split('=');
          data[pair[0]] = pair[1];
      }
      handleProcessing(null)
      store.dispatch(setRootLoading(true));
      await axios.post(`${BaseUrl}/paypal/execute-payment`, {paymentId:data.paymentId, payerId:data.PayerID, user_id:user_id, product: product});
      store.dispatch(setRootLoading(false));
      onSuccess();
    }
  };
  useEffect(() => {
    console.log('handleProcessing');
    setWebViewVisible(processing)
  }, [processing])
  return (
    <>
      {webViewVisible=='paypal' ? (
        <WebView
          source={{ uri: webViewUrl }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          style={{width: WIDTH, height: HEIGHT}}
        />
      ) : (
        <TouchableOpacity style={styles.button}  onPress={handlePayPal}>
          <Image source={paypalPng} style={{width: 80, height: 80}}/>
        </TouchableOpacity>
      )}
    </>      
  );
};
const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    borderBottomColor: '#33a1f9',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%'
  }
})
export default PayPalButton;