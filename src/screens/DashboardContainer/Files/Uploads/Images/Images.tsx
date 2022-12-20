import React, {useCallback, useEffect, useState} from 'react';
import {Image, StyleSheet} from 'react-native';
import useGetUploadData from '../LayoutWrapper/getUploadedDataHook';
import LayoutWrapper from '../LayoutWrapper/LayoutWrapper';
import ShowFileWrapper from '../LayoutWrapper/ShowFileWrapper';
import SelectableUploadWrapper from '../LayoutWrapper/SelectableUploadWrapper';
import ManageApps from '../../../../../utils/manageApps';

const Images = ({navigation}: {navigation: any}) => {
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
    useGetUploadData('image').then(fetchedData => {
      setData(fetchedData as any[]);
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
            <Image
              source={{uri: isShowingFile.uri}}
              style={{
                flex: 1,
              }}
              resizeMode="contain"
            />
          }
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
      )}
    </LayoutWrapper>
  );
};
const styles = StyleSheet.create({});

export default Images;
