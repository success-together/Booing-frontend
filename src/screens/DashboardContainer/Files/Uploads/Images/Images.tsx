import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, View, Text, TouchableOpacity, BackHandler} from 'react-native';
import useGetUploadData from '../LayoutWrapper/getUploadedDataHook';
import LayoutWrapper from '../LayoutWrapper/LayoutWrapper';
import ShowFileWrapper from '../LayoutWrapper/ShowFileWrapper';
import SelectableUploadWrapper from '../LayoutWrapper/SelectableUploadWrapper';
import ManageApps from '../../../../../utils/manageApps';
import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/native';
import useSocket from '../../../../../shared/socket';
import {store} from '../../../../../shared';
import {successDownload} from '../../../../../shared/slices/Fragmentation/FragmentationService';
import {setRootLoading} from '../../../../../shared/slices/rootSlice';
import * as Progress from 'react-native-progress';

let isFileFetching = false;
const Images = ({navigation}: {navigation: any}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [fetchProcess, setFetchProcess] = useState(0);
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
    image: false,
  });
  const isFocused = useIsFocused();
  // console.log('data ',data)
  const {createOffer, sendTrafficData} = useSocket();
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
      useGetUploadData('image')
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
  }, [isFocused]);
  const handleAbort = () => {
    setIsFetching(false);
    isFileFetching = false;

  }
  const showFile = async (id: string) => {
      const file = data.find(e => e.id === id);
      let arrayBuffer = ""
      let state = true;
      setFetchProcess(0);
      setIsFetching(true);
      isFileFetching  = true;
      // store.dispatch(setRootLoading(true)); 
      let traffic = {};
      const len = file["updates"].length;
      for (let i = 0; i < file["updates"].length; i++) {
        const filename = `${file["updates"][i]['fragmentID']}-${file["updates"][i]['uid']}-${file["updates"][i]['user_id']}.json`
        for (let j = 0; j < file["updates"][i]['devices'].length; j++) {
          const success = new Promise((resolve, reject) => {
            const device_id = file["updates"][i]['devices'][j]['device_id'];
            createOffer(device_id, filename, file["updates"][i]['fragmentID'], function(res) {
              if (res === false) {
                resolve(false);
              } else {
                arrayBuffer += res;
                if (traffic[device_id]) traffic[device_id] += file["updates"][i]['size'];
                else traffic[device_id] = file["updates"][i]['size']
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

      //
        // sendTrafficData(traffic);
        // traffic = {};
      //
      setIsFetching(false);
      isFileFetching = false;
      if (state) {
        successDownload(file.id);
        const uri = "data:"+file.type+";base64,"+arrayBuffer;
        setIsShowingFile({show: true, uri: uri, title: file['updates'][0]['fileName'], image: true});
      } else {
        Toast.show({
          type: 'error',
          text1: 'cannot fetch file.',
        });
      }
    }

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
            <Text style={{marginTop: 20, color: '#000000'}}>fetching file ... {fetchProcess?(fetchProcess*100).toFixed(2):0}%</Text>
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
                <Image
                  source={{uri: isShowingFile.uri}}
                  style={{
                    flex: 1,
                  }}
                  resizeMode="contain"
                />
              }
              uri={isShowingFile.uri}
              setIsShowingFile={setIsShowingFile}
            />
          ) : (
            <SelectableUploadWrapper
              showFile={showFile}
              data={data}
              pickItemsFn={() => ManageApps.pickImages()}
              setData={setData}
              isImageWrapper={true}
            />
          )

        ) 
      }
    </LayoutWrapper>
  );
};
const styles = StyleSheet.create({});

export default Images;
