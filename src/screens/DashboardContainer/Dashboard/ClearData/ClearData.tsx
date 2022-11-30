import { StorageAccessFramework } from "expo-file-system";
import React, { useEffect, useState } from "react";
import { View, Text, PermissionsAndroid, StyleSheet, Button, ActivityIndicator, TurboModuleRegistry } from "react-native";
import {CachesDirectoryPath, ExternalDirectoryPath ,ExternalCachesDirectoryPath  , ExternalStorageDirectoryPath,DownloadDirectoryPath , readDir, readdir, ReadDirItem, stat, readFile, PicturesDirectoryPath } from 'react-native-fs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import ManageApps from "../../../../utils/manageApps";
import bytes from "bytes";
import FilesList from "../FilesList/FilesList";
import { randomId } from "../../../../utils/util-functions";
import { nanoid } from "@reduxjs/toolkit";
import {checkMultiple, Permission, PERMISSIONS, request, requestMultiple, RESULTS} from 'react-native-permissions';


function sleep(randomSecs: number) {
  return  new Promise((res, rej) => {
    setTimeout(() => {
      res('');
    }, randomSecs);
  })
}

export interface IImage extends ReadDirItem {
  id: string;
  logo: string;
}

const paths =  [
  {
    label: 'Music',
    path: ExternalDirectoryPath + '/Music',
  },
  {
    label: 'Pictures',
    path: ExternalDirectoryPath + '/Pictures', 
  },
  {
    label: 'Downloads',
    path: DownloadDirectoryPath,
  },
  {
    label: 'Videos',
    path: ExternalDirectoryPath + '/Movies',
  },
  {
    label: 'Cache',
    path: CachesDirectoryPath,
  },
]

function ClearData({route, navigation}: {navigation: any, route: any}) {
  const {freeDiskStorage} = route.params;
  const [showData, setShowData] = useState(false);
  const [showModal, setShowModal] = useState({show:false, loading: false});


  const [images, setImages]= useState([]);
  const [videos, setVideos] = useState([]);
  const [apps, setApps] = useState([]);
  const [music, setMusic] = useState([]);

  const addId = (arr: []) => {
    arr.forEach(e => Object.assign(e, {id: nanoid(10)}));
    return arr;
  }

  useEffect(() => {
    (async () => {
      try {
      const granted = await requestMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]);
      if(Object.values(granted).every(v => v === RESULTS.GRANTED || v === RESULTS.BLOCKED)) {
        setShowData(true);
        let images = await ManageApps.getImages();
        images = await Promise.all(images.map(async(img: any) => Object.assign(img, {logo:await readFile(img.path, 'base64'), id: nanoid(10)})));
        setImages(images);
        setVideos(addId(await ManageApps.getVideos()));
        setMusic(addId(await ManageApps.getAudios()));
        setApps(addId(await ManageApps.getAllInstalledApps()));
      }
    }catch(e: any) {
        console.log(e.stack)
      }
    })();
  }, [])

  const removeDeletedItems = (ids: string[], label: string) => {
    const removeItems = (setFn: Function) => {
      setFn((arr: []) => arr.filter((item: any) => !ids.includes(item.id)));
    }
    switch(label) {
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
  }

  const clearMyCache =  () => {
    setShowModal({show: true, loading: true});
    ManageApps.clearMyCache().then(() => {
      setTimeout(() => {
        setShowModal({show: true,loading: false});
      }, 3000);
    });

  }

  return (
    <View>
      {showModal.show && (<View style={{position: 'absolute', width: 200, height: 120, padding: 10, zIndex: 9999, backgroundColor: 'white', top: '50%', left: 80}}>
        <Text>clear my app cache</Text>
        {showModal.loading === true ?( <ActivityIndicator size="large" />):(<View>
          <Text style={{marginBottom: 10}}>sell free space to the application ?</Text>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Button title='Yes' onPress={() => setShowModal({show: false, loading: false})}/>
            <Button title='No' onPress={() => setShowModal({show: false, loading: false})} />
          </View>
        </View>)
        }
      </View>)}
      <View style={styles.header}>
        <View style={styles.subContainer}>
            <View style={styles.navContainer}>
              <MaterialIcons name='arrow-back-ios' size={20} color='white' onPress={() => navigation.goBack()}/>
              <Text style={styles.text}>Available Storage</Text>
              <Feather name='search' size={20} color='white' />
            </View>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentage}>+{bytes(freeDiskStorage)}</Text>
            </View>
        </View>
      </View>

      <View style={styles.main}>
        {showData && <>
        <FilesList data={images as []}
                   label='Pictures'     
                   removeDeletedItems={removeDeletedItems}
              />
        <FilesList data={videos as []}
                   label='Videos'     
                   removeDeletedItems={removeDeletedItems}
              />
        <FilesList data={music as []}
                   label='Music'     
                   removeDeletedItems={removeDeletedItems}
        />
        <FilesList data={apps as []}
                   label='Cache'     
                   removeDeletedItems={removeDeletedItems}
              />
        </>}
        <Button title='clear app cache' onPress={clearMyCache} />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#33A1F9',
    paddingTop: 66,
    paddingBottom: 28,
    paddingLeft: 60,
    paddingRight: 60 
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
    fontWeight: 'bold' 
  },
  percentageContainer: {
    alignSelf: 'center',
  },
  percentage: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  main: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 30,
    paddingTop: 30,
  }
})

export default ClearData;
