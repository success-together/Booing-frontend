import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {small_logo} from '../../../../images/export';
import {useIsFocused} from '@react-navigation/native';
import {store} from '../../../../shared';
import LinearGradient from 'react-native-linear-gradient';
import {Wallet} from '../../../../models/Wallet';

const DashboardHeader = ({navigation, amount}: {navigation: any, amount: number}) => {
  // const isFocused = useIsFocused();
  // const [wallet, setWallet] = useState<Wallet>();

  // useEffect(() => {
  //   if (isFocused) {
  //     (async () => {
  //       setWallet(store.getState().wallet.data);
  //     })();
  //   }
  // }, [isFocused]);

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      colors={['#55A4F7', '#82BEFA']}
      style={styles.DashboardHeader}>    
      <View style={styles.topBar}>
        <Image style={styles.image} source={small_logo} />
        {/*<Text style={styles.BooingTitle}>BALANCE</Text>*/}
        <Ionicons name="search" size={24} color="white" onPress={()=>{ navigation.navigate('Files')}} />
      </View>
      <View style={styles.coins}>
        <Text style={styles.title}>Booing Balance</Text>
        <Text style={styles.amount}>{amount} Boo</Text>
        {/* <Text style={styles.title}>12 | +E 56.03</Text> */}
      </View>
      <View style={styles.bottomBar}>
        <Pressable
          style={styles.column}
          onPress={() => {
            navigation.navigate('BuySpace');
          }}>
          <Entypo name="plus" size={22} color="white" />
          <Text style={styles.txt}>Buy Space</Text>
        </Pressable>
        <Pressable
          style={styles.column}
          onPress={() => {
            navigation.navigate('SellSpace');
          }}>
          <Entypo name="minus" size={22} color="white" />
          <Text style={styles.txt}>Sell Space</Text>
        </Pressable>
        <Pressable
          style={styles.column}
          onPress={() => {
            navigation.navigate('Offer');
          }}>
          <Ionicons name="star" size={22} color="white" />
          <Text style={styles.txt}>Offer</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  DashboardHeader: {
    width: '100%',
    paddingTop: 30,
    paddingBottom: 18,
    paddingLeft: 30,
    paddingRight: 36,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 15,
    marginBottom: 10,
  },
  image: {
    width: 87,
    height: 30,
  },
  title: {
    fontFamily: 'Rubik-Bold', fontSize: 13,
    lineHeight: 13,
    color: '#1568AB',
    // marginLeft: 70,
    // marginRight: 70,
    // textAlign: 'center',
  },
  amount: {
    fontFamily: 'Rubik-Bold', fontSize: 20,
    lineHeight: 20,
    letterSpacing: 0.20,
    color: 'white',
    marginTop: 3,
  },
  coins: {
    marginTop: 19
    // alignContent: 'center',
    // justifyContent: 'space-between',
    // width: '100%',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 24,
  },
  txt: {
    marginTop: 6.5,
    color: 'white',
    fontFamily: 'Rubik-Regular', fontSize: 12,
    lineHeight: 15,
    letterSpacing: 0.25,
    textAlign: 'center',
  },
  BooingTitle: {
    fontFamily: 'Rubik-Bold', fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
    marginLeft: 24,
    marginRight: 100,
    textAlign: 'center',
  },
});

export default DashboardHeader;
