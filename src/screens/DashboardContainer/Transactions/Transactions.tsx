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
  Image,
  TextInput,
  TouchableOpacity,
  Button
} from 'react-native';
import TransactionsHeader from './TransactionHeader/TransactionHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getWallet} from '../../../shared/slices/wallet/walletService';
import {store} from '../../../shared';
import {setRootLoading} from '../../../shared/slices/rootSlice';
import {useIsFocused} from '@react-navigation/native';
import {Wallet} from '../../../models/Wallet';
import NoDataFound from '../../../Components/NoDataFound/NoDataFound';
import { eye } from '../../../images/export';
import DatePicker from 'react-native-date-picker'
// import {testData} from './data';

const isToday = (date: Date) => {
  const today = new Date();
  return (
    today.setUTCHours(0, 0, 0, 0) <= date.getTime() &&
    date.getTime() <= today.setUTCHours(23, 59, 59, 999)
  );
};

const isYesterday = (date: Date) => {
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  return (
    yesterday.setUTCHours(0, 0, 0, 0) <= date.getTime() &&
    date.getTime() <= yesterday.setUTCHours(23, 59, 59, 999)
  );
};

const groupByDateUploaded = (data: {date: date}[]) => {

  return data.reduceRight(
    (acc: {label: string; items: typeof data}[], elem: typeof data['0']) => {
      if (!elem.date) {
        return acc;
      }

      const itemUploadDate = new Date(elem.date);
      if (isToday(itemUploadDate)) {
        const exist = acc.find(e => e.label === 'Today');
        if (exist) {
          exist.items.push(elem);
        } else {
          acc.push({label: 'Today', items: [elem]});
          return acc;
        }
      } else if (isYesterday(itemUploadDate)) {
        const exist = acc.find(e => e.label === 'Yesterday');
        if (exist) {
          exist.items.push(elem);
        } else {
          acc.push({label: 'Yesterday', items: [elem]});
          return acc;
        }
      } else {
        const dateString = itemUploadDate.toDateString();
        const exist = acc.find(e => e.label === dateString);
        if (exist) {
          exist.items.push(elem);
        } else {
          acc.push({label: dateString, items: [elem]});
          return acc;
        }
      }

      return acc;
    },
    [],
  );
};


