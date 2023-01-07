import React, {useCallback, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
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

const FolderPage = ({navigation, route}: any) => {
  const [folderData, setFolderData] = useState({id: '', name: '', items: []});
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
          </View>
        </LinearGradient>
      </View>
      <View
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
});

export default FolderPage;
