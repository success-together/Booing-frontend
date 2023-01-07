import bytes from 'bytes';
import React, {ReactNode, useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';

interface FileProps {
  selected: boolean;
  onPress: (id: string) => void;
  id: string;
  name: string;
  thumbnail?: string;
  visibleCacheSize?: number;
  Icon: (size: number, color: string) => Element;
  loaded: () => void;
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
  loaded,
}: FileProps) => {
  // for items that does not have a thumbnail
  useEffect(() => {
    if (!thumbnail) {
      loaded();
    }
  }, []);
  return (
    <TouchableOpacity onPress={() => onPress(id)} style={styles.container}>
      {selected && <Selected />}
      {thumbnail ? (
        <FastImage
          source={{uri: thumbnail}}
          style={styles.image}
          onLoadEnd={loaded}
        />
      ) : (
        <View style={{width: 80, position: 'relative', minHeight: 80}}>
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
              height: 80,
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
