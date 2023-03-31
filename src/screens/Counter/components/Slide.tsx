import React from "react";
import { View, Dimensions, StyleSheet, Image } from "react-native";

const { height, width } = Dimensions.get("window");
export const Slide = ({ des }) => {
  return (
    <View style={styles.container}>
      <Text>{des}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 45,
    flex: 1,
    width,
    alignItems: "center",
  },
});
