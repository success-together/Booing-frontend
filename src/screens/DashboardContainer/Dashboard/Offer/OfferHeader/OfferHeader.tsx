import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native';
import { small_logo } from '../../../../../images/export';

const OfferHeader = () => {
  return (
    <View style={styles.DashboardHeader}>
    <View style={styles.topBar}>
      <Image style={styles.image} source={small_logo} />
    </View>
    <View style={styles.bottomBar}>
      <Text style={styles.BooingTitle}>TODAY'S OFFER</Text>
    </View>
  </View>
  )
}

export default OfferHeader

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
      width: 50,
      height: 30,
      marginLeft:20
    },
    title: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: "bold",
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
      fontSize: 14,
      lineHeight: 15,
      fontWeight: "bold",
      letterSpacing: 0.25,
      textAlign: "center",
    },
    BooingTitle: {
      fontSize: 20,
      lineHeight: 21,
      fontWeight: "bold",
      letterSpacing: 0.25,
      color: "white",
      textAlign: "center",
    },
  });