/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {FilesHeader} from '../../exports';
import Feather from 'react-native-vector-icons/Feather';
import ImagePlusIcon from '../../../Components/ImagePlusIcon/ImagePlusIcon';
import SortListIcon from '../../../Components/SortListIcon/SortListIcon';
import ArrowDown from '../../../Components/ArrowDownIcon/ArrowDownIcon';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Svg, {Path, SvgProps} from 'react-native-svg';
import NoDataFound from '../../../Components/NoDataFound/NoDataFound';
import {Dialog} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {AXIOS_ERROR, BaseUrl, store} from '../../../shared';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import CheckBox from '../../../Components/CheckBox/CheckBox';
import Folder, {FolderProps} from './FolderPage/Folder';
import {setRootLoading} from '../../../shared/slices/rootSlice';
import {useIsFocused} from '@react-navigation/native';
import {getDirectories} from '../../../shared/slices/Directories/DirectoriesService';

export const FolderIcon = (props: SvgProps) => {
  return (
    <Svg width={32} height={29} fill="none" {...props}>
      <Path
        d="m.34 5.59.322 18a5 5 0 0 0 5 4.91h20.693a5 5 0 0 0 5-4.894l.286-13.5A5 5 0 0 0 26.643 5H19a2.25 2.25 0 0 1-2.25-2.25A2.25 2.25 0 0 0 14.5.5H5.34a5 5 0 0 0-5 5.09Z"
        fill="#C6D2E8"
      />
    </Svg>
  );
};

