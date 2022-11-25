import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { FilesHeader } from "../../exports";
import AntDesign   from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/AntDesign";
import  Entypo from "react-native-vector-icons/AntDesign";


const Files = ({navigation}: {navigation : any}) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <FilesHeader />
      </View>

      <View style={styles.recentFilesContainer}>
        <Pressable style={styles.button} onPress={ () =>{ navigation.navigate("Uploads")}}>
          <Feather
            name="file-plus"
            size={24}
            color="grey"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.createAccount}>Upload</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <AntDesign
            name="addfolder"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.text}>Folder</Text>
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "column",
        }}
      >
        <View style={styles.row3}>
          {/* <Text style={styles.row4}>Essentials</Text> */}
          <Entypo name="text" size={24} color="black" />
          <Feather name="arrow-down" size={24} color="black" />
        </View>
      </View>

      <View style={styles.list}>
        <FontAwesome name="folder" size={35} color="grey" />
        <View
          style={{
            marginLeft: 30,
          }}
        >
          <Text style={styles.createAccount}> Images</Text>
          <Text
            style={{
              color: "grey",
            }}
          >
            {" "}
            06-Sep 21:29
          </Text>
        </View>
        <View
          style={{
            alignContent: "flex-end",
          }}
        >
          <Text
            style={{
              color: "grey",
            }}
          >
            3 Items
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        <FontAwesome name="folder" size={35} color="grey" />
        <View
          style={{
            marginLeft: 30,
          }}
        >
          <Text style={styles.createAccount}> Music</Text>
          <Text
            style={{
              color: "grey",
            }}
          >
            {" "}
            06-Sep 21:29
          </Text>
        </View>
        <View
          style={{
            alignContent: "flex-end",
          }}
        >
          <Text
            style={{
              color: "grey",
            }}
          >
            3 Items
          </Text>
        </View>
      </View>
      <View style={styles.list}>
        <FontAwesome name="folder" size={35} color="grey" />
        <View
          style={{
            marginLeft: 30,
          }}
        >
          <Text style={styles.createAccount}> Documents</Text>
          <Text
            style={{
              color: "grey",
            }}
          >
            {" "}
            06-Sep 21:29
          </Text>
        </View>
        <View
          style={{
            alignContent: "flex-end",
          }}
        >
          <Text
            style={{
              color: "grey",
            }}
          >
            3 Items
          </Text>
        </View>
      </View>
      <View style={styles.list}>
        <FontAwesome name="folder" size={35} color="grey" />
        <View
          style={{
            marginLeft: 30,
          }}
        >
          <Text style={styles.createAccount}> Downloads</Text>
          <Text
            style={{
              color: "grey",
            }}
          >
            06-Sep 21:29
          </Text>
        </View>
        <View
          style={{
            alignContent: "flex-end",
          }}
        >
          <Text
            style={{
              color: "grey",
            }}
          >
            3 Items
          </Text>
        </View>
      </View>
      <View style={styles.list}>
        <FontAwesome name="folder" size={35} color="grey" />
        <View
          style={{
            marginLeft: 30,
          }}
        >
          <Text style={styles.createAccount}> Images</Text>
          <Text
            style={{
              color: "grey",
            }}
          >
            06-Sep 21:29
          </Text>
        </View>
        <View
          style={{
            alignContent: "flex-end",
          }}
        >
          <Text
            style={{
              color: "grey",
            }}
          >
            3 Items
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  secondScreenContainer: {
    flexDirection: "row",
  },
  storageInfoContainer: {
    justifyContent: "space-evenly",
    marginLeft: 20,
  },
  txtStorage: {
    fontSize: 20,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: "bold",
    color: "#33a1f9",
  },
  container: {
    flex: 1.1,
    // backgroundColor: "#33a1f9",
    // alignItems: "center",
    color: "#33a1f9",
    justifyContent: "center",
    height: "100%",
    // flexWrap: "wrap",
    // flexDirecton: "row",
  },

  containerImage: {
    backgroundColor: "#33a1f9",
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
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
    flexDirection: "row"
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
  createAccount: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "black",
    fontWeight: "bold",
  },
  containerFolder: {
    flexDirection: "row",
  },
  recentFilesContainer: {
    justifyContent: "flex-start",
    flexDirection: "row",
    marginTop: 30,
  },

  row3: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 10,
  },

  row4: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 30,
  },

  list: {
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 25,
    borderRadius: 10,
    // width: '90%',
    height: 80,
    flexDirection: "row",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
export default Files;
