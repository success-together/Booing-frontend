/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, BackHandler, Image, TouchableOpacity, Pressable} from 'react-native';
import {ReadDirItem} from 'react-native-fs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import ManageApps from '../../../../utils/manageApps';
import FilesList from '../FilesList/FilesList';
import {isAllOf, nanoid} from '@reduxjs/toolkit';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import {ScrollView} from 'react-native';
import {Bar} from 'react-native-progress';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import {useIsFocused} from '@react-navigation/native';
import {store} from '../../../../shared';
import {setRootLoading} from '../../../../shared/slices/rootSlice';
import {Transaction} from '../../../../shared/slices/wallet/walletService';
import {sellSpace} from '../../../../shared/slices/Fragmentation/FragmentationService';
import {small_logo} from '../../../../images/export';
import LinearGradient from 'react-native-linear-gradient';
import {setStorage} from '../../../../shared/slices/Auth/AuthSlice';

export const Progress = ({progress, text}: any) => {
  return (
    <View>
      <Text
        style={{
          textAlign: 'center',
          marginBottom: 20,
          color: text === 'done !' ? 'green' : 'black',
          fontWeight: '500',
        }}>
        {text}
      </Text>
      <Bar progress={progress} height={10} />
    </View>
  );
};

const calcSpace = (arr: {size: number}[], field = 'size', minVal = 0) =>
  arr.reduce((acc, elem) => acc + (elem as any)[field], 0) > minVal
    ? arr.reduce((acc, elem) => acc + (elem as any)[field], 0)
    : 0;

export interface IImage extends ReadDirItem {
  id: string;
  logo: string;
}

