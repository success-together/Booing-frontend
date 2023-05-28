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
import axios from 'axios';
import {AXIOS_ERROR, BaseUrl, MAX_SIZE, store, types} from '../../../../shared';
import Toast from 'react-native-toast-message';
import Folder, {FolderProps} from './Folder';
import {FileProps} from './File';
import ImagePlusIcon from '../../../../Components/ImagePlusIcon/ImagePlusIcon';
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
import useGetSearchData from '../Uploads/LayoutWrapper/getSearchDataHook';

let isFileFetching = false;

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

const groupByType = (searchData: any) => {

  return searchData.reduce(
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

const SearchPage = ({navigation, route}: any) => {
  const [searchData, setSearchData] = useState([]);
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
      setSelectedIds([]);
      setIsShowingFile({
        show: false,
        uri: undefined,
        title: undefined,
        type: undefined,
      });      
      if (route.params?.returnStack) {
        navigation.navigate(route.params?.returnStack);
      } else {
        navigation.navigate("Files");
      }
      return true
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);  
  useEffect(() => {
    console.log(route);
    const {returnStack, search} = route.params;
    console.log(user_id);
    // setSearchData(prev => ({...prev, id}));
    (async () => {
      useGetSearchData({search, user_id})
        .then(fetchedData => {
          console.log(fetchedData)
          setSearchData(fetchedData as any[]);
          if (fetchedData.length === 0) {
            return Toast.show({
              type: 'info',
              text1: 'no data found',
            });
          } else {
            return Toast.show({
              text1: 'data fetched successfully',
            });
          }
        })
        .catch(e => {
          console.log({error: e});
          Toast.show({
            type: 'error',
            text1: 'cannot fetch files',
          });
        });      
      // if (!user_id || !id) {
      //   return Toast.show({
      //     type: 'error',
      //     text1:
      //       'cannot fetch folder, you are not logged in or folder id is invalid !',
      //   });
      // }
      // try {
      //   store.dispatch(setRootLoading(true));
      //   const response = await axios({
      //     method: 'POST',
      //     url: `${BaseUrl}/logged-in-user/directories/${id}`,
      //     headers: {
      //       Accept: 'application/json',
      //       'Content-type': 'application/json',
      //     },
      //     data: {
      //       user_id,
      //     },
      //   });

      //   if (response.status === 200) {
      //     const data = response.data.data;
      //     if (data.items) {
      //       data.items = data.items.map((item: any) => ({
      //         ...item,
      //         progress: 1,
      //         hasTriedToUpload: true,
      //         isImage: item.category==='image',
      //       }));
      //     }

      //     setSearchData(data);
      //   }
      // } catch (e: any) {
      //   if (e.name === AXIOS_ERROR && !e.message.includes('code 500')) {
      //     return Toast.show({
      //       type: 'error',
      //       text1: e.response?.data?.message,
      //     });
      //   }
      //   console.log(e);
      //   Toast.show({
      //     type: 'error',
      //     text1: 'something went wrong cannot get folder',
      //   });
      // } finally {
      //   store.dispatch(setRootLoading(false));
      // }
    })();
  }, [user_id, route]);

  const goBack = useCallback(() => {
    setSelectedIds([]);
    setIsShowingFile({
      show: false,
      uri: undefined,
      title: undefined,
      type: undefined,
    });
    const returnStack = route.params?.returnStack;
    if (returnStack) {
      navigation.navigate(returnStack);
    } else {
      navigation.navigate('Files');
    }
  }, [route, searchData, navigation]);

  const showSearchData = useCallback(
    () => {
      setSelectedIds([]);
      setIsShowingFile({
        show: false,
        uri: undefined,
        title: undefined,
        type: undefined,
      });
      const returnStack = route.params?.returnStack;
      navigation.navigate("Search", {
        search: route.params?.search,
        returnStack: route.params?.returnStack
      });
    },
    [route, navigation],
  );

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

        return showSearchData();
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
  }, [searchData, selectedIds, showSearchData]);

  const {files} = groupByType(searchData);
  // console.log(groupByType(searchData))
  const addRemoveFileBeforeSave = useCallback((path: string) => {
    setRemoveFilesAfterFinish(prev => [...new Set([...prev, path])]);
  }, []);
  const handleAbort = () => {
    setIsFetching(false);
    isFileFetching = false;
  }
  const showFile = useCallback(
    async (id: string) => {
      const file = searchData.find(e => e.id === id);
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
    [searchData],
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
      navigation={navigation}
      title={"Search: " + route.params?.search}
      search={route.params?.search}
      onBackPress={goBack}
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
                  {searchData.length !== 0 ? (
                    [
                      files.map((group: {label: string; items: FileProps[]})  => (
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
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginRight: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#9F9EB3',
    fontFamily: 'Rubik-Regular', fontSize: 16,
    fontWeight: '500',
  },  
});

export default SearchPage;
