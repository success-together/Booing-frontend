import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AXIOS_ERROR, BaseUrl, store} from '../../../../shared';
import LayoutWrapper from '../Uploads/LayoutWrapper/LayoutWrapper';
import Toast from 'react-native-toast-message';
import SelectableItems from '../Uploads/LayoutWrapper/SelectableItems';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setRootLoading} from '../../../../shared/slices/rootSlice';
import ShowFileWrapper from '../Uploads/LayoutWrapper/ShowFileWrapper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused} from '@react-navigation/native';
import Video from 'react-native-video';
import {formatUri} from '../Uploads/Videos/Videos';
import RNFS from 'react-native-fs';

export const getDisplayComponent = (type = 'other', uri?: string) => {
  switch (true) {
    case type === 'image':
      return (
        <Image
          source={{uri}}
          style={{
            flex: 1,
          }}
          resizeMode="contain"
        />
      );

    case type === 'video' || type === 'audio':
      return (
        <Video
          source={{uri}}
          style={{
            flex: 1,
          }}
          resizeMode="contain"
          controls
        />
      );
    case type === 'document':
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="document-outline" size={200} />
        </View>
      );
    default:
      return;
  }
};

function transformType(type?: string) {
  if (!type) {
    return 'other';
  }
  switch (true) {
    case type?.startsWith('video'):
      return 'video';

    case type?.startsWith('image'):
      return 'image';

    case type?.startsWith('audio'):
      return 'audio';

    case type === 'application/pdf' || type === 'pdf':
      return 'pdf';

    default:
      return 'other';
  }
}

function groupByCategory(data: any[]) {
  return data.reduce((acc, curr) => {
    const type = transformType(curr.type);
    const item = acc.find((e: any) => e.name === type);

    if (item) {
      item.data.push(curr);
      return acc;
    }

    acc.push({name: type, data: [curr]});
    return acc;
  }, []);
}