function ClearData({route, navigation}: {navigation: any; route: any}) {
  const {freeDiskStorage} = route.params;
  const [showData, setShowData] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showModal, setShowModal] = useState<{show: boolean; loading: boolean}>(
    {show: true, loading: false},
  );
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [music, setMusic] = useState([]);
  const [apps, setApps] = useState([]);
  const [duplicate, setDuplicate] = useState([]);
  const [duplicatePictures, setDuplicatePictures] = useState([]);
  const [duplicateVideos, setDuplicateVideos] = useState([]);
  const [duplicateMusic, setDuplicateMusic] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [emptyFolders, setEmptyFolders] = useState([]);
  const [notInstalledApks, setNotInstalledApks] = useState([]);
  const [cancelPopup, setCancelPopup] = useState<boolean>(false);
  const [isSelledSpace, setIsSelledSpace] = useState<boolean>(false);
  const [rescanOnFocuse, setRescanOnFocus] = useState(true);
  const [clearManually, setClearManually] = useState(false);
  const [categoryView, setCategoryView] = useState('All')
  const user_id = store.getState().authentication.userId;

  const [progressProps, setProgressProps] = useState({
    text: '',
    progress: 0,
  });

  const isFocused = useIsFocused();

  const addId = (arr: []) => {
    arr.forEach(e => ((e as any).id = nanoid(20)));
    return arr;
  };

  const requestPermissions = useCallback(async () => {
    const results = await requestMultiple([
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ]);
    const readWriteExternalStorage = Object.values(results).every(
      v => v === RESULTS.GRANTED || v === RESULTS.BLOCKED,
    );

    // all file access
    const allFilesAccess = await ManageApps.checkAllFilesAccessPermission();

    setPermissionGranted(readWriteExternalStorage && allFilesAccess);
  }, []);
  const showMessage = ({text, progress}) => {
    if (isFocused) {
      setProgressProps({text: text, progress: progress});
    } 
      ManageApps.showNotification(
        "Hey, I'm optimizing your device's space.",
        `${text}    ${progress*100}%`,
        true
      );
    // Toast.show({
    //   type: 'success',
    //   text1: text + '   ' + progress*100 + '%',
    //   autoHide: progress===1?true:false
    // })        
  }
  const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  }  
  const scanUserStorage = useCallback(async () => {
    try {
      setClearManually(false);
      setRescanOnFocus(false);
      store.dispatch(setRootLoading(false));
      setShowModal({show: true, loading: true});
      setApps(addId(await ManageApps.getAllInstalledApps()));
      showMessage(prev => ({...prev, text: 'fetching images ...', progress: 0}));
      setImages(addId(await ManageApps.getImages()));
      showMessage({text: 'fetching videos ...', progress: 0.25});
      setVideos(addId(await ManageApps.getVideos()));
      showMessage({text: 'fetching audio files ...', progress: 0.5});
      setMusic(addId(await ManageApps.getAudios()));
      showMessage({text: 'fetching junk files ...', progress: 0.75});
      const {notInstalledApps, thumbnails, emptyFolders} =
        await ManageApps.getJunkData();
      setNotInstalledApks(addId(notInstalledApps));
      setThumbnails(addId(thumbnails));
      setEmptyFolders(addId(emptyFolders));
      showMessage({text: 'done !', progress: 1});
      const delaytime = await delay(1500);
    } catch (e: any) {
      console.log(e.stack);
    } finally {
      setTimeout(() => {
        setShowModal({show: false, loading: false});
      }, 200);
      setShowData(true);
      ManageApps.showNotification(
        'Scan Completed',
        'you can find all your junk files in the scan page',
        false
      );
    }
  }, [isFocused]);
  const analyseStorage = () => {
      const totalMediaSize = calcSpace([...images, ...videos, ...music]);
      const totalCacheSize = calcSpace(apps, 'visibleCacheSize', 0);
      console.log('totalMediaSize', totalMediaSize)
      console.log('totalCacheSize', totalCacheSize)
      store.dispatch(setStorage({media: totalMediaSize, cache: totalCacheSize}));     
  }

  const removeDeletedItems = (ids: string[], label: string) => {
    const removeItems = (setFn: Function) => {
      setFn((arr: []) => arr.filter((item: any) => !ids.includes(item.id)));
    };
    switch (label) {
      case 'Pictures':
        removeItems(setImages);
        break;
      case 'Videos':
        removeItems(setVideos);
        break;
      case 'Music':
        removeItems(setMusic);
        break;
      // case 'Cache':
      //   removeItems(setApps);
      //   break;
      case 'Thumbnails':
        removeItems(setThumbnails);
        break;
      case 'Empty folders':
        removeItems(setEmptyFolders);
        break;
      case 'Not installed apks':
        removeItems(setNotInstalledApks);
        break;
      default:
        break;
    }
  };

  const refechByLabel = async (label: string) => {
    switch (label) {
      case 'Pictures':
        setImages(addId(await ManageApps.getImages()));
        break;
      case 'Videos':
        setVideos(addId(await ManageApps.getVideos()));
        break;
      case 'Music':
        setMusic(addId(await ManageApps.getAudios()));
        break;
      // case 'Cache':
      //   setApps(addId(await ManageApps.getAllInstalledApps()));
      //   break;
      default:
        break;
    }
  };
  
  const findDuplicateFiles = async (data, type) => {
      let duplicatedFiles = [];
      data.sort((a, b) => a.size - b.size);
      let temp = "";
      let sizeArr = {};
      for (let i = 0; i < data.length; i++) {
        if (sizeArr[data[i].size]) sizeArr[data[i].size].push(data[i]);
        else sizeArr[data[i].size] = [data[i]]
      }
      for (let key in sizeArr) {
        if (sizeArr[key].length > 1) {
          const arr = sizeArr[key];
          for (let i = 0; i < arr.length; i++) {
            arr[i]['temp'] = (await RNFS.readFile(arr[i].path, 'base64')).slice(0, 1000);
            arr[i]['type'] = type;
          }
          for (let i = 0; i < arr.length; i++) {
            for (let j = i+1; j < arr.length; j++) {
              if (arr[i]['temp'] === arr[j]['temp']) {
                if (arr[i]['dupl'] !== true) {
                  arr[i]['dupl'] = true;
                  duplicatedFiles.push(arr[i]);
                }
                if (arr[j]['dupl'] !== true) {
                  arr[j]['dupl'] = true;
                  duplicatedFiles.push(arr[j]);
                }
              } else console.log('differnt')
            }
          }
          // console.log(arr)
        }
      }
      if (duplicatedFiles.length > 0) {
        if (type === 'Pictures')  setDuplicatePictures(duplicatedFiles);
        else if (type === 'Videos') setDuplicateVideos(duplicatedFiles);
        else if (type === 'Music') setDuplicateMusic(duplicatedFiles);
        else setDuplicate(duplicatedFiles);
      }
  }

  useEffect(() => {
    (async () => {
      console.log('find images duplicate')
      await findDuplicateFiles(images, "Pictures");
      analyseStorage();
    })()
  }, [images])

  useEffect(() => {
    (async () => {
      console.log('find video duplicate')
      await findDuplicateFiles(videos, "Videos");
      analyseStorage();
    })()
  }, [videos])

  useEffect(() => {
    (async () => {
      console.log('find music duplicate')
      await findDuplicateFiles(music, "Music");
      analyseStorage();
    })()
  }, [music])

  useEffect(() => {
    const backAction = (e) => {
      if (categoryView !== 'All') {
        setCategoryView('All');
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);    
  const handleSellSpace = async (quantity) => {
    await sellSpace({user_id, quantity}).then(res => {
      if (res.success) {
        setIsSelledSpace(true);
        return Toast.show({
          type: "success",
          text1: res.msg
        })
      } else {
        return Toast.show({
          type: 'error',
          text1: res.msg
        })
      }
    })
  }
  useEffect(() => {
    console.log(isFocused, showModal, rescanOnFocuse)
    // if (!showData) {
      if (isFocused && showModal.loading === false && showModal.show === false) {
        if (rescanOnFocuse) {
          setShowData(false);
          setPermissionGranted(false);
          setShowModal({show: true, loading: false});
          setProgressProps({text: '', progress: 0});
          setRescanOnFocus(false);
        }
      }

      if (
        !isFocused &&
        showData &&
        showModal.loading === false &&
        showModal.show === false
      ) {
        setRescanOnFocus(true);
      }
    // } else {
    //   // setShowModal({show: false, loading: false});
    // }
  }, [isFocused, rescanOnFocuse]);
  useEffect(() => {
    console.log(categoryView)
  }, [categoryView])
  return (
    <View style={styles.container}>
      {showModal.show && (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            zIndex: 999,
          }}>
          <View
            style={{
              borderRadius: 10,
              width: 200,
              height: 150,
              padding: 10,
              zIndex: 9999,
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {showModal.loading ? (
              <Progress
                progress={progressProps.progress}
                text={progressProps.text}
              />
            ) : (
              <View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}>
                  <Button
                    title="scan"
                    disabled={!permissionGranted}
                    onPress={async () => await scanUserStorage()}
                  />
                  {!permissionGranted && (
                    <View>
                      <Text
                        style={{
                          fontFamily: 'Rubik-Bold', fontSize: 11,
                          textAlign: 'center',
                          marginBottom: 20,
                          color: 'black',
                        }}>
                        you need to enable permission to perform this action
                      </Text>
                      <Button
                        title="enable permission"
                        onPress={async () => await requestPermissions()}
                      />
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      )}
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
        <View style={styles.subContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <MaterialIcons
              name="arrow-back-ios"
              size={20}
              color="white"
            />
          </TouchableOpacity>
          <View>
            <View style={styles.navContainer}>
              <Text style={styles.text}>Available Storage</Text>
            </View>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentage}>+{freeDiskStorage} GB</Text>
            </View>
            
          </View>
        </View>
      </LinearGradient>
      <ScrollView style={styles.scrollView}>
        <View style={styles.main}>
          {showData && (
            <>
              {categoryView !== 'Manually' && (
                <>
                  {!cancelPopup && !isSelledSpace && categoryView==="All" && (
                    <View
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 15,
                        backgroundColor: '#FCFCFC',
                        borderRadius: 10,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        // elevation: 5,
                        marginBottom: 10,
                        flexDirection: 'row',
                        width: '100%',
                        // justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                      <Text
                        style={styles.sellOffer}>
                        Do you want sell {Math.round(freeDiskStorage / 2)} Gb of free space for{' '}
                        {Math.round(65000 * Math.round(freeDiskStorage / 2))} Boo
                        coin ?
                      </Text>
                      <View style={{
                        width: '30%',
                        flexDirection: 'row',
                        justifyContent: 'center',

                      }}>
                        <Pressable onPress={() => setCancelPopup(true)} style={[styles.offerBtn, {backgroundColor: '#F4F7F8'}]}>
                          <Text style={[styles.offerBtnText, {color: '#929292'}]}>No</Text>
                        </Pressable>
                        <View style={{width: 10}}></View>
                        <Pressable onPress={() => handleSellSpace(Math.round(freeDiskStorage / 2))} style={styles.offerBtn}>
                          <Text style={styles.offerBtnText}>Yes</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                  {(categoryView === 'All' || categoryView==='Pictures') && (
                    <FilesList
                      data={images as []}
                      label="Pictures"
                      size={calcSpace(images)}
                      removeDeletedItems={removeDeletedItems}
                      refetchByLabel={refechByLabel}
                      isCategoryView={setCategoryView}
                      categoryView={categoryView}
                    />
                  )}
                  {(categoryView === 'All' || categoryView==='Videos') && (
                  <FilesList
                    data={videos as []}
                    label="Videos"
                    removeDeletedItems={removeDeletedItems}
                    size={calcSpace(videos)}
                    refetchByLabel={refechByLabel}
                    isCategoryView={setCategoryView}
                    categoryView={categoryView}
                  />
                  )}
                  {(categoryView === 'All' || categoryView==='Music') && (
                  <FilesList
                    data={music as []}
                    label="Music"
                    removeDeletedItems={removeDeletedItems}
                    size={calcSpace(music)}
                    refetchByLabel={refechByLabel}
                    isCategoryView={setCategoryView}
                    categoryView={categoryView}
                  />
                  )}
                  {(categoryView === 'All' || categoryView==='Thumbnails') && (
                  <FilesList
                    data={thumbnails as []}
                    label="Thumbnails"
                    removeDeletedItems={removeDeletedItems}
                    size={calcSpace(thumbnails)}
                    refetchByLabel={refechByLabel}
                    isCategoryView={setCategoryView}
                    categoryView={categoryView}
                  />
                  )}
                  {(categoryView === 'All' || categoryView==='Empty folders') && (
                  <FilesList
                    data={emptyFolders as []}
                    label="Empty folders"
                    removeDeletedItems={removeDeletedItems}
                    size={calcSpace(emptyFolders)}
                    refetchByLabel={refechByLabel}
                    isCategoryView={setCategoryView}
                    categoryView={categoryView}
                  />
                  )}
                  {(categoryView === 'All' || categoryView==='Not installed apks') && (
                  <FilesList
                    data={notInstalledApks as []}
                    label="Not installed apks"
                    removeDeletedItems={removeDeletedItems}
                    size={calcSpace(notInstalledApks)}
                    refetchByLabel={refechByLabel}
                    isCategoryView={setCategoryView}
                    categoryView={categoryView}
                  />
                  )}
                  {(categoryView === 'All' || categoryView==='DuplicatePictures') && (
                  <FilesList
                    data={duplicatePictures as []}
                    label="Pictures"
                    type="Duplicate"
                    removeDeletedItems={removeDeletedItems}
                    size={calcSpace(duplicatePictures)}
                    refetchByLabel={refechByLabel}
                    isCategoryView={setCategoryView}
                    categoryView={categoryView}
                  />
                  )}
                  {(categoryView === 'All' || categoryView==='DuplicateVideos') && (
                  <FilesList
                    data={duplicateVideos as []}
                    label="Videos"
                    type="Duplicate"
                    removeDeletedItems={removeDeletedItems}
                    size={calcSpace(duplicateVideos)}
                    refetchByLabel={refechByLabel}
                    isCategoryView={setCategoryView}
                    categoryView={categoryView}
                  />
                  )}
                  {(categoryView === 'All' || categoryView==='DuplicateMusic') && (
                  <FilesList
                    data={duplicateMusic as []}
                    label="Music"
                    type="Duplicate"
                    removeDeletedItems={removeDeletedItems}
                    size={calcSpace(duplicateMusic)}
                    refetchByLabel={refechByLabel}
                    isCategoryView={setCategoryView}
                    categoryView={categoryView}
                  />
                  )}
                {/*  {(categoryView === 'All' || categoryView==='Cache') && (
                    <FilesList
                      data={apps as []}
                      label="Cache"
                      removeDeletedItems={removeDeletedItems}
                      size={calcSpace(apps, 'visibleCacheSize', 0)}
                      refetchByLabel={refechByLabel}
                      isCategoryView={setCategoryView}
                      categoryView={categoryView}                      
                    />
                  )}*/}
                </>
              )}
              {categoryView === 'Manually' && (
                <FilesList
                  data={[...images, ...videos, ...music]}
                  label="Manually"
                  size={calcSpace([...images, ...videos, ...music])}
                  removeDeletedItems={removeDeletedItems}
                  refetchByLabel={refechByLabel}
                  isCategoryView={setCategoryView}
                  categoryView={categoryView}
                />
              )}              
              {categoryView !== 'All' && (
                <>
                  <View style={{marginTop: 10}} />
                  <Button
                    title="return"
                    onPress={() => setCategoryView('All')}
                  />                 
                </>
              )}
              {categoryView === 'All' && (
                <>
                  <View style={{marginTop: 10}}></View>
                  <Button
                   title="free up space (manullay)"
                   onPress={() => setCategoryView('Manually')}
                   // onPress={async () => await ManageApps.freeSpace()}
                 />
                 {/*<Button
                    title="free up space (manullay)"
                    onPress={async () => await ManageApps.freeSpace()}
                  />*/}
                  <View style={{marginTop: 10}} />
                  <Button
                    title="clear all"
                    onPress={async () => await ManageApps.clearAllVisibleCache()}
                  />  
                </>
              )}      

            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginHorizontal: 0,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F6F7',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  header: {
    width: '100%',
    paddingTop: 50,
    paddingBottom: 23,
    paddingLeft: 20,
    paddingRight: 36,
    backgroundColor: '#33A1F9',
  },
  subContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'Rubik-Bold', fontSize: 20,
  },
  percentageContainer: {
    alignSelf: 'flex-end',
    // textAlign: 'flex-end'
  },
  percentage: {
    color: 'white',
    fontFamily: 'Rubik-Bold', fontSize: 16,
  },
  main: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 30,
    paddingTop: 30,
  },
  sellOffer: {
    width: '60%',
    marginRight: 30,
    color: '#75B7FA',
    fontFamily: 'Rubik-Regular', 
    fontSize: 13, 
    lineHeight: 20,
    letterSpacing: 0.02,
  },
  offerBtn: {
    height: 25,
    width: 50,
    backgroundColor: '#6DBDFE',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15
  },
  offerBtnText: {
    color: 'white'
  }
});

export default ClearData;
