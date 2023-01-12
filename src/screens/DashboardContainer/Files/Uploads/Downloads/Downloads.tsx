import {View, Text} from 'react-native';
import {LayoutWrapper} from '../../../../exports';
import ManageApps from '../../../../../utils/manageApps';
import SelectableUploadWrapper from '../LayoutWrapper/SelectableUploadWrapper';
import ShowFileWrapper from '../LayoutWrapper/ShowFileWrapper';
import {useCallback, useEffect, useState} from 'react';
import useGetUploadData from '../LayoutWrapper/getUploadedDataHook';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/native';

const Downloads = ({navigation}: any) => {
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
  const isFocused = useIsFocused();

  useEffect(() => {
    useGetUploadData('download').then(fetchedData => {
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
  }, [isFocused]);

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
    <LayoutWrapper onBackPress={() => navigation.navigate('Uplaods')}>
      {isShowingFile.show ? (
        <ShowFileWrapper
          title={isShowingFile.title}
          displayComponent={
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialIcons name="file-download" size={200} />
            </View>
          }
          setIsShowingFile={setIsShowingFile}
        />
      ) : (
        <SelectableUploadWrapper
          showFile={showFile}
          data={data}
          pickItemsFn={() => ManageApps.pickDownloads()}
          setData={setData}
          isImageWrapper={false}
        />
      )}
    </LayoutWrapper>
  );
};

export default Downloads;
