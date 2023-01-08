import React, {useEffect, useState} from 'react';
import {Dimensions, TouchableOpacity, Text, View} from 'react-native';
import {Selected} from '../../../Dashboard/File/File';
import * as Progress from 'react-native-progress';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import {Loader} from '../../../../../Components/exports';

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
  isImage,
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
          <Text style={{position: 'absolute', top: 30, left: 4, fontSize: 10}}>
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
      content = isImage ? (
        <FastImage
          source={{uri}}
          resizeMode="cover"
          style={{
            width: size,
            height: size,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      ) : (
        <Text>{name}</Text>
      );
    }
  }

  return (
    <TouchableOpacity
      onPress={progress === 1 && hasTriedToUpload ? handlePress : undefined}
      onLongPress={
        progress === 1 && hasTriedToUpload ? handleLongPress : undefined
      }
      style={{
        width: size,
        height: size,
        backgroundColor: '#D9D9D9',
        borderRadius: 8,
        marginRight: (index + 1) % NUM_COLS !== 0 ? 10 : undefined,
        marginBottom: NUM_COLS > 1 ? 5 : undefined,
        padding: 5,
        position: 'relative',
        overflow: 'hidden',
      }}>
      {selected && <Selected />}
      {content}
    </TouchableOpacity>
  );
};
export default Item;
