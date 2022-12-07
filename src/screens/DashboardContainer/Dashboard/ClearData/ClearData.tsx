import {StorageAccessFramework} from 'expo-file-system';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import {ReadDirItem, readFile} from 'react-native-fs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import ManageApps from '../../../../utils/manageApps';
import bytes from 'bytes';
import FilesList from '../FilesList/FilesList';
import {randomId} from '../../../../utils/util-functions';
import {nanoid} from '@reduxjs/toolkit';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import {setRootLoading} from '../../../../shared/slices/rootSlice';
import {store} from '../../../../shared';
import {ScrollView} from 'react-native';

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
  const [showModal, setShowModal] = useState({show: false, loading: false});

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [apps, setApps] = useState([]);
  const [music, setMusic] = useState([]);

  const [triggerRerender, setTriggerRerender] = useState(false);

  const addId = (arr: []) => {
    arr.forEach(e => Object.assign(e, {id: nanoid(10)}));
    return arr;
  };

  useEffect(() => {
    (async () => {
      try {
        const granted = await requestMultiple([
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ]);
        if (
          Object.values(granted).every(
            v => v === RESULTS.GRANTED || v === RESULTS.BLOCKED,
          )
        ) {
          store.dispatch(setRootLoading(true));
          console.log({granted});
          setShowData(true);
          let images = await ManageApps.getImages();
          images = await Promise.all(
            images.map(async (img: any) =>
              Object.assign(img, {
                logo: await readFile(img.path, 'base64'),
                id: nanoid(10),
              }),
            ),
          );
          store.dispatch(setRootLoading(false));

          setImages(images);
          setVideos(addId(await ManageApps.getVideos()));
          setMusic(addId(await ManageApps.getAudios()));
          setApps(addId(await ManageApps.getAllInstalledApps()));
          store.dispatch(setRootLoading(false));
        }
      } catch (e: any) {
        console.log(e.stack);
      }
      store.dispatch(setRootLoading(false));
    })();
  }, [triggerRerender]);

  const removeDeletedItems = (ids: string[], label: string) => {
    console.log({ids, label});
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
      default:
        break;
    }
  };

  const clearMyCache = () => {
    setShowModal({show: true, loading: true});
    ManageApps.clearAppVisibleCache('com.rnfrontend').then(() => {
      setTimeout(() => {
        setShowModal({show: true, loading: false});
      }, 3000);
    });
  };

  console.log({apps});
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
              height: 120,
              padding: 10,
              zIndex: 9999,
              backgroundColor: 'white',
            }}>
            {showModal.loading === true ? (
              <>
                <Text style={{color: 'black', fontSize: 20, marginBottom: 20}}>
                  clear my app cache
                </Text>
                <ActivityIndicator size="large" />
              </>
            ) : (
              <View>
                <Text style={{marginBottom: 20, color: 'black', fontSize: 16}}>
                  sell {freeDiskStorage / 2} Gb free space for {(50000 * freeDiskStorage) / 2} Boo coin ?
                </Text>
                <View style={{display: 'flex', flexDirection: 'row',justifyContent : 'center'}}>
                  <Button
                    title="Yes"
                    onPress={() => setShowModal({show: false, loading: false})}
                  />
                  <View style={{marginLeft: 10}}></View>
                  <Button
                    title="No"
                    onPress={() => setShowModal({show: false, loading: false})}
                  />
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
              <FilesList
                data={images as []}
                label="Pictures"
                size={calcSpace(images)}
                removeDeletedItems={removeDeletedItems}
              />
              <FilesList
                data={videos as []}
                label="Videos"
                removeDeletedItems={removeDeletedItems}
                size={calcSpace(videos)}
              />
              <FilesList
                data={music as []}
                label="Music"
                removeDeletedItems={removeDeletedItems}
                size={calcSpace(music)}
              />
              <FilesList
                data={
                  apps.filter(
                    (e: any) =>
                      e.visibleCacheSize > 6144 || e.hiddenCacheSize > 6144,
                  ) as []
                }
                label="Cache"
                removeDeletedItems={removeDeletedItems}
                size={calcSpace(apps, 'visibleCacheSize', 0)}
                setTriggerRerender={setTriggerRerender}
              />
            </>
          )}
          <View style={{marginTop: 10}}></View>
          <Button
            title="free up space (manullay)"
            onPress={async () => await ManageApps.freeSpace()}
          />
          <View style={{marginTop: 10}} />
          <Button title="clear my cache" onPress={async () => clearMyCache()} />
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
