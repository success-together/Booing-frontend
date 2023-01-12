import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {small_logo, threeVerticleDots} from '../../../../images/export';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {AXIOS_ERROR, BaseUrl, store} from '../../../../shared';
import Toast from 'react-native-toast-message';
import Folder, {FolderProps} from './Folder';
import File, {FileProps} from './File';
import NoDataFound from '../../../../Components/NoDataFound/NoDataFound';
import {setRootLoading} from '../../../../shared/slices/rootSlice';
import {useIsFocused} from '@react-navigation/native';
import {MultipleSelectList} from '../Files';
import {Dialog} from 'react-native-elements';
import ManageApps from '../../../../utils/manageApps';
import {uploadFiles} from '../../../../shared/slices/Fragmentation/FragmentationService';
import {Pie} from 'react-native-progress';

const AddFiles = ({handleHide, reload, id}: any) => {
  const [files, setFiles] = useState([]);
  const [selectedFilesIds, setSelectedFilesIds] = useState<string[]>([]);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const user_id = store.getState().authentication.userId;
  const isFocused = useIsFocused();

  const addFilesHandler = useCallback(async () => {
    setSubmitDisabled(true);
    store.dispatch(setRootLoading(true));
    try {
      if (!user_id) {
        setSubmitDisabled(false);
        store.dispatch(setRootLoading(false));
        handleHide();
        return Toast.show({
          type: 'error',
          text1: 'cannot add files, you are not logged in !',
        });
      }
      const response = await axios({
        method: 'POST',
        url: `${BaseUrl}/logged-in-user/addFilesToDirectory/${id}`,
        data: {
          files_ids: selectedFilesIds,
          user_id,
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (response.status === 200) {
        setSubmitDisabled(false);
        store.dispatch(setRootLoading(false));
        handleHide();
        Toast.show({
          type: 'success',
          text1: 'files added successfully',
        });
        return reload();
      }
    } catch (e: any) {
      if (e.name === AXIOS_ERROR && !e.message.includes('code 500')) {
        setSubmitDisabled(false);
        store.dispatch(setRootLoading(false));
        handleHide();
        return Toast.show({
          type: 'error',
          text1: e.response?.data?.message,
        });
      }
      Toast.show({
        type: 'error',
        text1: 'something went wrong cannot add files',
      });
    }
    handleHide();
    setSubmitDisabled(false);
    store.dispatch(setRootLoading(false));
  }, [user_id, selectedFilesIds, handleHide, reload, id]);

  useEffect(() => {
    (async () => {
      try {
        if (!user_id) {
          return Toast.show({
            type: 'error',
            text1: 'cannot get files to add, you are not logged in !',
          });
        }

        store.dispatch(setRootLoading(true));

        const response = await axios({
          method: 'POST',
          url: `${BaseUrl}/logged-in-user/getMyFiles`,
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
          setFiles(
            data
              .filter((item: any) => item.id !== id)
              .map(({id, name, isDirectory}: any) => ({
                id,
                label: name,
                isDirectory,
              })),
          );
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
          text1: 'something went wrong cannot get files to add',
        });
      } finally {
        store.dispatch(setRootLoading(false));
      }
    })();
  }, [user_id, isFocused]);

  return (
    <View>
      <Text style={{marginBottom: 10, color: 'black', fontWeight: '500'}}>
        Select files or folders you want to put inside :
      </Text>
      <MultipleSelectList
        data={files}
        label="search file/folder name"
        onSelect={newSelectedFilesIds =>
          setSelectedFilesIds(newSelectedFilesIds)
        }
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          height: 40,
          marginTop: 10,
        }}>
        <LinearGradient
          colors={['#33A1F9', '#6DBDFE']}
          style={{borderRadius: 8}}>
          <Pressable
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}
            onPress={addFilesHandler}
            disabled={submitDisabled}>
            <Text style={{color: 'white'}}>Add</Text>
          </Pressable>
        </LinearGradient>
        <LinearGradient
          colors={['#33A1F9', '#6DBDFE']}
          style={{
            borderRadius: 8,
            marginLeft: 10,
          }}>
          <Pressable
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}
            onPress={handleHide}>
            <Text style={{color: 'white'}}>Cancel</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
};

