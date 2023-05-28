import React, {useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  FlatList
} from 'react-native';
import File from '../File/File';
import bytes from 'bytes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Circle} from 'react-native-progress';
import DuplicateList from './DuplicateList';

const icons = {
  Duplicate: (size: number, color = '#8F8F8F') => (
    <MaterialCommunityIcons name="cached" size={size} color={color} />
  ),
  Pictures: (size: number, color = '#8F8F8F') => (
    <AntDesign name="picture" size={size} color={color} />
  ),
  Music: (size: number, color = '#8F8F8F') => (
    <MaterialCommunityIcons
      name="music-box-outline"
      size={size}
      color={color}
    />
    // <Image source={musicIcon} style={{width: size, height: size}}/>
  ),
  Videos: (size: number, color = '#8F8F8F') => (
    <Feather
      name="video"
      size={size}
      color={color}
    />
  ),
};
const tempData = [
  {name: "Pictures", icon: 'Pictures'},
  {name: "Music", icon: 'Music'},
  {name: "Videos", icon: 'Videos'}
]
const calcSpace = (arr: {size: number}[], field = 'size', minVal = 0) =>
  arr.reduce((acc, elem) => acc + (elem as any)[field], 0) > minVal
    ? arr.reduce((acc, elem) => acc + (elem as any)[field], 0)
    : 0;
interface DuplicateWrapperProps {
  data: [];
  label: string;
  removeDeletedItems: Function;
  size: number;
  type?: string;
  setTriggerRerender?: Function;
  refetchByLabel: Function;
  setCategoryView?: Function;
  categoryView: string;
}

export function DuplicateWrapper({
  data,
  label,
  type,
  size,
  refetchByLabel,
  removeDeletedItems,
  setCategoryView,
  categoryView
}: DuplicateWrapperProps) {
  const ShowCategory = () => {
    // console.log((data['document'] || data['apk'] || data['video'] || data['audio'] || data['image'] || data['download']))
   setCategoryView('Duplicate')
  }
  const getFirstFiveItems = useCallback(() => {
    const firstFiveItemsOfAllArrays = [];

    for (const key in data) {
      const array = data[key].slice(0, 4);
      firstFiveItemsOfAllArrays.push(...array);
    }

    return firstFiveItemsOfAllArrays
  }, [data])
  // const onPress = useCallback(
  //   (id: string) => {
  //     setSelectedFilesIds(prev => {
  //       prev.includes(id) ? prev.splice(prev.indexOf(id), 1) : prev.push(id);
  //       return [...prev];
  //     });
  //   },
  //   [selectedFilesIds],
  // );

  const otherPress = (id) => {
    console.log((data['document'] || data['apk'] || data['video'] || data['audio'] || data['image'] || data['download']))
    // ShowCategory();
  }  
  const renderFile = useCallback(
    ({item: {name, path, id, thumbnail, visibleCacheSize}}: RenderFileData) => {
      if (name.includes('other')) {
      }
      return (
        <File
          name={name}
          id={id}
          thumbnail={thumbnail}
          onPress={path !== null ? otherPress : otherPress}
          visibleCacheSize={visibleCacheSize}
          Icon={icons['Duplicate']}
          loaded={() => void 0}
        />
      );
    },
    [data],
  );
  return (
    <>
      {(data['document'].length || data['apk'].length || data['video'].length || data['audio'].length || data['image'].length || data['download'].length) > 0 && (
        <View>
          {categoryView === 'All' && (
            <View style={styles.container}>
              <View style={styles.header}>
                <View style={styles.headerTitle}>
                  {icons['Duplicate'](20)}
                  <View>
                    <Text
                      style={{
                        marginLeft: 10,
                        color: '#A0A0A0',
                        fontFamily: 'Rubik-Regular', fontSize: 16,
                        marginRight: 10,
                      }}>
                      {label}
                    </Text>
                  </View>
                  {/* {viewedItems.filter(item => !item.isLoaded).length !== 0 && (
                    <Circle size={16} indeterminate={true} />
                  )} */}
                </View>
                <Pressable
                  onPress={() => ShowCategory()}
                  style={{
                    height: 30,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {/*<Text style={{marginRight: 10}}>{bytes(size)}</Text>*/}
                  <Text style={{marginRight: 10, color: '#6DBDFE'}}>{data.length === 0?'':'Open'}</Text>
                </Pressable>
              </View>
              <SafeAreaView style={{paddingTop: 10, paddingBottom: 10}}>
                 <FlatList
                   data={getFirstFiveItems()}
                   renderItem={renderFile}
                   keyExtractor={item => item.id}
                   horizontal
                   showsHorizontalScrollIndicator={false}
                   initialNumToRender={5}
                   removeClippedSubviews={true}
                   maxToRenderPerBatch={5}
                   // viewabilityConfigCallbackPairs={
                   //   viewabilityConfigCallbackPairs.current as unknown as ViewabilityConfigCallbackPair[]
                   // }
                   viewabilityConfig={{
                     minimumViewTime: 200,
                   }}
                 />
              </SafeAreaView>            
            </View>
          )}
          {categoryView === 'Duplicate' && (
            <>
              <DuplicateList
                data={data['image']}
                label="Duplicate Images"
                type="image"
                size={calcSpace(data['image'])}
                removeDeletedItems={removeDeletedItems}
                refetchByLabel={refetchByLabel}
              />
              <DuplicateList
                data={data['video']}
                label="Duplicate Videos"
                type="video"
                size={calcSpace(data['video'])}
                removeDeletedItems={removeDeletedItems}
                refetchByLabel={refetchByLabel}
              />
              <DuplicateList
                data={data['audio']}
                label="Duplicate Music"
                type="audio"
                size={calcSpace(data['audio'])}
                removeDeletedItems={removeDeletedItems}
                refetchByLabel={refetchByLabel}
              />
            </>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 8,
    marginTop: 10
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filesContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
});
