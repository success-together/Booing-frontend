import React, {useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import * as Progress from 'react-native-progress';
import {Splash1, Splash2, Logo} from '../../images/export';

function Splash({navigation}: {navigation: any}) {
  const target = new Date("2023-04-25 00:00:00");
  const [date, setDate] = useState<object>({
    day: 0,
    hour: 0,
    minute: 0,
    second: 0
  })
  const [intervalIns, setIntervalIns] = useState(null)
  const handleInterval = () => {
    setIntervalIns(setInterval(() => {
      const delta = target - new Date();
      const update = {
        day: Math.trunc(delta/1000/60/60/24),
        hour: Math.trunc((delta/1000/60/60)%24),
        minute: Math.trunc((delta/1000/60)%60),
        second: Math.trunc((delta/1000)%60)
      }
      setDate(update);
    }, 1000));

  }
  const handlePress = () => {
    if (intervalIns) {
      clearInterval(intervalIns);
      setIntervalIns(null);
    }
    navigation.navigate('CounterDown')
  }
  useEffect(() => {
    handleInterval();
  }, [])
  useEffect(() => {
    console.log(date);
  }, [date])
  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Image style={styles.image} source={Splash2} />
      <Image style={styles.logo} source={Logo} />
      <Progress.Circle 
        progress={date.day/31} 
        size={70} 
        showsText={true} 
        color="#6DBDFE" 
        borderWidth={0} 
        unfilledColor="#ffffff"
        textStyle={{ fontFamily: 'Rubik-Bold', fontSize: 24}}
        formatText={(progress)=>{
          return date.day
        }}
        thickness={8}
      />
      <Text style={styles.normaltext}>Days</Text>
      <Progress.Circle 
        progress={date.hour/24} 
        size={70} 
        showsText={true} 
        color="#6DBDFE" 
        borderWidth={0} 
        unfilledColor="#ffffff"
        textStyle={{    fontFamily: 'Rubik-Bold', fontSize: 24}}
        formatText={(progress)=>{
          return date.hour
        }}
        thickness={8}
      />
      <Text style={styles.normaltext}>Hours</Text>
      <Progress.Circle 
        progress={date.minute/60} 
        size={70} 
        showsText={true} 
        color="#6DBDFE" 
        borderWidth={0} 
        unfilledColor="#ffffff"
        textStyle={{    fontFamily: 'Rubik-Bold', fontSize: 24}}
        formatText={(progress)=>{
          return date.minute
        }}
        thickness={8}
      />
      <Text style={styles.normaltext}>Minutes</Text>
      <Progress.Circle 
        progress={date.second/60} 
        size={70} 
        showsText={true} 
        color="#6DBDFE" 
        borderWidth={0} 
        unfilledColor="#ffffff"
        textStyle={{    fontFamily: 'Rubik-Bold', fontSize: 24}}
        formatText={(progress)=>{
          return date.second
        }}
        thickness={8}
      />
      <Text style={styles.normaltext}>Seconds</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    let: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    resizeMode: "cover"
  },
  logo: {
    // alignItems: 'center',
    // justifyContent: 'center'
    marginBottom: 40
  },
  normaltext: {
    color: '#6DBDFE',
    paddingVertical: 10,
    fontFamily: 'Rubik-Regular', 
    fontSize: 18
  }
});

export default Splash;
