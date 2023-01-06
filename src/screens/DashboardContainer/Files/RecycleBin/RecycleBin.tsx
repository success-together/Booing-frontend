import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import {BaseUrl, store} from '../../../../shared';
import LayoutWrapper from '../Uploads/LayoutWrapper/LayoutWrapper';
import Toast from 'react-native-toast-message';
import SelectableItems from '../Uploads/LayoutWrapper/SelectableItems';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setRootLoading} from '../../../../shared/slices/rootSlice';
import ShowFileWrapper from '../Uploads/LayoutWrapper/ShowFileWrapper';
import {useIsFocused} from '@react-navigation/native';

function transformType(type?: string) {
  if (!type) {
    return 'other';
  }
  switch (true) {
    case type?.startsWith('video'):
      return 'video';

    case type?.startsWith('image'):
      return 'image';

    case type === 'application/pdf' || type === 'pdf':
      return 'pdf';

    default:
      return 'other';
  }
}

function groupByCategory(data: any[]) {
  return data.reduce((acc, curr) => {
    const type = transformType(curr.type);
    const item = acc.find((e: any) => e.name === type);

    if (item) {
      item.data.push(curr);
      return acc;
    }

    acc.push({name: type, data: [curr]});
    return acc;
  }, []);
}

const RecycleBin = () => {
  const [data, setData] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pressHandler, setPressHandler] = useState<any>();
  const [isShowingFile, setIsShowingFile] = useState<{
    show: boolean;
    uri?: string;
    title?: string;
  }>({
    show: false,
    uri: undefined,
    title: undefined,
  });
  const isFocused: boolean = useIsFocused();
  const user_id = store.getState().authentication.userId;

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter((e: any) => e !== id) : [...prev, id],
      );
    },
    [data, selectedIds],
  );

  const uncheckAll = useCallback(() => setSelectedIds([]), [data, selectedIds]);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        try {
          store.dispatch(setRootLoading(true));
          const response = await axios({
            method: 'GET',
            url: `${BaseUrl}/logged-in-user/getDeletedFiles/${user_id}`,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            setData(
              response.data.data.map((e: any) => ({
                ...e,
                type: transformType(
                  e.uri?.slice(e.uri?.indexOf(':') + 1, e.uri?.indexOf(';')),
                ),
                progress: 1,
                hasTriedToUpload: true,
                isImage: e.uri?.startsWith('data:image/'),
              })),
            );
          }
        } catch (e: any) {
          return Toast.show({
            type: 'error',
            text1: 'there was an error with fetching delete files',
            text2: e?.message,
          });
        } finally {
          store.dispatch(setRootLoading(false));
        }
      })();
    }
  }, [isFocused]);

  const showImage = useCallback(
    (id: string) => {
      const file = data.find(e => e.id === id);
      if (file) {
        setIsShowingFile({show: true, uri: file.uri, title: file.name});
      }
    },
    [data],
  );

  return (
    <LayoutWrapper setPressHandlerRoot={setPressHandler}>
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
        <>
          <View style={{paddingLeft: 10, paddingRight: 10, flex: 1}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 34,
                marginBottom: 42,
                minHeight: 24,
              }}>
              {selectedIds.length > 0 && (
                <>
                  <AntDesign
                    name="close"
                    size={20}
                    color="#49ACFA"
                    onPress={uncheckAll}
                  />
                  <Text style={{marginLeft: 17, color: 'black', fontSize: 16}}>
                    {selectedIds.length} Selected
                  </Text>
                </>
              )}
            </View>
            {groupByCategory(data).map(
              ({data: categoryData, name}: {data: any[]; name: string}) => (
                <SelectableItems
                  data={categoryData}
                  handleSelect={handleSelect}
                  selectedIds={selectedIds}
                  text={name + 's'}
                  setSelectedIds={setSelectedIds}
                  key={name}
                  setPressHandler={pressHandler}
                  showFile={name === 'image' ? showImage : undefined}
                />
              ),
            )}
          </View>
        </>
      )}
    </LayoutWrapper>
  );
};

export default RecycleBin;
