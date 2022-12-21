import axios from 'axios';
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Text, View} from 'react-native';
import {BaseUrl, store} from '../../../../shared';
import LayoutWrapper from '../Uploads/LayoutWrapper/LayoutWrapper';
import Toast from 'react-native-toast-message';
import SelectableItems from '../Uploads/LayoutWrapper/SelectableItems';
import AntDesign from 'react-native-vector-icons/AntDesign';

function transformType(type: string) {
  switch (true) {
    case type.startsWith('video'):
      return 'video';

    case type.startsWith('image'):
      return 'image';

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
    (async () => {
      try {
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
              type: transformType(e.type),
              progress: 1,
              hasTriedToUpload: true,
              id: e._id,
            })),
          );
        }
      } catch (e) {
        return Toast.show({
          type: 'error',
          text1: 'there was an error with fetching delete files',
        });
      }
    })();
  }, []);
  return (
    <LayoutWrapper setPressHandlerRoot={setPressHandler}>
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
          ({data, name}: {data: any[]; name: string}) => (
            <SelectableItems
              data={data}
              handleSelect={handleSelect}
              selectedIds={selectedIds}
              text={name + 's'}
              setSelectedIds={setSelectedIds}
              key={name}
              setPressHandler={pressHandler}
            />
          ),
        )}
      </View>
    </LayoutWrapper>
  );
};

export default RecycleBin;
