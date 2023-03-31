import React, {ReactNode, useCallback, useEffect, useState} from 'react';
import {Pressable, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Tab, TabView} from 'react-native-elements';
import {Dialog} from 'react-native-elements/dist/dialog/Dialog';
import {FolderIcon, MultipleSelectList} from '../Files';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {AXIOS_ERROR, BaseUrl, store} from '../../../../shared';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {setRootLoading} from '../../../../shared/slices/rootSlice';
import axios from 'axios';

export interface FolderProps {
  id: string;
  name: string;
  createdAt: Date;
  items: number;
  type: string | null;
  isDirectory: true;
}

const formatDate = (date: Date): string => {
  const d = new Date(date);
  const [monthDay, hourMin] = d
    .toLocaleDateString('en-EG', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      formatMatcher: 'basic',
      hour12: false,
    })
    .split(', ');

  return `${monthDay.split(' ').reverse().join('-')} ${hourMin}`;
};
const Rename = ({id, handleHide, reload}: any) => {
  const [newName, setNewName] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const user_id = store.getState().authentication.userId;

  const renameHandler = useCallback(async () => {
    setSubmitDisabled(true);
    store.dispatch(setRootLoading(true));
    try {
      if (!user_id) {
        setSubmitDisabled(false);
        store.dispatch(setRootLoading(false));
        handleHide();
        return Toast.show({
          type: 'error',
          text1: 'cannot rename folder, you are not logged in !',
        });
      }
      const response = await axios({
        method: 'POST',
        url: `${BaseUrl}/logged-in-user/renameDirectory/${id}`,
        data: {
          newName,
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
          text1: 'file renamed successfully',
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
        text1: 'something went wrong cannot rename folder',
      });
    }
    handleHide();
    setSubmitDisabled(false);
    store.dispatch(setRootLoading(false));
  }, [user_id, newName, handleHide, reload, id]);

  return (
    <View>
      <Text style={{color: 'black', fontWeight: '500'}}>
        Enter new folder name :
      </Text>
      <TextInput
        placeholder="name"
        onChangeText={e => setNewName(e)}
        value={newName}
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
          justifyContent: 'center',
          height: 40,
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
            onPress={renameHandler}
            disabled={submitDisabled}>
            <Text style={{color: 'white'}}>Rename</Text>
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

const Delete = ({handleHide, id, reload}: any) => {
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const user_id = store.getState().authentication.userId;

  const deleteHandler = useCallback(async () => {
    setSubmitDisabled(true);
    store.dispatch(setRootLoading(true));
    try {
      if (!user_id) {
        setSubmitDisabled(false);
        store.dispatch(setRootLoading(false));
        handleHide();
        return Toast.show({
          type: 'error',
          text1: 'cannot delete folder, you are not logged in !',
        });
      }
      const response = await axios({
        method: 'POST',
        url: `${BaseUrl}/logged-in-user/deleteDirectory/${id}`,
        data: {
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
          text1: 'folder deleted successfully',
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
        text1: 'something went wrong cannot delete folder',
      });
    }
    handleHide();
    setSubmitDisabled(false);
    store.dispatch(setRootLoading(false));
  }, [user_id, handleHide, reload, id]);

  return (
    <View>
      <Text style={{color: 'black', fontWeight: '500'}}>Delete folder :</Text>
      <Text>Note : folder will be deleted with its sub files/folders</Text>
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
            disabled={submitDisabled}
            onPress={deleteHandler}>
            <Text style={{color: 'white'}}>Delete</Text>
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

const Copy = ({handleHide, id, reload}: any) => {
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const user_id = store.getState().authentication.userId;

  const copyHandler = useCallback(async () => {
    setSubmitDisabled(true);
    store.dispatch(setRootLoading(true));
    try {
      if (!user_id) {
        setSubmitDisabled(false);
        store.dispatch(setRootLoading(false));
        handleHide();
        return Toast.show({
          type: 'error',
          text1: 'cannot copy folder, you are not logged in !',
        });
      }
      const response = await axios({
        method: 'POST',
        url: `${BaseUrl}/logged-in-user/copyDirectory/${id}`,
        data: {
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
          text1: 'folder copied successfully',
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
        text1: 'something went wrong cannot copy folder',
      });
    }
    handleHide();
    setSubmitDisabled(false);
    store.dispatch(setRootLoading(false));
  }, [user_id, handleHide, reload, id]);
  return (
    <View>
      <Text style={{color: 'black', fontWeight: '500'}}>Copy folder :</Text>
      <Text>
        Note : folder will be copied with its sub files/folders and renamed as
        (previous folder name + copy number)
      </Text>
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
            disabled={submitDisabled}
            onPress={copyHandler}>
            <Text style={{color: 'white'}}>Copy</Text>
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

const contents = [
  {
    title: 'Rename',
    icon: <Feather name="edit" size={20} color="white" />,
    Content: Rename,
  },
  {
    title: 'Delete',
    icon: <AntDesign name="delete" size={20} color="white" />,
    Content: Delete,
  },
  {
    title: 'Copy',
    icon: <Feather name="copy" size={20} color="white" />,
    Content: Copy,
  },
];

const Folder = ({
  showFolder,
  createdAt,
  items,
  name,
  id,
  reload,
}: FolderProps & {showFolder: () => void; reload: () => void}) => {
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [index, setIndex] = useState(0);
  const Component = contents[index].Content;

  const handleShow = useCallback(() => {
    setShowEditOptions(true);
  }, []);

  const handleHide = useCallback(() => {
    setShowEditOptions(false);
  }, []);

  return (
    <TouchableOpacity
      onPress={showFolder}
      style={{
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}
      onLongPress={handleShow}>
      <View style={{flexDirection: 'row', alignItems: 'center', flexShrink: 1}}>
        <View style={{marginRight: 35}}>
          <FolderIcon />
        </View>
        <View style={{flexShrink: 1}}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Rubik-Regular', fontSize: 16,
              fontWeight: '500',
            }}>
            {name}
          </Text>
          <Text style={{color: '#C6D2E8', fontFamily: 'Rubik-Regular', fontSize: 12, fontWeight: '500'}}>
            {formatDate(createdAt)}
          </Text>
        </View>
      </View>
      <View style={{marginLeft: 10}}>
        <Text
          style={{
            color: '#C6D2E8',
            fontFamily: 'Rubik-Regular', fontSize: 12,
            fontWeight: '500',
          }}>
          {items} Items
        </Text>
      </View>
      {showEditOptions && (
        <Dialog isVisible={true}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#33A1F9',
              borderRadius: 10,
              marginBottom: 10,
              padding: 5,
            }}>
            {contents.map((item, i) => (
              <Pressable
                key={i}
                onPress={() => setIndex(i)}
                style={{
                  padding: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                {item.icon}
                <Text
                  style={{
                    color: 'white',
                    flexShrink: 1,
                    textAlign: 'center',
                    fontFamily: 'Rubik-Regular', fontSize: 10,
                  }}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </View>
          <View
            style={{padding: 10, borderRadius: 10, backgroundColor: '#E7E0E0'}}>
            {<Component handleHide={handleHide} id={id} reload={reload} />}
          </View>
        </Dialog>
      )}
    </TouchableOpacity>
  );
};

export default Folder;
