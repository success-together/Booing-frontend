import React, {useCallback, useEffect, useState} from 'react';
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

const Audio = () => {
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
    useGetUploadData('audio').then(fetchedData => {
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
    });

    return () => {
      if (removeFilesAfterFinish.length !== 0) {
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

  const showFile = useCallback(
    async (id: string) => {
      const file = data.find(e => e.id === id);
      if (file) {
        const formated = await formatUri('audio', file.uri, file.name);
        if (!formated) {
          return Toast.show({
            type: 'error',
            text1: `cannot play audio ${file.name}`,
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
    <LayoutWrapper>
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
      )}
    </LayoutWrapper>
  );
};

export default Audio;
