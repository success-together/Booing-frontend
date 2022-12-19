import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Button,
  TextInput,
 ScrollView} from 'react-native';
import {Input} from 'react-native-elements';
import {Logo} from '../../../images/export';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {register} from '../../../shared/slices/Auth/AuthService';
import {SocialMediaAuth} from '../../../Components/exports';
import {setRootLoading} from '../../../shared/slices/rootSlice';
import LinearGradient from 'react-native-linear-gradient';

function Register({navigation}: {navigation: any}) {
  const [formRegister, setFormRegister] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const onSubmit = () => {
    setIsSubmit(true);
    console.log(formRegister);
    if (
      !isSubmit &&
      formRegister.email &&
      formRegister.name &&
      formRegister.password &&
      formRegister.phone
    ) {
      register(formRegister).then(res => {
        setRootLoading(true);
        navigation.navigate('Verification', {
          user_id: res.data._id,
          isSignup: true,
        });
      });
    }
    setIsSubmit(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <Image style={styles.image} source={Logo} />
      </View>
      <ScrollView style={styles.ScrollView}>
      <Text style={styles.title}>Enter Username</Text>
      <Input
        placeholder="Enter User Name"
        autoCompleteType={'name'}
        onChangeText={e => setFormRegister({...formRegister, name: e})}
      />
        <Text style={styles.title}>Enter Email Adress</Text>
      <Input
        placeholder="Enter Email Adress"
        autoCompleteType={'email'}
        onChangeText={e => setFormRegister({...formRegister, email: e})}
      />
        <Text style={styles.title}>Enter Phone Number</Text>
      <Input
        placeholder="Enter Phone Number"
        autoCompleteType={'phone'}
        onChangeText={e => setFormRegister({...formRegister, phone: e})}
      />
        <Text style={styles.title}>Enter Password</Text>
      <Input
        placeholder="Enter Password"
        autoCompleteType={'password'}
        secureTextEntry={true}
        onChangeText={e => setFormRegister({...formRegister, password: e})}
      />
      <Pressable
        disabled={isSubmit}
        style={styles.button}
        onPress={() => {
          onSubmit();
        }}>
        <Text style={styles.text}>Sign Up</Text>
      </Pressable>
      <Text
        style={styles.createAccount}
        onPress={() => navigation.navigate('Login')}>
        Login
      </Text>
      <SocialMediaAuth navigation={navigation} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  ScrollView: {
    flex:1,
    padding:10
  },
  container: {
    flex: 1,
    alignItems: 'center',
    color: '#33a1f9',
    justifyContent: 'center',
    width: '100%',
  },
  containerImage: {
    backgroundColor: '#33a1f9',
    width: '100%',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    height: '42.66%',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 140,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#33a1f9',
  },
  text: {
    fontSize: 20,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
   
  },
  title: {
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0.25,
    color:'#797D7F',
   
    // marginLeft: 70,
    // marginRight: 70,

  },
  createAccount: {
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0.25,
    color:'#797D7F',
    textAlign:'center'
  },
  containerSocialMedia: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default Register;
