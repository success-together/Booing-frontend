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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getWallet} from '../../../shared/slices/wallet/walletService';
import {store} from '../../../shared';
import {useIsFocused} from '@react-navigation/native';
import {Wallet} from '../../../models/Wallet';
import NoDataFound from '../../../Components/NoDataFound/NoDataFound';

const Transactions = ({navigation}: any) => {
  const [isClicked, SetIsClicked] = useState<boolean>(false);
  const [viewTransaction, setViewTransaction] = useState(null);
  let drawer = useRef<DrawerLayoutAndroid>(null);
  const [drawerPosition, setDrawerPosition] = useState<'left' | 'right'>(
    'left',
  );
  const [wallet, setWallet] = useState<Wallet>();
  
  const user_id = store.getState().authentication.userId;
  const isFocused = useIsFocused();

  const getTransactions = async () => {
    if (user_id) {
      return await getWallet({user_id: user_id})
        .then(res => {
          if (res.success) setWallet(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  const coinWithComma = (coin) => {
    return coin.toLocaleString("en-US");
  }
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
  const Transaction = ({transaction}) => {
    const data = Object.assign({}, transaction);
    if (data.status===0) { //pending
      data.icon = <MaterialIcons
                name="pending"
                size={30}
                color="#07FA93"
              />;
      data.title = 'Pending';
      data.color = '#07FA93';
    } else if (data.status===1) { //sell
      data.icon = <MaterialIcons
                name="attach-money"
                size={30}
                color="#07FA93"
              />;
      data.title = 'Sell Space';
      data.color = '#07FA93'
    } else if (data.status===2) { //gift
      data.icon = <Ionicons
                name="gift"
                size={30}
                color="#F06060"
              />;
      data.title = 'Gift';
      data.color = '#F06060'
    } else if (data.status===3) { //receive
      data.icon = <Ionicons
                name="arrow-down-circle-sharp"
                size={30}
                color="#07FA93"
              />;
      data.title = 'Receive';
      data.color = '#07FA93'
    } else if (data.status===4) { //buy
      data.icon = <FontAwesome5
                name="shopping-basket"
                size={30}
                color="#07FA93"
              />;
      data.title = 'Buy Space';
      data.color = '#07FA93'
    } else if (data.status===5) { //send
      data.icon = <Ionicons
                name="arrow-up-circle-sharp"
                size={30}
                color="#07FA93"
              />;
      data.title = 'Send';
      data.color = '#07FA93'
    } else {

    }
   return <Pressable onPress={() => setViewTransaction(data)}><View style={styles.list}>
      <View style={[styles.card, {textAlign: 'center', alignItems: 'center'}]}>
        {data.icon}
        <View style={styles.Storage1, {marginLeft: 15}}>
          <View>
            <Text style={styles.Storage2}>{data.title}</Text>
          </View>
          <View>
            <Text style={styles.Storage3}>
              {data?.date}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.Storage11}>
        <View>
          <Text style={{fontWeight: 'bold', color:data.color}}>
            {coinWithComma(data.amount)}
          </Text>
        </View>
      </View>
    </View>
  </Pressable>
  }
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
            {viewTransaction ? (
              <View style={{backgroundColor: 'white', margin: 10, padding: 20}}>
                <View style={{flexDirection: "row", marginTop: 4, alignItems: 'center', marginBottom: 10}}>
                  <Text style={[{width: "25%", textAlign:'right', paddingRight: 5}]}>{viewTransaction.icon}</Text>
                  <Text style={[styles.normaltext, styles.textRight, {textAlign: 'center', fontSize: 20}]}>{viewTransaction.title}</Text>
                </View>
                <View style={{flexDirection: "row", marginTop: 4}}>
                  <Text style={[styles.normaltext, styles.textLeft]}>Amount: </Text>
                  <Text style={styles.normaltext, styles.textRight}> € {coinWithComma(viewTransaction.amount)}</Text>
                </View>
                {viewTransaction.status !== 0 && 
                  <>
                    <View style={{flexDirection: "row", marginTop: 4}}>
                      <Text style={[styles.normaltext, styles.textLeft]}>Before: </Text>
                      <Text style={styles.normaltext, styles.textRight}> € {coinWithComma(viewTransaction.before)}</Text>
                    </View>
                    <View style={{flexDirection: "row", marginTop: 4}}>
                      <Text style={[styles.normaltext, styles.textLeft]}>After: </Text>
                      <Text style={styles.normaltext, styles.textRight}> € {coinWithComma(viewTransaction.after)}</Text>
                    </View>
                  </>
                }
                <View style={{flexDirection: "row", marginTop: 4}}>
                  <Text style={[styles.normaltext, styles.textLeft]}>Date: </Text>
                  <Text style={styles.normaltext, styles.textRight}>{viewTransaction.date}</Text>
                </View>
                <View style={{flexDirection: "row", marginTop: 4}}>
                  <Text style={[styles.normaltext, styles.textLeft]}>Info: </Text>
                  <Text style={styles.normaltext, styles.textRight}>{viewTransaction.info}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <Pressable style={styles.button} onPress={() => setViewTransaction(null)}>
                    <Text style={styles.whitetext}>
                      return
                    </Text>
                  </Pressable>
                </View>
              </View>
            ): (
              wallet && wallet.transactions.length > 0 ? (
                wallet?.transactions.map((transaction, ind )=> {
                  return (
                    <Transaction key={ind} transaction={transaction} />
                  );
                })
              ) : (
                <NoDataFound />
              )
            )}
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
    color: '#33a1f9',
    justifyContent: 'center',
    height: '100%',
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
  whitetext: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  } ,
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: 20,
    width: 100,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#33a1f9',
  },  
  normaltext: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#797D7F',
  }, 
  textRight: {
    width: "70%", 
    textAlign: 'right'
  },
  textLeft: {
    width: "25%", 
    textAlign: 'right',
    paddingRight: 5 
  },
});
export default Transactions;