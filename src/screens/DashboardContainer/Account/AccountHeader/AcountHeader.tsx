import React, { useEffect, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Image, Text, View } from 'react-native'
import { StyleSheet} from "react-native";
import { small_logo } from '../../../../images/export';
import { store } from '../../../../shared';

const AccountHeader = () => {

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

  return (
    <View style={styles.DashboardHeader}>
        <View style={styles.logoView}>
        <Image style={styles.logo} source={small_logo} />
        </View>
        <View style={styles.profileImage}>
        <FontAwesome name="user-circle-o" size={70} color="white" />
        <Text style={styles.title}>{loggedInUser?.name}</Text>
        <Text style={styles.text}>{loggedInUser?.email}</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({  
  DashboardHeader: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
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
    color: "white",
    marginTop: 5,
    // marginLeft: 70,
    // marginRight: 70,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "white",
    marginTop: 5,
  },
});

export default AccountHeader