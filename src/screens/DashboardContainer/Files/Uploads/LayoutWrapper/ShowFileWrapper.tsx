import React, {Dispatch, ReactNode, SetStateAction} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {threeVerticleDots} from '../../../../../images/export';
import Feather from 'react-native-vector-icons/Feather';
import Share from 'react-native-share';
import ManageApps from '../../../../../utils/manageApps';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';

interface ShowFileWrapperProps {
  title?: string;
  displayComponent: ReactNode;
  setIsShowingFile: Dispatch<SetStateAction<any>>;
  uri?: string;
}

const ShowFileWrapper = ({
  title,
  displayComponent,
  setIsShowingFile,
  uri,
  image
}: ShowFileWrapperProps) => {

  const sharing = async () => {
    const shareOptions = {
      message: ' ',
      url: uri
    };
    try {
      const shareResponse = await Share.open(shareOptions);
    } catch (error) {
      console.log('Error ==>', error);
    }
  };
  const download = async() => {
    console.log(title, uri.length, image)
    const results = await requestMultiple([
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ]);
    const readWriteExternalStorage = Object.values(results).every(
      v => v === RESULTS.GRANTED || v === RESULTS.BLOCKED,
    );

    const allFilesAccess = await ManageApps.checkAllFilesAccessPermission();

    if (!readWriteExternalStorage || !allFilesAccess) {
      return Toast.show({
        type: 'error',
        text1: 'you need to enable permissions to upload files',
      });
    }
    var path = `${RNFS.ExternalStorageDirectoryPath}/BooingApp`;
    RNFS.mkdir(path);
    path += '/'+title;
    // await RNFS.copyFile(internalFilePath, `RNFS.DownloadDirectoryPath/${fileName}`);
    try {
      if (image) {
        await RNFS.writeFile(
          path,
          uri.slice(uri.indexOf('base64,') + 7),
          'base64',
        );
      } else {
        await RNFS.copyFile(uri, path);
      }
      Toast.show({
        type: 'success',
        text1: 'successfuly file donwloaded to BooingApp directory.',
      });
    } catch  {
        Toast.show({
          type: 'error',
          text1: 'cannot download file.',
        });      
    }
  }
  return (
    <View style={{flex: 1, display: 'flex'}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          paddingLeft: 35,
          paddingRight: 35,
          paddingTop: 25,
          paddingBottom: 25,
          backgroundColor: '#F6F7FB',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
          }}>
          <AntDesign
            name="arrowleft"
            color={'black'}
            size={20}
            onPress={() =>
              setIsShowingFile({show: false, uri: undefined, title: undefined})
            }
          />
          <Text
            style={{
              color: 'black',
              fontFamily: 'Rubik-Regular', fontSize: 16,
              fontWeight: '700',
              marginLeft: 15,
              flex: 1,
            }} selectable>
            {title}
          </Text>
        </View>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          {/* <AntDesign name="staro" size={20} color={'black'} /> */}
{/*          <Image
            source={threeVerticleDots}
            resizeMode={'contain'}
            style={{width: 10, height: 20, tintColor: 'black', marginLeft: 20}}
          />*/}
        </View>
      </View>
      <View
        style={{
          position: 'relative',
          backgroundColor: 'black',
          flex: 1,
        }}>
        {displayComponent}
      </View>
      <View style={styles.uploadContainer}>
        <View>
          {/* <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 16,
              marginRight: 16,
            }}>
            <Feather name="check-square" size={18} color="#C6D2E8" />
          </TouchableOpacity> */}
        </View>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          {/* <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 16,
              marginRight: 16,
            }}>
            <Feather name="message-square" size={18} color="#C6D2E8" />
          </TouchableOpacity> */}

          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
            }}
            onPress={sharing}>
            <Text style={{color: '#49ACFA', fontWeight: '500'}}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
            }}
            onPress={download}>
            <Text style={{color: '#49ACFA', fontWeight: '500'}}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  uploadContainer: {
    width: '100%',
    backgroundColor: '#F6F7FB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 11,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 18,
  },
});

export default ShowFileWrapper;
