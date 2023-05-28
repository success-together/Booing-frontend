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
  Videos: (size: number, color = '#8F8F8F') => (
    <Feather
      name="video"
      size={size}
      color={color}
    />
  ),
  APK: (size: number, color = '#8F8F8F') => (
    <AntDesign name="android1" size={size} color={color} />
  ),
  'Other files': (size: number, color = '#8F8F8F') => (
    <MaterialCommunityIcons name="file-download-outline" size={size} color={color} />
  ),
};

const getCategoryTime = () => {
  // Start time of today
  const todayStartTime = new Date();
  todayStartTime.setHours(0, 0, 0, 0);

  // Start time of yesterday
  const yesterdayStartTime = new Date();
  yesterdayStartTime.setDate(yesterdayStartTime.getDate() - 1);
  yesterdayStartTime.setHours(0, 0, 0, 0);

  // Start time of this week (starting from Sunday)
  const thisWeekStartTime = new Date();
  thisWeekStartTime.setDate(thisWeekStartTime.getDate() - thisWeekStartTime.getDay());
  thisWeekStartTime.setHours(0, 0, 0, 0);

  // Start time of last week (starting from Sunday)
  const lastWeekStartTime = new Date();
  lastWeekStartTime.setDate(lastWeekStartTime.getDate() - lastWeekStartTime.getDay() - 7);
  lastWeekStartTime.setHours(0, 0, 0, 0);

  // Start time of this month
  const thisMonthStartTime = new Date();
  thisMonthStartTime.setDate(1);
  thisMonthStartTime.setHours(0, 0, 0, 0);

  // Start time of last month
  const lastMonthStartTime = new Date();
  lastMonthStartTime.setMonth(lastMonthStartTime.getMonth() - 1);
  lastMonthStartTime.setDate(1);
  lastMonthStartTime.setHours(0, 0, 0, 0);

  // Start time of this year
  const thisYearStartTime = new Date();
  thisYearStartTime.setMonth(0);
  thisYearStartTime.setDate(1);
  thisYearStartTime.setHours(0, 0, 0, 0);

  // Start time of last year
  const lastYearStartTime = new Date();
  lastYearStartTime.setFullYear(lastYearStartTime.getFullYear() - 1);
  lastYearStartTime.setMonth(0);
  lastYearStartTime.setDate(1);
  lastYearStartTime.setHours(0, 0, 0, 0);  
  return {
    'today': todayStartTime.getTime()/1000,
    'yesterday': yesterdayStartTime.getTime()/1000,
    'thisWeek': thisWeekStartTime.getTime()/1000,
    'lastWeek': lastWeekStartTime.getTime()/1000,
    'thisMonth': thisMonthStartTime.getTime()/1000,
    'lastMonth': lastMonthStartTime.getTime()/1000,
    'thisYear': thisYearStartTime.getTime()/1000,
    'lastYear': lastYearStartTime.getTime()/1000,
    'longAgo': 0
  }
}

interface RenderFileData {
  item: {
    id: string;
    name: string;
    visibleCacheSize?: number;
    thumbnail?: string;
    path: string | null;
  };
}

interface DateListProps {
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

export function DateList({
  data,
  label,
  type,
  size,
  refetchByLabel,
  removeDeletedItems,
  setCategoryView,
  categoryView
}: DateListProps) {
  console.log(type, categoryView)
  const [showData, setShowData] = useState(null);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
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
    // console.log(selectedFilesIds, data)

      const paths = selectedFilesIds.reduce<string[]>((acc, id) => {
        console.log(acc)
        const item = data.find((e: RenderFileData['item']) => e.id === id);
        if (item) {
          acc.push((item as any).path);
          return acc;
        }
        return acc;
      }, []);

      let isDeleted;
      console.log(paths)
      if (type === 'image') {
        isDeleted = await ManageApps.deleteImages(paths);
      }
      if (type === 'video') {
        isDeleted = await ManageApps.deleteVideos(paths);
      }
      if (type === 'audio') {
        isDeleted = await ManageApps.deleteAudios(paths);
      }
      if (type === 'apk') {
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

  useEffect(() => {
    console.log('data')
    if (data.length > 0) {
      const times = getCategoryTime();
      console.log(times)
      const newData = {today: [], yesterday: [], thisWeek: [], lastWeek: [], thisMonth: [], lastMonth: [], thisYear: [], lastYear: [], longAgo: []};
      for (let i = 0; i < data.length; i++) {
        console.log(data[i]['ctime'])
        if (data[i]['ctime'] > times['today']) {
          newData['today'].push(data[i]);
        } else if (data[i]['ctime'] > times['yesterday']) {
          newData['yesterday'].push(data[i]);
        } else if (data[i]['ctime'] > times['thisWeek']) {
          newData['thisWeek'].push(data[i]);
        } else if (data[i]['ctime'] > times['lastWeek']) {
          newData['lastWeek'].push(data[i]);
        } else if (data[i]['ctime'] > times['thisMonth']) {
          newData['thisMonth'].push(data[i]);
        } else if (data[i]['ctime'] > times['lastMonth']) {
          newData['lastMonth'].push(data[i]);
        } else if (data[i]['ctime'] > times['thisYear']) {
          newData['thisYear'].push(data[i]);
        } else if (data[i]['ctime'] > times['lastYear']) {
          newData['lastYear'].push(data[i]);
        } else {
          newData['longAgo'].push(data[i]);
        }
      }
      setShowData(newData);
    }
  }, [data])

  const ShowCategory = () => {
    if (data.length > 0)
      setCategoryView(type)
  }
  const getData = () => {
    console.log('getData');
    setLoadMoreLoading(true);
    setTimeout(() => {
      setLoadMoreLoading(false);
    }, 3000);
  }
  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={getData}
          //On Click of button load more data
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Load More</Text>
          {loadMoreLoading ? (
            <ActivityIndicator
              color="white"
              style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <>
      {data.length > 0 && (categoryView === 'All' || categoryView === type) && (
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
                  onPress={onDeleteFilesPress}
                  disabled={deleteBtnProps.disabled}
                />
              )}
            </Pressable>
          </View>
          <SafeAreaView style={{paddingTop: 10, paddingBottom: 10}}>

             { categoryView===type?(
              <>
                { showData && Object.keys(showData).map(key => (
                  <View key={key}>
                    {showData[key].length > 0 && (
                      <View>
                        <Text style={{
                          marginLeft: 10,
                          color: '#A0A0A0',
                          fontFamily: 'Rubik-Bold', 
                          fontSize: 16,
                          marginRight: 10,
                          borderBottomWidth: 1,
                          borderBottomColor: '#A0A0A0',
                          borderBottomStyle: 'dotted',
                          padding: 5
                        }}>{key}</Text>
                        <FlatList
                          key={key}
                          data={showData[key]}
                          scrollEnabled={false}
                          columnWrapperStyle={{justifyContent: showData[key].length>3?'space-between':'flex-start', marginTop: 5 }}
                          renderItem={renderFile}
                          keyExtractor={item => item.id}
                          horizontal={false}
                          numColumns={4}
                        />
                      </View>
                    )}
                  </View>
                ))}
              </>
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
                 // ListFooterComponent={renderFooter}
               />
             )}
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
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },  
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },  
});
