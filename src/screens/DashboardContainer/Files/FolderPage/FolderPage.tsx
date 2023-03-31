import React, {useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  View,
  BackHandler
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {AXIOS_ERROR, BaseUrl, MAX_SIZE, store, types} from '../../../../shared';
import Toast from 'react-native-toast-message';
import Folder, {FolderProps} from './Folder';
import {FileProps} from './File';
import NoDataFound from '../../../../Components/NoDataFound/NoDataFound';
import {setRootLoading} from '../../../../shared/slices/rootSlice';
import {useIsFocused} from '@react-navigation/native';
import {Dialog} from 'react-native-elements';
import ManageApps from '../../../../utils/manageApps';
import {uploadFiles} from '../../../../shared/slices/Fragmentation/FragmentationService';
import SelectableItems from '../Uploads/LayoutWrapper/SelectableItems';
import LayoutWrapper from '../Uploads/LayoutWrapper/LayoutWrapper';
import {formatUri} from '../Uploads/Videos/Videos';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ShowFileWrapper from '../Uploads/LayoutWrapper/ShowFileWrapper';
import {getDisplayComponent} from '../RecycleBin/RecycleBin';
import RNFS from 'react-native-fs';
import useSocket from '../../../../shared/socket';
import * as Progress from 'react-native-progress';

let isFileFetching = false;
// const AddFiles = ({handleHide, reload, id}: any) => {
//   const [files, setFiles] = useState([]);
//   const [selectedFilesIds, setSelectedFilesIds] = useState<string[]>([]);
//   const [submitDisabled, setSubmitDisabled] = useState(false);
//   const user_id = store.getState().authentication.userId;
//   const isFocused = useIsFocused();

//   const addFilesHandler = useCallback(async () => {
//     setSubmitDisabled(true);
//     store.dispatch(setRootLoading(true));
//     try {
//       if (!user_id) {
//         setSubmitDisabled(false);
//         store.dispatch(setRootLoading(false));
//         handleHide();
//         return Toast.show({
//           type: 'error',
//           text1: 'cannot add files, you are not logged in !',
//         });
//       }
//       const response = await axios({
//         method: 'POST',
//         url: `${BaseUrl}/logged-in-user/addFilesToDirectory/${id}`,
//         data: {
//           files_ids: selectedFilesIds,
//           user_id,
//         },
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         setSubmitDisabled(false);
//         store.dispatch(setRootLoading(false));
//         handleHide();
//         Toast.show({
//           type: 'success',
//           text1: 'files added successfully',
//         });
//         return reload();
//       }
//     } catch (e: any) {
//       if (e.name === AXIOS_ERROR && !e.message.includes('code 500')) {
//         setSubmitDisabled(false);
//         store.dispatch(setRootLoading(false));
//         handleHide();
//         return Toast.show({
//           type: 'error',
//           text1: e.response?.data?.message,
//         });
//       }
//       Toast.show({
//         type: 'error',
//         text1: 'something went wrong cannot add files',
//       });
//     }
//     handleHide();
//     setSubmitDisabled(false);
//     store.dispatch(setRootLoading(false));
//   }, [user_id, selectedFilesIds, handleHide, reload, id]);

//   useEffect(() => {
//     if (isFocused) {
//       (async () => {
//         try {
//           if (!user_id) {
//             return Toast.show({
//               type: 'error',
//               text1: 'cannot get files to add, you are not logged in !',
//             });
//           }

//           store.dispatch(setRootLoading(true));

//           const response = await axios({
//             method: 'POST',
//             url: `${BaseUrl}/logged-in-user/getMyFiles`,
//             headers: {
//               Accept: 'application/json',
//               'Content-type': 'application/json',
//             },
//             data: {
//               user_id,
//             },
//           });

//           if (response.status === 200) {
//             const data = response.data.data;
//             setFiles(
//               data
//                 .filter((item: any) => item.id !== id)
//                 .map(({id, name, isDirectory}: any) => ({
//                   id,
//                   label: name,
//                   isDirectory,
//                 })),
//             );
//           }
//         } catch (e: any) {
//           if (e.name === AXIOS_ERROR && !e.message.includes('code 500')) {
//             return Toast.show({
//               type: 'error',
//               text1: e.response?.data?.message,
//             });
//           }
//           Toast.show({
//             type: 'error',
//             text1: 'something went wrong cannot get files to add',
//           });
//         } finally {
//           store.dispatch(setRootLoading(false));
//         }
//       })();
//     }
//   }, [user_id, isFocused]);

//   return (
//     <View>
//       <Text style={{marginBottom: 10, color: 'black', fontWeight: '500'}}>
//         Select files or folders you want to put inside :
//       </Text>
//       <MultipleSelectList
//         data={files}
//         label="search file/folder name"
//         onSelect={newSelectedFilesIds =>
//           setSelectedFilesIds(newSelectedFilesIds)
//         }
//       />
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'center',
//           height: 40,
//           marginTop: 10,
//         }}>
//         <LinearGradient
//           colors={['#33A1F9', '#6DBDFE']}
//           style={{borderRadius: 8}}>
//           <Pressable
//             style={{
//               display: 'flex',
//               justifyContent: 'center',
//               flexDirection: 'row',
//               alignItems: 'center',
//               padding: 10,
//             }}
//             onPress={addFilesHandler}
//             disabled={submitDisabled}>
//             <Text style={{color: 'white'}}>Add</Text>
//           </Pressable>
//         </LinearGradient>
//         <LinearGradient
//           colors={['#33A1F9', '#6DBDFE']}
//           style={{
//             borderRadius: 8,
//             marginLeft: 10,
//           }}>
//           <Pressable
//             style={{
//               display: 'flex',
//               justifyContent: 'center',
//               flexDirection: 'row',
//               alignItems: 'center',
//               padding: 10,
//             }}
//             onPress={handleHide}>
//             <Text style={{color: 'white'}}>Cancel</Text>
//           </Pressable>
//         </LinearGradient>
//       </View>
//     </View>
//   );
// };

const CreateFolder = ({
  id,
  reload,
  handleHide,
}: {
  handleHide: () => void;
  id: string;
  reload: () => void;
}) => {
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
          dir: id,
        },
      });

      if (response.status === 200) {
        handleHide();
        setCreateFolderDisabled(false);
        Toast.show({
          text1: response.data.message,
        });

        return reload();
      }
    } catch (e: any) {
      handleHide();
      setCreateFolderDisabled(false);
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
      handleHide();
      setCreateFolderDisabled(false);
    }
  }, [name, user_id]);

  const cancelHandler = useCallback(() => {
    handleHide();
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

const transformType = (type: string | null) => {
  if (type === null) {
    return type;
  }

  const validType = Object.keys(types).find(key => (types as any)[key](type));
  if (validType) {
    return validType;
  }

  return null;
};

interface ListProps {
  label: string | null;
  items: (FileProps | FolderProps)[];
}

const groupByType = (folderData: any) => {
  return folderData.items.reduce(
    (
      acc: {dirs: FolderProps[]; files: ListProps[]},
      item: FolderProps | FileProps,
    ) => {
      if (item.isDirectory) {
        acc.dirs.push(item);
        return acc;
      }

      const label = transformType(item.type);
      const exist = acc.files.find(e => e.label === label);

      if (exist) {
        exist.items.push(item);
      } else {
        acc.files.push({label, items: [item]});
      }

      return acc;
    },
    {dirs: [], files: []},
  );
};

const FolderPage = ({navigation, route}: any) => {
  const [folderData, setFolderData] = useState({
    id: '',
    name: '',
    type: '',
    items: [],
  });
  const [isAddingFolders, setIsAddingFolders] = useState(false);
  const [isUploadButtonDisabled, setIsUploadButtonDisabled] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [removeFilesAfterFinish, setRemoveFilesAfterFinish] = useState<
    string[]
  >([]);
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(false);
  const [pressHandler, setPressHandler] = useState<any>();
  const [isShowingFile, setIsShowingFile] = useState<{
    show: boolean;
    type?: string;
    uri?: string;
    title?: string;
    image?: boolean;
  }>({
    show: false,
    uri: undefined,
    title: undefined,
    type: undefined,
    image: true,
  });
  const user_id = store.getState().authentication.userId;
  const isFocused = useIsFocused();
  const {createOffer, recreateOffer} = useSocket();
  const [isFetching, setIsFetching] = useState(false);
  const [fetchProcess, setFetchProcess] = useState(0);
  const WIDTH = Dimensions.get('window').width;
  const progressSize = WIDTH*0.8;  

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter((e: any) => e !== id) : [...prev, id],
      );
    },
    [selectedIds],
  );

  const uncheckAll = useCallback(() => setSelectedIds([]), [selectedIds]);
  useEffect(() => {
    const backAction = (e) => {
      console.log('backAction')
      navigation.navigate("Files");
      return true
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);  
  useEffect(() => {
    const {id} = route?.params;
    console.log(user_id, id);
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
          if (data.items) {
            data.items = data.items.map((item: any) => ({
              ...item,
              progress: 1,
              hasTriedToUpload: true,
              isImage: item.category==='image',
            }));
          }

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
      setSelectedIds([]);
      setIsShowingFile({
        show: false,
        uri: undefined,
        title: undefined,
        type: undefined,
      });
      const historyStack = route.params?.historyStack || [folderData.id];
      historyStack[historyStack.length - 1] !== id && historyStack.push(id);

      navigation.navigate('Folder', {id, historyStack});
    },
    [route, navigation],
  );

  const goBack = useCallback(() => {
    setSelectedIds([]);
    setIsShowingFile({
      show: false,
      uri: undefined,
      title: undefined,
      type: undefined,
    });
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
    if (!(await ManageApps.checkAllFilesAccessPermission())) {
      Toast.show({
        type: 'error',
        text1: 'cannot upload, you need to enable all files access permission',
      });
    }
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

          if (fileDesc.size >= MAX_SIZE) {
            // 25mb
            setIsUploadButtonDisabled(false);
            store.dispatch(setRootLoading(false));
            return Toast.show({
              type: 'info',
              text1: 'cannot upload file(s)',
              text2: `file (${fileDesc.name}) has exceeded the max size (16mb)`,
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

        const response = await uploadFiles(body, user_id, newProgress => {});
        if (response.status === 200) {
          const files_ids = response.data.data.map(({id}: any) => id);
          if (
            !files_ids ||
            !Array.isArray(files_ids) ||
            files_ids.includes(null)
          ) {
            setIsUploadButtonDisabled(false);
            store.dispatch(setRootLoading(false));
            return Toast.show({
              type: 'error',
              text1: 'something went wrong, failed to upload file',
            });
          }
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
        return Toast.show({
          type: 'error',
          text1: e.response?.data?.message,
        });
      }

      Toast.show({
        type: 'error',
        text1: 'something went wrong cannot uplaod files',
      });
    }

    setIsUploadButtonDisabled(false);
    store.dispatch(setRootLoading(false));
  }, [user_id, folderData, showFolder]);

  const handleDelete = useCallback(async () => {
    store.dispatch(setRootLoading(true));
    setIsDeleteButtonDisabled(true);
    try {
      const response = await axios({
        method: 'POST',
        url: `${BaseUrl}/logged-in-user/deleteFiles`,
        data: {
          files_id: selectedIds,
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (response.status === 200) {
        setSelectedIds([]);
        store.dispatch(setRootLoading(false));
        setIsDeleteButtonDisabled(false);
        Toast.show({
          text1: 'files deleted successfully !',
        });

        return showFolder(folderData.id)();
      }
    } catch (e: any) {
      store.dispatch(setRootLoading(false));
      setIsDeleteButtonDisabled(false);
      console.log('error');
      Toast.show({
        type: 'error',
        text1: 'there was an error in delete files',
        text2: e.message,
      });
    }
    store.dispatch(setRootLoading(false));
    setIsDeleteButtonDisabled(false);
  }, [folderData, selectedIds, showFolder]);

  const {dirs, files} = groupByType(folderData);

  const addRemoveFileBeforeSave = useCallback((path: string) => {
    setRemoveFilesAfterFinish(prev => [...new Set([...prev, path])]);
  }, []);
  const handleAbort = () => {
    setIsFetching(false);
    isFileFetching = false;
  }
  const showFile = useCallback(
    async (id: string) => {
      const file = folderData.items.find(e => e.id === id);
      let arrayBuffer = ""
      let state = true;
      setFetchProcess(0);
      setIsFetching(true);
      isFileFetching = true;
      // store.dispatch(setRootLoading(true)); 
      const len = file["updates"].length;
      for (let i = 0; i < file["updates"].length; i++) {
        const filename = `${file["updates"][i]['fragmentID']}-${file["updates"][i]['uid']}-${file["updates"][i]['user_id']}.json`
        for (let j = 0; j < file["updates"][i]['devices'].length; j++) {
          const success = new Promise((resolve, reject) => {
            createOffer(file["updates"][i]['devices'][j]['device_id'], filename, file["updates"][i]['fragmentID'], function(res) {
              if (res === false) {
                resolve(false);
              } else {
                arrayBuffer += res;
                resolve(true);
              }
            })
          })
          state = await success;
          if (!isFileFetching) {
            Toast.show({
              type: 'error',
              text1: 'aborted fetch file.',
            });
            return true;
          }                    
          if (state) break;
        }
        if (!state) break;
        setFetchProcess((i+1)/len);
      }
      if (state) {
         const uri = "data:"+file.type+";base64,"+arrayBuffer;
         const type = file.category;

         // setIsShowingFile({show: true, uri: uri, title: file['updates'][0]['fileName'], type: file['category']});
        if (type === 'video' || type === 'audio' || type === 'document') {
          const formated = await formatUri(
            file.type,
            uri,
            Math.floor(Math.random() * 412515125).toString(),
          );

          if (formated) {
            const {changed, path} = formated;
            if (changed) {
              addRemoveFileBeforeSave(path);
            }
            setIsFetching(false);
            isFileFetching = false
            setIsShowingFile({
              show: true,
              uri: path,
              title: file['updates'][0]['fileName'],
              type: type as any,
              image: false
            });         
            return;   
          } else {
            return Toast.show({
              type: 'error',
              text1: `cannot play audio ${file['updates'][0]['fileName']}`,
            });
          }
        } else {
          setIsFetching(false);
          isFileFetching = false          
          setIsShowingFile({
            show: true,
            uri: uri,
            title: file['updates'][0]['fileName'],
            type: type as any,
            image: true,
          });     
          return;  
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'cannot fetch file.',
        });
      }
    },
    [folderData],
  );

  useEffect(() => {
    if (!isFocused) {
      if (removeFilesAfterFinish.length !== 0) {
        for (const file of removeFilesAfterFinish) {
          RNFS.unlink(file)
            .then(() => {
              console.log(`${file} is deleted`);
            })
            .catch(e => {});
        }
      }
    }
  }, [isFocused]);

  return (
    <LayoutWrapper
      title={folderData.name}
      onBackPress={goBack}
      headerMenuContent={
        <Text
          style={{color: 'black'}}
          onPress={e => {
            setIsAddingFolders(true);
          }}>
          Add folder
        </Text>
      }
      setPressHandlerRoot={setPressHandler}>
      {
        isFetching ? (   
          <View
            style={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Progress.Bar progress={fetchProcess} width={progressSize} />
            <Text style={{marginTop: 20, color: "#000000"}}>fetching file ... {fetchProcess?(fetchProcess*100).toFixed(2):0}%</Text>
            <TouchableOpacity
              style={{
                width: 82,
                height: 49,
                backgroundColor: '#33a1f9',
                color: '#FFFFFF',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20
              }}
              onPress={handleAbort}>
              <Text style={{color: '#FFFFFF', fontWeight: '500'}}>Abort</Text>
            </TouchableOpacity>              
          </View>
        ) : (              
          isShowingFile.show ? (
            <ShowFileWrapper
              title={isShowingFile.title}
              image={isShowingFile.image}
              uri={isShowingFile.uri}
              displayComponent={getDisplayComponent(
                isShowingFile.type,
                isShowingFile.uri,
              )}
              setIsShowingFile={setIsShowingFile}
            />
          ) : (
            <View style={{flex: 1}}>
              <ScrollView style={{flex: 1}}>
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: '4.67%',
                    paddingVertical: '2.45%',
                    backgroundColor: '#F6F7FB',
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 34,
                      marginBottom: 42,
                      minHeight: 24,
                    }}>
                    {selectedIds.length > 0 && (
                      <>
                        <AntDesign
                          name="close"
                          size={20}
                          color="#49ACFA"
                          onPress={uncheckAll}
                        />
                        <Text
                          style={{marginLeft: 17, color: 'black', fontFamily: 'Rubik-Regular', fontSize: 16}}>
                          {selectedIds.length} Selected
                        </Text>
                      </>
                    )}
                  </View>
                  {folderData.items.length !== 0 ? (
                    [
                      dirs.map((dir: FolderProps) => (
                        <Folder
                          {...dir}
                          key={dir.id}
                          showFolder={showFolder(dir.id)}
                          reload={showFolder(folderData.id)}
                        />
                      )),
                      ...files.map((group: {label: string; items: FileProps[]}) => (
                        <SelectableItems
                          data={group.items}
                          handleSelect={handleSelect}
                          selectedIds={selectedIds}
                          text={group.label + 's'}
                          setSelectedIds={setSelectedIds}
                          key={group.label}
                          setPressHandler={pressHandler}
                          showFile={showFile}
                        />
                      )),
                    ]
                  ) : (
                    <NoDataFound />
                  )}
                </View>
                {isAddingFolders && (
                  <Dialog isVisible={true}>
                    <CreateFolder
                      id={folderData.id}
                      reload={showFolder(folderData.id)}
                      handleHide={() => setIsAddingFolders(false)}
                    />
                  </Dialog>
                )}
              </ScrollView>
              <View style={styles.uploadContainer}>
                {selectedIds.length > 0 && (
                  <TouchableOpacity
                    style={{
                      width: 82,
                      height: 49,
                      marginRight: 10,
                      backgroundColor: 'white',
                      borderRadius: 15,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={handleDelete}
                    disabled={isDeleteButtonDisabled}>
                    <Text style={{color: '#49ACFA', fontWeight: '500'}}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                )}
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
          )
        )
      }
    </LayoutWrapper>
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
