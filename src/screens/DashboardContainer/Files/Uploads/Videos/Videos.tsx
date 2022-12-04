import React, {useState} from 'react';
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
import ImagePicker from 'react-native-image-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {BaseUrl} from '../../../../../shared';
import ManageApps from '../../../../../utils/manageApps';

const Videos = ({navigation}: {navigation: any}) => {
  const [image, setImage] = useState<Array<any>>([]);

  const createFormData = (photo: any, body = {}) => {
    const data = new FormData();

    data.append('file', {
      // name: photo.fileName,
      // type: photo.type,
      file: photo.uri,
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    return data;
  };

  const pickVideo = async () => {
    // await launchImageLibrary(
    //   {
    //     mediaType: 'photo',
    //     // includeBase64: false,
    //     // maxHeight: 200,
    //     // maxWidth: 200,
    //   },
    //   response => {
    //     response.assets && console.log(response.assets[0].uri);
    //     if (image.length === 0 && response.assets) {
    //       setImage([{uri: response.assets[0].uri}]);
    //       fetch(`${BaseUrl}/logged-in-user/uploadFile`, {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //           Accept: 'application/json',
    //           token:
    //             'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzN2E4YTQ4ZjQyYzhmZjBkZDE1YWZiYSIsImlhdCI6MTY2OTYzNjk0MiwiZXhwIjoxNjY5NzIzMzQyfQ.Dmenec_EewLSW8sWsmg8yVW7umsMr1yvs1zKXQO-SXU',
    //         },
    //         body: createFormData(response.assets[0]),
    //       })
    //         .then(response => response.json())
    //         .then(response => {
    //           console.log('response', response);
    //         })
    //         .catch(error => {
    //           console.log('error', error);
    //         });
    //     } else
    //       setImage(oldImages => [
    //         ...oldImages,
    //         {uri: response.assets ? response.assets[0].uri : ''},
    //       ]);
    //   },
    // );
    // console.log(image);
    await ManageApps.pickVideos();
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
      <Pressable style={styles.button} onPress={pickVideo}>
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

export default Videos;
