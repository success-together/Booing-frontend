import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {FlatList, Text, TouchableWithoutFeedback, View} from 'react-native';
import CheckBox from '../../../../../Components/CheckBox/CheckBox';
import {useOutsideAlerter} from '../../../../../utils/util-functions';
import Item from './Item';

export interface SelectableItemsProps {
  handleSelect: (id: string) => void;
  selectedIds: string[];
  data: any[];
  setSelectedIds: (x: any) => void;
  text: string;
  showFile?: (id: string) => void;
  setPressHandler?: () => void;
}

const SelectableItems = ({
  handleSelect,
  selectedIds,
  data,
  setSelectedIds,
  text,
  showFile,
  setPressHandler,
}: SelectableItemsProps) => {
  const [checked, setChecked] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const listWrapperRef = useRef() as MutableRefObject<TouchableWithoutFeedback>;
  useOutsideAlerter(listWrapperRef, setPressHandler, setIsSelecting);

  const handlePress = useCallback(
    (id: string) => () => {
      if (isSelecting) {
        return handleSelect(id);
      }
      // show file
      if (showFile) {
        showFile(id);
      }
    },
    [isSelecting, data],
  );

  const handleLongPress = useCallback(
    (id: string) => () => {
      setIsSelecting(true);
      handleSelect(id);
    },
    [handleSelect],
  );

  const handleCheck = useCallback(() => {
    setChecked(prev => !prev);
  }, []);

  const renderItem = ({
    item: {name, id, progress, hasTriedToUpload, thumbnail, category},
    index,
  }: any) => {
    console.log(category)
    return (
      <Item
        name={name}
        index={index}
        selected={selectedIds.includes(id)}
        progress={progress}
        handleLongPress={handleLongPress(id)}
        handlePress={handlePress(id)}
        hasTriedToUpload={hasTriedToUpload}
        category={category}
        uri={thumbnail}
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
      return [
        ...new Set([
          ...prev,
          ...data
            .filter(e => e.progress === 1 && e.hasTriedToUpload)
            .map(e => e.id),
        ]),
      ];
    });
  }, [data, selectedIds]);

  const uncheckAll = useCallback(() => {
    setIsSelecting(false);
    setSelectedIds((prev: string[]) =>
      prev.filter(e => !data.find(item => item.id === e)),
    );
  }, [data, selectedIds, isSelecting]);

  useEffect(() => {
    if (isSelecting === false) {
      setSelectedIds([]);
    }
  }, [isSelecting]);

  return (
    <TouchableWithoutFeedback ref={listWrapperRef}>
      <View style={{marginBottom: 10}}>
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
                  fontFamily: 'Rubik-Bold', 
                  fontSize: 16,
                  color: 'black',
                }}>
                {text}
              </Text>
            </View>
          }
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SelectableItems;
