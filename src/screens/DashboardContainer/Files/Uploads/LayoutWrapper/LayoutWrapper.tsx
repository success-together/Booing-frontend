import React, {
  cloneElement,
  Dispatch,
  JSXElementConstructor,
  MutableRefObject,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import {Logo} from '../../../../../images/export';
import {threeVerticleDots} from '../../../../../images/export';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';

interface LayoutWrapperProps {
  children?: ReactNode;
  setPressHandlerRoot?: (
    fn: Dispatch<SetStateAction<(() => void) | undefined>>,
  ) => void;
}

interface RefWithPressHandler extends MutableRefObject<TouchableHighlight> {
  handlePress: () => void;
}

export default function LayoutWrapper({
  children,
  setPressHandlerRoot,
}: LayoutWrapperProps) {
  const rootRef = useRef() as RefWithPressHandler;
  const [pressHandler, setPressHandler] = useState<() => void>();

  let clonedChildren = children;
  if (clonedChildren) {
    if (!['string', 'number', 'boolean'].includes(typeof clonedChildren)) {
      clonedChildren = cloneElement(
        clonedChildren as ReactElement<
          any,
          string | JSXElementConstructor<any>
        >,
        {setPressHandler},
      );
    }
  }

  useEffect(() => {
    if (setPressHandlerRoot) {
      setPressHandlerRoot(() => setPressHandler);
    }
  }, []);

  return (
    <TouchableHighlight
      style={styles.main}
      ref={rootRef}
      onPress={pressHandler}>
      <>
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
        <View style={{flex: 1, backgroundColor: '#F6F7FB'}}>
          {clonedChildren}
        </View>
      </>
    </TouchableHighlight>
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
});
