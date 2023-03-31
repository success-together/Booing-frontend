import React, { useEffect, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Image, Text, View, TouchableOpacity } from 'react-native'
import { StyleSheet} from "react-native";
import axios from "axios";
import { small_logo } from '../../../../images/export';
import { store, BaseUrl } from '../../../../shared';
import {updateProfilePic} from '../../../../shared/slices/Auth/AuthService';
import LinearGradient from 'react-native-linear-gradient';
import ManageApps from '../../../../utils/manageApps';
const AccountHeader = () => {

  const user_id = store.getState().authentication.user_id;
   const [loggedInUser, setLoggedUser] = useState<
     | {
         name: string;
         email: string;
         phone: string;
         avatar: string;
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
   const handleUpdateProfile = async () => {
    const images = await ManageApps.pickImages();
    if (images.length > 0) {
      console.log(user_id)
      const fileDesc = await ManageApps.getFileDescription(images[0])
      const body = new FormData();
      body.append('file', {
        uri: images[0],
        type: fileDesc.type,
        name: fileDesc.name,
      });
      const res = await updateProfilePic(body, loggedInUser?._id)
      console.log(res)
      setLoggedUser({...loggedInUser, avatar:res.thumbnail})
    }
   }
   useEffect(() => {
     try {
       getUserData();
     } catch (error) {
       console.log(error);
     }
   }, []);

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      colors={['#55A4F7', '#82BEFA']}
      style={styles.DashboardHeader}>  
        <View style={styles.logoView}>
          <Image style={styles.logo} source={small_logo} style={{width: 87, height: 30}}/>
        </View>
        <View style={styles.profileImage}>
          <View>
            
          </View>
          {loggedInUser?.avatar?
          <Image source={{uri:loggedInUser.avatar}} style={styles.avatar} />
          :<FontAwesome name="user-circle-o" size={70} color="white" />
          }
          <View style={{alignItems: 'flex-start', marginLeft: 15}}>
            <Text style={styles.title}>{loggedInUser?.name}</Text>
            <Text style={styles.text}>{loggedInUser?.email}</Text>
          </View>   
        </View>
        <TouchableOpacity onPress={handleUpdateProfile}>
          <Text style={[styles.text, {marginLeft: 28}]}>Edit</Text>
        </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({  
  DashboardHeader: {
    padding: 30,
    // justifyContent: "center",
    // alignItems: "center"
  },
  logoView: {
    // position: "absolute",
    // top: 30,
    // left: 35,
  },
  profileImage: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: "center",
    // minHeight: 100,
    marginTop: 30,
    // borderWidth: 1,
    // borderColor: 'red'
  },
  logo: {
    width: 87,
    height: 30,
  },
  title: {
    fontFamily: 'Rubik-Bold',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "white",
    marginTop: 5,
    textAlign: "center",
  },
  text: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "white",
    marginTop: 5,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
  }
});

export default AccountHeader