const RecycleBin = ({navigation}: any) => {
  const [data, setData] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pressHandler, setPressHandler] = useState<any>();
  const [isShowingFile, setIsShowingFile] = useState<{
    show: boolean;
    type?: string;
    uri?: string;
    title?: string;
  }>({
    show: false,
    uri: undefined,
    title: undefined,
    type: undefined,
  });
  const [
    HandleRemovePermanentlyBtnDisabled,
    setHandleRemovePermanentlyBtnDisabled,
  ] = useState(false);
  const [HandleRestoreBtnDisabled, setHandleRestoreBtnDisabled] =
    useState(false);

  const isFocused: boolean = useIsFocused();
  const user_id = store.getState().authentication.userId;
  const [removeFilesAfterFinish, setRemoveFilesAfterFinish] = useState<
    string[]
  >([]);

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter((e: any) => e !== id) : [...prev, id],
      );
    },
    [data, selectedIds],
  );

  const uncheckAll = useCallback(() => setSelectedIds([]), [data, selectedIds]);

  const fetchDeletedFiles = useCallback(async () => {
    try {
      store.dispatch(setRootLoading(true));
      const response = await axios({
        method: 'GET',
        url: `${BaseUrl}/logged-in-user/getDeletedFiles/${user_id}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        store.dispatch(setRootLoading(false));
        return setData(
          response.data.data.map((e: any) => ({
            ...e,
            type: e.type,
            progress: 1,
            hasTriedToUpload: true,
            isImage: e.category==='image',
          })),
        );
      }
    } catch (e: any) {
      store.dispatch(setRootLoading(false));
      return Toast.show({
        type: 'error',
        text1: 'there was an error with fetching deleted files',
        text2: e?.message,
      });
    }
    store.dispatch(setRootLoading(false));
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchDeletedFiles();
    }
  }, [isFocused]);

  const addRemoveFileBeforeSave = useCallback((path: string) => {
    setRemoveFilesAfterFinish(prev => [...new Set(...prev, path)]);
  }, []);

  const showFile = useCallback(
    async (id: string) => {
      console.log('please restore file.')
    },
    [data],
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

  const handleRemovePermanently = useCallback(async () => {
    setHandleRemovePermanentlyBtnDisabled(true);
    store.dispatch(setRootLoading(true));
    try {
      if (!user_id) {
        setHandleRemovePermanentlyBtnDisabled(false);
        store.dispatch(setRootLoading(false));
        return Toast.show({
          type: 'error',
          text1: 'cannot create folder, you are not logged in !',
        });
      }
      const response = await axios({
        method: 'POST',
        url: `${BaseUrl}/logged-in-user/deleteFilesPermanently`,
        data: {
          files_ids: selectedIds,
          user_id,
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (response.status === 200) {
        setHandleRemovePermanentlyBtnDisabled(false);
        store.dispatch(setRootLoading(false));
        setSelectedIds([]);
        fetchDeletedFiles();
        return Toast.show({
          type: 'success',
          text1: 'files deleted successfully',
        });
      }
    } catch (e: any) {
      if (e.name === AXIOS_ERROR && !e.message.includes('code 500')) {
        setHandleRemovePermanentlyBtnDisabled(false);
        store.dispatch(setRootLoading(false));
        return Toast.show({
          type: 'error',
          text1: e.response?.data?.message,
        });
      }
      Toast.show({
        type: 'error',
        text1: 'something went wrong cannot delete files',
      });
    }
    setHandleRemovePermanentlyBtnDisabled(false);
    store.dispatch(setRootLoading(false));
  }, [selectedIds, user_id]);

  const handleRestore = useCallback(async () => {
    setHandleRestoreBtnDisabled(true);
    store.dispatch(setRootLoading(true));
    try {
      if (!user_id) {
        setHandleRestoreBtnDisabled(false);
        store.dispatch(setRootLoading(false));
        return Toast.show({
          type: 'error',
          text1: 'cannot restore files, you are not logged in !',
        });
      }
      const response = await axios({
        method: 'POST',
        url: `${BaseUrl}/logged-in-user/restoreFiles`,
        data: {
          files_ids: selectedIds,
          user_id,
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (response.status === 200) {
        setHandleRestoreBtnDisabled(false);
        store.dispatch(setRootLoading(false));
        setSelectedIds([]);
        fetchDeletedFiles();
        return Toast.show({
          type: 'success',
          text1: 'files restored successfully',
        });
      }
    } catch (e: any) {
      if (e.name === AXIOS_ERROR && !e.message.includes('code 500')) {
        setHandleRestoreBtnDisabled(false);
        store.dispatch(setRootLoading(false));
        console.log(e.response?.data);
        return Toast.show({
          type: 'error',
          text1: e.response?.data?.message,
        });
      }
      Toast.show({
        type: 'error',
        text1: 'something went wrong cannot restore files',
      });
    }
    setHandleRestoreBtnDisabled(false);
    store.dispatch(setRootLoading(false));
  }, [user_id, selectedIds]);

  return (
    <LayoutWrapper
      onBackPress={() => navigation.navigate('Uploads')}>
        <View style={{paddingLeft: 10, paddingRight: 10, flex: 1}}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: "center",
              marginTop: 34,
              marginBottom: 42,
              minHeight: 24,
            }}>
            {selectedIds.length > 0 ? (
              <>
                <AntDesign
                  name="close"
                  size={20}
                  color="#49ACFA"
                  onPress={uncheckAll}
                />
                <Text style={{marginLeft: 17, color: 'black', fontFamily: 'Rubik-Regular', fontSize: 16}}>
                  {selectedIds.length} Selected
                </Text>
              </>
            ) : (
              <View style={{
                borderColor: '#FF0000',
                borderWidth: 3,
                borderStyle: 'solid',
                width: "90%",
                textAlign: 'center',
                padding: 10,
                marginTop: -20,
                marginBottom: -20
              }}>
                <Text style={{color: 'red', fontFamily: 'Rubik-Regular'}}>All files will be deleted permanantly after 24 hours.</Text>
              </View>
            )}
          </View>
          {groupByCategory(data).map(
            ({data: categoryData, name}: {data: any[]; name: string}) => (
              <SelectableItems
                data={categoryData}
                handleSelect={handleSelect}
                selectedIds={selectedIds}
                text={name + 's'}
                setSelectedIds={setSelectedIds}
                key={name}
                setPressHandler={pressHandler}
                showFile={showFile}
              />
            ),
          )}

          <View style={styles.uploadContainer}>
            {selectedIds.length > 0 && (
              <>
                <TouchableOpacity
                  style={{
                    height: 49,
                    paddingHorizontal: 20,
                    marginRight: 10,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  disabled={HandleRemovePermanentlyBtnDisabled}
                  onPress={handleRemovePermanently}>
                  <Text style={{color: '#49ACFA', fontWeight: '500', fontFamily: 'Rubik-Regular'}}>
                    Delete permanently
                  </Text>
                </TouchableOpacity>
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
                  disabled={HandleRestoreBtnDisabled}
                  onPress={handleRestore}>
                  <Text style={{color: '#49ACFA', fontWeight: '500', fontFamily: 'Rubik-Regular'}}>
                    Restore
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
    </LayoutWrapper>
  );
};

const styles = StyleSheet.create({
  uploadContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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

export default RecycleBin;
