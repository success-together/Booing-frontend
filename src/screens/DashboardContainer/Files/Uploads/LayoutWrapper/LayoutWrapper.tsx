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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  View,
} from 'react-native';
import {small_logo} from '../../../../../images/export';
import {threeVerticleDots} from '../../../../../images/export';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface LayoutWrapperProps {
  onBackPress: () => void;
  children?: ReactNode;
  setPressHandlerRoot?: (
    fn: Dispatch<SetStateAction<(() => void) | undefined>>,
  ) => void;
  title?: string;
  onHeaderDotsPress?: () => void;
  headerMenuContent?: ReactNode;
}

interface RefWithPressHandler extends MutableRefObject<TouchableHighlight> {
  handlePress: () => void;
}

export default function LayoutWrapper({
  children,
  setPressHandlerRoot,
  onBackPress,
  onHeaderDotsPress,
  headerMenuContent,
  title = 'MY FILES',
}: LayoutWrapperProps) {
  const rootRef = useRef() as RefWithPressHandler;
  const [pressHandler, setPressHandler] = useState<() => void>();
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

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

  const WIDTH = Dimensions.get('window').width;
  const size = WIDTH;
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
            {title}
          </Text>
          <View
            style={{
              display: 'flex',              
              flexDirection: 'row',
              justifyContent: 'space-between',
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
                width: size
              }}>
              <Feather
                name="search"
                size={14}
                style={{position: 'absolute', zIndex: 999, top: 15, left: 13}}
              />
              <TextInput
                style={{
                  flexBasis: '70%',
                  height: 44,
                  backgroundColor: 'white',
                  fontFamily: 'Rubik-Regular', fontSize: 12,
                  borderRadius: 8,
                  paddingLeft: 33,
                  color: 'black',
                }}
                placeholder="Search"
                placeholderTextColor={'#9190A8'}
              />
            </View>

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
