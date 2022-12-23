import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BaseUrl, store} from '../../../../../shared';
import {uploadFiles} from '../../../../../shared/slices/Fragmentation/FragmentationService';
import ManageApps from '../../../../../utils/manageApps';
import SelectableItems from './SelectableItems';
import Toast from 'react-native-toast-message';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';

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

    const processInterval = setInterval(() => {
      setData((prev: any[]) => {
        prev.forEach(item => {
          if (item.hasTriedToUpload === false && item.progress !== 1) {
            let random = Math.random();
            while (random > 0.01) {
              random = Math.random();
            }

            if (item.prgress + random === 1) {
              return clearInterval(processInterval);
            }
            item.progress += random;
          }
        });

        return [...prev];
      });
    }, 1000);

    return () => {
      if (processInterval) {
        clearInterval(processInterval);
      }
    };
  }, []);

  const uncheckAll = useCallback(() => setSelectedIds([]), [data, selectedIds]);

  const handleUpload = useCallback(async () => {
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

          if (fileDesc.size >= 26214400) {
            setIsUploadButtonDisabled(false);
            return Toast.show({
              type: 'info',
              text1: 'cannot upload file(s)',
              text2: `file (${fileDesc.name}) has exceeded the max size (25mb)`,
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

        if (!user_id) {
          return;
        }

        const response = await uploadFiles(body, user_id);

        if (response.status === 200) {
          const data = response.data.data;
          setData((prevData: any[]) => {
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
        } else {
          mergeData({hasTriedToUpload: true});
        }
      }
    } catch (e: any) {
      mergeData({hasTriedToUpload: true});
      Toast.show({
        type: 'error',
        text1: 'cannot upload file(s)',
        text2: e.response?.data?.msg || e.message,
      });
    } finally {
      setIsUploadButtonDisabled(false);
    }
  }, [setData, pickItemsFn, data]);

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
      <SelectableItems
        data={data}
        handleSelect={handleSelect}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        text={'Today'}
        showFile={showFile}
        setPressHandler={setPressHandler}
      />
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
            backgroundColor: isUploadButtonDisabled ? '#D9D9D9' : 'white',
            borderRadius: 15,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={isUploadButtonDisabled ? undefined : handleUpload}>
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
