import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import ManageApps from '../../../../../utils/manageApps';
import {LayoutWrapper} from '../../../../exports';
import ShowFileWrapper from '../LayoutWrapper/ShowFileWrapper';
import SelectableUploadWrapper from '../LayoutWrapper/SelectableUploadWrapper';
import Video from 'react-native-video';

const Videos = () => {
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
          pickItemsFn={() => ManageApps.pickVideos()}
          setData={setData}
        />
      )}
    </LayoutWrapper>
  );
};
const styles = StyleSheet.create({});

export default Videos;
