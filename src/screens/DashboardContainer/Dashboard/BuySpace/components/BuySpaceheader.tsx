import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { small_logo } from '../../../../../images/export'
import LinearGradient from 'react-native-linear-gradient';

export const BuySpaceheader = () => {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      colors={['#55A4F7', '#82BEFA']}
      style={styles.DashboardHeader}>    
      <View style={styles.topBar}>
        <Image style={styles.image} source={small_logo} />
      </View>
      <View style={styles.bottomBar}>
        <Text style={styles.BooingTitle}>BUY SPACE</Text>
      </View>
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  DashboardHeader: {
    position: "absolute",
    top: 35,
    width: '100%'
  },
  topBar: {
    flexDirection: "row",
    marginTop: 35,
   
  },
  bottomBar: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  image: {
    width: 87,
    height: 30,
    marginLeft:20
  },
  title: {
    fontFamily: 'Rubik-Bold', fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "white",
    marginLeft: 70,
    marginRight: 70,
    textAlign: "center",
  },
  coins: {
    alignContent: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  column: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  txt: {
    marginTop: 0,
    color: "white",
    fontFamily: 'Rubik-Bold', fontSize: 14,
    lineHeight: 15,
    letterSpacing: 0.25,
    textAlign: "center",
  },
  BooingTitle: {
    fontFamily: 'Rubik-Bold', fontSize: 20,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "white",
    textAlign: "center",
  },
});