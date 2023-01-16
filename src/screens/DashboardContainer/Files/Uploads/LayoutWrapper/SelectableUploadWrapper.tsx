import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {AXIOS_ERROR, BaseUrl, MAX_SIZE, store} from '../../../../../shared';
import {uploadFiles} from '../../../../../shared/slices/Fragmentation/FragmentationService';
import ManageApps from '../../../../../utils/manageApps';
import SelectableItems from './SelectableItems';
import Toast from 'react-native-toast-message';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import NoDataFound from '../../../../../Components/NoDataFound/NoDataFound';

const isToday = (date: Date) => {
  const today = new Date();
  return (
    today.setUTCHours(0, 0, 0, 0) <= date.getTime() &&
    date.getTime() <= today.setUTCHours(23, 59, 59, 999)
  );
};

const isYesterday = (date: Date) => {
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  return (
    yesterday.setUTCHours(0, 0, 0, 0) <= date.getTime() &&
    date.getTime() <= yesterday.setUTCHours(23, 59, 59, 999)
  );
};

const groupByDateUploaded = (data: {createdAt: string}[]) => {
  return data.reduce(
    (acc: {label: string; items: typeof data}[], elem: typeof data['0']) => {
      if (!elem.createdAt) {
        return acc;
      }

      const itemUploadDate = new Date(elem.createdAt);
      if (isToday(itemUploadDate)) {
        const exist = acc.find(e => e.label === 'Today');
        if (exist) {
          exist.items.push(elem);
        } else {
          acc.push({label: 'Today', items: [elem]});
        }
      } else if (isYesterday(itemUploadDate)) {
        const exist = acc.find(e => e.label === 'Today');
        if (exist) {
          exist.items.push(elem);
        } else {
          acc.push({label: 'Yesterday', items: [elem]});
        }
      } else {
        const dateString = itemUploadDate.toDateString();
        const exist = acc.find(e => e.label === dateString);
        if (exist) {
          exist.items.push(elem);
        } else {
          acc.push({label: dateString, items: [elem]});
        }
      }

      return acc;
    },
    [],
  );
};

export interface SelectableUploadWrapperProps {
  data: any[];
  setPressHandler?: () => void;
  showFile: (id: string) => void;
  pickItemsFn: () => Promise<any[]>;
  setData: (arg: any) => void;
  isImageWrapper: boolean;
}

