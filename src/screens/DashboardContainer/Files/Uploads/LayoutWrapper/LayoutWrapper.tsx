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
  Pressable,
  View,
} from 'react-native';
import {small_logo} from '../../../../../images/export';
import {threeVerticleDots} from '../../../../../images/export';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';
interface LayoutWrapperProps {
  onBackPress: () => void;
  children?: ReactNode;
  setPressHandlerRoot?: (
    fn: Dispatch<SetStateAction<(() => void) | undefined>>,
  ) => void;
  title?: string;
  navigation: any;
  onHeaderDotsPress?: () => void;
  headerMenuContent?: ReactNode;
  search?: string;
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
  navigation,
  search,
  title = 'MY FILES',
}: LayoutWrapperProps) {
  const rootRef = useRef() as RefWithPressHandler;
  const [pressHandler, setPressHandler] = useState<() => void>();
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const isFocused = useIsFocused();
  console.log("search", search)
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

  const handleSearch = () => {
    navigation.navigate('Search', {
      search: searchVal,
      return: 'Files'
    })    
    console.log(navigation)
    console.log('handleSearch LayoutWrapper')
  }

  const WIDTH = Dimensions.get('window').width;
  const width = WIDTH;
  useEffect(() => {
    if (setPressHandlerRoot) {
      setPressHandlerRoot(() => setPressHandler);
    }
  }, []);
  useEffect(() => {
    if (search) {
      setSearchVal(search);
    } else {
      setSearchVal('')
    }
  }, [search])
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
              justifyContent: 'flex-start',
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
                width: width*0.7
              }}>
              <Pressable
                onPress={() => handleSearch()}
                style={{
                  height: 44,
                  position: 'absolute', 
                  zIndex: 999, 
                  justifyContent: 'center',
                  right: 0,
                  paddingHorizontal: 15,
                  backgroundColor: '#edf0f3',
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8
                }}
              >
                <Feather
                  name="search"
                  size={14}
                />
              </Pressable>
              <TextInput
                style={{
                  height: 44,
                  backgroundColor: 'white',
                  fontFamily: 'Rubik-Regular', 
                  fontSize: 12,
                  borderRadius: 8,
                  paddingLeft: 33,
                  color: 'black',
                  width: '100%',
                  paddingRight: 50,
                }}
                value={searchVal}
                onChangeText={e => setSearchVal(e)}
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
