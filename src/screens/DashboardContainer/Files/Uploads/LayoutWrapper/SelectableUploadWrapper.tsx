import React, {MutableRefObject, useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {store} from '../../../../../shared';
import {uploadFiles} from '../../../../../shared/slices/Fragmentation/FragmentationService';
import ManageApps from '../../../../../utils/manageApps';
import SelectableItems from './SelectableItems';

export interface SelectableUploadWrapperProps {
  data: any[];
  setPressHandler?: () => void;
  showFile: (id: string) => void;
  pickItemsFn: () => Promise<any[]>;
  setData: (arg: any) => void;
}

const SelectableUploadWrapper = ({
  data,
  setPressHandler,
  showFile,
  pickItemsFn,
  setData,
}: SelectableUploadWrapperProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const user_id = store.getState().authentication.userId;

  const handleSelect = useCallback(
    (id: string) =>
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter((e: any) => e !== id) : [...prev, id],
      ),
    [data, selectedIds],
  );

  const uncheckAll = useCallback(() => setSelectedIds([]), [data, selectedIds]);

  const handleUpload = useCallback(async () => {
    try {
      const pickedFiles = await pickItemsFn();
      if (pickedFiles && pickedFiles.length > 0) {
        const fileDescs: any[] = [];
        for (const file of pickedFiles) {
          fileDescs.push({
            ...(await ManageApps.getFileDescription(file)),
            uri: file,
            id: (Math.random() * 500).toString(), // change this later
          });
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
            hasTriedToUpload: false,
          }));

        setData((prevData: any[]) => [...prevData, ...newData]);

        if (!user_id) {
          return;
        }

        const response = await uploadFiles({
          user_id: user_id as string,
          files: newData.map(e => ({name: e.name, data: e.data, type: e.type})),
        });

        console.log({response: response.data});

        setData((prev: []) => {
          for (const item of newData) {
            const e = prev.find(
              (existingItem: any) => existingItem.id === item.id,
            );
            if (!e) {
              continue;
            }
            (e as any).hasTriedToUpload = true;
          }
          return [...prev];
        });

        if (response?.status === 200) {
          console.log(response.data.data.message);
        }
      }
    } catch (e: any) {
      for (const prop in e) {
        console.log(prop, e[prop]);
      }
    }
  }, []);

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
    width: '100%',
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
