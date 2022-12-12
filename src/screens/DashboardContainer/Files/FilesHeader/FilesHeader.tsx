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
import LinearGradient from 'react-native-linear-gradient';

const FilesHeader = () => {
  return (
    <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#33A1F9', '#6DBDFE']}
        style={styles.header}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            position: 'relative',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 36,
          }}>
          <Image
            source={Logo}
            style={{width: 52, height: 35, position: 'absolute', left: 0}}
          />
          <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
            MY FILES
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'relative',
            }}>
            <Feather
              name="search"
              size={24}
              style={{position: 'absolute', zIndex: 999, top: 10, left: 13}}
            />
            <TextInput
              style={{
                flexBasis: '70%',
                height: 44,
                backgroundColor: 'white',
                borderRadius: 8,
                paddingLeft: 44,
              }}
              placeholder="Search"
              placeholderTextColor={'#9190A8'}
            />
          </View>
          <Image
            source={threeVerticleDots}
            resizeMode={'contain'}
            style={{width: 10, height: 20, tintColor: 'white'}}
          />
        </View>
      </LinearGradient>
  );
};
const styles = StyleSheet.create({
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
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
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
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    textAlign: 'center',
  },
  header: {
    width: '100%',
    paddingTop: 63,
    paddingBottom: 23,
    paddingLeft: 20,
    paddingRight: 36,
  },
  main: {
    width: '100%',
    position: 'relative',
    minHeight: '100%',
  },
});

export default FilesHeader;
