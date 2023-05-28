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
    image?: boolean;
  }>({
    show: false,
    uri: undefined,
    title: undefined,
    image: false
  });
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      useGetUploadData('download')
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
    <LayoutWrapper navigation={navigation} onBackPress={() => navigation.navigate('Uplaods')}>
      {isShowingFile.show ? (
        <ShowFileWrapper
          title={isShowingFile.title}
          image={isShowingFile.image}
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
          uri={isShowingFile.uri}
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
