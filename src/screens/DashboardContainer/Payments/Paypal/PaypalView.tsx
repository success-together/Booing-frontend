import React, { useState } from 'react';
import { View } from 'react-native';
import PayPalButton from './PayPalButton';

const PayPalPayment = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSuccess = () => {
    console.log('handleSuccess')
    setPaymentSuccess(true);
    // Do something else when payment is successful
  };

  const handleCancel = () => {
    console.log('handleCancel')
    // Do something when payment is cancelled
  };

  return (
    <View>
      <PayPalButton
        amount={50.0}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        user_id={123} // This is an example of passing in a user ID prop
      />
    </View>
  );
};

export default PayPalPayment;