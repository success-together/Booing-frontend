import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, View, Text, TouchableOpacity, BackHandler} from 'react-native';
import {LayoutWrapper} from '../../../../exports';
import ManageApps from '../../../../../utils/manageApps';
import useGetUploadData from '../LayoutWrapper/getUploadedDataHook';
import ShowFileWrapper from '../LayoutWrapper/ShowFileWrapper';
import Video from 'react-native-video';
import SelectableUploadWrapper from '../LayoutWrapper/SelectableUploadWrapper';
import Toast from 'react-native-toast-message';
import {formatUri} from '../Videos/Videos';
import {useIsFocused} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import useSocket from '../../../../../shared/socket';
import {store} from '../../../../../shared';
import {setRootLoading} from '../../../../../shared/slices/rootSlice';
import {successDownload} from '../../../../../shared/slices/Fragmentation/FragmentationService';
import * as Progress from 'react-native-progress';
let isFileFetching = false;
const Audio = ({navigation}: any) => {
  const [data, setData] = useState<any[]>([]);
  const [isShowingFile, setIsShowingFile] = useState<{
    show: boolean;
    uri?: string;
    title?: string;
    image?: boolean;
  }>({
    show: false,
    uri: undefined,
    title: undefined,
    image: false
  });
  const [removeFilesAfterFinish, setRemoveFilesAfterFinish] = useState<
    string[]
  >([]);
  const isFocused = useIsFocused();
  const {createOffer, recreateOffer} = useSocket();
  const [isFetching, setIsFetching] = useState(false);
  const [fetchProcess, setFetchProcess] = useState(0);
  const WIDTH = Dimensions.get('window').width;
  const progressSize = WIDTH*0.8;  
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
    if (isFocused) {
      useGetUploadData('audio')
        .then(fetchedData => {
          setData(fetchedData as any[]);
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
    }

    return () => {
      if (removeFilesAfterFinish.length !== 0 && !isFocused) {
        for (const file of removeFilesAfterFinish) {
          try {
            RNFS.unlink(file).then(() => {
              console.log(`${file} is deleted`);
            });
          } catch (e) {}
        }
      }
    };
  }, [isFocused]);
  const handleAbort = () => {
    setIsFetching(false);
    isFileFetching = false;
  }
  const showFile = useCallback(
    async (id: string) => {
      const file = data.find(e => e.id === id);
      let arrayBuffer = ""
      let state = false;
      setFetchProcess(0);
      setIsFetching(true); 
      isFileFetching = true;
      const len = file['updates'].length;
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
        setIsFetching(false);
        isFileFetching = false;
        const uri = "data:"+file.type+";base64,"+arrayBuffer;
        const formated = await formatUri('audio', uri, file['updates'][0]['fileName']);
        if (!formated) {
          return Toast.show({
            type: 'error',
            text1: `cannot play audio ${file['updates'][0]['fileName']}`,
          });
        } else {
          const {changed, path} = formated;
          if (changed) {
            setRemoveFilesAfterFinish(prev => [...new Set([...prev, path])]);
          }
          successDownload(file.id);
          setIsShowingFile({
            show: true,
            uri: path,
            title: file['updates'][0]['fileName'],
          });
          return ;
        }

      } else {
        Toast.show({
          type: 'error',
          text1: 'cannot fetch file.',
        });
      }
    },

    [data, setRemoveFilesAfterFinish, setIsShowingFile],
  );

  return (
    <LayoutWrapper onBackPress={() => navigation.navigate('Uploads')}>
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
            <Text style={{marginTop: 20,}}>fetching file ... {fetchProcess?(fetchProcess*100).toFixed(2):0}%</Text>
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
              displayComponent={
                <Video
                  source={{uri: isShowingFile.uri}}
                  style={{
                    flex: 1,
                  }}
                  resizeMode="contain"
                  controls
                />
              }
              uri={isShowingFile.uri}
              setIsShowingFile={setIsShowingFile}
            />
          ) : (
            <SelectableUploadWrapper
              showFile={showFile}
              data={data}
              pickItemsFn={() => ManageApps.pickAudios()}
              setData={setData}
              isImageWrapper={false}
            />
          )
        )
      }
    </LayoutWrapper>
  );
};

export default Audio;
