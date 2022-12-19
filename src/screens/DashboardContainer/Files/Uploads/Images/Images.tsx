import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FilesHeader from '../../FilesHeader/FilesHeader';
import {launchImageLibrary} from 'react-native-image-picker';
import {BaseUrl, store} from '../../../../../shared';
import {
  downloadFiles,
  uploadFiles,
} from '../../../../../shared/slices/Fragmentation/FragmentationService';

import axios from 'axios';
import {setRootLoading} from '../../../../../shared/slices/rootSlice';

const Images = ({navigation}: {navigation: any}) => {
  let userData: any = store.getState().authentication.loggedInUser;
  const [image, setImage] = useState<Array<any>>([]);
  const [downloadedImages, setDownloadedImages] = useState<Array<any>>([]);

  useEffect(() => {
    let user: any = store.getState().authentication.loggedInUser;
    let user_id = user?._id;
    downloadFiles({user_id: user_id, type: 'image'}).then(res => {
      // console.log('response from server \n' + res.data);
      // res.data.json();
      // setDownloadedImages(res.data);
      // setImage([{uri: res.data[0]}]);
      // store.dispatch(setRootLoading(true));
      res?.data.forEach((item: string) => {
        setImage(oldImages => [...oldImages, {uri: item ? item : ''}]);
      });
    });
    // store.dispatch(setRootLoading(false));
  }, []);

  // const createFormData = (photo: any, body = {}) => {
  //   let data = new FormData();
  //   console.log(photo);
  //   data.append('file', {
  //     uri: photo,
  //     type: photo.type,
  //     name: photo.fileName,
  //   });

  //   // Object.keys(body).forEach(key => {
  //   //   data.append(key, body[key]);
  //   // });
  //   // data.append('file',image,'images[]')

  //   return data;
  // };

  const pickImage = async () => {
    await launchImageLibrary(
      {
        mediaType: 'photo',
        // includeBase64: false,
        // maxHeight: 200,
        // maxWidth: 200,
      },
      async (response : any )=> {
        response.assets && console.log(response.assets[0].uri);
        if (response.assets) {
          setImage(oldImages => [...oldImages, {uri: response?.assets[0].uri ? response?.assets[0].uri : ''}]);
          console.log(`${BaseUrl}/logged-in-user/uploadFile/${userData._id}`);
          let data = new FormData();
          // console.log(response.assets[0]);

          data.append('file', {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          });
          store.dispatch(setRootLoading(true));

          await uploadFiles(data, userData._id)
            .then(function (response: any) {
              console.log('response :', response);
              store.dispatch(setRootLoading(false));
            })
            .catch(function (error) {
              console.log(error);
              store.dispatch(setRootLoading(false));
            });
        } else
          setImage(oldImages => [
            ...oldImages,
            {uri: response.assets ? response.assets[0].uri : ''},
          ]);
        store.dispatch(setRootLoading(false));
      },
    );
    store.dispatch(setRootLoading(false));
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerImage}>
          <FilesHeader />
        </View>
        <FlatList
          data={image}
          numColumns={3}
          style={{flex: 1}}
          keyExtractor={item => item.uri}
          renderItem={({item}) => {
            return (
              <View style={styles.inner}>
                <Image
                  source={{uri: item.uri}}
                  style={{
                    width: Dimensions.get('window').width / 4,
                    height: Dimensions.get('window').height / 4,
                  }}
                  resizeMode={'contain'}
                />
              </View>
            );
          }}></FlatList>
      </View>
      <View style={styles.uploadContainer}>
        <TouchableOpacity
          style={{
            width: 82,
            height: 49,
            backgroundColor: 'white',
            borderRadius: 15,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={pickImage}
          >
          <Text style={{color: '#49ACFA', fontWeight: '500'}}>Upload</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  uploadContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: '#F6F7FB',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 11,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 18,
  },
  image: {
    width: 150,
    height: 300,
  },
  inner: {
    flexDirection: 'row',
    marginRight: 20,
  },
  container: {
    flex: 1,
    // backgroundColor: "#33a1f9",
    // alignItems: "center",
    color: '#33a1f9',
    justifyContent: 'center',
    height: '100%',
    // flexWrap: "wrap",
    // flexDirecton: "row",
    width: '100%',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#33a1f9',
    fontWeight: 'bold',
  },
  containerImage: {
    backgroundColor: '#33a1f9',
    width: '100%',
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
});

export default Images;
