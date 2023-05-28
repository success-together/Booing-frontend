import bytes from 'bytes';
import React, {ReactNode, useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';

interface FileProps {
  selected: boolean;
  onPress?: (id: string) => void;
  id: string;
  name: string;
  thumbnail?: string;
  isVideo?: string;
  visibleCacheSize?: number;
  Icon: (size: number, color: string) => Element;
  loaded: () => void;
}

const formatRecentFolderName = (name: string) => {
  return name.length <= 10 ? name : name.slice(0, 10) + '...';
};

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
  isVideo
}: FileProps) => {
  // for items that does not have a thumbnail
  useEffect(() => {
    if (!thumbnail) {
      loaded();
    }
  }, []);
  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(id)}
      style={styles.container}
      disabled={!onPress}>
      {selected && <Selected />}
      {thumbnail ? (
        <View style={{
          padding: 8,
          paddingBottom: 3,
          alignItems: 'center'
        }}>
          <FastImage
            source={{uri: thumbnail}}
            style={styles.image}
            onLoadEnd={loaded}
          />
          <Text style={{width: 65, paddingTop: 3, fontFamily: 'Rubik-Bold', textAlign: 'center', maxHeight: 50}}>{formatRecentFolderName(name)}</Text>
        </View>
      ) : (
        <View style={{paddingHorizontal: 8, paddingVertical: 3, alignItems: 'center'}}>
          {Icon(65, '#ffffff63') as ReactNode}
          <Text style={{width: 65, fontFamily: 'Rubik-Bold', textAlign: 'center', maxHeight: 30}}>{formatRecentFolderName(name)}</Text>
          <Text style={{width: 65, fontFamily: 'Rubik-Regular', textAlign: 'center'}}>{bytes(visibleCacheSize)}</Text>

        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 65,
    marginRight: 6,
    position: 'relative',
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
    overflow: 'hidden',
    marginTop: 5,
  },
  image: {
    width: 65,
    height: 65,
  },
});

export default File;
