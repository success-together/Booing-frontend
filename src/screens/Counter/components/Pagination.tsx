import React from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");

const DOT_SIZE = 15;

function Pagination ({ scrollX, slides }) {
  const inputRange = [0, width, width * 2];
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: [-DOT_SIZE, 0, DOT_SIZE],
  });
  return (
    <View style={[styles.pagination]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width,
        }}
      >
        <Animated.View
          style={[
            styles.paginationIndicator,
            {
              position: "absolute",
              transform: [{ translateX }],
            },
          ]}
        />
        {slides.map((item, index) => {
          return (
            <View key={index} style={styles.paginationDotContainer}>
              <View
                style={[
                  styles.paginationDot,
                  { backgroundColor: '#ffffff' },
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  pagination: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    height: DOT_SIZE,
    zIndex: 1000,
    alignItems: "center",
  },
  paginationDot: {
    width: DOT_SIZE * 0.5,
    height: DOT_SIZE * 0.5,
    borderRadius: DOT_SIZE * 0.3,
    borderColor: "#000",
  },
  paginationDotContainer: {
    width: DOT_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  paginationIndicator: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    borderColor: '#ffffff',
    left: width/2-DOT_SIZE*2
  },
});

export default Pagination;