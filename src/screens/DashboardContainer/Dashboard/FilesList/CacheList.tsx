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
  Cache: (size: number, color = '#8F8F8F') => (
    <MaterialCommunityIcons name="cached" size={size} color={color} />
  ),
  'Empty folders': (size: number, color = '#8F8F8F') => (
    <MaterialCommunityIcons name="folder-outline" size={size} color={color} />
  ),
  thumbnail: (size: number, color = '#8F8F8F') => (
    <Foundation name="thumbnails" size={size} color={color} />
  ),
  cache: (size: number, color = '#8F8F8F') => (
    <AntDesign name="android1" size={size} color={color} />
  ),
  apks: (size: number, color = '#8F8F8F') => (
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

interface CacheListProps {
  data: [];
  label: string;
  removeDeletedItems: Function;
  size: number;
  type?: string;
  setTriggerRerender?: Function;
  refetchByLabel: Function;
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

export default function CacheList({
  data,
  label,
  type,
  size,
  refetchByLabel,
  removeDeletedItems,
}: CacheListProps) {
  console.log(data)
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
      let isDeleted = true;
      const paths = selectedFilesIds.reduce<string[]>((acc, id) => {
        const item = data.find((e: RenderFileData['item']) => e.id === id);
        if (item) {
          if (type === 'cache') {
            acc.push((item as any).packageName);
          } else {
            acc.push((item as any).path);
          }
          return acc;
        }
        return acc;
      }, []);
      console.log(paths)
      if (type === 'cache') {
        paths.map(async (item) => {
          console.log(item.packageName)
          isDeleted = await ManageApps.deleteAppCache(item.packageName);
          return isDeleted
        })

      }
      // return true;

      if (type === 'thumbnail') {
        isDeleted = await ManageApps.deleteDirs(paths);
        console.log(isDeleted)
      }
      if (type === 'apks') {
        isDeleted = await ManageApps.deleteApks(paths);
      }
      setDeleteBtnProps({disabled: true, show: true});
      await refetchByLabel(selectedFilesIds, type);
      setSelectedFilesIds([]);
      setDeleteBtnProps({disabled: false, show: false});
      if (isDeleted) {
        return Toast.show({
          type: 'success',
          text1: 'items deleted successfully',
        });
      }
  }, [selectedFilesIds, refetchByLabel]);

  const otherPress = (id) => {
    ShowCategory();
  }
  const renderFile = useCallback(
    ({item: {name, path, id, thumbnail, visibleCacheSize, size}}: RenderFileData) => {
      if (name.includes('other')) {
      }
      return (
        <File
          name={name}
          id={id}
          thumbnail={thumbnail}
          onPress={path !== null ? onPress : otherPress}
          visibleCacheSize={visibleCacheSize || size}
          selected={selectedFilesIds.includes(id)}
          Icon={icons[type]}
          loaded={() => void 0}
          isVideo={false}
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

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            {icons[type](20)}
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

          </View>
          <Pressable
            style={{
              height: 30,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{marginRight: 10, color: '#6DBDFE'}}>{bytes(size)}</Text>
            {deleteBtnProps.show && (
              <DeleteBtn
                onPress={ onDeleteFilesPress }
                disabled={deleteBtnProps.disabled}
              />
            )}
          </Pressable>
        </View>
        <SafeAreaView style={{paddingTop: 10, paddingBottom: 10}}>
          {data.length > 0 ? (
        
           <FlatList
             key={"cache" + label}
             data={data}
             horizontal
             showsHorizontalScrollIndicator={false}
             renderItem={renderFile}
             keyExtractor={item => item.id}
           />
          ) : (
            <NoDataFound />
          )}
        </SafeAreaView>
      </View>

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
