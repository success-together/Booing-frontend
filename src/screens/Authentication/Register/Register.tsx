import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, Button } from "react-native";
import { Input } from "react-native-elements";
import { Logo } from "../../../images/export";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { register } from "../../../shared/slices/Auth/AuthService";
import { SocialMediaAuth } from "../../../Components/exports";
import { setRootLoading } from "../../../shared/slices/rootSlice";

function Register({ navigation }: { navigation: any }) {
  const [formRegister, setFormRegister] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const onSubmit = () => {
    setIsSubmit(true);
    console.log(formRegister);
    if (
      !isSubmit &&
      formRegister.email &&
      formRegister.name &&
      formRegister.password &&
      formRegister.phone
    ) {
      register(formRegister).then((res) => {
        setRootLoading(true);
        navigation.navigate("Verification", { user_id: res.data._id });
      });
    }
    setIsSubmit(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <Image style={styles.image} source={Logo} />
      </View>
      <View style={{ flex: 0.1 }} />
      <Input
        placeholder="Enter User Name"
        autoCompleteType={"name"}
        onChangeText={(e) => setFormRegister({ ...formRegister, name: e })}
      />
      <Input
        placeholder="Enter Email Adress"
        autoCompleteType={"email"}
        onChangeText={(e) => setFormRegister({ ...formRegister, email: e })}
      />
      <Input
        placeholder="Enter Phone Number"
        autoCompleteType={"phone"}
        onChangeText={(e) => setFormRegister({ ...formRegister, phone: e })}
      />
      <Input
        placeholder="Enter Password"
        autoCompleteType={"password"}
        secureTextEntry={true}
        onChangeText={(e) => setFormRegister({ ...formRegister, password: e })}
      />
      <Pressable
        disabled={isSubmit}
        style={styles.button}
        onPress={() => {
          onSubmit();
        }}
      >
        <Text style={styles.text}>Sign Up</Text>
      </Pressable>
      <Text
        style={styles.createAccount}
        onPress={() => navigation.navigate("Login")}
      >
        Login
      </Text>
      <SocialMediaAuth navigation = {navigation} />
    </View>
  );
}

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
    marginBottom: 10,
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

export default Register;
