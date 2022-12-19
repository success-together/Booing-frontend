import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-elements'
import { SellSpaceHeader } from './SellSpaceHeader/SellSpaceHeader'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SellSpace = () => {
  const [Quantity, setQuantity] = useState(1)
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <SellSpaceHeader />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.whitetext}> BASIC PLAN</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.boldtext}>SELL FIRST 1 GB</Text>
                <Text style={styles.boldtext}>1 GB</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'red', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 }}> GIFT : 6500 Boo </Text>
              </View>
              <View style={{ marginTop: 8 }}>
                <Text style={styles.normaltext}>Sync Across Unlimited Devices</Text>
                <Text style={styles.normaltext}>Auto-Upload More Photos With Ease</Text>
                <Text style={styles.normaltext}>Revert Any Change Within 30 Days</Text>
              </View>

            </View>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.whitetext}> ADDITIONAL PLAN</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.boldtext}></Text>
                <Text style={styles.boldtext}></Text>
                <Text style={styles.boldtext}></Text>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold', }}>Quantity</Text>
                  <View style={{
                    justifyContent: 'center', alignItems: 'center', flexDirection: 'row',
                  }}>
                    <Pressable onPress={() => { setQuantity(Quantity - 1) }}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#CDD0D1',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#CDD0D1',
                        width: 20,

                      }} >
                      <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold', }}>-</Text>
                    </Pressable>
                    <Text style={{
                      textAlign: 'center',
                      color: 'black',
                      fontSize: 14,
                      fontWeight: 'bold',
                      borderStyle: 'solid',
                      borderWidth: 1,
                      borderColor: '#CDD0D1',
                      width: 20
                    }}> {Quantity} </Text>
                    <Pressable onPress={() => { setQuantity(Quantity + 1) }}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#CDD0D1',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#CDD0D1',
                        width: 20
                      }}>
                      <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold', }}>+</Text>
                    </Pressable>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <MaterialIcons name="highlight-remove" size={20} color="#CDD0D1" />
                    <Text style={{ color: '#CDD0D1', fontSize: 12 }}> Remove </Text>
                  </View>
                </View>
                <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold', }}>Total</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.boldtext}> ADDITIONAL </Text>
              </View>
              <View style={{ marginTop: 8 }}>
                <Text style={styles.normaltext}>Sync Across Unlimited Devices</Text>
                <Text style={styles.normaltext}>Auto-Upload More Photos With Ease</Text>
                <Text style={styles.normaltext}>Revert Any Change Within 30 Days</Text>
              </View>
            </View>
          </View>
          <Pressable style={styles.button}>
            <Text style={styles.whitetext}>
              TRY FREE FOR 30 DAYS
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

export default SellSpace
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginHorizontal: 0,
    width: '100%',
  },
  body: {
    flex: 1,
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'

  },
  cardBody: {
    flexDirection: 'column',
    padding: 14,
    backgroundColor: 'white'
  },
  cardContainer: {
    flexDirection: 'column',
    marginTop: 10,
    width: '90%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#797D7F'
  },
  cardHeader: {
    padding: 10,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    // backgroundColor: "#33a1f9",
    alignItems: 'center',
    color: '#33a1f9',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    // flexWrap: "wrap",
    // flexDirecton: "row",
  },
  containerImage: {
    backgroundColor: '#33a1f9',
    width: '100%',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#33a1f9',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  whitetext: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  normaltext: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#797D7F',
  },
  boldtext: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  containerFolder: {
    flexDirection: 'row',
  },
  recentFilesContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});