const FolderPage = ({navigation, route}: any) => {
  const [folderData, setFolderData] = useState({id: '', name: '', items: []});
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [isAddingFolders, setIsAddingFolders] = useState(false);
  const [isUploadButtonDisabled, setIsUploadButtonDisabled] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    progress: 0,
    show: false,
  });
  const user_id = store.getState().authentication.userId;

  useEffect(() => {
    const {id} = route?.params;
    setFolderData(prev => ({...prev, id}));
    (async () => {
      if (!user_id || !id) {
        return Toast.show({
          type: 'error',
          text1:
            'cannot fetch folder, you are not logged in or folder id is invalid !',
        });
      }
      try {
        store.dispatch(setRootLoading(true));
        const response = await axios({
          method: 'POST',
          url: `${BaseUrl}/logged-in-user/directories/${id}`,
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
          setFolderData(data);
        }
      } catch (e: any) {
        if (e.name === AXIOS_ERROR && !e.message.includes('code 500')) {
          return Toast.show({
            type: 'error',
            text1: e.response?.data?.message,
          });
        }
        console.log(e);
        Toast.show({
          type: 'error',
          text1: 'something went wrong cannot get folder',
        });
      } finally {
        store.dispatch(setRootLoading(false));
      }
    })();
  }, [user_id, route]);

  const showFolder = useCallback(
    (id: string) => () => {
      const historyStack = route.params?.historyStack || [folderData.id];
      historyStack[historyStack.length - 1] !== id && historyStack.push(id);

      navigation.navigate('Folder', {id, historyStack});
    },
    [route, navigation],
  );

  const goBack = useCallback(() => {
    const historyStack = route.params?.historyStack;
    if (historyStack) {
      historyStack.pop();
      if (historyStack.length !== 0) {
        navigation.navigate('Folder', {
          id: historyStack[historyStack.length - 1],
          historyStack,
        });
      } else {
        navigation.navigate('Files');
      }
    } else {
      navigation.navigate('Files');
    }
  }, [route, folderData, navigation]);

  const handleUpload = useCallback(async () => {
    setIsUploadButtonDisabled(true);
    store.dispatch(setRootLoading(true));
    try {
      if (!user_id) {
        setIsUploadButtonDisabled(false);
        store.dispatch(setRootLoading(false));
        return Toast.show({
          type: 'error',
          text1: 'cannot add files, you are not logged in !',
        });
      }

      const pickedFiles = await ManageApps.pickAnyFile();
      if (pickedFiles && pickedFiles.length > 0) {
        const body = new FormData();
        for (const file of pickedFiles) {
          const fileDesc = await ManageApps.getFileDescription(file);
          if (fileDesc.size >= 25000000) {
            // 25mb
            setIsUploadButtonDisabled(false);
            store.dispatch(setRootLoading(false));
            return Toast.show({
              type: 'info',
              text1: 'cannot upload file(s)',
              text2: `file (${fileDesc.name}) has exceeded the max size (25mb)`,
            });
          }

          if (
            folderData.items.find(
              (item: any) =>
                item.name === fileDesc.name ||
                item.name.includes('_' + fileDesc.name),
            )
          ) {
            setIsUploadButtonDisabled(false);
            store.dispatch(setRootLoading(false));
            return Toast.show({
              type: 'info',
              text1: 'file already uploaded',
            });
          }

          body.append('file', {
            uri: file,
            type: fileDesc.type,
            name: fileDesc.name,
          });
        }

        setUploadProgress(prev => ({...prev, show: true}));
        const response = await uploadFiles(body, user_id, newProgress => {
          setUploadProgress(prev => ({...prev, progress: newProgress}));
        });
        if (response.status === 200) {
          const files_ids = response.data.data.map(({id}: any) => id);
          const addFileToFolderResponse = await axios({
            method: 'POST',
            url: `${BaseUrl}/logged-in-user/addFilesToDirectory/${folderData.id}`,
            data: {
              files_ids,
              user_id,
            },
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });

          if (addFileToFolderResponse.status === 200) {
            setIsUploadButtonDisabled(false);
            store.dispatch(setRootLoading(false));
            setUploadProgress({progress: 0, show: false});
            Toast.show({
              type: 'success',
              text1: 'files uploaded successfully',
            });
            return showFolder(folderData.id)();
          }
        }
      }
    } catch (e: any) {
      if (e.name === AXIOS_ERROR && !e.message.includes('code 500')) {
        setIsUploadButtonDisabled(false);
        store.dispatch(setRootLoading(false));
        setUploadProgress({progress: 0, show: false});
        return Toast.show({
          type: 'error',
          text1: e.response?.data?.message,
        });
      }
      Toast.show({
        type: 'error',
        text1: 'something went wrong cannot uplaod files',
      });
      throw e;
    }
    setUploadProgress({progress: 0, show: false});
    setIsUploadButtonDisabled(false);
    store.dispatch(setRootLoading(false));
  }, [user_id, folderData, showFolder]);

  return (
    <View style={{flexDirection: 'column', flex: 1}}>
      <View>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={['#33A1F9', '#6DBDFE']}
          style={styles.header}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'relative',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 36,
            }}>
            <Image
              source={small_logo}
              style={{width: 50, height: 30, position: 'absolute', left: 0}}
            />
            <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
              {folderData.name}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <MaterialIcons
              name="arrow-back-ios"
              size={20}
              color="white"
              onPress={goBack}
              style={{marginRight: 10}}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
                flex: 1,
              }}>
              <Feather
                name="search"
                size={24}
                style={{position: 'absolute', zIndex: 999, top: 10, left: 13}}
              />
              <TextInput
                style={{
                  height: 44,
                  backgroundColor: 'white',
                  borderRadius: 8,
                  paddingLeft: 44,
                  color: 'black',
                  flex: 1,
                }}
                placeholder="Search"
                placeholderTextColor={'#9190A8'}
              />
            </View>
            <View style={{position: 'relative'}}>
              <TouchableOpacity
                onPress={() => setIsHeaderMenuOpen(prev => !prev)}>
                <Image
                  source={threeVerticleDots}
                  resizeMode={'contain'}
                  style={{
                    width: 10,
                    height: 20,
                    tintColor: 'white',
                    marginLeft: 26,
                  }}
                />
              </TouchableOpacity>
              {isHeaderMenuOpen && (
                <View
                  style={{
                    position: 'absolute',
                    minWidth: 100,
                    right: 0,
                    top: '60%',
                    zIndex: 9999,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    elevation: 2,
                    padding: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsHeaderMenuOpen(false);
                      setIsAddingFolders(true);
                    }}>
                    <Text style={{color: 'black'}}>Add folder</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: '4.67%',
          paddingVertical: '2.45%',
          backgroundColor: '#F6F7FB',
        }}>
        {folderData.items.length !== 0 ? (
          folderData.items.map(
            (
              item:
                | (FolderProps & {isDirectory: boolean})
                | (FileProps & {isDirectory: boolean}),
            ) =>
              item.isDirectory ? (
                <Folder
                  {...(item as FolderProps)}
                  key={item.id}
                  showFolder={showFolder(item.id)}
                  reload={showFolder(folderData.id)}
                />
              ) : (
                <File {...(item as FileProps)} key={item.id} />
              ),
          )
        ) : (
          <NoDataFound />
        )}
      </ScrollView>
      {isAddingFolders && (
        <Dialog isVisible={true}>
          <AddFiles
            id={folderData.id}
            reload={showFolder(folderData.id)}
            handleHide={() => setIsAddingFolders(false)}
          />
        </Dialog>
      )}
      {uploadProgress.show && (
        <Dialog isVisible={true}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Pie progress={uploadProgress.progress} size={50} />
          </View>
        </Dialog>
      )}
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
          disabled={isUploadButtonDisabled}
          onPress={handleUpload}>
          <Text style={{color: '#49ACFA', fontWeight: '500'}}>Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: 63,
    paddingBottom: 23,
    paddingLeft: 20,
    paddingRight: 36,
  },
  uploadContainer: {
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
});

export default FolderPage;
