import {View} from 'react-native';
import {LayoutWrapper} from '../../../../exports';
import ManageApps from '../../../../../utils/manageApps';

const Documents = () => {
  return (
    <LayoutWrapper
      uploadButtonPress={async () =>
        await ManageApps.pickDocument()
      }></LayoutWrapper>
  );
};

export default Documents;
