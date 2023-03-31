import React, { useState, useEffect } from 'react'
import { Pressable, ScrollView, StyleSheet, View, Dimensions, TextInput } from 'react-native'
import { Text } from 'react-native-elements'
import { SellSpaceHeader } from './SellSpaceHeader/SellSpaceHeader'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Progress from 'react-native-progress';
import {AXIOS_ERROR, BaseUrl, store} from '../../../../shared';
import Toast from 'react-native-toast-message';
import {getTraffic, receiveGiftCoin, sellSpace} from '../../../../shared/slices/Fragmentation/FragmentationService';
import {useIsFocused} from '@react-navigation/native';

const SellSpace = () => {
  const [quantity, setQuantity] = useState(1);
  const [traffic, setTraffic] = useState(0);
  const user_id = store.getState().authentication.userId;
  const freeSpace = store.getState().devices.freeSpace;
  const isFocused = useIsFocused();

  const WIDTH = Dimensions.get('window').width;
  const progressSize = WIDTH*0.5;

  const handleQuantity = (plus) => {
    if (quantity*1 + plus != 0) setQuantity(quantity*1 + plus)
      console.log(quantity)
  }
  const handleQuantityInput = (val) => {
    let cval = val.replace(/[^0-9]/g, '')*1;
    if (cval > 1) setQuantity(cval)
    else setQuantity(1);
  }
  const getTrafficData = async () => {
    await getTraffic({user_id}).then(res => {
      if (res.data) setTraffic(res.data/1000000000)
    })
  }
  const receiveGift = async () => {
    
    await receiveGiftCoin({user_id}).then(res => {
      if (res.success) {
        setTraffic(res.data/1000000000)
        return Toast.show({
          type: 'success',
          text1: res.msg,
        });
      } else {
        return Toast.show({
          type: 'error',
          text1: res.msg,
        });
      }
    })
  }

  const handleSellSpace = async () => {
    const available = Math.trunc(freeSpace.freeStorage/1000000000-freeSpace.occupyCloud);
    if (quantity > available) {
      Toast.show({
        type: 'error',
        text1: `You don't have available ${quantity}GB storage`,
        text2: `Available storage is about ${Math.trunc(freeSpace.freeStorage/1000000000)}GB and already solded ${freeSpace.occupyCloud}GB`
      })
    } else {
      await sellSpace({user_id, quantity}).then(res => {
        if (res.success) {
          return Toast.show({
            type: "success",
            text1: res.msg
          })
        } else {
          return Toast.show({
            type: 'error',
            text1: res.msg
          })
        }
      })

    }
  }

  useEffect(() => {
    if (isFocused) {
      getTrafficData();
    }
  }, [isFocused]);
  useEffect(() => {
    console.log(freeSpace)
  }, [freeSpace])
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <SellSpaceHeader />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.whitetext}> DATA TRANSFER </Text>
            </View>
            <View style={styles.cardBody}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View >
                  <Progress.Bar progress={traffic} width={progressSize} height={8} style={{height: 8}}/>
                  <Text style={{ color: 'red', fontFamily: 'Rubik-Bold', fontSize: 16,  letterSpacing: 0.5, marginTop: 5, textAlign: 'right' }}> {Math.trunc(traffic*10000)/100}% </Text>
                </View>
                <View style={{width: '30%', marginLeft:30, alignItems: 'center'}}>
                  <Text style={[styles.normaltext, {marginLeft: 10, marginTop: -8}]}>50000 Boo</Text>
                  <Pressable style={[styles.claim, {backgroundColor: traffic>=1?'green':'grey', marginLeft: 10}]} onPress={receiveGift}>
                    <Text style={styles.whitetext}>
                      CLAIM
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View style={{ marginTop: 8 }}>
                <Text style={styles.normaltext}>Claim Boo coins for every 1GB Data transfer</Text>
                <Text style={styles.normaltext}>Option to disable data transfer</Text>
              </View>

            </View>
          </View>
          <View style={[styles.cardContainer, {marginBottom: 20}]}>
            <View style={styles.cardHeader}>
              <Text style={styles.whitetext}> ADDITIONAL PLAN</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '33%',
                    borderRightWidth: 2,
                    borderColor: '#FFFFFF',
                  }}>
                  <FontAwesome5 name="cloud" size={40} color="#33a1f9" />
                  <Text style={styles.cloudText}>OccupyCloud</Text>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                  <Text style={{ color: 'black', fontFamily: 'Rubik-Bold', fontSize: 14,  }}>GB</Text>
                  <View style={{
                    justifyContent: 'center', alignItems: 'center', flexDirection: 'row',
                  }}>
                    <Pressable onPress={() => { handleQuantity(-1) }}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#CDD0D1',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#CDD0D1',
                        width: 20,

                      }} >
                      <Text style={{ color: 'black', fontFamily: 'Rubik-Bold', fontSize: 14,  }}>-</Text>
                    </Pressable>

                    <TextInput
                      editable
                      maxLength={40}
                      inputMode='numeric'
                      keyboardType='numeric'
                      onChangeText={(val) => handleQuantityInput(val)}
                      value={quantity.toString()}
                      style={{
                        textAlign: 'center',
                        color: 'black',
                        fontFamily: 'Rubik-Bold', fontSize: 10,
                        padding: 0,
                        
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#CDD0D1',
                        width: 40,
                        height: 20
                      }}
                    />
                    <Pressable onPress={() => { handleQuantity(+1) }}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#CDD0D1',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#CDD0D1',
                        width: 20
                      }}>
                      <Text style={{ color: 'black', fontFamily: 'Rubik-Bold', fontSize: 14,  }}>+</Text>
                    </Pressable>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <MaterialIcons name="highlight-remove" size={15} color="#CDD0D1" />
                    <Text style={{ color: quantity>1?'#000000':'#CDD0D1', fontFamily: 'Rubik-Regular', fontSize: 12 }}> Remove </Text>
                  </View>
                </View>
                <View>
                  <Text style={{ color: 'black', fontFamily: 'Rubik-Bold', fontSize: 14,  textAlign: 'right'}}>Total</Text>
                  <Text style={{ color: 'black', fontFamily: 'Rubik-Bold', fontSize: 16,  }}>{quantity*65000} Boo</Text>
                  <Pressable style={[styles.claim, {width: '100%'}]} onPress={handleSellSpace}>
                    <Text style={[styles.whitetext, {    fontFamily: 'Rubik-Regular',
    fontSize: 25, lineHeight: 30}]}>
                      SELL
                    </Text>
                  </Pressable>                
                </View>
              </View>
              <View style={{ marginTop: 8 }}>
                <Text style={styles.normaltext}>Sync Across Unlimited Devices</Text>
                <Text style={styles.normaltext}>Auto-Upload More Photos With Ease</Text>
                <Text style={styles.normaltext}>Revert Any Change Within 30 Days</Text>
              </View>
            </View>
          </View>
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
    padding: 20,
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
  claim: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    backgroundColor: 'green',
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 3,
    width: '80%'
  },
  text: {
    fontFamily: 'Rubik-Regular', fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  whitetext: {
    fontFamily: 'Rubik-Bold', fontSize: 14,
    lineHeight: 21,
    
    letterSpacing: 0.25,
    color: 'white',
  },
  normaltext: {
    fontFamily: 'Rubik-Bold', fontSize: 14,
    lineHeight: 21,
    
    letterSpacing: 0.25,
    color: '#797D7F',
  },
  boldtext: {
    fontFamily: 'Rubik-Bold', fontSize: 18,
    lineHeight: 21,
    
    letterSpacing: 0.25,
    color: 'black',
  },
  containerFolder: {
    flexDirection: 'row',
  },
  cloudText: {
    fontFamily: 'Rubik-Bold', fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    
    color: '#33a1f9',
  },  
});