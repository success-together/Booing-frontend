import React, {useEffect, useState, useCallback} from 'react';
import {
  PermissionsAndroid,
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import FilesHeader from '../FilesHeader/FilesHeader';
import Folder, {EditDialog} from '../FolderPage/Folder';
import {AXIOS_ERROR, BaseUrl, MAX_SIZE, store, types} from '../../../../shared';
import {setRootLoading} from '../../../../shared/slices/rootSlice';
import {uploadFiles} from '../../../../shared/slices/Fragmentation/FragmentationService';
import {FolderIcon} from '../Files';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import {Dialog} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import {getCategoryInfo} from '../../../../shared/slices/Directories/DirectoriesService'
import Toast from 'react-native-toast-message';
import ManageApps from '../../../../utils/manageApps';
import ImagePlusIcon from '../../../../Components/ImagePlusIcon/ImagePlusIcon';
import bytes from 'bytes';
import {useSelector} from 'react-redux';


const CreateFolder = ({closeModel, fetchFolders}: {closeModel: (bool?: boolean) => void, fetchFolders: any}) => {
  const [name, setName] = useState('');
  const user_id = store.getState().authentication.userId;
  const [createFolderDisabled, setCreateFolderDisabled] = useState(false);

  const submitHandler = useCallback(async () => {
    setCreateFolderDisabled(true);
    if (name.trim() === '') {
      setCreateFolderDisabled(false);
      return Toast.show({
        type: 'error',
        text1: 'invalid folder name',
      });
    }

    if (!user_id) {
      setCreateFolderDisabled(false);
      return Toast.show({
        type: 'error',
        text1: 'cannot create folder, you are not logged in !',
      });
    }

    try {
      const response = await axios({
        method: 'POST',
        url: `${BaseUrl}/logged-in-user/directory`,
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        data: {
          user_id,
          name,
          dir: 'top'
        },
      });

      if (response.status === 200) {
        closeModel(true);
        setCreateFolderDisabled(false);
        fetchFolders();
        return Toast.show({
          text1: response.data.message,
        });
      }
    } catch (e: any) {
      if (e.name === AXIOS_ERROR && !e.message.includes('code 500')) {
        return Toast.show({
          type: 'error',
          text1: e.response?.data?.message,
        });
      }
      Toast.show({
        type: 'error',
        text1: 'something went wrong cannot get folder',
      });
    } finally {
      setCreateFolderDisabled(false);
    }
  }, [name, user_id]);

  const cancelHandler = useCallback(() => {
    closeModel();
  }, []);

  return (
    <View>
      <Text
        style={{
          color: 'black',
          fontWeight: '600',
          fontFamily: 'Rubik-Regular', fontSize: 18,
          marginBottom: 20,
        }}>
        Create Folder
      </Text>
      <TextInput
        placeholder="name"
        onChangeText={newName => setName(newName)}
        value={name}
        style={{
          backgroundColor: '#F8F8F8',
          borderRadius: 8,
          marginBottom: '5.18%',
          marginTop: 4,
        }}
        placeholderTextColor="#716D6D"
      />
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'flex-end',
        }}>
        <LinearGradient
          colors={['#33A1F9', '#6DBDFE']}
          style={{borderRadius: 8, marginRight: 10}}>
          <Pressable
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              paddingHorizontal: 20,
            }}
            onPress={submitHandler}
            disabled={createFolderDisabled}>
            <Text style={{color: 'white'}}>Create</Text>
          </Pressable>
        </LinearGradient>
        <LinearGradient
          colors={['#33A1F9', '#6DBDFE']}
          style={{borderRadius: 8}}>
          <Pressable
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              paddingHorizontal: 20,
            }}
            onPress={cancelHandler}>
            <Text style={{color: 'white'}}>Cancel</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
};
const Files = ({navigation, fetchFolders}: {navigation: any, fetchFolders: any}) => {
  const [folders, setFolders] = useState([]);
  const [isCreatedFolderShown, setIsCreateFolderShown] = useState(false);
  const user_id = store.getState().authentication.userId;
  const directoires = store.getState().directories.data;

  const isFocused = useIsFocused();

  const showCreateFolder = useCallback(() => {
    console.log('createFolder view')
    setIsCreateFolderShown(true);
  }, []);

  const hideCreateFolder = useCallback(async (refech = false) => {
    setIsCreateFolderShown(false);
  }, []);

  return (
    <View style={fileStyles.columnIcon}>
      <View style={fileStyles.rowIcon}>
{/*        <Pressable
          style={fileStyles.button}
          onPress={() => {
            navigation.navigate('Uploads');
          }}>
          <Feather
            name="folder-plus"
            size={24}
            color="#C6D2E8"
            style={{marginRight: 10}}
          />
          <Text style={fileStyles.buttonText}>Upload</Text>
        </Pressable>*/}
        <Pressable style={fileStyles.button} onPress={showCreateFolder}>
          <ImagePlusIcon style={{marginRight: 8}} />
          <Text style={fileStyles.buttonText}>Folder</Text>
        </Pressable>
        {isCreatedFolderShown && (
          <Dialog isVisible={true}>
            <CreateFolder closeModel={hideCreateFolder} fetchFolders={fetchFolders}/>
          </Dialog>
        )}
      </View>
    </View>
  );
};

const fileStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginRight: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'Rubik-Bold', fontSize: 16,
    lineHeight: 21,
    
    letterSpacing: 0.25,
    color: 'black',
  },
  buttonText: {
    color: '#9190A8',
    fontFamily: 'Rubik-Regular', fontSize: 14,
    fontWeight: '500',
  },

  rowIcon: {
    marginTop: 10,
    // flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // alignItems: 'center',
    // width: '100%',
  },

  columnIcon: {
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    marginLeft: 30,
    width: '30%',
  },
});
const Uploads = ({navigation}: {navigation: any}) => {
  const [folders, setFolders] = useState([]);
  const [showEditOptions, setShowEditOptions] = useState(null);
  const category = useSelector(state => state.directories.category);
  const user_id = store.getState().authentication.userId;
  const isFocused = useIsFocused();
  useSelector(state => state.directories.category);
  const handleUpload = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ], {
      title: 'Permission Required',
      message: 'This app needs access device storage to function properly.'
    });

    if (
      granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('All permissions granted');
    } else {
      Toast.show({
        type: 'error',
        text1: 'You can not upload, you need to enable all files access permission',
      });
      return false;
    }    
    store.dispatch(setRootLoading(true));
    try {
      if (!user_id) {
        store.dispatch(setRootLoading(false));
        return Toast.show({
          type: 'error',
          text1: 'You can not add files, you are not logged in !',
        });
      }

      const pickedFiles = await ManageApps.pickAnyFile();
      if (pickedFiles && pickedFiles.length > 0) {
        const body = new FormData();
        let length = 0;
        for (const file of pickedFiles) {
          const fileDesc = await ManageApps.getFileDescription(file);

          if (fileDesc.size >= MAX_SIZE) {
            // 25mb
            store.dispatch(setRootLoading(false));
            Toast.show({
              type: 'info',
              text1: `You can not upload file (${fileDesc.name})`,
              text2: `File has exceeded the max size (16mb)`,
            });
            continue ;
          }

          body.append('file', {
            uri: file,
            type: fileDesc.type,
            name: fileDesc.name,
          });
          length++;
        }

        if (length > 0) {
          const response = await uploadFiles(body, user_id, newProgress => {});
          if (response.status === 200) {
            const files_ids = response.data.data.map(({id}: any) => id);
            if (
              !files_ids ||
              !Array.isArray(files_ids) ||
              files_ids.includes(null)
            ) {
              store.dispatch(setRootLoading(false));
              return Toast.show({
                type: 'error',
                text1: 'something went wrong, failed to upload file',
              });
            }

            store.dispatch(setRootLoading(false));
            Toast.show({
              type: 'success',
              text1: 'files uploaded successfully',
            });
            await getCategoryInfo({user_id:user_id});          
          }
        } else {
            return Toast.show({
              type: 'info',
              text1: `You can not upload File(s)`,
              text2: `File(s) has exceeded the max size (16mb)`,
            });
        }

      }
    } catch (e: any) {
      console.log(e)
      if (e.name === AXIOS_ERROR && !e.message.includes('code 500')) {
        store.dispatch(setRootLoading(false));
        return Toast.show({
          type: 'error',
          text1: e.response?.data?.message,
        });
      }

      Toast.show({
        type: 'error',
        text1: "Something went wrong and the file couldn't be uploaded.",
      });
    }
    store.dispatch(setRootLoading(false));
  }

  const fetchFolders = useCallback(async () => {
    if (!user_id) {
      return Toast.show({
        type: 'error',
        text1: 'cannot get folders, you are not logged in !',
      });
    }

    try {
      // console.log('directories from sotre : ' + JSON.stringify(directoires));
      // store.dispatch(setRootLoading(true));
      const response = await axios({
        method: 'POST',
        url: `${BaseUrl}/logged-in-user/directories/top`,
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        data: {
          user_id,
        },
      });

      if (response.status === 200) {
        const data = response.data.data;
        setFolders(data);
      }
      // await getDirectories({user_id}).then(res => {
      //   // console.log(res);
      //   if (res.success) {
      //     setFolders(res.data);
      //   }
      // });
    } catch (e: any) {
      if (e.name === AXIOS_ERROR && !e.message.includes('code 500')) {
        return Toast.show({
          type: 'error',
          text1: e.response?.data?.message,
        });
      }
      Toast.show({
        type: 'error',
        text1: 'something went wrong cannot get folder',
      });
    } finally {
      store.dispatch(setRootLoading(false));
    }
  }, [user_id]);
  const navigateToFolder = (id: string) => {
    navigation.navigate({
      name: 'Folder',
      params: {
        id,
        historyStack: [id],
      },
    });
  }


  const handleShow = useCallback((id) => {
    setShowEditOptions(id);
  }, []);

  const handleHide = useCallback(() => {
    setShowEditOptions(null);
  }, []);

  const reload = useCallback(() => {
    fetchFolders();
    console.log('reload');
    return true;
  }, [])
  useEffect(() => {
    if (isFocused) {
      (async() => {
        fetchFolders();
        await getCategoryInfo({user_id:user_id});
      })()
    }
  }, [isFocused]);  
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <FilesHeader onBackPress={() => navigation.navigate('Home')} navigation={navigation} />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingRight: 30}}>
          <Files navigation={navigation} fetchFolders={fetchFolders}/>    
          <Pressable style={[fileStyles.button, {paddingLeft: 15, justifyContent: 'flex-start', backgroundColor: '#6DBDFE', width: '30%', padding: 1, height: 43, marginTop: 10}]} onPress={handleUpload}>
            <AntDesign name="pluscircleo" size={15} color="white" style={{marginRight: 18}} />
            <Text style={[fileStyles.buttonText, {color: 'white'}]}>File</Text>
          </Pressable>
        </View>
        <View style={{marginLeft: 20}}>
          <Text style={styles.title}>Categories</Text>
        </View>
        <View style={styles.columnItems}>
          <Pressable
            style={styles.rowItem}
            onPress={() => {
              navigation.navigate('Images');
            }}>
            <View style={styles.namegroup}>
              <Feather name="image" size={24} color="#FE6149"/>
              <View style={styles.name}>
                <Text style={styles.nameFont}>Images</Text>
                {/*<Text style={styles.timeFont}>{category.image.updated}</Text>*/}
              </View>
            </View>
            <Text style={styles.count}>{category.image.count} items</Text>
          </Pressable>
          <Pressable
            style={styles.rowItem}
            onPress={() => {
              navigation.navigate('Videos');
            }}>
            <View style={styles.namegroup}>
              <Feather name="video" size={24} color="#CFB2F2"/>
              <View style={styles.name}>
                <Text style={styles.nameFont}>Videos</Text>
                {/*<Text style={styles.timeFont}>{category.video.updated}</Text>*/}
              </View>
            </View>
            <Text style={styles.count}>{category.video.count} items</Text>
          </Pressable>
          <Pressable
            style={styles.rowItem}
            onPress={() => {
              navigation.navigate('Audio');
            }}>
            <View style={styles.namegroup}>
              <SimpleLineIcons name="music-tone" size={24} color="#B7B7E1"/>
              <View style={styles.name}>
                <Text style={styles.nameFont}>Audio</Text>
                {/*<Text style={styles.timeFont}>{category.audio.updated}</Text>*/}
              </View>
            </View>
            <Text style={styles.count}>{category.audio.count} items</Text>
          </Pressable>
          <Pressable
            style={styles.rowItem}
            onPress={() => {
              navigation.navigate('Documents');
            }}>
            <View style={styles.namegroup}>
              <Ionicons name="document-outline" size={24} color="#FF8700"/>
              <View style={styles.name}>
                <Text style={styles.nameFont}>Documents</Text>
                {/*<Text style={styles.timeFont}>{category.document.updated}</Text>*/}
              </View>
            </View>
            <Text style={styles.count}>{category.document.count} items</Text>
          </Pressable>
          <Pressable
            style={styles.rowItem}
            onPress={() => {
              navigation.navigate('Others');
            }}>
            <View style={styles.namegroup}>
              <Ionicons name="document-outline" size={24} color="#FF2960"/>
              <View style={styles.name}>
                <Text style={styles.nameFont}>Other Files</Text>
                {/*<Text style={styles.timeFont}>{category.other.updated}</Text>*/}
              </View>
            </View>
            <Text style={styles.count}>{category.other.count} items</Text>
          </Pressable>
          {folders.map((folder) => {
            return (
              <Pressable
                key={folder.id}
                style={styles.rowItem}
                onPress={() => {
                  console.log(folder.id)
                  navigateToFolder(folder.id);
                }}
                onLongPress={() => handleShow(folder.id)}
              >
                <View style={styles.namegroup}>
                  <FolderIcon  color="#ffffff"/>
                  <View style={styles.name}>
                    <Text style={styles.nameFont}>{folder.name}</Text>
                    {/*<Text style={styles.timeFont}>{category.other.updated}</Text>*/}
                  </View>
                </View>
                <Text style={styles.count}>{folder.count} items</Text>
              </Pressable>
            )
          })}
          {showEditOptions && (
            <EditDialog
              handleHide={handleHide}
              id={showEditOptions}
              reload={reload}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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

  containerImage: {
    backgroundColor: '#33a1f9',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 0,
  },
  input: {
    width: '100%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: 'white',
    backgroundColor: 'white',
    marginRight: 50,
  },
  TopBody: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
    padding: 10,
  },
  BottomBody: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    padding: 2,
  },
  row: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '90%',
    height: 60,
    borderRadius: 10,
  },

  title: {
    fontFamily: 'Rubik-Regular', 
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'grey',
    textAlign: 'left',
    marginLeft: 5,
    marginTop: 8,
  },


  columnItems: {
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  rowItem: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    width: '80%',
  },

  namegroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "80%",
  },
  icon: {
    // width: "20%"
    // flexDirection: 'column',
    // justifyContent: 'flex-end',
    // // alignItems: 'center',
  },
  name: {
    width: '100%',
    textAlign: 'left',
    marginLeft: 20,
    color: 'black',
  },
  nameFont: {
    fontFamily: 'Rubik-Regular', fontSize: 15,
    color: '#A0A0A0'
  },
  timeFont: {
    fontFamily: 'Rubik-Regular', fontSize: 10,
    color: '#A0A0A0'
  },
  count: {
    fontFamily: 'Rubik-Regular', fontSize: 10,
    textAlign: 'center',
    color: 'black',
    // marginTop: 4,
  },

  createAccount: {
    fontFamily: 'Rubik-Bold', fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'black',
    
  },

});

export default Uploads;
