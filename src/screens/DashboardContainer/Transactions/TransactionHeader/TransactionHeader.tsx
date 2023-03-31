import React from 'react';
import {StyleSheet, Text, TextInput, View, Image} from 'react-native';
import {Logo, small_logo, threeVerticleDots} from '../../../../images/export';
import {Input} from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const TransactionsHeader = (props: any) => {
  
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
      <Text style={{fontFamily: 'Rubik-Bold',color: 'white',  fontSize: 18, marginBottom: 20}}>
        Transactions
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <MaterialIcons
          name="arrow-back-ios"
          size={20}
          color="white"
          onPress={() => props.navigation.navigate('Home')}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            position: 'relative',
          }}>
          <Feather
            name="search"
            size={14}
            style={{position: 'absolute', zIndex: 999, top: 15, left: 13}}
          />
          <TextInput
            style={{
              flexBasis: '70%',
              height: 44,
              backgroundColor: 'white',
              fontFamily: 'Rubik-Regular', 
              fontSize: 12,
              borderRadius: 8,
              paddingLeft: 33,
              color: 'black',
            }}
            placeholder="Search"
            placeholderTextColor={'#9190A8'}
            onChangeText={(val) => props.handleSearch(val)}
          />      
        </View>
        <View style={styles.materialIcons}>
          <MaterialCommunityIcons name={props.isFilter?"filter":"filter-outline"} size={25} color="white" onPress={() => { props.handleIsFilter()}} />
        </View>
      </View>
    </LinearGradient>
  );
};
          // <MaterialIcons
          //   style={{marginLeft: 10}}
          //   name="arrow-downward"
          //   size={25}
          //   color="white"
          // />
const styles = StyleSheet.create({
  materialIcons: {
    flexDirection: 'row',
  },
  input: {
    marginLeft: 0,
    borderWidth: 1,
    padding: 10,
    borderColor: 'white',
    marginRight: 50,
    width: '60%',
    height: 60,
  },
  FilesHeader: {
    position: 'absolute',
    top: 35,
  },
  topBar: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    width: 35,
    height: 20,
    marginLeft: 6,
  },
  title: {
    fontFamily: 'Rubik-Bold', 
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
    justifyContent: 'center',
    textAlign: 'center',
    marginLeft: 80,
  },
  coins: {
    alignContent: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    height: 60,
  },
  bottomBar: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  txt: {
    marginTop: 10,
    color: 'white',
    fontFamily: 'Rubik-Bold', 
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    textAlign: 'center',
  },
  header: {
    width: '100%',
    paddingTop: 50,
    paddingBottom: 23,
    paddingLeft: 20,
    paddingRight: 36,
  },
});

export default TransactionsHeader;
