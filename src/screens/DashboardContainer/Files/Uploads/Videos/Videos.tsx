import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import ManageApps from '../../../../../utils/manageApps';
import {LayoutWrapper} from '../../../../exports';
import ShowFileWrapper from '../LayoutWrapper/ShowFileWrapper';
import SelectableUploadWrapper from '../LayoutWrapper/SelectableUploadWrapper';
import Video from 'react-native-video';
import useGetUploadData from '../LayoutWrapper/getUploadedDataHook';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import {useIsFocused} from '@react-navigation/native';

export const formatUri = async (
  type: string,
  file: string,
  fileName: string,
): Promise<{changed: boolean; path: string} | null> => {
  if (file.startsWith(`data:${type}`)) {
    try {
      const mimeType = file.slice(file.indexOf(`${type}/`), file.indexOf(';'));
      const extension = await ManageApps.getExtensionFromMimeType(mimeType);
      const path = `file://${RNFS.DocumentDirectoryPath}/${fileName}.${extension}`;
      await RNFS.writeFile(
        path,
        file.slice(file.indexOf('base64,') + 7),
        'base64',
      );
      return {changed: true, path};
    } catch (e) {
      return null;
    }
  }

  return {changed: false, path: file};
};

const Videos = ({navigation}: any) => {
  const [data, setData] = useState<any[]>([]);
  const [isShowingFile, setIsShowingFile] = useState<{
    show: boolean;
    uri?: string;
    title?: string;
  }>({
    show: false,
    uri: undefined,
    title: undefined,
  });
  const [removeFilesAfterFinish, setRemoveFilesAfterFinish] = useState<
    string[]
  >([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      useGetUploadData('video')
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
          RNFS.unlink(file)
            .then(() => {
              console.log(`${file} is deleted`);
            })
            .catch(e => {});
        }
      }
    };
  }, [isFocused]);

  const showFile = useCallback(
    async (id: string) => {
      const file = data.find(e => e.id === id);
      if (file) {
        const formated = await formatUri('video', file.uri, file.name);
        if (!formated) {
          return Toast.show({
            type: 'error',
            text1: `cannot play video ${file.name}`,
          });
        }

        const {changed, path} = formated;
        if (changed) {
          setRemoveFilesAfterFinish(prev => [...new Set([...prev, path])]);
        }
        setIsShowingFile({
          show: true,
          uri: path,
          title: file.name,
        });
      }
    },
    [data, setRemoveFilesAfterFinish, setIsShowingFile],
  );

  return (
    <LayoutWrapper onBackPress={() => navigation.navigate('Uploads')}>
      {isShowingFile.show ? (
        <ShowFileWrapper
          title={isShowingFile.title}
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
          pickItemsFn={() => ManageApps.pickVideos()}
          setData={setData}
          isImageWrapper={false}
        />
      )}
    </LayoutWrapper>
  );
};
const styles = StyleSheet.create({});

export default Videos;
