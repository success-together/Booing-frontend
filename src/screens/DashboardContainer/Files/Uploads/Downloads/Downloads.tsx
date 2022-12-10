import {View, Text} from 'react-native';
import {LayoutWrapper} from '../../../../exports';
import ManageApps from '../../../../../utils/manageApps';

const Downloads = () => {
  return (
    <LayoutWrapper
      uploadButtonPress={async () =>
        await ManageApps.pickDownloads()
      }></LayoutWrapper>
  );
};

export default Downloads;