export const FileIcon = (props: SvgProps) => {
  return (
    <Svg width={36} height={36} fill="none" {...props}>
      <Path
        d="M21.646 3.417H9.25a2.917 2.917 0 0 0-2.917 2.916v23.334a2.917 2.917 0 0 0 2.917 2.916h17.5a2.917 2.917 0 0 0 2.917-2.916v-18.23l-8.021-8.02Z"
        stroke="#C6D2E8"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.917 3.417v8.75h8.75"
        stroke="#C6D2E8"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

interface MultipleSelectListProps {
  data: {id: string; label: string; isDirectory: boolean}[];
  label: string;
  onSelect?: (newSelectedFiles: string[]) => void;
}

const SelectItem = ({
  id,
  label,
  isDirectory,
  handleSelect,
  checked,
}: MultipleSelectListProps['data']['0'] & {
  handleSelect: () => void;
  checked: boolean;
}) => {
  return (
    <TouchableOpacity
      key={id}
      style={{
        padding: 5,
        backgroundColor: 'white',
        marginBottom: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={handleSelect}>
      <CheckBox checked={checked} handleCheck={handleSelect} />
      <View style={{marginLeft: 10}} />
      {isDirectory ? <FolderIcon /> : <FileIcon />}
      <Text style={{marginLeft: 10}}>{label}</Text>
    </TouchableOpacity>
  );
};

export const MultipleSelectList = ({
  label,
  data,
  onSelect,
}: MultipleSelectListProps) => {
  const [items, setItems] = useState(data);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setItems(data);
  }, [data]);

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedItems);
    }
  }, [selectedItems]);

  const filterItems = useCallback(
    (val: string) => {
      setSearchText(val);

      if (val === '') {
        return setItems(data);
      }

      setItems(prev =>
        prev.filter(item =>
          item.label.toLocaleLowerCase().includes(val.toLocaleLowerCase()),
        ),
      );
    },
    [setSearchText],
  );

  const handleSelect = useCallback(
    (id: string) => () =>
      setSelectedItems(prev =>
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
      ),
    [],
  );

  return (
    <View>
      <TextInput
        placeholder={label}
        value={searchText}
        onChangeText={filterItems}
        style={{
          backgroundColor: '#F8F8F8',
          borderRadius: 8,
          marginBottom: '5.18%',
          marginTop: 4,
        }}
        placeholderTextColor="#716D6D"
      />

      <ScrollView
        style={{
          minHeight: 100,
          backgroundColor: '#F8F8F8',
          borderRadius: 15,
          padding: 5,
          maxHeight: 200,
        }}
        showsVerticalScrollIndicator={false}>
        {items.map(item => (
          <SelectItem
            handleSelect={handleSelect(item.id)}
            checked={selectedItems.includes(item.id)}
            {...item}
            key={item.id}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const CreateFolder = ({closeModel}: {closeModel: (bool?: boolean) => void}) => {
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
        },
      });

      if (response.status === 200) {
        closeModel(true);
        setCreateFolderDisabled(false);
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

const Files = ({navigation}: {navigation: any}) => {
  const [folders, setFolders] = useState([]);
  const [isCreatedFolderShown, setIsCreateFolderShown] = useState(false);
  const user_id = store.getState().authentication.userId;
  const directoires = store.getState().directories.data;

  const isFocused = useIsFocused();

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
      // const response = await axios({
      //   method: 'POST',
      //   url: `${BaseUrl}/logged-in-user/directories`,
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-type': 'application/json',
      //   },
      //   data: {
      //     user_id,
      //   },
      // });

      // if (response.status === 200) {
      //   const data = response.data.data;
      //   setFolders(data);
      // }
      await getDirectories({user_id}).then(res => {
        // console.log(res);
        if (res.success) {
          setFolders(res.data);
        }
      });
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

  useEffect(() => {
    if (isFocused) {
      console.log(directoires);
      if (directoires.length !== 0) setFolders(directoires);
      fetchFolders();
    }
  }, [user_id, isFocused]);

  const showCreateFolder = useCallback(() => {
    setIsCreateFolderShown(true);
  }, []);

  const hideCreateFolder = useCallback(async (refech = false) => {
    setIsCreateFolderShown(false);
    if (refech) {
      await fetchFolders();
    }
  }, []);

  const navigateToFolder = useCallback(
    (id: string) => () => {
      navigation.navigate({
        name: 'Folder',
        params: {
          id,
          historyStack: [id],
        },
      });
    },
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <FilesHeader onBackPress={() => navigation.navigate('Home')} />
      </View>
      <View style={styles.body}>
        <View style={styles.recentFilesContainer}>
 {/*         <Pressable
            style={styles.button}
            onPress={() => {
              navigation.navigate('Uploads');
            }}>
            <Feather
              name="folder-plus"
              size={24}
              color="#C6D2E8"
              style={{marginRight: 10}}
            />
            <Text style={styles.buttonText}>Upload</Text>
          </Pressable>*/}
          <Pressable style={styles.button} onPress={showCreateFolder}>
            <ImagePlusIcon style={{marginRight: 10}} />
            <Text style={styles.buttonText}>Folder</Text>
          </Pressable>
          {isCreatedFolderShown && (
            <Dialog isVisible={true}>
              <CreateFolder closeModel={hideCreateFolder} />
            </Dialog>
          )}
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {folders?.length === 0 ? (
            <NoDataFound />
          ) : (
            folders?.map((folderProps: FolderProps) => (
              <Folder
                {...folderProps}
                showFolder={navigateToFolder(folderProps.id)}
                key={folderProps.id}
                reload={() => fetchFolders()}
              />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: '4.67%',
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 0,
  },
  secondScreenContainer: {
    flexDirection: 'row',
  },
  storageInfoContainer: {
    justifyContent: 'space-evenly',
    marginLeft: 20,
  },
  title: {
    fontFamily: 'Rubik-Bold', fontSize: 16,
    letterSpacing: 0.25,
    color: 'black',
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    // alignItems: "center",
    color: '#33a1f9',
    justifyContent: 'center',
    height: '100%',
    // flexWrap: "wrap",
    // flexDirecton: "row",
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
    color: '#9F9EB3',
    fontFamily: 'Rubik-Regular', fontSize: 16,
    fontWeight: '500',
  },
  createAccount: {
    fontFamily: 'Rubik-Bold', fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'black',
  },
  containerFolder: {
    flexDirection: 'row',
  },
  recentFilesContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginBottom: 20
  },

  row3: {},

  // row4: {
  //   flexDirection: "row",
  //   justifyContent: "flex-start",
  //   marginTop: 30,
  // },

  list: {
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 25,
    borderRadius: 10,
    // width: '90%',
    height: 80,
    flexDirection: 'row',
  },
  item: {
    padding: 10,
    fontFamily: 'Rubik-Regular', fontSize: 18,
    height: 44,
  },
});
export default Files;
