import React from "react";
import { Text, View, StyleSheet, Pressable, TextInput } from "react-native";
import FilesHeader from "../FilesHeader/FilesHeader";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import  FontAwesome from "react-native-vector-icons/FontAwesome";
import  Ionicons from "react-native-vector-icons/Ionicons";
import  MaterialIcons from "react-native-vector-icons/MaterialIcons";
import  SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const Uploads = ({navigation} : {navigation : any}) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <FilesHeader />
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.row}>
          <AntDesign name="clockcircleo" size={24} color="grey" />
          <TextInput style={styles.input} placeholder="Recent Files" />
        </View>
      </View>
      <View style={{ marginLeft: 20 }}>
        <Text style={styles.title}>Categories</Text>
      </View>
      <View style={styles.columnIcon}>
        <View style={styles.rowIcon}>
          <Pressable style={styles.icon} onPress={navigation.navigate('Images')}>
            <Feather name="image" size={24} color="#FF2960" />
            <Text style={styles.font}>Images</Text>
          </Pressable>
          <View style={styles.icon}>
            <Feather name="video" size={24} color="#FF00E4" />
            <Text style={styles.font}>Videos</Text>
          </View>
          <View style={styles.icon}>
            <MaterialIcons name="audiotrack" size={24} color="#FF00E4" />
            <Text style={styles.font}>Audio Files</Text>
          </View>
        </View>
        <View style={styles.rowIcon}>
          <View style={styles.icon}>
            <Ionicons name="document-outline" size={24} color="#FF8700" />
            <Text style={styles.font}>Documents</Text>
          </View>
          <View style={styles.icon}>
            <Feather name="download" size={24} color="#0DD6C0" />
            <Text style={styles.font}>Downloads</Text>
          </View>
          <View style={styles.icon}>
            {/* <Feather name="image" size={24} color="#06FE19" /> */}
            <Text
              style={{
                color: "#06FE19",
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              APK
            </Text>
            <Text style={styles.font}>Installation Files</Text>
          </View>
        </View>
      </View>
      <View style={{ marginLeft: 20 }}>
        <Text style={styles.title}>Storage</Text>
      </View>
      <View style={styles.list1}>
        <View style={styles.Storage}>
          <View>
            <SimpleLineIcons
              name="screen-smartphone"
              size={24}
              color="grey"
              style={{ marginRight: 10 }}
            />
          </View>
          <View style={styles.Storage1}>
            <View>
              <Text style={styles.Storage2}>Internal Storage</Text>
            </View>
            <View>
              <Text style={styles.Storage3}>49.97 GB / 64.00 GB</Text>
            </View>
          </View>
        </View>

        {/* <Hr lineColor="#eee" width={1} text="Dummy Text" textStyles={customStylesHere}/> */}
        <View
          style={{
            marginBottom: 10,
            marginTop: 10,
            borderBottomColor: "grey",
            borderBottomWidth: 1,
          }}
        />
        <View style={styles.Storage}>
          <View>
            <AntDesign
              name="clockcircleo"
              size={24}
              color="grey"
              style={{ marginRight: 10 }}
            />
          </View>
          <View style={styles.Storage1}>
            <View>
              <Text style={styles.Storage2}>SD card</Text>
            </View>
            <View>
              <Text style={styles.Storage3}>Not Inserted</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{ marginLeft: 20 }}>
        <Text style={styles.title}>Recycle Bin</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.95,
    // backgroundColor: "#33a1f9",
    // alignItems: "center",
    color: "#33a1f9",
    justifyContent: "center",
    height: "100%",
    // flexWrap: "wrap",
    // flexDirecton: "row",
    width: "100%",
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
  input: {
    width: "100%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "white",
    backgroundColor: "white",
    marginRight: 50,
  },
  bottomBar: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20,
  },
  row: {
    marginLeft: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  title: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "grey",
    justifyContent: "space-evenly",
    textAlign: "left",
    marginLeft: 5,
    marginBottom: 10,
  },

  rowIcon: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },

  columnIcon: {
    marginTop: 0,
    marginBottom: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  icon: {
    flexDirection: "column",
    backgroundColor: "white",
    alignItems: "center",
    padding: 25,
    borderRadius: 10,
    width: "27%",
    paddingVertical: 20,
  },

  font: {
    fontSize: 9,
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
  },

  list: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 25,
    borderRadius: 10,
    // width: '90%',
    height: 80,
    flexDirection: "row",
  },

  list1: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "white",
    justifyContent: "flex-start",
    padding: 25,
    borderRadius: 10,
    // width: '90%',
    height: 120,
    flexDirection: "column",
  },

  createAccount: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "black",
    fontWeight: "bold",
  },

  Storage: {
    flexDirection: "row",
  },
  Storage1: {
    flexDirection: "column",
    marginTop: -7,
  },
  Storage2: {
    fontWeight: "bold",
  },
  Storage3: {
    fontSize: 10,
  },
});

export default Uploads;
