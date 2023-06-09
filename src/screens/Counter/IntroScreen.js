import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";
//Slides
import { Slide, SubSlide, Ticker, Pagination } from "./components";
import slides from "./IntroDB";

const { height, width } = Dimensions.get("window");

export const IntroScreen = () => {
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

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slider, { backgroundColor }]}>
        <Ticker scrollX={scrollX} />
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
            return <Slide key={slide.id} des={slide.des} />;
          })}
        </Animated.ScrollView>
      </Animated.View>
      <View style={styles.footer}>
        <Pagination slides={slides} scrollX={scrollX} />
        <Animated.View
          style={[StyleSheet.absoluteFillObject, { backgroundColor }]}
        ></Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  slider: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    height: 0.61 * height,
    borderBottomEndRadius: 75,
  },
  footer: {
    flex: 1,
  },
  footerContent: {
    flex: 1,
    borderTopLeftRadius: 75,
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
});
