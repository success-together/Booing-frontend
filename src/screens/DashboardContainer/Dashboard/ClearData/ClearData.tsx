import { StorageAccessFramework } from "expo-file-system";
import React, { useEffect } from "react";
import { View, Text } from "react-native";

function ClearData() {

  const askForPermission = async () => {
     return await StorageAccessFramework.requestDirectoryPermissionsAsync();

  }

  useEffect(() => {
    const permissions = askForPermission();
    console.log(permissions);
    
    // if (permissions.granted) {
    //   // Gets SAF URI from response
    //   const uri = permissions.directoryUri;

    //   // Gets all files inside of selected directory
    //   const files = await StorageAccessFramework.readDirectoryAsync(uri);
    //   alert(`Files inside ${uri}:\n\n${JSON.stringify(files)}`);
    // }
  }, []);

  return (
    <View>
      <Text>clear cache</Text>
    </View>
  );
}

export default ClearData;
