import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';
import {LayoutWrapper} from '../../../../exports';
import ManageApps from '../../../../../utils/manageApps';

const Audio = () => {
  return (
    <LayoutWrapper
      uploadButtonPress={async () =>
        await ManageApps.pickAudios()
      }></LayoutWrapper>
  );
};

export default Audio;
