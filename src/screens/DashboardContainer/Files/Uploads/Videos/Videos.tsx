import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import ManageApps from '../../../../../utils/manageApps';
import {LayoutWrapper} from '../../../../exports';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Selected} from '../../../Dashboard/File/File';

const DATA = Array.from({length: 2}, (_, index) => ({
  id: `${index}`,
  dateUploaded: new Date(),
  name: `FakeData${index}`,
}));

const CheckBox = ({checked, handleCheck, onCheck, onUncheck, style}: any) => {
  useEffect(() => {
    if (checked && onCheck) {
      onCheck();
    }
    if (!checked && onUncheck) {
      onUncheck();
    }
  }, [checked]);

  return (
    <TouchableOpacity
      onPress={handleCheck}
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        borderStyle: 'solid',
        borderColor: '#C6D2E8',
        borderWidth: 2,
        ...style,
      }}>
      {checked && <Feather name="check" size={20} color={'#C6D2E8'} />}
    </TouchableOpacity>
  );
};

const WIDTH = Dimensions.get('window').width;
const NUM_COLS = 4;

const Item = ({index, name, handleSelect, selected}: any) => {
  return (
    <TouchableOpacity
      onPress={handleSelect}
      style={{
        width: (WIDTH - (NUM_COLS + 1) * 10) / NUM_COLS,
        height: (WIDTH - (NUM_COLS + 1) * 10) / NUM_COLS,
        backgroundColor: '#D9D9D9',
        borderRadius: 8,
        marginRight: (index + 1) % NUM_COLS !== 0 ? 10 : undefined,
        marginBottom: NUM_COLS > 1 ? 5 : undefined,
        padding: 5,
        position: 'relative',
      }}>
      <Text>{name}</Text>
      {selected && <Selected />}
    </TouchableOpacity>
  );
};

const Videos = () => {
  const [data, setData] = useState(DATA);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const handleCheck = useCallback(() => {
    setChecked(prev => !prev);
  }, [checked]);

  const checkAll = useCallback(
    () => setSelectedIds(data.map(e => e.id)),
    [data, selectedIds],
  );

  const uncheckAll = useCallback(() => setSelectedIds([]), [data, selectedIds]);

  const handleSelect = useCallback(
    (id: string) => () =>
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter((e: any) => e !== id) : [...prev, id],
      ),
    [data, selectedIds],
  );

  const renderItem = ({item: {name, id}, index}: any) => (
    <Item
      name={name}
      index={index}
      handleSelect={handleSelect(id)}
      selected={selectedIds.includes(id)}
    />
  );

  const handleUpload = useCallback(async () => {
    const pickedFiles = await ManageApps.pickVideos();

    if (pickedFiles && pickedFiles.length > 0) {
      const fileDescs: any[] = [];
      for (const file of pickedFiles) {
        fileDescs.push(await ManageApps.getFileDescription(file));
      }

      setData(prevData => [
        ...prevData,
        ...fileDescs
          .filter(
            fileDesc =>
              fileDesc && !prevData.find(file => file.id === fileDesc.id),
          )
          .map(prevFileDesc => ({...prevFileDesc, dateUploaded: new Date()})),
      ]);
    }
  }, []);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setChecked(false);
    }
  }, [selectedIds]);

  return (
    <LayoutWrapper uploadButtonPress={handleUpload}>
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
      <FlatList
        data={data}
        renderItem={renderItem}
        numColumns={4}
        columnWrapperStyle={{flexDirection: 'row', marginRight: 10}}
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
              Today
            </Text>
          </View>
        }
      />
    </LayoutWrapper>
  );
};
const styles = StyleSheet.create({});

export default Videos;
