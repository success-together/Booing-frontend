import React, {useEffect, useState} from 'react';
import {Dimensions, TouchableOpacity, Text} from 'react-native';
import {Selected} from '../../../Dashboard/File/File';
import * as Progress from 'react-native-progress';

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
}: any) => {
  const [showProgress, setShowProgress] = useState(progress !== 1);

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

  return (
    <TouchableOpacity
      onPress={progress === 1 ? handlePress : undefined}
      onLongPress={progress === 1 ? handleLongPress : undefined}
      style={{
        width: (WIDTH - (NUM_COLS + 1) * 10) / NUM_COLS,
        height: (WIDTH - (NUM_COLS + 1) * 10) / NUM_COLS,
        backgroundColor: '#D9D9D9',
        borderRadius: 8,
        marginRight: (index + 1) % NUM_COLS !== 0 ? 10 : undefined,
        marginBottom: NUM_COLS > 1 ? 5 : undefined,
        padding: 5,
        position: 'relative',
      }}>
      {selected && <Selected />}
      {showProgress ? (
        <Circle
          progress={progress}
          showsText={true}
          size={(WIDTH - (NUM_COLS + 1) * 10) / NUM_COLS - 10}
          style={{
            position: 'absolute',
            top: 5,
            left: 5,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
          }}
        />
      ) : (
        <Text>{name}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Item;
