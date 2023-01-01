import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {FolderIcon} from '../Files';

export interface FolderProps {
  id: string;
  name: string;
  createdAt: Date;
  items: number;
}

const formatDate = (date: Date): string => {
  const d = new Date(date);
  const [monthDay, hourMin] = d
    .toLocaleDateString('en-EG', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      formatMatcher: 'basic',
      hour12: false,
    })
    .split(', ');

  return `${monthDay.split(' ').reverse().join('-')} ${hourMin}`;
};
const Folder = ({
  showFolder,
  createdAt,
  items,
  name,
}: FolderProps & {showFolder: () => void}) => {
  return (
    <TouchableOpacity
      onPress={showFolder}
      style={{
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', flexShrink: 1}}>
        <View style={{marginRight: 35}}>
          <FolderIcon />
        </View>
        <View style={{flexShrink: 1}}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontWeight: '500',
            }}>
            {name}
          </Text>
          <Text style={{color: '#C6D2E8', fontSize: 12, fontWeight: '500'}}>
            {formatDate(createdAt)}
          </Text>
        </View>
      </View>
      <View style={{marginLeft: 10}}>
        <Text
          style={{
            color: '#C6D2E8',
            fontSize: 12,
            fontWeight: '500',
          }}>
          {items} Items
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Folder;
