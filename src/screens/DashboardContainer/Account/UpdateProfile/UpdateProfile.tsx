import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, Image, Pressable, BackHandler, ScrollView } from "react-native";
import { Input } from "react-native-elements";
import { store } from "../../../../shared";
import { updateProfile } from "../../../../shared/slices/Auth/AuthService";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AccountHeader from "../AccountHeader/AcountHeader";
import DatePicker from 'react-native-date-picker'

const UpdateProfile = ({ navigation }: any) => {
  const [loggedInUser, setLoggedUser] = useState<
    | {
      name: string;
      email: string;
      phone: string;
      birth?: string;
      address?: string;
      _id?: string;
    }
    | undefined
  >(undefined);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [onDatePicker, setOnDatePicker] = useState<boolean>(false);
  const [formUpdateUser, setFormUpdateUser] = useState<{
    name: string;
    phone: string;
    address: string;
    birth: string;
  }>({ name: "", phone: "", address: "", birth: "" });
  useEffect(() => {
    const backAction = (e) => {
      console.log('backAction')
      navigation.navigate("Account");
      return true
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);  
  const getUserData = () => {
    setLoggedUser(store.getState().authentication.loggedInUser);
  };
  useEffect(() => {
    setFormUpdateUser({name: loggedInUser?.name, phone: loggedInUser?.phone, birth: loggedInUser?.birth, address: loggedInUser?.address, user_id: loggedInUser?._id, })
  }, [loggedInUser])
  useEffect(() => {
    try {
      getUserData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onUpdateForm = (value: string, type: string) => {
    setIsDisabled(false);
    setFormUpdateUser({ ...formUpdateUser, [type]: value });
  };

  const onSubmit = async () => {

    if (!isDisabled && loggedInUser?._id) {
      const data = {
        name: formUpdateUser.name || '',
        phone: formUpdateUser.phone || '',
        address: formUpdateUser.address || '',
        birth: formUpdateUser.birth || '',
      }
      await updateProfile(formUpdateUser).then(() => {
        navigation.navigate('Account');
      });

    }
  };

  const formatChange = (val) => {
    const date =  new Date(val);
    return (date.getDate() + " - " + ('0' + (date.getMonth() + 1)).slice(-2) + " - " + date.getFullYear());
  }

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
      <ScrollView style={{
        flex: 1,
        marginHorizontal: 0,
        backgroundColor: 'white'
      }}>
      <View style={styles.Body}>
        <View style={{padding: 20, paddingBottom: 0}}>
          <Text style={styles.title}>Email</Text>
         
          <TextInput
            placeholder="Email"
            autoComplete={'email'}
            defaultValue={loggedInUser?.email}
            disabled={true}
            style={{
              fontFamily: 'Rubik-Regular',
              color: '#402B51',
              backgroundColor: '#F8F8F8',
              borderRadius: 8,
              marginBottom: '5.18%',
              marginTop: 4,
              paddingLeft: 20
            }}
            placeholderTextColor="#black"
          />        
           <Text style={styles.title}>Username</Text>
          <TextInput
            placeholder="Enter User Name"
            autoCompleteType={"name"}
            defaultValue={formUpdateUser?.name}
            onChangeText={(e) => onUpdateForm(e, "name")}
            style={{
              fontFamily: 'Rubik-Regular',
              color: '#402B51',
              backgroundColor: '#F8F8F8',
              borderRadius: 8,
              marginBottom: '5.18%',
              marginTop: 4,
              paddingLeft: 20
            }}
            placeholderTextColor="#black"          
          />
          <Text style={styles.title}>Phone number</Text>
          <TextInput
            placeholder="Enter Phone Number"
            autoCompleteType={"phone"}
            defaultValue={formUpdateUser?.phone}
            onChangeText={(e) => onUpdateForm(e, "phone")}
            keyboardType="numeric"
            style={{
              fontFamily: 'Rubik-Regular',
              color: '#402B51',
              backgroundColor: '#F8F8F8',
              borderRadius: 8,
              marginBottom: '5.18%',
              marginTop: 4,
              paddingLeft: 20
            }}
            placeholderTextColor="#black"                 
          />
          <Text style={styles.title}>Date of Birth</Text>
          <Pressable
            style={styles.datePickerText}
            onPress={() => setOnDatePicker(true)}
          >
            <Text             
              style={{
                fontFamily: 'Rubik-Regular',
                color: '#402B51',
                backgroundColor: '#F8F8F8',
                borderRadius: 8,
                marginBottom: '5.18%',
                marginTop: 4,
                paddingLeft: 20,
                paddingVertical: 15
              }}
            >
              {formUpdateUser.birth?formatChange(formUpdateUser.birth):'Enter date of birth'}
            </Text>
          </Pressable>  
          <Text style={styles.title}>Address</Text>
          <TextInput
            placeholder="Enter Adress"
            autoCompleteType={"address"}
            defaultValue={formUpdateUser?.address}
            onChangeText={(e) => onUpdateForm(e, "address")}
            style={{
              fontFamily: 'Rubik-Regular',
              color: '#402B51',
              backgroundColor: '#F8F8F8',
              borderRadius: 8,
              marginBottom: '5.18%',
              marginTop: 4,
              paddingLeft: 20
            }}
            placeholderTextColor="#black"          
          />          
          <Pressable
          style={isDisabled ? styles.disabled : styles.button}
          onPress={onSubmit}
          >
            <Text style={[styles.text, {color: isDisabled?"#49ACFA":'white'}]}>Update</Text>
          </Pressable>                
        </View>
        <DatePicker
          modal
          open={onDatePicker}
          date={formUpdateUser.birth?new Date(formUpdateUser.birth):new Date()}
          maximumDate={new Date()}
          onConfirm={(date) => {
            console.log(date)
            setOnDatePicker(false)
            onUpdateForm(date, "birth")
          }}
          onCancel={() => {
            setOnDatePicker(false)
          }}
          mode="date"
        />
        <View style={{padding: 20}}>

        </View>        
      </View>
        
      </ScrollView>
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
    // flex: 0.6,
  },
  Body: {
    flex: 1,
    marginTop: 20,
    // padding: 20
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
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "#716D6D",
    marginTop: 5,
    // marginLeft: 70,
    // marginRight: 70,

  },
  text: {
    fontSize: 18,
    fontFamily: 'Rubik-Bold',
    lineHeight: 21,
    letterSpacing: 0.25,
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
    borderRadius: 10,
    // elevation: 3,
    backgroundColor: "#6DBDFE",
  },
  datePickerText: {
    // marginBottom: 10,
    // paddingVertical: 12,
    // marginRight: 10,
    // marginLeft: 10,
    // borderBottomColor: 'grey',
    // borderBottomWidth: 1,
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
    borderRadius: 10,
    backgroundColor: "white",
  },
});

export default UpdateProfile;
