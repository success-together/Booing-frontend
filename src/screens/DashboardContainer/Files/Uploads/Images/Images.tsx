import React, { useState } from "react";
import {
    Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FilesHeader from "../../FilesHeader/FilesHeader";
import * as ImagePicker from "expo-image-picker";

const Images = ({ navigation }: { navigation: any }) => {
  const [image, setImage] = useState<Array<any>>([]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });
    console.log(result);
    if (!result.canceled) {
    //   if (image.length === 0)
    //     setImage([{ uri: result.assets ? result.assets[0].uri : "" }]);
    //   else
        setImage((oldImages) => [
          ...oldImages,
          { uri: result.assets ? result.assets[0].uri : "" },
        ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <FilesHeader />
      </View>
      <FlatList
        data={image}
        numColumns={3}
        style={{ flex: 1 }}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => {
          return (
            <View style={styles.inner}>
              <Image
                source={item.uri}
                style={{
                  width: Dimensions.get("window").width / 4,
                  height: Dimensions.get("window").height / 4,
                }}
                resizeMode={"contain"}
              />
            </View>
          );
        }}
      ></FlatList>
      <Pressable style={styles.button} onPress={pickImage}>
        <Text style={styles.text}>Upload</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 300,
  },
  inner: {
    flexDirection: "row",
    marginRight: 20,
  },
  container: {
    flex: 0.9,
    // backgroundColor: "#33a1f9",
    // alignItems: "center",
    color: "#33a1f9",
    justifyContent: "center",
    height: "100%",
    // flexWrap: "wrap",
    // flexDirecton: "row",
    width: "100%",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "#33a1f9",
    fontWeight: "bold",
  },
  containerImage: {
    backgroundColor: "#33a1f9",
    width: "100%",
    flex: 0.8,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
    flexDirection: "row",
  },
});

export default Images;
