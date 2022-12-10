import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import ManageApps from '../../../../../utils/manageApps';
import {LayoutWrapper} from '../../../../exports';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectableUploadWrapper from '../LayoutWrapper/SelectableUploadWrapper';
import {BaseUrl, store} from '../../../../../shared';

const DATA = Array.from({length: 2}, (_, index) => ({
  id: `${index}`,
  dateUploaded: new Date(),
  name: `FakeData${index}`,
  progress: 0,
}));

const Videos = () => {
  const [data, setData] = useState(DATA);
  let userData: any = store.getState().authentication.loggedInUser;

  console.log({userData});

  useEffect(() => {
    const id = setTimeout(() => {
      setData((prev: any) => {
        const newData = [...prev];
        newData.forEach(e => {
          if (e.progress === 0) {
            e.progress = 1;
          }
        });

        return newData;
      });
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, [data]);

  return (
    <LayoutWrapper
      pickItemsFn={() => ManageApps.pickVideos()}
      setData={setData}>
      <SelectableUploadWrapper data={data} />
    </LayoutWrapper>
  );
};
const styles = StyleSheet.create({});

export default Videos;
