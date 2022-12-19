import React from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import TransactionsHeader from './TransactionHeader/TransactionHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';


const Transactions = () => {
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <TransactionsHeader />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={{ padding: 4, marginTop: 20 }}>
          <View style={{ marginLeft: 10, marginTop: 4 }}>
            <Text style={styles.title} >Today</Text>
          </View>
          <View style={styles.list}>
            <View style={styles.card}>
              <Ionicons name="arrow-down-circle-sharp" size={50} color="#07FA93" />
              <View style={styles.Storage1}>
                <View><Text style={styles.Storage2}>Received</Text></View>
                <View><Text style={styles.Storage3}>March 05.2022</Text></View>
              </View>
            </View>
            <View style={styles.Storage11}>
              <View><Text style={styles.Storage22}>01.000Boo</Text></View>
              <View><Text style={styles.Storage3}>TX_D: 40.000.000</Text></View>
            </View>
          </View>
          <View style={styles.list}>
            <View style={styles.card}>
              <Ionicons name="arrow-up-circle-sharp" size={50} color="red" />
              <View style={styles.Storage1}>
                <View><Text style={styles.Storage2}>Sent</Text></View>
                <View><Text style={styles.Storage3}>March 05.2022</Text></View>
              </View>
            </View>
            <View style={styles.Storage11}>
              <View><Text style={styles.Storage222}>01.000Boo</Text></View>
              <View><Text style={styles.Storage3}>TX_D: 40.000.000</Text></View>
            </View>
          </View>

          <View style={{ marginLeft: 10, marginTop: 4 }}>
            <Text style={styles.title} >Yesterday</Text>
          </View>
          <View style={styles.list}>
            <View style={styles.card}>
              <Ionicons name="arrow-down-circle-sharp" size={50} color="#07FA93" />
              <View style={styles.Storage1}>
                <View><Text style={styles.Storage2}>Received</Text></View>
                <View><Text style={styles.Storage3}>March 05.2022</Text></View>
              </View>
            </View>
            <View style={styles.Storage11}>
              <View><Text style={styles.Storage22}>01.000Boo</Text></View>
              <View><Text style={styles.Storage3}>TX_D: 40.000.000</Text></View>
            </View>
          </View>
          <View style={styles.list}>
            <View style={styles.card}>
              <Ionicons name="arrow-up-circle-sharp" size={50} color="red" />
              <View style={styles.Storage1}>
                <View><Text style={styles.Storage2}>Sent</Text></View>
                <View><Text style={styles.Storage3}>March 05.2022</Text></View>
              </View>
            </View>
            <View style={styles.Storage11}>
              <View><Text style={styles.Storage222}>01.000Boo</Text></View>
              <View><Text style={styles.Storage3}>TX_D: 40.000.000</Text></View>
            </View>
          </View>

          <View style={{ marginLeft: 10, marginTop: 4 }}>
            <Text style={styles.title} >This Week</Text>
          </View>
          <View style={styles.list}>
            <View style={styles.card}>
              <Ionicons name="arrow-up-circle-sharp" size={50} color="red" />
              <View style={styles.Storage1}>
                <View><Text style={styles.Storage2}>Sent</Text></View>
                <View><Text style={styles.Storage3}>March 05.2022</Text></View>
              </View>
            </View>
            <View style={styles.Storage11}>
              <View><Text style={styles.Storage222}>01.000Boo</Text></View>
              <View><Text style={styles.Storage3}>TX_D: 40.000.000</Text></View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginHorizontal: 0,
  },
  card: {
    height: 60,
    flexDirection: "row"
  },
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
    flex: 1,
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
    flex: 0.4,
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
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 25,
    borderRadius: 10,
    // width: '90%',
    height: 70,
    flexDirection: "row",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  title: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
    justifyContent: "space-evenly",
    textAlign: "left",
    marginLeft: 5,
  },
  Storage: {
    flexDirection: "row",
  },
  Storage1: {
    flexDirection: "column",
    marginTop: 10,
    alignItems: "flex-start",
  },
  Storage11: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  Storage2: {
    fontWeight: "bold",
    color: "grey",
  },
  Storage3: {
    fontSize: 10,
    color: "grey"
  },
  Storage22: {
    fontWeight: "bold",
    color: "#07FA93",
  },
  Storage222: {
    fontWeight: "bold",
    color: "red",
  },
});
export default Transactions