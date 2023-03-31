import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import {store, BaseUrl} from '../../../../shared';
import {setRootLoading} from '../../../../shared/slices/rootSlice';
import WebView from 'react-native-webview';
import { stripePng } from '../../../../images/export';

const StripeButton = ({product, onSuccess, onCancel, user_id, handleProcessing, processing }) => {
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const WIDTH = Dimensions.get('window').width;
  const HEIGHT = Dimensions.get('window').height;
  console.log(user_id)
  const handleStripe = async () => {
    store.dispatch(setRootLoading(true));
    try {
      const { data } = await axios.post(`${BaseUrl}/stripe/create-payment`, { amount: product.total, id: product.id });
      const redirectUrl = data.url;
      handleProcessing('stripe');
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
      console.log('success-payment')
      let session_id = url.split('session_id=')[1];
      handleProcessing(null)
      store.dispatch(setRootLoading(true));
      await axios.post(`${BaseUrl}/stripe/execute-payment`, {session_id, user_id, product});
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
      {webViewVisible=='stripe' ? (
        <WebView
          source={{ uri: webViewUrl }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          style={{width: WIDTH, height: HEIGHT}}
        />
      ) : (
        <TouchableOpacity style={styles.button}  onPress={handleStripe}>
          <Image source={stripePng} style={{width: 80, height: 80}}/>
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
export default StripeButton;