const Transactions = ({navigation}: any) => {
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [viewTransaction, setViewTransaction] = useState(null);
  let drawer = useRef<DrawerLayoutAndroid>(null);
  const [drawerPosition, setDrawerPosition] = useState<'left' | 'right'>(
    'left',
  );
  const [wallet, setWallet] = useState<array>([]);
  const [filterData, setFilterData] = useState<array>([]);
  const [filterCond, setFilterCond] = useState<object>({
    period : '',
    amount: '',
    from: '',
    to: ''
  });
  const [datePicker, setDatePicker] = useState({from: false, to: false})
  const user_id = store.getState().authentication.userId;
  const isFocused = useIsFocused();

  const getTransactions = async () => {
    if (user_id) {
      store.dispatch(setRootLoading(true));
      await getWallet({user_id: user_id})
        .then(async res => {
          if (res.success) {
            console.log(res.data.transactions)
            const transactionsData = await groupByDateUploaded(res.data.transactions);
            setWallet(transactionsData);
            setFilterData(transactionsData);
          }
        })
        .catch(err => {
          console.log(err);
        });
      store.dispatch(setRootLoading(false));
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
          setIsFilter(false);
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
          setIsFilter(false);
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
          setIsFilter(false);
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
          setIsFilter(false);
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
          setIsFilter(false);
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
      data.icon = <View style={{backgroundColor: '#07FA93', padding: 5, borderRadius: 30}}><MaterialIcons
                name="pending"
                size={20}
                color="#ffffff"
              /></View>;
      data.title = 'Pending';
      data.color = '#07FA93';
    } else if (data.status===1) { //sell
      data.icon = <View style={{backgroundColor: '#4CE364', padding: 5, borderRadius: 30}}><MaterialCommunityIcons
                name="arrow-expand-up"
                size={20}
                color="#ffffff"
              /></View>;
      data.title = 'Sell Space';
      data.color = '#07FA93'
    } else if (data.status===2) { //gift
      data.icon = <View style={{backgroundColor: '#F06060', padding: 5, borderRadius: 30}}><Ionicons
                name="gift"
                size={20}
                color="#ffffff"
              /></View>;
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
      data.icon = <View style={{backgroundColor: '#E06F60', padding: 5, borderRadius: 30}}><MaterialCommunityIcons
                name="arrow-expand-down"
                size={20}
                color="#FFFFFF"
              /></View>;
      data.title = 'Buy Space';
      data.color = '#F06060'
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
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontFamily: 'Rubik-Bold', color:data.color, marginRight: 3}}>
            {coinWithComma(data.amount)}  
          </Text> 
          <Image source={eye}/>
        </View>
      </View>
    </View>
  </Pressable>
  }

  const handleFilter = (cond, isPeriod, isRange=false) => {
    let cond1,cond2 = '';
    let from=0, to = 0;
    if (isRange) {
      cond1 = '';
      cond2 = filterCond.amount;
      from = filterCond.from?filterCond.from:0;
      to = filterCond.to?filterCond.to:0;
    } else {
      cond1 = isPeriod?cond:filterCond.period;
      cond2 = !isPeriod?cond:filterCond.amount;
      if (!isPeriod && cond1 === '') {
        from = filterCond.from?filterCond.from:0;
        to = filterCond.to?filterCond.to:0;
      }
      if (isPeriod && cond === filterCond.period) cond1 = '';
      if (!isPeriod && cond === filterCond.amount) cond2 = '';
    }
    if (!isRange && cond1 === '' && cond2 === '') {
      setFilterData(wallet)
    } else {
      if (cond1 === 'week') {
        from = new Date(new Date().setDate(new Date().getDate() - 7));
      } else if (cond1 === '1month') {
        from = new Date(new Date().setMonth(new Date().getMonth() - 1));
      } else if (cond1 === '3month') {
        from = new Date(new Date().setMonth(new Date().getMonth() - 3));
      } else {
        from = new Date(from);
      }
      to = to===0?new Date():new Date(to);
      from.setUTCHours(0, 0, 0, 0);
      to.setUTCHours(23, 59, 59, 999);
      console.log(from, to)
      const newdata = [];
      wallet.map((obj) => {
        const newItems = [];
        const date = new Date(obj.items[0].date);
        obj.items.map((item) => {
          if (date >= from && date <= to) {
            if ((cond2 === 'entry' && item.status === 1) || 
              (cond2 === 'exit' && item.status === 4) || 
              cond2 === ''
            ) {
              newItems.push(item);
            }
          }
        })
        if (newItems.length > 0) {
          newdata.push({label: obj.label, items: newItems});
        }
      })
      setFilterData(newdata)
    }
    if (!isRange && isPeriod) {
      setFilterCond({period: cond1, amount: cond2, from: '', to: ''});
    } else {
      setFilterCond({period: cond1, amount: cond2, from: filterCond.from, to: filterCond.to});
    }
  }
  const handleSearch = (val) => {
    const searchVal = val.toLowerCase(val)
    console.log(searchVal)
    if (isFilter) {
      setIsFilter(false);
    }
    if (val === '') {
      setFilterData(wallet);
    } else {
      const newdata = [];
      wallet.map((obj) => {
        const newItems = [];
        obj.items.map((item) => {
          const status = item.status===4?"buy space":(item.status===1?"sell space":"gift");
          console.log(item.date, status)
          if (status.indexOf(searchVal) !== -1 || item.date.indexOf(searchVal) !== -1) {
            newItems.push(item);
          }
        })
        if (newItems.length > 0) {
          newdata.push({label: obj.label, items: newItems});
        }
      })
      setFilterData(newdata);
    }
  }
  const handleIsFilter = () => {
    setIsFilter(!isFilter);
  }
  const formatDate = (val) => {
    const date = new Date(val);
    return date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + " " + ("0" + date.getHours()%12).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + (date.getHours()/12>=1?' Am':' Pm')
  }
  return (
    <View style={styles.container}>
      <>
      {/*{isFilter && drawer.current?.openDrawer()}*/}
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300}
        drawerPosition={drawerPosition}
        renderNavigationView={navigationView}
        onDrawerClose={() => {
          setIsFilter(false);
        }}>
        <View style={styles.containerImage}>
          <TransactionsHeader
            handleIsFilter={handleIsFilter}
            navigation={navigation}
            handleSearch = {handleSearch}
            isFilter = {isFilter}
          />
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={{padding: 4, marginTop: 10}}>
            {!!isFilter && (
              <>
                <Text style={{fontFamily: 'Rubik-Bold', fontSize: 15, marginTop: 10, marginLeft: 10}}>PERIOD</Text>
                <View style={styles.filterView}>
                  <TouchableOpacity style={[styles.filterBtn, styles.leftRadius, filterCond.period==='week'?styles.active:{}]} onPress={() => handleFilter('week', true)}>
                    <Text style={[styles.filterBtnText, filterCond.period==='week'?styles.colorWhite:{}]}>
                      Last 7 days
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.filterBtn, filterCond.period==='1month'?styles.active:{}]} onPress={() => handleFilter('1month', true)}>
                    <Text style={[styles.filterBtnText, filterCond.period==='1month'?styles.colorWhite:{}]}>
                      Last 1 Month
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.filterBtn, styles.rightRadius, filterCond.period==='3month'?styles.active:{}]} onPress={() => handleFilter('3month', true)}>
                    <Text style={[styles.filterBtnText, filterCond.period==='3month'?styles.colorWhite:{}]}>
                      Last 3 Months
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.filterView}>
                  <Text style={{color: 'black'}}>From : </Text>
                  <Pressable  onPress={() => setDatePicker({to: false, from: true})} style={styles.datePickerBtn} >
                    <Text style={{fontFamily: 'Rubik-Regular'}}>{filterCond.from?(new Date(filterCond.from).toISOString().slice(0,10)):''}</Text>
                  </Pressable>
                  <Text style={{color: 'black'}}>To : </Text>
                  <Pressable onPress={() => setDatePicker({to: true, from: false})} style={styles.datePickerBtn} >
                    <Text style={{fontFamily: 'Rubik-Regular'}}>{filterCond.to?(new Date(filterCond.to).toISOString().slice(0,10)):''}</Text>
                  </Pressable>
                  <DatePicker
                    modal
                    open={datePicker.from}
                    date={filterCond.from?filterCond.from:new Date()}
                    maximumDate={filterCond.to?filterCond.to:new Date()}
                    onConfirm={(date) => {
                      setDatePicker({to: false, from: false})
                      setFilterCond({...filterCond, from: date})
                    }}
                    onCancel={() => {
                      setDatePicker({to: false, from: false})
                    }}
                  />
                  <DatePicker
                    modal
                    open={datePicker.to}
                    date={filterCond.to?filterCond.to:new Date()}
                    minimumDate={filterCond.from?filterCond.from:new Date()}
                    onConfirm={(date) => {
                      setDatePicker({to: false, from: false})
                      setFilterCond({...filterCond, to: date})
                    }}
                    onCancel={() => {
                      setDatePicker({to: false, from: false})
                    }}
                  />
                  <TouchableOpacity style={[styles.filterBtn, styles.fullRadius]} onPress={() => handleFilter('',true,true)}>
                    <Text style={[styles.filterBtnText]}>
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>                
                <Text style={{fontFamily: 'Rubik-Bold', fontSize: 15, marginTop: 10, marginLeft: 10}}>AMOUNT</Text>
                <View style={styles.filterView}>
                  <TouchableOpacity style={[styles.filterBtn, styles.leftRadius, filterCond.amount==='entry'?styles.active:{borderRightWidth: 1}]} onPress={() => handleFilter('entry', false)}>
                    <Text style={[styles.filterBtnText, filterCond.amount==='entry'?styles.colorWhite:{}]}>
                      ENTRY
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.filterBtn, styles.rightRadius, filterCond.amount==='exit'?styles.active:{}]} onPress={() => handleFilter('exit', false)}>
                    <Text style={[styles.filterBtnText, filterCond.amount==='exit'?styles.colorWhite:{}]}>
                      EXIT
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {viewTransaction ? (
              <View style={{backgroundColor: 'white', margin: 10, padding: 20}}>
                <View style={{flexDirection: "row", marginTop: 4, alignItems: 'center', marginBottom: 10}}>
                  <Text style={[{width: "25%", textAlign:'right', paddingRight: 5}]}>{viewTransaction.icon}</Text>
                  <Text style={[styles.normaltext, styles.textRight, {textAlign: 'center', fontFamily: 'Rubik-Regular', fontSize: 20}]}>{viewTransaction.title}</Text>
                </View>
                <View style={{flexDirection: "row", marginTop: 4}}>
                  <Text style={[styles.normaltext, styles.textLeft]}>Amount: </Text>
                  <Text style={styles.normaltext, styles.textRight}> {coinWithComma(viewTransaction.amount)} BOO</Text>
                </View>
                {(viewTransaction.status !== 0 && viewTransaction.status !== 4) && 
                  <>
                    <View style={{flexDirection: "row", marginTop: 4}}>
                      <Text style={[styles.normaltext, styles.textLeft]}>Before: </Text>
                      <Text style={styles.normaltext, styles.textRight}> {coinWithComma(viewTransaction.before)} BOO</Text>
                    </View>
                    <View style={{flexDirection: "row", marginTop: 4}}>
                      <Text style={[styles.normaltext, styles.textLeft]}>After: </Text>
                      <Text style={styles.normaltext, styles.textRight}> {coinWithComma(viewTransaction.after)} BOO</Text>
                    </View>
                  </>
                }
                <View style={{flexDirection: "row", marginTop: 4}}>
                  <Text style={[styles.normaltext, styles.textLeft]}>Date: </Text>
                  <Text style={styles.normaltext, styles.textRight}>{formatDate(viewTransaction.date)}</Text>
                </View>
                <View style={{flexDirection: "row", marginTop: 4}}>
                  <Text style={[styles.normaltext, styles.textLeft]}>Info: </Text>
                  <Text style={styles.normaltext, styles.textRight}>{viewTransaction.info}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <Pressable style={styles.button} onPress={() => setViewTransaction(null)}>
                    <Text style={styles.whitetext}>
                      RETURN
                    </Text>
                  </Pressable>
                </View>
              </View>
            ): (
              filterData && filterData.length > 0 ? (
                filterData?.map((transactionArr, ind )=> {
                  return (
                    <View key={ind+'group'}>
                      <Text style={{fontFamily: 'Rubik-Bold', fontSize: 15, marginTop: 10, marginLeft: 10}}>{transactionArr.label}</Text>
                      {transactionArr.items.map((item, index) => {
                        return <Transaction key={index} transaction={item} />
                      })}
                    </View>
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
    fontFamily: 'Rubik-Bold',
    fontSize: 20,
    lineHeight: 21,
    letterSpacing: 0.25,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontFamily: 'Rubik-Bold',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'black',
  },
  createAccount: {
    fontFamily: 'Rubik-Bold', 
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'black',
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
    fontFamily: 'Rubik-Regular',
    fontSize: 18,
    height: 44,
  },
  title: {
    fontFamily: 'Rubik-Bold',
    fontSize: 16,
    lineHeight: 21,
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
    color: 'grey',
    fontFamily: 'Rubik-Bold', 
  },
  Storage3: {
    fontFamily: 'Rubik-Regular', 
    fontSize: 10,
    color: 'grey',
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
    fontFamily: 'Rubik-Regular',
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
    fontFamily: 'Rubik-Bold', 
    fontSize: 14,
    lineHeight: 21,
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
    fontFamily: 'Rubik-Bold',
    fontSize: 14,
    lineHeight: 21,
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
  filterView: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterBtn: {
    width: '30%',
    padding: 8,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#D9D9D9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',    
  },
  filterBtnText: {
    color: '#49ACFA', 
    fontFamily: 'Rubik-Regular', 
    fontSize: 12
  },
  leftRadius: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderRightWidth: 0
  },
  rightRadius: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderLeftWidth: 0
  },
  fullRadius: {
    borderRadius: 20,
    marginLeft: 10
  },
  active: {
    backgroundColor: '#49ACFA',
    borderColor: '#49ACFA'
  },
  colorWhite: {
    color: 'white'
  },
  filterDate: {
    width: '30%',
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Rubik-Bold',
    fontSize: 10,
    padding: 0,
    borderWidth: 0,
    borderColor: '#CDD0D1',
  },
  datePickerBtn: {
    width: '25%',
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
    alignItems: 'center'
  }
});
export default Transactions;