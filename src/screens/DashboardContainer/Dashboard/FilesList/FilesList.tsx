import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import File from '../File/File';
import Toast from 'react-native-toast-message';
import ManageApps from '../../../../utils/manageApps';
import bytes from 'bytes';

import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import {Circle} from 'react-native-progress';

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
  ),
  Downloads: (size: number, color = '#8F8F8F') => (
    <MaterialCommunityIcons
      name="file-download-outline"
      size={size}
      color={color}
    />
  ),
  Videos: (size: number, color = '#8F8F8F') => (
    <MaterialCommunityIcons
      name="file-video-outline"
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
};

interface RenderFileData {
  item: {
    id: string;
    name: string;
    visibleCacheSize?: number;
    thumbnail?: string;
  };
}

interface FilesListProps {
  data: [];
  label: keyof typeof icons;
  removeDeletedItems: Function;
  size: number;
  setTriggerRerender?: Function;
  refetchByLabel: Function;
}

interface DeleteBtnProps {
  onPress: () => void;
}

const DeleteBtn = ({onPress}: DeleteBtnProps) => {
  return (
    <TouchableOpacity
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 5,
        backgroundColor: '#CB2821',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 5,
      }}
      onPress={onPress}>
      <Feather name="trash-2" size={20} color="#FFF" />
      <Text style={{marginLeft: 3, fontWeight: '500', color: '#FFF'}}>
        Delete
      </Text>
    </TouchableOpacity>
  );
};

export default function FilesList({
  data,
  label,
  size,
  setTriggerRerender,
  refetchByLabel,
}: FilesListProps) {
  const [selectedFilesIds, setSelectedFilesIds] = useState<string[]>([]);
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const [items, setItems] = useState([]);
  const [iterator, setIterator] = useState<Iterator<[]>>();
  const [loading, setLoading] = useState(false);

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

    let isDeleted;

    if (label === 'Pictures') {
      isDeleted = await ManageApps.deleteImages(paths);
    }
    if (label === 'Videos') {
      isDeleted = await ManageApps.deleteVideos(paths);
    }
    if (label === 'Music') {
      isDeleted = await ManageApps.deleteAudios(paths);
    }
    if (label === 'Empty folders' || label === 'Thumbnails') {
      isDeleted = await ManageApps.deleteDirs(paths);
    }

    setShowDeleteBtn(false);
    refetchByLabel(label);

    if (isDeleted) {
      return Toast.show({
        type: 'success',
        text1: 'items deleted successfully',
      });
    }
  }, [selectedFilesIds]);

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

    if (setTriggerRerender) {
      setTriggerRerender((prev: any) => !prev);
    }

    setShowDeleteBtn(false);
    refetchByLabel(label);
    Toast.show({
      text1: `cache cleared for apps ${apps.map(e => e.name).join(',')}`,
    });
  };

  const renderFile = useCallback(
    ({item: {name, id, thumbnail, visibleCacheSize}}: RenderFileData) => {
      return (
        <File
          name={name}
          id={id}
          thumbnail={thumbnail}
          onPress={onPress}
          visibleCacheSize={visibleCacheSize}
          selected={selectedFilesIds.includes(id)}
          Icon={icons[label]}
        />
      );
    },
    [selectedFilesIds, onPress, data],
  );

  useEffect(() => {
    if (selectedFilesIds.length !== 0 && !showDeleteBtn) {
      setShowDeleteBtn(true);
    }
    if (selectedFilesIds.length === 0 && showDeleteBtn) {
      setShowDeleteBtn(false);
    }

    return () => {
      if (selectedFilesIds.length === 0 && showDeleteBtn) {
        setShowDeleteBtn(false);
      }
    };
  }, [selectedFilesIds]);

  const nextSet = useCallback(
    (initial?: Iterator<[]>) => {
      if (items.length === data.length) {
        return;
      }

      if (initial) {
        const next = initial.next();
        if (next && !next.done) {
          setItems(next.value);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setTimeout(() => {
        const next = iterator!.next();
        if (next && !next.done) {
          setItems(next.value);
          setLoading(false);
        }
      }, 500);
    },
    [items, data, iterator],
  );

  useEffect(() => {
    const iterator = (function* () {
      const dataCopy: typeof data = [];
      let prevPos = 0;

      while (dataCopy.length !== data.length) {
        dataCopy.push(...data.slice(prevPos, prevPos + 5));
        prevPos += 5;
        yield dataCopy;
      }
    })();

    setIterator(iterator);
    nextSet(iterator);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          {icons[label](20)}
          <Text
            style={{
              marginLeft: 10,
              color: '#8F8F8F',
              fontSize: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#8F8F8F',
              borderStyle: 'solid',
              marginRight: 10,
            }}>
            {label}
          </Text>
          {loading && <Circle size={16} indeterminate={true} />}
        </View>
        <View
          style={{
            height: 30,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{marginRight: 10}}>{bytes(size)}</Text>
          {showDeleteBtn && (
            <DeleteBtn
              onPress={
                label !== 'Cache' ? onDeleteFilesPress : onDeleteAppsPress
              }
            />
          )}
        </View>
      </View>
      <SafeAreaView style={{paddingTop: 10, paddingBottom: 10}}>
        <FlatList
          data={items}
          renderItem={renderFile}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          initialNumToRender={2}
          removeClippedSubviews={true}
          maxToRenderPerBatch={4}
          onEndReached={() => nextSet()}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
