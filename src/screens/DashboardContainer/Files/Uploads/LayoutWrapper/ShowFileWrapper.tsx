import React, {Dispatch, ReactNode, SetStateAction} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {threeVerticleDots} from '../../../../../images/export';
import Feather from 'react-native-vector-icons/Feather';

interface ShowFileWrapperProps {
  title?: string;
  displayComponent: ReactNode;
  setIsShowingFile: Dispatch<SetStateAction<any>>;
}

const ShowFileWrapper = ({
  title,
  displayComponent,
  setIsShowingFile,
}: ShowFileWrapperProps) => {
  return (
    <View style={{flex: 1, display: 'flex'}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          paddingLeft: 35,
          paddingRight: 35,
          paddingTop: 25,
          paddingBottom: 25,
          backgroundColor: '#F6F7FB',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
          }}>
          <AntDesign
            name="arrowleft"
            color={'black'}
            size={20}
            onPress={() =>
              setIsShowingFile({show: false, uri: undefined, title: undefined})
            }
          />
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontWeight: '700',
              marginLeft: 15,
              flex: 1,
            }}>
            {title}
          </Text>
        </View>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <AntDesign name="staro" size={20} color={'black'} />
          <Image
            source={threeVerticleDots}
            resizeMode={'contain'}
            style={{width: 10, height: 20, tintColor: 'black', marginLeft: 20}}
          />
        </View>
      </View>
      <View
        style={{
          position: 'relative',
          backgroundColor: 'black',
          flex: 1,
        }}>
        {displayComponent}
      </View>
      <View style={styles.uploadContainer}>
        <View>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 16,
              marginRight: 16,
            }}>
            <Feather name="check-square" size={18} color="#C6D2E8" />
          </TouchableOpacity>
        </View>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 16,
              marginRight: 16,
            }}>
            <Feather name="message-square" size={18} color="#C6D2E8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
            }}>
            <Text style={{color: '#49ACFA', fontWeight: '500'}}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  uploadContainer: {
    width: '100%',
    backgroundColor: '#F6F7FB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 11,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 18,
  },
});

export default ShowFileWrapper;
