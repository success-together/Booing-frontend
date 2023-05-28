import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewabilityConfigCallbackPair,
  ViewToken,
  Image,
  Pressable,
} from 'react-native';

import File from '../File/File';
import Toast from 'react-native-toast-message';
import ManageApps from '../../../../utils/manageApps';
import bytes from 'bytes';
import {musicIcon} from '../../../../images/export';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import {Circle} from 'react-native-progress';
import NoDataFound from '../../../../Components/NoDataFound/NoDataFound';

const icons = {
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
  Manually: (size: number, color = '#8F8F8F') => (
    <AntDesign name="picture" size={size} color={color} />
  ),
  'Duplicated Files': (size: number, color = '#8F8F8F') => (
    <AntDesign name="picture" size={size} color={color} />
  ),
  Downloads: (size: number, color = '#8F8F8F') => (
    <MaterialCommunityIcons
      name="file-download-outline"
      size={size}
      color={color}
    />
  ),
  Videos: (size: number, color = '#8F8F8F') => (
    <Feather
      name="video"
      size={size}
      color={color}
    />
  ),
  Cache: (size: number, color = '#8F8F8F') => (
    <MaterialCommunityIcons name="cached" size={size} color={color} />
  ),
  Thumbnails: (size: number, color = '#8F8F8F') => (
    <Foundation name="thumbnails" size={size} color={color} />
  ),
  'Empty folders': (size: number, color = '#8F8F8F') => (
    <MaterialCommunityIcons name="folder-outline" size={size} color={color} />
  ),
  'Not installed apks': (size: number, color = '#8F8F8F') => (
    <AntDesign name="android1" size={size} color={color} />
  ),
};

interface RenderFileData {
  item: {
    id: string;
    name: string;
    visibleCacheSize?: number;
    thumbnail?: string;
    path: string | null;
  };
}

interface FilesListProps {
  data: [];
  label: keyof typeof icons;
  removeDeletedItems: Function;
  size: number;
  type?: string;
  setTriggerRerender?: Function;
  refetchByLabel: Function;
  setCategoryView?: Function;
  categoryView: string;
}

interface DeleteBtnProps {
  onPress: () => void;
  disabled: boolean;
}

const DeleteBtn = ({onPress, disabled}: DeleteBtnProps) => {
  return (
    <TouchableOpacity
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 5,
        backgroundColor: disabled ? 'gray' : '#CB2821',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 5,
      }}
      onPress={!disabled ? onPress : undefined}>
      <Feather name="trash-2" size={20} color="#FFF" />
      <Text style={{marginLeft: 3, fontWeight: '500', color: '#FFF'}}>
        Delete
      </Text>
    </TouchableOpacity>
  );
};

