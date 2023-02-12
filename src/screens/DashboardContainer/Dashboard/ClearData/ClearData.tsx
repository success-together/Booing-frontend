/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {ReadDirItem} from 'react-native-fs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import ManageApps from '../../../../utils/manageApps';
import FilesList from '../FilesList/FilesList';
import {nanoid} from '@reduxjs/toolkit';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import {ScrollView} from 'react-native';
import {Bar} from 'react-native-progress';
import {useIsFocused} from '@react-navigation/native';
import {store} from '../../../../shared';
import {setRootLoading} from '../../../../shared/slices/rootSlice';
import {Transaction} from '../../../../shared/slices/wallet/walletService';

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
  const [showModal, setShowModal] = useState({show: true, loading: false});
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [music, setMusic] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [emptyFolders, setEmptyFolders] = useState([]);
  const [notInstalledApks, setNotInstalledApks] = useState([]);
  const [cancelPopup, setCancelPopup] = useState<boolean>(false);
  const [isSelledSpace, setIsSelledSpace] = useState<boolean>(false);
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

  const scanUserStorage = useCallback(async () => {
    try {
      store.dispatch(setRootLoading(false));
      setShowModal({show: true, loading: true});
      setProgressProps(prev => ({...prev, text: 'fetching images ...'}));
      setImages(addId(await ManageApps.getImages()));
      setProgressProps({text: 'fetching videos ...', progress: 0.25});
      setVideos(addId(await ManageApps.getVideos()));
      setProgressProps({text: 'fetching audio files ...', progress: 0.5});
      setMusic(addId(await ManageApps.getAudios()));
      // setApps(addId(await ManageApps.getAllInstalledApps()));
      setProgressProps({text: 'fetching junk files ...', progress: 0.75});
      const {notInstalledApps, thumbnails, emptyFolders} =
        await ManageApps.getJunkData();

      setNotInstalledApks(addId(notInstalledApps));
      setThumbnails(addId(thumbnails));
      setEmptyFolders(addId(emptyFolders));
      setProgressProps({text: 'done !', progress: 1});
    } catch (e: any) {
      console.log(e.stack);
    } finally {
      setShowData(true);

      setTimeout(() => setShowModal({show: false, loading: false}), 200);
    }
  }, []);

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

  useEffect(() => {
    if (isFocused) {
      (async () => {
        console.log(store.getState().wallet.data.isSpaceSelled);
        setIsSelledSpace(store.getState().wallet.data.isSpaceSelled);
        setProgressProps({text: '', progress: 0});
        await scanUserStorage();
      })();
    }
  }, [isFocused]);

  const sellSpace = async (coins: number) => {
    user_id &&
      Transaction({
        coins: coins,
        isIncremenet: true,
        user_id: user_id,
        isSpaceSelled: true,
      }).then(res => {
        if (res.success) {
          setCancelPopup(true);
        }
      });
  };

  // useEffect(() => {
  //   console.log(images.map(image => image.id));
  // }, [images]);

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
                          fontSize: 11,
                          textAlign: 'center',
                          marginBottom: 20,
                          color: 'black',
                          fontWeight: 'bold',
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
      <View style={styles.header}>
        <View style={styles.subContainer}>
          <View style={styles.navContainer}>
            <MaterialIcons
              name="arrow-back-ios"
              size={20}
              color="white"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.text}>Available Storage</Text>

            <Feather name="search" size={20} color="white" />
          </View>
          <View style={styles.percentageContainer}>
            <Text style={styles.percentage}>+{freeDiskStorage} GB</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.main}>
          {showData && (
            <>
              {!cancelPopup && !isSelledSpace && (
                <View
                  style={{
                    padding: 10,
                    backgroundColor: '#FCFCFC',
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{marginBottom: 20, color: '#9F9EB3', fontSize: 16}}>
                    sell {freeDiskStorage / 2} Gb free space for {Math.round(((50000 * freeDiskStorage) / 2) * 10) / 10} Boo coin ?
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'center',
                    }}>
                    <Button
                      title="yes"
                      onPress={() =>
                        sellSpace(
                          Math.round(((50000 * freeDiskStorage) / 2) * 10) / 10,
                        )
                      }
                    />
                    <View style={{marginLeft: 10}} />
                    <Button title="no" onPress={() => setCancelPopup(true)} />
                  </View>
                </View>
              )}

              <FilesList
                data={images as []}
                label="Pictures"
                size={calcSpace(images)}
                removeDeletedItems={removeDeletedItems}
                refetchByLabel={refechByLabel}
              />
              <FilesList
                data={videos as []}
                label="Videos"
                removeDeletedItems={removeDeletedItems}
                size={calcSpace(videos)}
                refetchByLabel={refechByLabel}
              />
              <FilesList
                data={music as []}
                label="Music"
                removeDeletedItems={removeDeletedItems}
                size={calcSpace(music)}
                refetchByLabel={refechByLabel}
              />
              {/* <FilesList
                data={apps.filter((e: any) => e.visibleCacheSize > 0) as []}
                label="Cache"
                removeDeletedItems={removeDeletedItems}
                size={calcSpace(apps, 'visibleCacheSize', 0)}
                refetchByLabel={refechByLabel}
              /> */}
              <FilesList
                data={thumbnails as []}
                label="Thumbnails"
                removeDeletedItems={removeDeletedItems}
                size={calcSpace(thumbnails)}
                refetchByLabel={refechByLabel}
              />
              <FilesList
                data={emptyFolders as []}
                label="Empty folders"
                removeDeletedItems={removeDeletedItems}
                size={calcSpace(emptyFolders)}
                refetchByLabel={refechByLabel}
              />
              <FilesList
                data={notInstalledApks as []}
                label="Not installed apks"
                removeDeletedItems={removeDeletedItems}
                size={calcSpace(notInstalledApks)}
                refetchByLabel={refechByLabel}
              />
              <View style={{marginTop: 10}}></View>
              <Button
                title="free up space (manullay)"
                onPress={async () => await ManageApps.freeSpace()}
              />
              <View style={{marginTop: 10}} />
              <Button
                title="clear all visible cache"
                onPress={async () => await ManageApps.clearAllVisibleCache()}
              />
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
    // flexWrap: "wrap",
    // flexDirecton: "row",
  },
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#33A1F9',
    paddingTop: 66,
    paddingBottom: 28,
    paddingLeft: 60,
    paddingRight: 60,
  },
  subContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  navContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  percentageContainer: {
    alignSelf: 'center',
  },
  percentage: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  main: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 30,
    paddingTop: 30,
  },
});

export default ClearData;
