import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import {store} from '../../shared';
import {setRootLoading} from '../../shared/slices/rootSlice';
const Loader = (Props: {isLoading: boolean}) => {
  return (
    <>
      {Props.isLoading && (
        <Modal
          transparent={true}
          animationType={'none'}
          visible={Props.isLoading}
          onRequestClose={() => {
            console.log('close modal');
            store.dispatch(setRootLoading(false));
          }}>
          <View style={styles.modalBackground}>
            <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color="blue" />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    zIndex: 9999,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
});

export default Loader;
