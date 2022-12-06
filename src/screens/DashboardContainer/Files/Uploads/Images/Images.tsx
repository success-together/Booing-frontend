import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FilesHeader from '../../FilesHeader/FilesHeader';
import {launchImageLibrary} from 'react-native-image-picker';
import {BaseUrl, store} from '../../../../../shared';
import {downloadFiles} from '../../../../../shared/slices/Fragmentation/FragmentationService';

import axios from 'axios';
import {setRootLoading} from '../../../../../shared/slices/rootSlice';

const Images = ({navigation}: {navigation: any}) => {
  let userData: any = store.getState().authentication.loggedInUser;
  const [image, setImage] = useState<Array<any>>([]);
  const [downloadedImages, setDownloadedImages] = useState<Array<any>>([]);

  useEffect(() => {
    let user: any = store.getState().authentication.loggedInUser;
    let user_id = user?._id;
    downloadFiles({user_id: user_id}).then(res => {
      console.log('response from server \n' + res.data[0]);
      // res.data.json();
      // setDownloadedImages(res.data);
      // setImage([{uri: res.data[0]}]);
      // store.dispatch(setRootLoading(true));
      res?.data.forEach((item: string) => {
        console.log(item);
        setImage(oldImages => [...oldImages, {uri: item ? item : ''}]);
        console.log(image);
      });
    });
    console.log(image);
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
      async response => {
        response.assets && console.log(response.assets[0].uri);
        if (image.length === 0 && response.assets) {
          setImage([{uri: response.assets[0].uri}]);
          console.log(`${BaseUrl}/logged-in-user/uploadFile${userData._id}`);
          let data = new FormData();
          console.log(response.assets[0]);

          data.append('file', {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          });
          console.log(data);
          store.dispatch(setRootLoading(true));

          await axios({
            url: `${BaseUrl}/logged-in-user/uploadFile${userData._id}`,
            method: 'POST',
            data: data,
            headers: {
              accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          })
            .then(function (response) {
              console.log('response :', response?.data);
              store.dispatch(setRootLoading(false));
            })
            .catch(function (error) {
              console.log(error);
            });
        } else
          setImage(oldImages => [
            ...oldImages,
            {uri: response.assets ? response.assets[0].uri : ''},
          ]);
        store.dispatch(setRootLoading(false));
      },
    );
    console.log(image);
    store.dispatch(setRootLoading(false));
  };

  return (
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
      <Pressable style={styles.button} onPress={pickImage}>
        <Text style={styles.text}>Upload</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 300,
  },
  inner: {
    flexDirection: 'row',
    marginRight: 20,
  },
  container: {
    flex: 0.9,
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
    flex: 0.8,
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
