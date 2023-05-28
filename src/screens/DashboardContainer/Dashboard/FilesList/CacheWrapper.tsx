import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  FlatList,
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
import {isAllOf, nanoid} from '@reduxjs/toolkit';
import CacheList from './CacheList';

const icons = {
  Cache: (size: number, color = '#8F8F8F') => (
    <MaterialCommunityIcons name="cached" size={size} color={color} />
  ),
  Thumbnails: (size: number, color = '#8F8F8F') => (
    <Foundation name="thumbnails" size={size} color={color} />
  ),
  Empty: (size: number, color = '#8F8F8F') => (
    <MaterialCommunityIcons name="folder-outline" size={size} color={color} />
  ),
  NotInstalledApk: (size: number, color = '#8F8F8F') => (
    <AntDesign name="android1" size={size} color={color} />
  ),  
};
const tempData = [
  {name: "Cache \n", icon: 'Cache'},
  {name: "Thumbnails", icon: 'Thumbnails'},
  {name: "Not installed Apk", icon: 'NotInstalledApk'},
  {name: "Empty folders", icon: 'Empty'},
];
const calcSpace = (arr: {size: number}[], field = 'size', minVal = 0) =>
  arr.reduce((acc, elem) => acc + (elem as any)[field], 0) > minVal
    ? arr.reduce((acc, elem) => acc + (elem as any)[field], 0)
    : 0;
const addId = (arr: []) => {
  arr.forEach(e => ((e as any).id = nanoid(20)));
  return arr;
};

interface CacheWrapperProps {
  label: string;
  apps: [],
  refetchByLabel: Function;
  setCategoryView: Function;
  categoryView: string;
}

export function CacheWrapper({
  label,
  apps,
  refetchByLabel,
  setCategoryView,
  categoryView,
}: CacheWrapperProps) {
  const [data, setData] = useState({
    cache: [],
    empty: [],
    thumbnail: [],
    notInstallApk: []
  });
  const [init, setInit] = useState(false);
  const [selectedFilesIds, setSelectedFilesIds] = useState<string[]>([]);
  const [deleteBtnProps, setDeleteBtnProps] = useState({
    disabled: false,
    show: false,
  });
  const WIDTH = Dimensions.get('window').width;
  const minHeight = Dimensions.get('window').height/3;
  const FlatWidth = WIDTH/4;

  const otherPress = (id) => {
    // ShowCategory();
  }
  const ShowCategory = () => {
    setCategoryView('Cache')
  }
  const refechByLabel = async (ids: string[], type: string) => {
    console.log('refechByLabel', ids, type)
    if (type === 'thumbnail' || type === 'cache') {
      setData({...data, [type]: data[type].filter((item: any) => !ids.includes(item.id))});
    } else if (type === 'apks') {
      refetchByLabel(ids, type)
    }
  };
  const removeDeletedItems = () => {
    console.log('removeDeletedItems')
  }
  useEffect(() => {
    console.log(apps)
  }, [apps])
  useEffect(() => {
    if (!init) {
      (async () => {
        const thumbnails = await ManageApps.getThumbnails();
        const cache = addId(await ManageApps.getAllInstalledApps());
        const empty = [];
        let thumbArr = []
        for (let item in thumbnails) {
          thumbArr.push({...thumbnails[item], name: item})
        }
        setInit(true)
        setData({...data, cache: cache, thumbnail: addId(thumbArr)});
      })()
    }
  }, [data])
  return (
    <>
        {(categoryView === 'All' || categoryView === 'Cache') && (
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.headerTitle}>
                {icons['Cache'](20)}
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
                {categoryView === 'All' && (
              <Pressable
                onPress={() => ShowCategory()}
                style={{
                  height: 30,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{marginRight: 10, color: '#6DBDFE'}}>{'Open'}</Text>
              </Pressable>
                )}
            </View>

               { categoryView==='Cache'?(
                <>
                  <CacheList
                    data={data['cache'].filter((item) => item.visibleCacheSize> 0) as []}
                    label="Cache"
                    type="cache"
                    size={calcSpace(data['cache'], 'visibleCacheSize')}
                    removeDeletedItems={removeDeletedItems}
                    refetchByLabel={refechByLabel}
                  />
                  <CacheList
                    data={data['thumbnail'].filter((item) => item.size> 0) as []}
                    label="Thumbnails"
                    type="thumbnail"
                    size={calcSpace(data['thumbnail'])}
                    removeDeletedItems={removeDeletedItems}
                    refetchByLabel={refechByLabel}
                  />
                  <CacheList
                    data={apps as []}
                    label="Not installed apks"
                    type="apks"
                    size={calcSpace(apps)}
                    removeDeletedItems={removeDeletedItems}
                    refetchByLabel={refechByLabel}
                  />
                </>
               ):(
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  {tempData.map((item, ind) => (
                    <View
                      key={'temp'+ind}
                      style={{
                        width: '25%',
                      }}
                    >
                      <File
                        name={item.name}
                        id={'temp'+ind}
                        onPress={otherPress}
                        selected={false}
                        Icon={icons[item.icon]}
                        loaded={() => void 0}
                      />
                    </View>           
                  ))}
                </View>
               )}
          </View>
        )}
    </>
  );
}
                 // <FlatList
                 //   data={data}
                 //   renderItem={renderFile}
                 //   keyExtractor={item => item.id}
                 //   horizontal
                 //   showsHorizontalScrollIndicator={false}
                 //   initialNumToRender={5}
                 //   removeClippedSubviews={true}
                 //   maxToRenderPerBatch={5}
                 //   // viewabilityConfigCallbackPairs={
                 //   //   viewabilityConfigCallbackPairs.current as unknown as ViewabilityConfigCallbackPair[]
                 //   // }
                 //   viewabilityConfig={{
                 //     minimumViewTime: 200,
                 //   }}
                 // />

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
