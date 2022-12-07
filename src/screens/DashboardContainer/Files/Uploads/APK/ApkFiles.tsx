import React from 'react';
import {Text, View} from 'react-native';
import ManageApps from '../../../../../utils/manageApps';
import {LayoutWrapper} from '../../../../exports';

const ApkFiles = () => {
  return (
    <LayoutWrapper
      uploadButtonPress={async () =>
        await ManageApps.pickApks()
      }></LayoutWrapper>
  );
};

export default ApkFiles;
