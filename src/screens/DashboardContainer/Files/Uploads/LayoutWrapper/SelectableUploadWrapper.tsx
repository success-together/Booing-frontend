import React, {useCallback, useState} from 'react';
import {Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ManageApps from '../../../../../utils/manageApps';
import SelectableItems from './SelectableItems';

export interface SelectableUploadWrapperProps {
  data: any[];
}

const SelectableUploadWrapper = ({data}: SelectableUploadWrapperProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = useCallback(
    (id: string) => () =>
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter((e: any) => e !== id) : [...prev, id],
      ),
    [data, selectedIds],
  );

  const uncheckAll = useCallback(() => setSelectedIds([]), [data, selectedIds]);

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
      />
    </>
  );
};

export default SelectableUploadWrapper;
