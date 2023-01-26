import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewabilityConfigCallbackPair,
  ViewToken,
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

export default function FilesList({
  data,
  label,
  size,
  refetchByLabel,
  removeDeletedItems,
}: FilesListProps) {
  const [selectedFilesIds, setSelectedFilesIds] = useState<string[]>([]);
  const [deleteBtnProps, setDeleteBtnProps] = useState({
    disabled: false,
    show: false,
  });
  const [items, setItems] = useState([]);
  const [iterator, setIterator] = useState<Iterator<[]>>();
  const [viewedItems, setViewedItems] = useState<
    {id: string; isLoaded: boolean}[]
  >([]);
  const [loadedItemsIds, setLoadedItemsIds] = useState<string[]>([]);

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    setViewedItems(prev => {
      const newViewedItems = [];
      for (const viewToken of viewableItems) {
        const isExist = prev.findIndex(e => e.id === viewToken.item.id) !== -1;
        if (!isExist) {
          newViewedItems.push({id: viewToken.item.id, isLoaded: false});
        }
      }

      return newViewedItems.length > 0 ? [...prev, ...newViewedItems] : prev;
    });
  };
  const viewabilityConfigCallbackPairs = useRef([{onViewableItemsChanged}]);

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

    console.log({paths});

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
      await refetchByLabel(label);
    }

    setSelectedFilesIds([]);
    setDeleteBtnProps({disabled: false, show: false});
    if (isDeleted) {
      return Toast.show({
        type: 'success',
        text1: 'items deleted successfully',
      });
    }
  }, [selectedFilesIds, data, refetchByLabel]);

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

  const renderFile = useCallback(
    ({item: {name, path, id, thumbnail, visibleCacheSize}}: RenderFileData) => {
      return (
        <File
          name={name}
          id={id}
          thumbnail={thumbnail}
          onPress={path !== null ? onPress : undefined}
          visibleCacheSize={visibleCacheSize}
          selected={selectedFilesIds.includes(id)}
          Icon={icons[label]}
          loaded={() => {
            setLoadedItemsIds(prev =>
              prev.includes(id) ? prev : [...prev, id],
            );
          }}
        />
      );
    },
    [selectedFilesIds, onPress, data],
  );

  useEffect(() => {
    setViewedItems(prev => {
      let changed = false;
      for (const item of prev) {
        if (loadedItemsIds.includes(item.id) && !item.isLoaded) {
          item.isLoaded = true;
          changed = true;
        }
      }

      return changed ? [...prev] : prev;
    });
  }, [viewedItems, loadedItemsIds]);

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

  const nextSet = useCallback(
    (initial?: Iterator<[]>) => {
      if (items.length === data.length) {
        return;
      }

      if (viewedItems.filter(item => !item.isLoaded).length !== 0) {
        return Toast.show({
          type: 'info',
          text1: label,
          text2: 'please wait until full content is loaded',
        });
      }

      if (initial) {
        const next = initial.next();
        if (next && !next.done) {
          setTimeout(() => {
            setItems(next.value);
          }, 500);
        } else {
          setItems([]);
        }
        return;
      }

      const next = iterator!.next();
      if (next && !next.done) {
        setTimeout(() => {
          setItems(next.value);
        }, 500);
      } else {
        setItems([]);
      }
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
  }, [data]);

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
          {viewedItems.filter(item => !item.isLoaded).length !== 0 && (
            <Circle size={16} indeterminate={true} />
          )}
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
          {deleteBtnProps.show && (
            <DeleteBtn
              onPress={
                label !== 'Cache' ? onDeleteFilesPress : onDeleteAppsPress
              }
              disabled={deleteBtnProps.disabled}
            />
          )}
        </View>
      </View>
      <SafeAreaView style={{paddingTop: 10, paddingBottom: 10}}>
        {data.length === 0 ? (
          <NoDataFound />
        ) : (
          <FlatList
            data={items}
            renderItem={renderFile}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            initialNumToRender={5}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            onEndReached={() => nextSet()}
            viewabilityConfigCallbackPairs={
              viewabilityConfigCallbackPairs.current as unknown as ViewabilityConfigCallbackPair[]
            }
            viewabilityConfig={{
              minimumViewTime: 200,
            }}
          />
        )}
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
