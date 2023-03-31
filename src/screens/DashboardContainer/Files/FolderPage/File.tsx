import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {FileIcon} from '../Files';

export interface FileProps {
  id: string;
  name: string;
  type: string | null;
  isDirectory: false;
  createdAt: Date;
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
const File = ({createdAt, name}: FileProps) => {
  return (
    <TouchableOpacity
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
          <FileIcon />
        </View>
        <View style={{flexShrink: 1}}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Rubik-Regular', fontSize: 16,
              fontWeight: '500',
            }}>
            {name}
          </Text>
          <Text style={{color: '#C6D2E8', fontFamily: 'Rubik-Regular', fontSize: 12, fontWeight: '500'}}>
            {formatDate(createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default File;
