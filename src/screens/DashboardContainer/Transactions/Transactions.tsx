/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  DrawerLayoutAndroid,
  Pressable,
} from 'react-native';
import TransactionsHeader from './TransactionHeader/TransactionHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getWallet} from '../../../shared/slices/wallet/walletService';
import {store} from '../../../shared';
import {useIsFocused} from '@react-navigation/native';
import {Wallet} from '../../../models/Wallet';
import NoDataFound from '../../../Components/NoDataFound/NoDataFound';

const Transactions = ({navigation}: any) => {
  const [isClicked, SetIsClicked] = useState<boolean>(false);
  let drawer = useRef<DrawerLayoutAndroid>(null);
  const [drawerPosition, setDrawerPosition] = useState<'left' | 'right'>(
    'left',
  );
  const [wallet, setWallet] = useState<Wallet>();

  // const changeDrawerPosition = () => {
  //   if (drawerPosition === 'left') {
  //     setDrawerPosition('right');
  //   } else {
  //     setDrawerPosition('left');
  //   }
  // };

  const user_id = store.getState().authentication.userId;
  const isFocused = useIsFocused();

  const getTransactions = async () => {
    if (user_id) {
      return await getWallet({user_id: user_id})
        .then(res => {
          console.log(res);
          if (res.success) setWallet(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (isFocused) {
      getTransactions();
    }
  }, [isFocused]);

  const navigationView = () => (
    <View style={styles.Drawercontainer}>
      <Text style={styles.text}>Sert Try Date</Text>
      <Pressable
        style={styles.day}
        onPress={() => {
          drawer.current?.closeDrawer();
          SetIsClicked(false);
        }}>
        <View style={{flexDirection: 'row'}}>
          <AntDesign name="calendar" size={24} color="grey" />
          <Text style={styles.text}> Today </Text>
        </View>
        <AntDesign name="check" size={24} color="#07FA93" />
      </Pressable>
      <Pressable
        style={styles.day}
        onPress={() => {
          drawer.current?.closeDrawer();
          SetIsClicked(false);
        }}>
        <View style={{flexDirection: 'row'}}>
          <AntDesign name="calendar" size={24} color="grey" />
          <Text style={styles.text}> Yesterday </Text>
        </View>
        <AntDesign name="check" size={24} color="#07FA93" />
      </Pressable>
      <Pressable
        style={styles.day}
        onPress={() => {
          drawer.current?.closeDrawer();
          SetIsClicked(false);
        }}>
        <View style={{flexDirection: 'row'}}>
          <AntDesign name="calendar" size={24} color="grey" />
          <Text style={styles.text}> Last week </Text>
        </View>
        <AntDesign name="check" size={24} color="#07FA93" />
      </Pressable>
      <Pressable
        style={styles.day}
        onPress={() => {
          drawer.current?.closeDrawer();
          SetIsClicked(false);
        }}>
        <View style={{flexDirection: 'row'}}>
          <AntDesign name="calendar" size={24} color="grey" />
          <Text style={styles.text}> Last Month </Text>
        </View>
        <AntDesign name="check" size={24} color="#07FA93" />
      </Pressable>
      <Pressable
        style={styles.day}
        onPress={() => {
          drawer.current?.closeDrawer();
          SetIsClicked(false);
        }}>
        <View style={{flexDirection: 'row'}}>
          <AntDesign name="calendar" size={24} color="grey" />
          <Text style={styles.text}> Custom Range </Text>
        </View>
        <AntDesign name="check" size={24} color="#07FA93" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <>
      {isClicked && drawer.current?.openDrawer()}
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300}
        drawerPosition={drawerPosition}
        renderNavigationView={navigationView}
        onDrawerClose={() => {
          SetIsClicked(false);
        }}>
        <View style={styles.containerImage}>
          <TransactionsHeader
            SetIsClicked={SetIsClicked}
            navigation={navigation}
          />
        </View>
        
        <ScrollView style={styles.scrollView}>
          <View style={{padding: 4, marginTop: 20}}>
            {/* <DrawerLayoutAndroid
            ref={drawer}
            drawerWidth={300}
            drawerPosition={drawerPosition}
            renderNavigationView={navigationView}>
            
              
          </DrawerLayoutAndroid> */}
            {/* <Button
              title="Open drawer"
              onPress={() => drawer.current?.openDrawer()}
            /> */}

            {/* <View style={{marginLeft: 10, marginTop: 4}}>
              <Text style={styles.title}>Today</Text>
            </View> */}

            {wallet && wallet.transactions.length > 0 ? (
              wallet?.transactions.map(transaction => {
                return (
                  <>
                    {transaction.isIncremenet ? (
                      <View style={styles.list}>
                        <View style={styles.card}>
                          <Ionicons
                            name="arrow-down-circle-sharp"
                            size={50}
                            color="#07FA93"
                          />
                          <View style={styles.Storage1}>
                            <View>
                              <Text style={styles.Storage2}>Received</Text>
                            </View>
                            <View>
                              <Text style={styles.Storage3}>
                                {transaction?.date}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.Storage11}>
                          <View>
                            <Text style={styles.Storage22}>
                              {transaction.amount}
                            </Text>
                          </View>
                          {/* <View>
                          <Text style={styles.Storage3}></Text>
                        </View> */}
                        </View>
                      </View>
                    ) : (
                      <View style={styles.list}>
                        <View style={styles.card}>
                          <Ionicons
                            name="arrow-up-circle-sharp"
                            size={50}
                            color="red"
                          />
                          <View style={styles.Storage1}>
                            <View>
                              <Text style={styles.Storage2}>Sent</Text>
                            </View>
                            <View>
                              <Text style={styles.Storage3}>
                                {transaction.date}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.Storage11}>
                          <View>
                            <Text style={styles.Storage222}>
                              {transaction.amount}
                            </Text>
                          </View>
                          {/* <View>
                          <Text style={styles.Storage3}>TX_D: 40.000.000</Text>
                        </View> */}
                        </View>
                      </View>
                    )}
                  </>
                );
              })
            ) : (
              <NoDataFound />
            )}

            {/* <View style={{marginLeft: 10, marginTop: 4}}>
              <Text style={styles.title}>Yesterday</Text>
            </View>
            <View style={styles.list}>
              <View style={styles.card}>
                <Ionicons
                  name="arrow-down-circle-sharp"
                  size={50}
                  color="#07FA93"
                />
                <View style={styles.Storage1}>
                  <View>
                    <Text style={styles.Storage2}>Received</Text>
                  </View>
                  <View>
                    <Text style={styles.Storage3}>March 05.2022</Text>
                  </View>
                </View>
              </View>
              <View style={styles.Storage11}>
                <View>
                  <Text style={styles.Storage22}>01.000Boo</Text>
                </View>
                <View>
                  <Text style={styles.Storage3}>TX_D: 40.000.000</Text>
                </View>
              </View>
            </View>
            <View style={styles.list}>
              <View style={styles.card}>
                <Ionicons name="arrow-up-circle-sharp" size={50} color="red" />
                <View style={styles.Storage1}>
                  <View>
                    <Text style={styles.Storage2}>Sent</Text>
                  </View>
                  <View>
                    <Text style={styles.Storage3}>March 05.2022</Text>
                  </View>
                </View>
              </View>
              <View style={styles.Storage11}>
                <View>
                  <Text style={styles.Storage222}>01.000Boo</Text>
                </View>
                <View>
                  <Text style={styles.Storage3}>TX_D: 40.000.000</Text>
                </View>
              </View>
            </View>

            <View style={{marginLeft: 10, marginTop: 4}}>
              <Text style={styles.title}>This Week</Text>
            </View>
            <View style={styles.list}>
              <View style={styles.card}>
                <Ionicons name="arrow-up-circle-sharp" size={50} color="red" />
                <View style={styles.Storage1}>
                  <View>
                    <Text style={styles.Storage2}>Sent</Text>
                  </View>
                  <View>
                    <Text style={styles.Storage3}>March 05.2022</Text>
                  </View>
                </View>
              </View>
              <View style={styles.Storage11}>
                <View>
                  <Text style={styles.Storage222}>01.000Boo</Text>
                </View>
                <View>
                  <Text style={styles.Storage3}>TX_D: 40.000.000</Text>
                </View>
              </View>
            </View> */}
          </View>
        </ScrollView>
      </DrawerLayoutAndroid>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginHorizontal: 0,
  },
  card: {
    height: 60,
    flexDirection: 'row',
  },
  secondScreenContainer: {
    flexDirection: 'row',
  },
  storageInfoContainer: {
    justifyContent: 'space-evenly',
    marginLeft: 20,
  },
  txtStorage: {
    fontSize: 20,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: 'bold',
    color: '#33a1f9',
  },
  container: {
    flex: 1,
    // backgroundColor: "#33a1f9",
    // alignItems: "center",
    color: '#33a1f9',
    justifyContent: 'center',
    height: '100%',
    // flexWrap: "wrap",
    // flexDirecton: "row",
  },

  containerImage: {
    backgroundColor: '#33a1f9',
    width: '100%',
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  createAccount: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'black',
    fontWeight: 'bold',
  },
  containerFolder: {
    flexDirection: 'row',
  },
  recentFilesContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 30,
  },

  row3: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 10,
  },

  row4: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 30,
  },

  list: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 25,
    borderRadius: 10,
    // width: '90%',
    height: 70,
    flexDirection: 'row',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  title: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
    justifyContent: 'space-evenly',
    textAlign: 'left',
    marginLeft: 5,
  },
  Storage: {
    flexDirection: 'row',
  },
  Storage1: {
    flexDirection: 'column',
    marginTop: 10,
    alignItems: 'flex-start',
  },
  Storage11: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  Storage2: {
    fontWeight: 'bold',
    color: 'grey',
  },
  Storage3: {
    fontSize: 10,
    color: 'grey',
  },
  Storage22: {
    fontWeight: 'bold',
    color: '#07FA93',
  },
  Storage222: {
    fontWeight: 'bold',
    color: 'red',
  },
  Drawercontainer: {
    flex: 1,
    alignItems: 'center',
    color: '#33a1f9',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
    color: 'black',
  },

  day: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    color: '#33a1f9',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 20,
  },
});
export default Transactions;
