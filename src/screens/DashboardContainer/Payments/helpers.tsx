import { Alert } from 'react-native';
import { API_URL } from './Config';

export async function fetchPublishableKey(
  paymentMethod?: string
): Promise<string | null> {
	return "pk_test_51MjkVyFXtBJLEoWydBEh9IL3AsnH5mNpeTO4A6mq58R6rrqb1HuOX0BgH9xcVJJXBY74fNAMcRR77tcFVErZebLp001fnnhhdH";
  // try {
  //   const response = await fetch(
  //     `${API_URL}/stripe-key?paymentMethod=${paymentMethod}`
  //   );

  //   const { publishableKey } = await response.json();

  //   return publishableKey;
  // } catch (e) {
  //   console.warn('Unable to fetch publishable key. Is your server running?');
  //   Alert.alert(
  //     'Error',
  //     'Unable to fetch publishable key. Is your server running?'
  //   );
  //   return null;
  // }
}