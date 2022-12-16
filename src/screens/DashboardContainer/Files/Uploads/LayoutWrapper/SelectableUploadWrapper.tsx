import React, {MutableRefObject, useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
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

  const handleSelect = useCallback(
    (id: string) =>
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter((e: any) => e !== id) : [...prev, id],
      ),
    [data, selectedIds],
  );

  const uncheckAll = useCallback(() => setSelectedIds([]), [data, selectedIds]);

  const handleUpload = useCallback(async () => {
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

      setData((prevData: any[]) => [
        ...prevData,
        ...fileDescs
          .filter(
            fileDesc =>
              fileDesc && !prevData.find(file => file.id === fileDesc.id),
          )
          .map(prevFileDesc => ({
            ...prevFileDesc,
            dateUploaded: new Date(),
            progress: 0,
          })),
      ]);
    }
  }, []);

  return (
    <>
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
    </>
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
