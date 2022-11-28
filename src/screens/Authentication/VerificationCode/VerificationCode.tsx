import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Input } from "react-native-elements";
import { Logo } from "../../../images/export";
import { mailVerification } from "../../../shared/slices/Auth/AuthService";
import { setRootLoading } from "../../../shared/slices/rootSlice";

function VerificationCode({ route, navigation }: { route: any;navigation: any }) {
  
  const [code , setCode] = useState<number>(0);
  const [userId , setUserId] = useState<any>(null);
  
  const submit = async () => {
    if (code > 999 && userId) {
      // setRootLoading(true);
      await mailVerification({ user_id: userId, code: code, isSignup: true }).then((res) => {
        navigation.navigate("Login");
      });
    }
  }
  
  
  
  useEffect(() => {
    const { user_id }  = route.params;
    setUserId(user_id);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <Image style={styles.image} source={Logo} />
      </View>
      <View style={{ flex: 0.4 }} />
      <Text style={styles.createAccount}>A mail was send to your adress</Text>
      <Input
        placeholder="Enter verification code"
        autoCompleteType={"password"}
        keyboardType="numeric"
        maxLength={4}
        onChangeText={(e) => setCode(Number(e))}
      />
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.text}>Verify</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    // backgroundColor: "#33a1f9",
    alignItems: "center",
    color: "#33a1f9",
    justifyContent: "center",
    height: "100%",
    // flexWrap: "wrap",
    // flexDirecton: "row",
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
  button: {
    marginTop:40,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 140,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#33a1f9",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  createAccount: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    marginBottom: 50,
  },
  containerSocialMedia: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
  },
});

export default VerificationCode;
