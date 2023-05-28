import React, {useEffect, useState, useCallback} from 'react';
import {View, Button, Text} from 'react-native';
import ProgressBar from './ProgressBar';
import ManageApps from '../../../../../utils/manageApps';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import {useIsFocused} from '@react-navigation/native';

export const CleanModal = (props) => {

	const [permissionGranted, setPermissionGranted] = useState(false);
  const isFocused = useIsFocused();

	const requestPermissions = useCallback(async () => {
		const results = await requestMultiple([
			PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
			PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
		]);
		const readWriteExternalStorage = Object.values(results).every(
			v => v === RESULTS.GRANTED || v === RESULTS.BLOCKED,
		);

		// all file access
		const allFilesAccess = await ManageApps.checkAllFilesAccessPermission();

		setPermissionGranted(readWriteExternalStorage && allFilesAccess);
	}, []);

  useEffect(() => {
    requestPermissions();
  }, [isFocused])

	return (
	  <>
      {props.showModal.show && (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            zIndex: 999,
          }}>
          <View
            style={{
              borderRadius: 10,
              width: 200,
              height: 150,
              padding: 10,
              zIndex: 9999,
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {props.showModal.loading ? (
              <ProgressBar
                progress={props.progressProps.progress}
                text={props.progressProps.text}
              />
            ) : (
              <View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}>
           
                  {!permissionGranted ? (
                    <View>
                      <Text
                        style={{
                          fontFamily: 'Rubik-Bold', fontSize: 11,
                          textAlign: 'center',
                          marginBottom: 20,
                          color: 'black',
                        }}>
                        you need to enable permission to perform this action
                      </Text>
                      <Button
                        title="enable permission"
                        onPress={async () => await requestPermissions()}
                      />
                    </View>
                  ) : (
                    <Button
                      title="scan"
                      disabled={!permissionGranted}
                      onPress={async () => await props.scan()}
                    />
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    </>
	)
}

