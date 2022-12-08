import React, {ReactNode} from 'react';
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Logo} from '../../../../../images/export';
import {threeVerticleDots} from '../../../../../images/export';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';

interface LayoutWrapperProps {
  uploadButtonPress?: (event: GestureResponderEvent) => void;
  children?: ReactNode;
}

export default function LayoutWrapper({
  uploadButtonPress,
  children,
}: LayoutWrapperProps) {
  return (
    <View style={styles.main}>
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
      <View style={{flex: 1, padding: 10, backgroundColor: '#F6F7FB'}}>
        {children}
      </View>
      <View style={styles.uploadContainer}>
        <TouchableOpacity
          style={{
            width: 82,
            height: 49,
            backgroundColor: 'white',
            borderRadius: 15,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={uploadButtonPress}>
          <Text style={{color: '#49ACFA', fontWeight: '500'}}>Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  uploadContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: '#F6F7FB',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 11,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 18,
  },
});
