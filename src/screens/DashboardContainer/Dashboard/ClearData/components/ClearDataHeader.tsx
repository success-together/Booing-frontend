import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {small_logo} from '../../../../../images/export';

export const ClearDataHeader = ({freeDiskStorage, navigation} : {navigation: any, route: any}) => {
	return (
	    <LinearGradient
	      start={{x: 0, y: 0}}
	      end={{x: 0, y: 1}}
	      colors={['#55A4F7', '#82BEFA']}
	      style={styles.header}>
	      <View
	        style={{
	          display: 'flex',
	          flexDirection: 'row',
	          position: 'relative',
	          width: '100%',
	          justifyContent: 'center',
	          alignItems: 'center',
	          marginBottom: 40,
	        }}>
	        <Image
	          source={small_logo}
	          style={{width: 87, height: 30, position: 'absolute', left: 0}}
	        />
	      </View>
	      <View style={styles.subContainer}>
	        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
	          <MaterialIcons
	            name="arrow-back-ios"
	            size={20}
	            color="white"
	          />
	        </TouchableOpacity>
	        <View>
	          <View style={styles.navContainer}>
	            <Text style={styles.text}>Available Storage</Text>
	          </View>
	          <View style={styles.percentageContainer}>
	            <Text style={styles.percentage}>+{freeDiskStorage} GB</Text>
	          </View>
	          
	        </View>
	      </View>
	    </LinearGradient>
	)
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: 50,
    paddingBottom: 23,
    paddingLeft: 20,
    paddingRight: 36,
    backgroundColor: '#33A1F9',
  },
  subContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'Rubik-Bold', fontSize: 20,
  },
  percentageContainer: {
    alignSelf: 'flex-end',
    // textAlign: 'flex-end'
  },
  percentage: {
    color: 'white',
    fontFamily: 'Rubik-Bold', fontSize: 16,
  },
})
