import bytes from 'bytes';
import React, {ReactNode} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {extractExtension} from '../../../../utils/util-functions';

interface FileProps {
  selected: boolean;
  onPress: (id: string) => void;
  id: string;
  name: string;
  thumbnail?: string;
  visibleCacheSize?: number;
  Icon: (size: number, color: string) => Element;
}

export const Selected = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 25,
        height: 25,
        backgroundColor: '#FFF',
        borderRadius: 25 / 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
      }}>
      <Feather name="check-circle" size={19} color={'#BDECB6'} />
    </View>
  );
};

const File = ({
  selected,
  id,
  name,
  visibleCacheSize,
  thumbnail,
  onPress,
  Icon,
}: FileProps) => {
  return (
    <TouchableOpacity onPress={() => onPress(id)} style={styles.container}>
      {selected && <Selected />}
      {thumbnail ? (
        <Image source={{uri: thumbnail}} style={styles.image} />
      ) : (
        <View style={{width: 80, position: 'relative'}}>
          <Text style={{padding: 10}}>{name}</Text>
          {visibleCacheSize && (
            <Text style={{color: 'black', padding: 5}}>
              size: {bytes(visibleCacheSize)}
            </Text>
          )}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 80,
              height: '100%',
              zIndex: -1,
            }}>
            {Icon(70, '#ffffff63') as ReactNode}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 80,
    marginRight: 6,
    position: 'relative',
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
  },
});

export default File;
