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
          style={styles.button}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.text}>Signup</Text>
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
    justifyContent: 'center',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerButtons: {
    display: 'flex',
    position: 'absolute',
    bottom: 48,
    flexDirection: 'row',
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'stretch',
    width: '100%',
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
    flex: 1,
  },

  text: {
    fontSize: 20,
    letterSpacing: 0.25,
    color: '#33A1F9',
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
