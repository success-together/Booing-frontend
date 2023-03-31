import React, {useEffect, useState} from 'react';
import {Dimensions, TouchableOpacity, Text, View, Image} from 'react-native';
import {Selected} from '../../../Dashboard/File/File';
import * as Progress from 'react-native-progress';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import {Loader} from '../../../../../Components/exports';
import {musicIcon, docIcon, apkIcon, otherIcon} from '../../../../../images/export'
const {Circle} = Progress;

const WIDTH = Dimensions.get('window').width;
const NUM_COLS = 4;

const Item = ({
  index,
  name,
  selected,
  progress,
  handlePress,
  handleLongPress,
  hasTriedToUpload,
  category,
  uri,
}: any) => {
  const [showProgress, setShowProgress] = useState(progress !== 1);
  const size = (WIDTH - (NUM_COLS + 1) * 10) / NUM_COLS;
  const iconSize = size - 10;

  useEffect(() => {
    let id: any;
    if (progress === 1) {
      id = setTimeout(() => {
        setShowProgress(false);
      }, 500);
    }

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [progress]);

  let content = <View></View>;
  if (!hasTriedToUpload) {
    if (showProgress) {
      content = (
        <View
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Circle
            progress={progress}
            showsText={true}
            size={iconSize}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }}
          />
        </View>
      );
    } else {
      content = (
        <View
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Progress.Circle
            size={iconSize}
            indeterminate={true}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }}
          />
          <Text style={{position: 'absolute', top: 30, left: 4, fontFamily: 'Rubik-Regular', fontSize: 10}}>
            fragmentation...
          </Text>
        </View>
      );
    }
  } else {
    if (progress !== 1) {
      content = (
        <View
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesign
            name="warning"
            size={iconSize}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }}
            color={'white'}
          />
          <Text
            style={{color: 'black', fontWeight: '500', textAlign: 'center'}}>
            cannot upload file
          </Text>
        </View>
      );
    } else {
      content = uri ? (
        <FastImage
          source={{uri: uri}}
          resizeMode="cover"
          style={{
            width: size,
            height: size,
            borderRadius: 5
          }}
        />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', height: size}}>
          {category === 'document' && <Image source={docIcon} size={size} />}
          {category === 'apk' && <Image source={apkIcon} size={size} />}
          {category === 'audio' && <Image source={musicIcon} size={size} />}
          {category !== 'audio' && category !== 'document' && category !=='apk' && <Image source={otherIcon} size={size} />}
        </View>
      );
    }
  }
        // <Text>{name}</Text>
  const formatName = (name: string) => {
    return name.length <= 10 ? name : name.slice(0, 10) + '...';
  };
  return (
    <TouchableOpacity
      onPress={progress === 1 && hasTriedToUpload ? handlePress : undefined}
      onLongPress={
        progress === 1 && hasTriedToUpload ? handleLongPress : undefined
      }
      style={{
        width: size,
        height: size+30,
        // backgroundColor: '#D9D9D9',
        borderRadius: 8,
        marginRight: (index + 1) % NUM_COLS !== 0 ? 10 : undefined,
        marginBottom: NUM_COLS > 1 ? 5 : undefined,
        padding: 5,
        position: 'relative',
        overflow: 'hidden',
      }}>
      {selected && <Selected />}
      <View style={{alignItems: 'center'}}>
        {content}
        <Text>{formatName(name)}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default Item;
