import React, {useCallback, useEffect, useState} from 'react';
import {LayoutWrapper} from '../../../../exports';
import ManageApps from '../../../../../utils/manageApps';
import useGetUploadData from '../LayoutWrapper/getUploadedDataHook';
import ShowFileWrapper from '../LayoutWrapper/ShowFileWrapper';
import Video from 'react-native-video';
import SelectableUploadWrapper from '../LayoutWrapper/SelectableUploadWrapper';
import Toast from 'react-native-toast-message';

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
  }, []);

  const showFile = useCallback(
    (id: string) => {
      const file = data.find(e => e.id === id);
      if (file) {
        setIsShowingFile({show: true, uri: file.uri, title: file.name});
      }
    },
    [data],
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
