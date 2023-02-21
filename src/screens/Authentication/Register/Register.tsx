import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  Text,
} from 'react-native';
import {Logo} from '../../../images/export';
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
      <LinearGradient
        colors={['#33A1F9', '#6DBDFE']}
        style={styles.containerImage}>
        <Image style={styles.image} source={Logo} />
      </LinearGradient>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          width: '100%',
          paddingLeft: '2.15%',
          paddingRight: '2.15%',
          paddingTop: '4.97%',
          paddingBottom: '4.97%',
          flex: 1,
        }}>
        <View>
          <Text style={styles.title}>Username </Text>
          <TextInput
            placeholder="Enter User Name"
            autoComplete={'name'}
            onChangeText={e => setFormRegister({...formRegister, name: e})}
            style={{
              color: 'black',
              backgroundColor: '#F8F8F8',
              borderRadius: 8,
              marginBottom: '3.24%',
              marginTop: 4,
            }}
            placeholderTextColor="#716D6D"
          />
          <Text style={styles.title}>Email </Text>
          <TextInput
            placeholder="Enter Email Adress"
            autoComplete={'email'}
            onChangeText={e => setFormRegister({...formRegister, email: e})}
            style={{
              color: 'black',
              backgroundColor: '#F8F8F8',
              borderRadius: 8,
              marginBottom: '3.24%',
              marginTop: 4,
            }}
            placeholderTextColor="#716D6D"
          />
          <Text style={styles.title}>Phone number </Text>
          <TextInput
            placeholder="Enter Phone Number"
            autoComplete={'tel'}
            onChangeText={e => setFormRegister({...formRegister, phone: e})}
            style={{
              color: 'black',
              backgroundColor: '#F8F8F8',
              borderRadius: 8,
              marginBottom: '3.24%',
              marginTop: 4,
            }}
            placeholderTextColor="#716D6D"
          />
          <Text style={styles.title}>Password </Text>
          <TextInput
            placeholder="Enter Password"
            autoComplete={'password'}
            secureTextEntry={true}
            onChangeText={e => setFormRegister({...formRegister, password: e})}
            style={{
              color: 'black',
              backgroundColor: '#F8F8F8',
              borderRadius: 8,
              marginBottom: '3.24%',
              marginTop: 4,
            }}
            placeholderTextColor="#716D6D"
          />
        </View>
        <LinearGradient
          colors={['#33A1F9', '#6DBDFE']}
          style={{borderRadius: 8}}>
          <Pressable
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              height: 60,
            }}
            onPress={onSubmit}
            disabled={isSubmit}>
            <Text style={styles.text}>Sign Up</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ScrollView: {
    flex: 1,
    padding: 10,
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
    color: '#797D7F',

    // marginLeft: 70,
    // marginRight: 70,
  },
  createAccount: {
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#797D7F',
    textAlign: 'center',
  },
  containerSocialMedia: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default Register;
