import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import ManageApps from '../../../../../utils/manageApps';
import {LayoutWrapper} from '../../../../exports';
import ShowFileWrapper from '../LayoutWrapper/ShowFileWrapper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectableUploadWrapper from '../LayoutWrapper/SelectableUploadWrapper';
import {BaseUrl, store} from '../../../../../shared';
import Video from 'react-native-video';

const DATA = Array.from({length: 2}, (_, index) => ({
  id: `${index}`,
  dateUploaded: new Date(),
  name: `FakeData${index}`,
  progress: 0,
  uri: '',
}));

const Videos = () => {
  const [data, setData] = useState(DATA);
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
    const id = setTimeout(() => {
      setData((prev: any) => {
        const newData = [...prev];
        newData.forEach(e => {
          if (e.progress === 0) {
            e.progress = 1;
          }
        });

        return newData;
      });
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, [data]);

  const showFile = useCallback(
    (id: string) => {
      console.log({idtoShow: id, data});
      const file = data.find(e => e.id === id);
      console.log({file});
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
