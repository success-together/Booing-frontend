import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { BuySpaceheader } from './BuySpaceHeader/BuySpaceheader'

const BuySpace = () => {
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <BuySpaceheader />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.whitetext}> MOST POPULAR</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={styles.boldtext}>Plus</Text>
                <Text style={styles.boldtext}>100GB</Text>
              </View>
              <View style={{flexDirection:'row'}}>
              <Text style={{color:'black', fontSize:16, fontWeight:'bold', letterSpacing:0.5}}> € 0.93/ </Text>
               <Text style={styles.normaltext}> Month </Text> 
               <Text style={{color:'black', fontSize:16, fontWeight:'bold', letterSpacing:0.5}}> Or 10€ /Year </Text>
              </View>
              <View style={{marginTop:8}}>
              <Text style={styles.normaltext}>Sync Across Unlimited Devices</Text>
              <Text style={styles.normaltext}>Auto-Upload More Photos With Ease</Text>
              <Text style={styles.normaltext}>Revert Any Change Within 30 Days</Text>
              </View>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.whitetext}> VALUE PLAN</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={styles.boldtext}>Plus</Text>
                <Text style={styles.boldtext}>500GB</Text>
              </View>
              <View style={{flexDirection:'row'}}>
              <Text style={{color:'black', fontSize:16, fontWeight:'bold', letterSpacing:0.5}}> € 2.70/ </Text>
               <Text style={styles.normaltext}> Month </Text> 
               <Text style={{color:'black', fontSize:16, fontWeight:'bold', letterSpacing:0.5}}> Or 20€ /Year </Text>
              </View>
              <View style={{marginTop:8}}>
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

export default BuySpace

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
    alignItems:'center'
   
  },
  cardBody: {
    flexDirection: 'column',
    padding: 20,
   backgroundColor: 'white'
  },
  cardContainer: {
    flexDirection: 'column',
    marginTop: 10,
    width: '90%',
    borderStyle:'solid',
    borderWidth: 1,
    borderColor:'#797D7F'
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
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  normaltext: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#797D7F',
  },
  boldtext: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  containerFolder: {
    flexDirection: 'row',
  },
});