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
  Duplicate: (size: number, color = '#8F8F8F') => (
    <MaterialCommunityIcons name="cached" size={size} color={color} />
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

interface DuplicateListProps {
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

export default function DuplicateList({
  data,
  label,
  type,
  size,
  refetchByLabel,
  removeDeletedItems,
  setCategoryView,
  categoryView
}: DuplicateListProps) {
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
      const paths = selectedFilesIds.reduce<string[]>((acc, id) => {
        const item = data.find((e: RenderFileData['item']) => e.id === id);
        if (item) {
          acc.push((item as any).path);
          return acc;
        }
        return acc;
      }, []);
      console.log(paths)
      let isDeleted;
      if (type === 'image') {
        isDeleted = await ManageApps.deleteImages(paths);
      }
      if (type === 'video') {
        isDeleted = await ManageApps.deleteVideos(paths);
      }
      if (type === 'audio') {
        isDeleted = await ManageApps.deleteAudios(paths);
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
          Icon={icons['Duplicate']}
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

  return (
    <>
      {data.length > 0 && (
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
             <FlatList
               key={"duple"}
               data={data}
               horizontal
               showsHorizontalScrollIndicator={false}
               renderItem={renderFile}
               keyExtractor={item => item.id}
             />
          </SafeAreaView>
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
