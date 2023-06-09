import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TextInput, View, Image, Dimensions, Pressable} from 'react-native';
import {Logo, small_logo, threeVerticleDots} from '../../../../images/export';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';


const FilesHeader = ({onBackPress, navigation}: {onBackPress: any, navigation: any}) => {
  const width =  Dimensions.get('window').width;
  const [searchVal, setSearchVal] = useState<string>('');
  const isFocused = useIsFocused();
  const handleSearch = () => {
    console.log('handleSearch', searchVal)
    navigation.navigate('Search', {
      search: searchVal,
      returnStack: 'Files'
    })
  }
  useEffect(() => {
    setSearchVal('')
  }, [isFocused])
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
      <Text style={{color: 'white', fontFamily: 'Rubik-Bold', fontSize: 18, marginBottom: 20}}>
        My Files
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <MaterialIcons
          name="arrow-back-ios"
          size={20}
          color="white"
          onPress={onBackPress}
        />
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 25,
            alignItems: 'center',
            width: width*0.7
          }}>
          <Pressable
            onPress={() => handleSearch()}
            style={{
              height: 44,
              position: 'absolute', 
              zIndex: 999, 
              justifyContent: 'center',
              right: 0,
              paddingHorizontal: 15,
              backgroundColor: '#edf0f3',
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8
            }}
          >
            <Feather
              name="search"
              size={14}
            />
          </Pressable>
          <TextInput
            style={{
              height: 44,
              backgroundColor: 'white',
              fontFamily: 'Rubik-Regular', 
              fontSize: 12,
              borderRadius: 8,
              paddingLeft: 33,
              color: 'black',
              width: '100%',
              paddingRight: 50,
            }}
            placeholder="Search"
            value={searchVal}
            onChangeText={(e) => setSearchVal(e)}
            placeholderTextColor={'#9190A8'}
          />
        </View>
      </View>
    </LinearGradient>
  );
};
        // <Image
        //   source={threeVerticleDots}
        //   resizeMode={'contain'}
        //   style={{width: 10, height: 20, tintColor: 'white'}}
        // />
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
    fontFamily: 'Rubik-Bold', fontSize: 16,
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
    fontFamily: 'Rubik-Bold', fontSize: 16,
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
  main: {
    width: '100%',
    position: 'relative',
    minHeight: '100%',
  },
});

export default FilesHeader;
