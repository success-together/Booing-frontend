import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Logo} from '../../images/export';

function Home({navigation}: {navigation: any}) {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={Logo} />
      <View style={styles.containerButtons}>
        <Pressable
          style={{...styles.button, marginRight: 20}}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.text}>Login</Text>
        </Pressable>
        <Pressable
          style={[styles.button, {backgroundColor: '#eee'}]}
          onPress={() => navigation.navigate('Register')}>
          <Text style={[styles.text, {color: '#33A1F9'}]}>Signup</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#33a1f9',
    alignItems: 'center',

    // justifyContent: 'center',
  },
  image: {
    width: '90%',
    marginTop: '65%',
    resizeMode: "contain"
  },
  containerButtons: {
    display: 'flex',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'column',
    height: 180,
    padding: 30,
    width: '100%',
    backgroundColor: 'white'
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#33A1F9',
    color: 'white',
    width: '100%',
    height: 50,
    borderRadius: 15,
    marginBottom: 20,
  },

  text: {
    fontFamily: 'Rubik-Regular', 
    fontSize: 18,
    letterSpacing: 0.25,
    color: '#ffffff',
  },

  // inputView: {
  //   backgroundColor: "#FFC0CB",
  //   borderRadius: 30,
  //   width: "70%",
  //   height: 45,
  //   marginBottom: 20,

  //   alignItems: "center",
  // },

  // TextInput: {
  //   height: 50,
  //   flex: 1,
  //   padding: 10,
  //   marginLeft: 20,
  // },

  // forgot_button: {
  //   height: 30,
  //   marginBottom: 30,
  // },

  // loginBtn: {
  //   width: "80%",
  //   borderRadius: 25,
  //   height: 50,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   marginTop: 40,
  //   backgroundColor: "#FF1493",
  // },
});

export default Home;
