import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import CheckBox from '../../../../../Components/CheckBox/CheckBox';
import Item from './Item';

export interface SelectableItemsProps {
  handleSelect: (id: string) => () => void;
  selectedIds: string[];
  data: any[];
  setSelectedIds: (x: any) => void;
  text: string;
}

const SelectableItems = ({
  handleSelect,
  selectedIds,
  data,
  setSelectedIds,
  text,
}: SelectableItemsProps) => {
  const [checked, setChecked] = useState(false);

  const handleCheck = useCallback(() => {
    setChecked(prev => !prev);
  }, []);

  const renderItem = ({item: {name, id, progress}, index}: any) => {
    return (
      <Item
        name={name}
        index={index}
        handleSelect={handleSelect(id)}
        selected={selectedIds.includes(id)}
        progress={progress}
      />
    );
  };

  useEffect(() => {
    if (selectedIds.length === 0) {
      setChecked(false);
    }
  }, [selectedIds]);

  const checkAll = useCallback(() => {
    setSelectedIds((prev: string[]) => {
      return [...new Set([...prev, ...data.map(e => e.id)])];
    });
  }, [data, selectedIds]);

  const uncheckAll = useCallback(() => {
    setSelectedIds((prev: string[]) =>
      prev.filter(e => !data.find(item => item.id === e)),
    );
  }, [data, selectedIds]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      numColumns={4}
      extraData={selectedIds}
      ListHeaderComponent={
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <CheckBox
            checked={checked}
            handleCheck={handleCheck}
            onCheck={checkAll}
            onUncheck={uncheckAll}
          />
          <Text
            style={{
              marginLeft: 13,
              fontWeight: 'bold',
              fontSize: 16,
              color: 'black',
            }}>
            {text}
          </Text>
        </View>
      }
    />
  );
};

export default SelectableItems;
