import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Input } from "react-native-elements";
import { store } from "../../../../shared";
import { updateProfile } from "../../../../shared/slices/Auth/AuthService";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AccountHeader from "../AccountHeader/AcountHeader";

const UpdateProfile = ({ navigation }: any) => {
  const [loggedInUser, setLoggedUser] = useState<
    | {
      name: string;
      email: string;
      phone: string;
      accountVerified?: true;
      code?: 0;
      created_at?: string;
      last_login?: string;
      password?: string;
      __v?: number;
      _id?: string;
    }
    | undefined
  >(undefined);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [formUpdateUser, setFormUpdateUser] = useState<{
    name: string;
    phone: string;
  }>({ name: "", phone: "" });

  const getUserData = () => {
    setLoggedUser(store.getState().authentication.loggedInUser);
  };

  useEffect(() => {
    try {
      getUserData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onUpdateForm = (value: string, type: string) => {
    // console the key params
    setIsDisabled(false);
    if (type === "phone")
      setFormUpdateUser({ ...formUpdateUser, phone: value });
    else if (type === "name")
      setFormUpdateUser({ ...formUpdateUser, name: value });
  };

  const onSubmit = async () => {

    if (!isDisabled && loggedInUser?._id) {
      if (formUpdateUser.name !== "" && formUpdateUser.phone !== "")
        await updateProfile({ phone: formUpdateUser.phone, name: formUpdateUser.name, user_id: loggedInUser?._id }).then(() => {
          navigation.navigate('Account');
        });
      else if (formUpdateUser.name === "")
        await updateProfile({
          phone: formUpdateUser.phone,
          user_id: loggedInUser?._id,
        }).then(() => {
          navigation.navigate('Account');
        });
      else if (formUpdateUser.phone === "")
        await updateProfile({
          name: formUpdateUser.name,
          user_id: loggedInUser?._id,
        }).then(() => {
          navigation.navigate('Account');
        });
    }
  };

  return (
    <View style={styles.container} >
      <View style={styles.containerHeader}>
        <AccountHeader />
         {/* <AntDesign
        style={{alignSelf:'flex-end', marginRight:60}}
            onPress={() => navigation.goBack()}
            name="back"
            size={33}
            color="black"
          />  */}
      </View>
    
      <View style={styles.Body}>
        <Text style={styles.title}>Email</Text>
        <Input
          placeholder="Enter Email Adress"
          autoCompleteType={"email"}
          defaultValue={loggedInUser?.email}
          disabled={true}
        />
         <Text style={styles.title}>Username</Text>
        <Input
          placeholder="Enter User Name"
          autoCompleteType={"name"}
          defaultValue={loggedInUser?.name}
          onChangeText={(e) => onUpdateForm(e, "name")}
        />
         <Text style={styles.title}>Phone number</Text>
        <Input
          placeholder="Enter Phone Number"
          autoCompleteType={"phone"}
          defaultValue={loggedInUser?.phone}
          onChangeText={(e) => onUpdateForm(e, "phone")}
          keyboardType="numeric"
        />
        <Pressable
        style={isDisabled ? styles.disabled : styles.button}
        onPress={onSubmit}
      >
        <Text style={styles.text}>Update</Text>
      </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6F7",   
    width: "100%",
    // flexWrap: "wrap",
    // flexDirecton: "row",
  },
  containerHeader: {
    backgroundColor: "#33a1f9",
    width: "100%",
    flex: 0.6,
  },
  Body: {
    flex: 1,
    marginTop: 20,
    padding: 20
  },
  DashboardHeader: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#33a1f9",
  },
  logoView: {
    position: "absolute",
    top: 40,
    left: 40,
  },
  profileImage: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 35,
    height: 20,
  },
  title: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
    marginTop: 5,
    // marginLeft: 70,
    // marginRight: 70,

  },
  text: {
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: "bold",
    color: "#49ACFA",
    marginTop: 5,
    maxWidth: "100%",
  },
  button: {
    // flexDirection:  'row',
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    // paddingHorizontal: 140,
    marginRight: 10,
    marginLeft: 10,
    // borderRadius: 4,
    // elevation: 3,
    backgroundColor: "#33a1f9",
  },
  disabled: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    // paddingHorizontal: 140,
    borderRadius: 4,
    elevation: 4,
    backgroundColor: "white",
  },
});

export default UpdateProfile;
