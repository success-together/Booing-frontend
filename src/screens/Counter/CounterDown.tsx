import React, {useEffect, useState, useRef} from 'react';
import {Image, StyleSheet, Text, View, Dimensions, Animated} from 'react-native';
import * as Progress from 'react-native-progress';
import {Splash1, Splash2, Logo} from '../../images/export';
import Slide from "./components/Slide";
import Pagination from "./components/Pagination";
import slides from "./introDB";

function CounterDown({navigation}: {navigation: any}) {
  const target = new Date("2023-04-25 00:00:00");
  const [date, setDate] = useState<object>({
    day: 0,
    hour: 0,
    minute: 0,
    second: 0
  })
  const [intervalIns, setIntervalIns] = useState(null)
 
  const { height, width } = Dimensions.get("window");
  const [loading, setLoading] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollClick = useRef(null);
  const unmounted = useRef(false);
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);
  const backgroundColor = scrollX.interpolate({
    inputRange: [0, width, width * 2],
    outputRange: ["#BFEAF5", "#BEECC4", "#FFE4D9"],
    extrapolate: "clamp",
  });
  const textTranslate = scrollX.interpolate({
    inputRange: [0, width, width * 2],
    outputRange: [0, width * -1, width * -2],
    extrapolate: "clamp",
  });

  const EnterApp = async () => {
  console.log('EnterApp')
  };

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
    navigation.navigate('Home')
  }
  useEffect(() => {
    handleInterval();
  }, [])
  useEffect(() => {
    console.log(date);
  }, [date])
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={Splash1} />
      <Image style={styles.logo} source={Logo} />
      <View style={{ height: '50%', position: 'relative'}}>
        <Animated.View style={[styles.slider]}>
          {/*<Ticker scrollX={scrollX} />*/}
          <Animated.ScrollView
            ref={scrollClick}
            horizontal
            snapToInterval={width}
            scrollTo={{ x: scrollClick, animated: true }}
            decelerationRate='fast'
            showsHorizontalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false } //
            )}
          >
            {slides.map((slide) => {
              return <View style={{
                flex: 1,
                width,
                alignItems: "center",
                paddingHorizontal: 50,
                justifyContent: 'center',
                marginBottom: 50,
                marginTop: 20,
              }} key={slide.id}>
                <View style={{
                  backgroundColor: 'rgba(255,255,255,0.54)',
                  paddingVertical: 50,
                  paddingHorizontal: 40,
                  borderRadius: 50
                }}>
                  <Text style={styles.slideText}><Text style={styles.boldtext}>Booing, </Text>{slide.des}</Text>
                </View>
              </View>;
            })}
          </Animated.ScrollView>
        </Animated.View>
        <Pagination slides={slides} scrollX={scrollX} />
      </View>
      <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30}}>
        <View style={{alignItems: 'center'}}>
          <Progress.Circle 
            progress={date.day/31} 
            size={50} 
            showsText={true} 
            color="#6DBDFE" 
            borderWidth={0} 
            unfilledColor="#ffffff"
            textStyle={{fontFamily: 'Rubik-Bold', fontSize: 18}}
            formatText={(progress)=>{
              return date.day
            }}
            thickness={5}
          />
          <Text style={styles.normaltext}>Days</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Progress.Circle 
            progress={date.hour/24} 
            size={50} 
            showsText={true} 
            color="#6DBDFE" 
            borderWidth={0} 
            unfilledColor="#ffffff"
            textStyle={{fontFamily: 'Rubik-Bold', fontSize: 18}}
            formatText={(progress)=>{
              return date.hour
            }}
            thickness={5}
          />
          <Text style={styles.normaltext}>Hours</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Progress.Circle 
            progress={date.minute/60} 
            size={50} 
            showsText={true} 
            color="#6DBDFE" 
            borderWidth={0} 
            unfilledColor="#ffffff"
            textStyle={{fontFamily: 'Rubik-Bold', fontSize: 18}}
            formatText={(progress)=>{
              return date.minute
            }}
            thickness={5}
          />
          <Text style={styles.normaltext}>Minutes</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Progress.Circle 
            progress={date.second/60} 
            size={50} 
            showsText={true} 
            color="#6DBDFE" 
            borderWidth={0} 
            unfilledColor="#ffffff"
            textStyle={{fontFamily: 'Rubik-Bold', fontSize: 18}}
            formatText={(progress)=>{
              return date.second
            }}
            thickness={5}
          />
          <Text style={styles.normaltext}>Seconds</Text>
        </View>                
        
      </View>
    </View>
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
    // marginBottom: 40
  },
  normaltext: {
    color: '#6DBDFE',
    paddingVertical: 10,
    fontFamily: 'Rubik-Regular',
    fontSize: 15
  },
  slideText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 1,
    color:  '#6DBDFE'
  },
  boldtext: {
    fontFamily: 'Rubik-Bold'
  },
  slider: {
    // justifyContent: 'center',
    // alignItems: 'center'
  }
});

export default CounterDown;
