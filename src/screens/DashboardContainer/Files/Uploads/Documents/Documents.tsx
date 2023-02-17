import {Text, View} from 'react-native';
import {LayoutWrapper} from '../../../../exports';
import ManageApps from '../../../../../utils/manageApps';
import {useCallback, useEffect, useState} from 'react';
import useGetUploadData from '../LayoutWrapper/getUploadedDataHook';
import ShowFileWrapper from '../LayoutWrapper/ShowFileWrapper';
import SelectableUploadWrapper from '../LayoutWrapper/SelectableUploadWrapper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/native';

const Documents = ({navigation}: any) => {
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
    if (isFocused) {
      useGetUploadData('document')
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
    <LayoutWrapper onBackPress={() => navigation.navigate('Uploads')}>
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
              <Ionicons name="document-outline" size={200} />
            </View>
          }
          uri={isShowingFile.uri}
          setIsShowingFile={setIsShowingFile}
        />
      ) : (
        <SelectableUploadWrapper
          showFile={showFile}
          data={data}
          pickItemsFn={() => ManageApps.pickDocument()}
          setData={setData}
          isImageWrapper={false}
        />
      )}
    </LayoutWrapper>
  );
};

export default Documents;