export function FilesList({
  data,
  label,
  type,
  size,
  refetchByLabel,
  removeDeletedItems,
  setCategoryView,
  categoryView
}: FilesListProps) {
  console.log(type)
  const [selectedFilesIds, setSelectedFilesIds] = useState<string[]>([]);
  const [deleteBtnProps, setDeleteBtnProps] = useState({
    disabled: false,
    show: false,
  });
  const WIDTH = Dimensions.get('window').width;
  const minHeight = Dimensions.get('window').height/3;
  const FlatWidth = WIDTH/4;
  
  const onPress = useCallback(
    (id: string) => {
      setSelectedFilesIds(prev => {
        prev.includes(id) ? prev.splice(prev.indexOf(id), 1) : prev.push(id);
        return [...prev];
      });
    },
    [selectedFilesIds],
  );

  const onDeleteFilesPress = useCallback(async () => {
    if (label === 'Manually') {
      let pathArr = {};
      selectedFilesIds.map((id) => {
        const item = data.find((e: RenderFileData['item']) => e.id === id);
        if (item) {
          if (pathArr[item.type]) pathArr[item.type].push((item as any).path);
          else pathArr[item.type] = [(item as any).path];
        }
      })
      for (let key in pathArr) {
        if (key === 'Pictures') {
          isDeleted = await ManageApps.deleteImages(pathArr[key]);
        }
        if (key === 'Videos') {
          isDeleted = await ManageApps.deleteVideos(pathArr[key]);
        }
        if (key === 'Music') {
          isDeleted = await ManageApps.deleteAudios(pathArr[key]);
        }      
      }
    } else {

      const paths = selectedFilesIds.reduce<string[]>((acc, id) => {
        const item = data.find((e: RenderFileData['item']) => e.id === id);
        if (item) {
          acc.push((item as any).path);
          return acc;
        }
        return acc;
      }, []);

      let isDeleted;

      if (type === 'images') {
        isDeleted = await ManageApps.deleteImages(paths);
      }
      if (type === 'videos') {
        isDeleted = await ManageApps.deleteVideos(paths);
      }
      if (type === 'audios') {
        isDeleted = await ManageApps.deleteAudios(paths);
      }
      if (label === 'Empty folders' || label === 'Thumbnails') {
        isDeleted = await ManageApps.deleteDirs(paths);
        if (isDeleted) {
          removeDeletedItems(selectedFilesIds, label);
        }
      }
      if (label === 'Not installed apks') {
        isDeleted = await ManageApps.deleteApks(paths);
        if (isDeleted) {
          removeDeletedItems(selectedFilesIds, label);
        }
      }

      setDeleteBtnProps({disabled: true, show: true});

      if (
        label !== 'Empty folders' &&
        label !== 'Thumbnails' &&
        label !== 'Not installed apks'
      ) {
        await refetchByLabel(selectedFilesIds, type);
      }

      setSelectedFilesIds([]);
      setDeleteBtnProps({disabled: false, show: false});
      if (isDeleted) {
        return Toast.show({
          type: 'success',
          text1: 'items deleted successfully',
        });
      }
    }
  }, [selectedFilesIds, refetchByLabel]);

  const onDeleteAppsPress = async () => {
    const apps = selectedFilesIds.reduce<any[]>((acc, id) => {
      const item = data.find((e: RenderFileData['item']) => e.id === id);
      if (item) {
        acc.push(item);
        return acc;
      }
      return acc;
    }, []);

    for (const app of apps) {
      const arr = await ManageApps.clearAppVisibleCache(
        (app as any).packageName,
      );
    }

    setDeleteBtnProps({disabled: true, show: true});
    await refetchByLabel(label);

    setDeleteBtnProps({disabled: false, show: false});
    Toast.show({
      text1: `cache cleared for apps ${apps.map(e => e.name).join(',')}`,
    });
  };
  const otherPress = (id) => {
    ShowCategory();
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
          onPress={path !== null ? onPress : otherPress}
          visibleCacheSize={visibleCacheSize}
          selected={selectedFilesIds.includes(id)}
          Icon={icons[label]}
          loaded={() => void 0}
          isVideo={(label=='Videos'||label=='Music')?true:false}
          // loaded={() => {
          //   setLoadedItemsIds(prev =>
          //     prev.includes(id) ? prev : [...prev, id],
          //   );
          // }}
        />
      );
    },
    [selectedFilesIds, onPress, data],
  );

  useEffect(() => {
    if (selectedFilesIds.length !== 0 && !deleteBtnProps.show) {
      setDeleteBtnProps({show: true, disabled: false});
    }
    if (selectedFilesIds.length === 0 && deleteBtnProps.show) {
      setDeleteBtnProps({show: false, disabled: false});
    }

    return () => {
      if (selectedFilesIds.length === 0 && deleteBtnProps.show) {
        setDeleteBtnProps({show: false, disabled: false});
      }
    };
  }, [selectedFilesIds]);

  const ShowCategory = () => {
    if (data.length > 0)
      setCategoryView(type)
  }

  return (
    <>
      {data.length > 0 && (
        (categoryView === 'All' || categoryView === type) && (
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.headerTitle}>
                {icons[label](20)}
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
                {categoryView === 'All' ? (
                  <Text style={{marginRight: 10, color: '#6DBDFE'}}>{data.length === 0?'Add':'Open'}</Text>
                ) : (
                  <Text style={{marginRight: 10}}>{bytes(size)}</Text>
                )}
                {deleteBtnProps.show && (
                  <DeleteBtn
                    onPress={
                      label !== 'Cache' ? onDeleteFilesPress : onDeleteAppsPress
                    }
                    disabled={deleteBtnProps.disabled}
                  />
                )}
              </Pressable>
            </View>
            <SafeAreaView style={{paddingTop: 10, paddingBottom: 10}}>

               { categoryView===type?(
                 <FlatList
                   key={"duple"}
                   data={data}
                   scrollEnabled={false}
                   columnWrapperStyle={{justifyContent: data.length>3?'space-between':'flex-start', marginTop: 5 }}
                   renderItem={renderFile}
                   keyExtractor={item => item.id}
                   horizontal={false}
                   numColumns={4}
                 />
               ):(
                 <FlatList
                   data={data}
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
               )}
            </SafeAreaView>
          </View>
        )
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