const SelectableUploadWrapper = ({
  data,
  setPressHandler,
  showFile,
  pickItemsFn,
  setData,
  isImageWrapper,
}: SelectableUploadWrapperProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isUploadButtonDisabled, setIsUploadButtonDisabled] = useState(false);
  const user_id = store.getState().authentication.userId;

  const handleSelect = useCallback(
    (id: string) =>
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter((e: any) => e !== id) : [...prev, id],
      ),
    [data, selectedIds],
  );

  useEffect(() => {
    (async () => {
      const results = await requestMultiple([
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ]);
      const readWriteExternalStorage = Object.values(results).every(
        v => v === RESULTS.GRANTED || v === RESULTS.BLOCKED,
      );

      if (!readWriteExternalStorage) {
        return Toast.show({
          type: 'error',
          text1: 'you need to enable permissions to upload files',
        });
      }
    })();
  }, []);

  const uncheckAll = useCallback(() => setSelectedIds([]), [data, selectedIds]);

  const handleUpload = useCallback(async () => {
    if (!user_id) {
      return Toast.show({
        type: 'error',
        text1: 'cannot upload you are not logged in !',
      });
    }
    setIsUploadButtonDisabled(true);
    let fileDescs: any[] = [];
    function mergeData(obj: object) {
      setData((prevData: any[]) => {
        if (fileDescs.length > 0) {
          for (const {name} of fileDescs) {
            const item = prevData.find((e: any) => e.name === name);
            if (item) {
              Object.assign(item, obj);
            }
          }
          return [...prevData];
        }
        return prevData;
      });
    }

    try {
      const pickedFiles = await pickItemsFn();
      if (pickedFiles && pickedFiles.length > 0) {
        const body = new FormData();
        for (const file of pickedFiles) {
          const fileDesc = {
            ...(await ManageApps.getFileDescription(file)),
            uri: file,
            hasTriedToUpload: false,
            isImage: isImageWrapper,
            id: Math.floor(Math.random() * 9999).toString(), // change this later
          };

          if (
            data.find(
              item =>
                (item.name === fileDesc.name ||
                  item.name.includes('_' + fileDesc.name)) &&
                item.progress === 1,
            )
          ) {
            setIsUploadButtonDisabled(false);
            return Toast.show({
              type: 'info',
              text1: 'file already uploaded',
            });
          }

          if (fileDesc.size >= MAX_SIZE) {
            // 25mb
            setIsUploadButtonDisabled(false);
            return Toast.show({
              type: 'info',
              text1: 'cannot upload file(s)',
              text2: `file (${fileDesc.name}) has exceeded the max size (16mb)`,
            });
          }

          body.append('file', {
            uri: file,
            type: fileDesc.type,
            name: fileDesc.name,
          });

          fileDescs.push(fileDesc);
        }

        const newData = fileDescs
          .filter(
            fileDesc =>
              fileDesc && !data.find(file => file.name === fileDesc.name),
          )
          .map(prevFileDesc => ({
            ...prevFileDesc,
            dateUploaded: new Date(),
            progress: 0,
          }));

        setData((prevData: any[]) => [...prevData, ...newData]);

        const response = await uploadFiles(body, user_id, newProgress => {
          mergeData({progress: newProgress});
        });

        if (response.status === 200) {
          const data = response.data.data;
          setIsUploadButtonDisabled(false);
          return setData((prevData: any[]) => {
            for (const {name} of fileDescs) {
              const item = prevData.find((e: any) => e.name === name);
              const fileData = data.find((e: any) =>
                e.name.includes(item.name),
              );

              if (item && fileData) {
                Object.assign(item, {
                  progress: 1,
                  hasTriedToUpload: true,
                  id: fileData.id,
                });
              }
            }
            return [...prevData];
          });
        }
      }
    } catch (e: any) {
      mergeData({hasTriedToUpload: true, progress: 0});

      if (e.name === AXIOS_ERROR && !e.message.includes('code 500')) {
        return Toast.show({
          type: 'error',
          text1: e.response?.data?.message,
        });
      }

      Toast.show({
        type: 'error',
        text1: 'something went wrong cannot uplaod files',
      });
    } finally {
      setIsUploadButtonDisabled(false);
    }
  }, [pickItemsFn, data, user_id, uploadFiles]);

  const handleDelete = useCallback(async () => {
    try {
      const response = await axios({
        method: 'POST',
        url: `${BaseUrl}/logged-in-user/deleteFiles`,
        data: {
          files_id: selectedIds,
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (response.status === 200) {
        setData((prev: any[]) => {
          const newData = prev.filter(e => !selectedIds.includes(e.id));
          setSelectedIds([]);
          return newData;
        });
        Toast.show({
          text1: 'files deleted successfully !',
        });
      }
    } catch (e: any) {
      console.log('error');
      Toast.show({
        type: 'error',
        text1: 'there was an error in delete files',
        text2: e.message,
      });
    }
  }, [data, selectedIds]);

  return (
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
      {data.length === 0 ? (
        <NoDataFound />
      ) : (
        groupByDateUploaded(data).map((group, index) => (
          <SelectableItems
            key={index}
            data={group.items}
            handleSelect={handleSelect}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            text={group.label}
            showFile={showFile}
            setPressHandler={setPressHandler}
          />
        ))
      )}
      <View style={styles.uploadContainer}>
        {selectedIds.length > 0 && (
          <TouchableOpacity
            style={{
              width: 82,
              height: 49,
              marginRight: 10,
              backgroundColor: 'white',
              borderRadius: 15,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleDelete}>
            <Text style={{color: '#49ACFA', fontWeight: '500'}}>Delete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{
            width: 82,
            height: 49,
            backgroundColor: 'white',
            borderRadius: 15,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          disabled={isUploadButtonDisabled}
          onPress={handleUpload}>
          <Text style={{color: '#49ACFA', fontWeight: '500'}}>Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  uploadContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F6F7FB',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 11,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 18,
  },
});

export default SelectableUploadWrapper;