import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch
} from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
import {Logo} from '../../../images/export';
import {register} from '../../../shared/slices/Auth/AuthService';
import {SocialMediaAuth} from '../../../Components/exports';
import {setRootLoading} from '../../../shared/slices/rootSlice';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message'
import Entypo from 'react-native-vector-icons/Entypo';

function Register({navigation}: {navigation: any}) {
  const [formRegister, setFormRegister] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    cpassword: '',
  });
  const [strongCond, setStrongCond] = useState({length: false, digit: false, lower: false, upper: false, special: false, include: 0})
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [seePassword, setSeePassword] = useState<boolean>(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [terms, setTerms] = useState<boolean>(false);

  const handlePassword = (val) => {
    const patterndigits = /\d/;
    const patternlower = /[a-z]/;
    const patternupper = /[A-Z]/;
    const patternnonWords = /\W/;
    let requireCond = {length: false, digit: false, lower: false, upper: false, special: false, include: 0};
    if (val.length > 8 && val.length < 19) requireCond.length = true;
    if (patterndigits.test(val)) {requireCond.digit = true; requireCond.include += 1};
    if (patternlower.test(val)) {requireCond.lower = true; requireCond.include += 1};
    if (patternupper.test(val)) {requireCond.upper = true; requireCond.include += 1};
    if (patternnonWords.test(val)) {requireCond.special = true; requireCond.include += 1};
    setFormRegister({...formRegister, password: val});
    setStrongCond(requireCond);
  }
  const handleConfirmPassword = (val) => {
    // if (formRegister.password === val) setMatchPassword(true);
    // else setMatchPassword(false);
    setFormRegister({...formRegister, cpassword: val});
  }
  const onSubmit = () => {
    if (formRegister.password !== formRegister.cpassword) return 'check confirm password';
    if (!strongCond.length) return 'check password length';
    if ( strongCond.include < 2 ) return 'check at least cond'
    setIsSubmit(true);
    if (
      !isSubmit &&
      formRegister.email &&
      formRegister.name &&
      formRegister.password &&
      formRegister.phone
    ) {
      register(formRegister).then(res => {
        console.log(res)
        setRootLoading(true);
        navigation.navigate('Verification', {
          user_id: res.data._id,
          isSignup: true,
        });
      });
    }
    setIsSubmit(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#33A1F9', '#6DBDFE']}
        style={styles.containerImage}>
        <Image style={styles.image} source={Logo} />
      </LinearGradient>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.modalView}>
              <Text style={styles.modaltitletext}>
                Terms and Conditions of Booing
              </Text>
              <View style={{padding: 10}}>
                <Text style={styles.modalnormaltext}>
                  These Terms govern the use of this Application, and, any
                  other related Agreement or legal relationship with the
                  Owner in a legally binding way. Capitalized words are
                  defined in the relevant dedicated section of this
                  document.
                  {'\n'}
                  {'\n'}
                  The User must read this document carefully.
                  {'\n'} {'\n'}
                  This Application is provided by: NEVIL SRL - VIA COCCO
                  ORTU 98, CAGLIARI,CA,09121, Italia Owner contact email:
                  info@nevil.biz
                  {'\n'}
                </Text>
              </View>
              <Text style={styles.modaltitletext}>TERMS OF USE</Text>
              <View style={{padding: 10}}>
                <Text style={styles.modalnormaltext}>
                  Unless otherwise specified, the terms of use detailed in
                  this section apply generally when using this Application.
                  {'\n'}
                  Single or additional conditions of use or access may apply
                  in specific scenarios and in such cases are additionally
                  indicated within this document.
                  {'\n'}
                  By using this Application, Users confirm to meet the
                  following requirements:
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Text style={styles.modalboldtext}>
                    Content on this Application{' '}
                  </Text>
                  {'\n'}
                  {'\n'}
                  Unless where otherwise specified or clearly recognizable,
                  all content available on this Application is owned or
                  provided by the Owner or its licensors. The Owner
                  undertakes its utmost effort to ensure that the content
                  provided on this Application infringes no applicable legal
                  provisions or third-party rights. However, it may not
                  always be possible to achieve such a result. In such
                  cases, without prejudice to any legal prerogatives of
                  Users to enforce their rights, Users are kindly asked to
                  preferably report related complaints using the contact
                  details provided in this document.
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Text style={styles.modalboldtext}>
                    Access to external resources{'\n'}
                    {'\n'}
                  </Text>
                  Through this Application Users may have access to external
                  resources provided by third parties. Users acknowledge and
                  accept that the Owner has no control over such resources
                  and is therefore not responsible for their content and
                  availability. Conditions applicable to any resources
                  provided by third parties, including those applicable to
                  any possible grant of rights in content, result from each
                  such third parties’ terms and conditions or, in the
                  absence of those, applicable statutory law.
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Text style={styles.modalboldtext}>
                    Acceptable use{'\n'}
                    {'\n'}
                  </Text>
                  This Application and the Service may only be used within
                  the scope of what they are provided for, under these Terms
                  and applicable law. Users are solely responsible for
                  making sure that their use of this Application and/or the
                  Service violates no applicable law, regulations or
                  third-party rights.
                  {'\n'}
                </Text>
              </View>
              <Text style={styles.modaltitletext}>
                Common provisions{'\n'}
              </Text>
              <View style={{padding: 10}}>
                <Text style={styles.modalnormaltext}>
                  <Text style={styles.modalboldtext}>
                    No Waiver
                    {'\n'}
                    {'\n'}
                  </Text>
                  The Owner’s failure to assert any right or provision under
                  these Terms shall not constitute a waiver of any such
                  right or provision. No waiver shall be considered a
                  further or continuing waiver of such term or any other
                  term.
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Text style={styles.modalboldtext}>
                    Service interruption
                    {'\n'}
                    {'\n'}
                  </Text>
                  To ensure the best possible service level, the Owner
                  reserves the right to interrupt the Service for
                  maintenance, system updates or any other changes,
                  informing the Users appropriately. Within the limits of
                  law, the Owner may also decide to suspend or terminate the
                  Service altogether. If the Service is terminated, the
                  Owner will cooperate with Users to enable them to withdraw
                  Personal Data or information in accordance with applicable
                  law. Additionally, the Service might not be available due
                  to reasons outside the Owner’s reasonable control, such as
                  “force majeure” (eg. labor actions, infrastructural
                  breakdowns or blackouts etc).
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Text style={styles.modalboldtext}>
                    Service reselling
                    {'\n'}
                    {'\n'}
                  </Text>
                  Users may not reproduce, duplicate, copy, sell, resell or
                  exploit any portion of this Application and of its Service
                  without the Owner’s express prior written permission,
                  granted either directly or through a legitimate reselling
                  programme.
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Text style={styles.modalboldtext}>
                    Intellectual property rights
                    {'\n'}
                    {'\n'}
                  </Text>
                  Without prejudice to any more specific provision of these
                  Terms, any intellectual property rights, such as
                  copyrights, trademark rights, patent rights and design
                  rights related to this Application are the exclusive
                  property of the Owner or its licensors and are subject to
                  the protection granted by applicable laws or international
                  treaties relating to intellectual property. All trademarks
                  — nominal or figurative — and all other marks, trade
                  names, service marks, word marks, illustrations, images,
                  or logos appearing in connection with this Application
                  are, and remain, the exclusive property of the Owner or
                  its licensors and are subject to the protection granted by
                  applicable laws or international treaties related to
                  intellectual property.
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Text style={styles.modalboldtext}>
                    Changes to these Terms
                    {'\n'}
                    {'\n'}
                  </Text>
                  The Owner reserves the right to amend or otherwise modify
                  these Terms at any time. In such cases, the Owner will
                  appropriately inform the User of these changes. Such
                  changes will only affect the relationship with the User
                  for the future. The continued use of the Service will
                  signify the User’s acceptance of the revised Terms. If
                  Users do not wish to be bound by the changes, they must
                  stop using the Service. Failure to accept the revised
                  Terms, may entitle either party to terminate the
                  Agreement. The applicable previous version will govern the
                  relationship prior to the User's acceptance. The User can
                  obtain any previous version from the Owner.
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Text style={styles.modalboldtext}>
                    Assignment of contract
                    {'\n'}
                    {'\n'}
                  </Text>
                  The Owner reserves the right to transfer, assign, dispose
                  of by novation, or subcontract any or all rights or
                  obligations under these Terms, taking the User’s
                  legitimate interests into account. Provisions regarding
                  changes of these Terms will apply accordingly. Users may
                  not assign or transfer their rights or obligations under
                  these Terms in any way, without the written permission of
                  the Owner.
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Text style={styles.modalboldtext}>
                    Contacts
                    {'\n'}
                    {'\n'}
                  </Text>
                  All communications relating to the use of this Application
                  must be sent using the contact information stated in this
                  document.
                  {'\n'}
                  {'\n'}
                  {'\n'}
                  <Text style={styles.modalboldtext}>
                    Severability
                    {'\n'}
                    {'\n'}
                  </Text>
                  Should any provision of these Terms be deemed or become
                  invalid or unenforceable under applicable law, the
                  invalidity or unenforceability of such provision shall not
                  affect the validity of the remaining provisions, which
                  shall remain in full force and effect. 
                  {'\n'}{'\n'}{'\n'}{'\n'}
                  Latest update:
                  February 09, 2023 
                  {'\n'}{'\n'}
                  iubenda hosts this content and only
                  collects the Personal Data strictly necessary for it to be
                  provided.
                </Text>
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() =>{ setModalVisible(!modalVisible); setTerms(true)}}>
                <Text style={styles.textStyle}>Agreed</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
      <ScrollView style={styles.scrollView}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          width: '100%',
          paddingLeft: 25,
          paddingRight: 25,
          paddingTop: 30,
          paddingBottom: 30,
          flex: 1,
        }}>
          <Text style={styles.title}>Username </Text>
          <TextInput
            placeholder="Enter User Name"
            autoComplete={'name'}
            onChangeText={e => setFormRegister({...formRegister, name: e})}
            style={{
              color: 'black',
              backgroundColor: '#F8F8F8',
              borderRadius: 8,
              marginBottom: '3.24%',
              marginTop: 4,
            }}
            placeholderTextColor="#716D6D"
          />
          <Text style={styles.title}>Email </Text>
          <TextInput
            placeholder="Enter Email Adress"
            autoComplete={'email'}
            onChangeText={e => setFormRegister({...formRegister, email: e})}
            style={{
              color: 'black',
              backgroundColor: '#F8F8F8',
              borderRadius: 8,
              marginBottom: '3.24%',
              marginTop: 4,
            }}
            placeholderTextColor="#716D6D"
          />
          <Text style={styles.title}>Phone number </Text>
          <TextInput
            placeholder="Enter Phone Number"
            autoComplete={'tel'}
            onChangeText={e => setFormRegister({...formRegister, phone: e})}
            style={{
              color: 'black',
              backgroundColor: '#F8F8F8',
              borderRadius: 8,
              marginBottom: '3.24%',
              marginTop: 4,
            }}
            placeholderTextColor="#716D6D"
          />
          <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
            <Text style={styles.title}>Create your password </Text>
            <TouchableOpacity style={{flexDirection: 'row', alignItems:'center'}} onPress={() => setSeePassword(!seePassword)}>
              <Entypo name={seePassword?'eye-with-line':'eye'} size={25} color="grey" />
              <Text style={[styles.normaltext, {marginLeft: 5}]}>{seePassword?'Hide':'Show'}</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Enter Password"
            autoComplete={'password'}
            secureTextEntry={seePassword?false:true}
            onChangeText={e => handlePassword(e)}
            style={{
              color: 'black',
              backgroundColor: '#F8F8F8',
              borderRadius: 8,
              marginBottom: '3.24%',
              marginTop: 4,
            }}
            placeholderTextColor="#716D6D"
          />
          <View style={{marginTop: 15, marginBottom: 25}}>
            <Text style={[styles.title]}>Password must:</Text>
            <Text style={[styles.normaltext, formRegister.password.length>0?(strongCond.length?styles.active:styles.error):{}]}>● Be between 9 and 18 characters</Text>
            <Text style={[styles.normaltext, formRegister.password.length>0?(strongCond.include>1?styles.active:styles.error):{}]}>● Include at least two of the following:</Text>
            <Text style={[styles.normaltext, formRegister.password.length>0?(strongCond.upper?styles.active:(strongCond.include<2?styles.error:{})):{}]}>     • An uppercase character</Text>
            <Text style={[styles.normaltext, formRegister.password.length>0?(strongCond.lower?styles.active:(strongCond.include<2?styles.error:{})):{}]}>     • A lowercase character</Text>
            <Text style={[styles.normaltext, formRegister.password.length>0?(strongCond.digit?styles.active:(strongCond.include<2?styles.error:{})):{}]}>     • A number</Text>
            <Text style={[styles.normaltext, formRegister.password.length>0?(strongCond.special?styles.active:(strongCond.include<2?styles.error:{})):{}]}>     • A special character</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
            <Text style={styles.title}>Confirm your password </Text>
            <TouchableOpacity style={{flexDirection: 'row', alignItems:'center'}} onPress={() => setSeeConfirmPassword(!seeConfirmPassword)}>
              <Entypo name={seeConfirmPassword?'eye-with-line':'eye'} size={25} color="grey" />
              <Text style={[styles.normaltext, {marginLeft: 5}]}>{seeConfirmPassword?'Hide':'Show'}</Text>
            </TouchableOpacity>
          </View>          
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={seeConfirmPassword?false:true}
            onChangeText={e => handleConfirmPassword(e)}
            style={{
              color: 'black',
              backgroundColor: formRegister.password===formRegister.cpassword||!formRegister.cpassword?'#F8F8F8':'#ffdddd',
              borderRadius: 8,
              marginBottom: '3.24%',
              marginTop: 4,
            }}
            placeholderTextColor="#716D6D"
          />
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
{/*            <CheckBox 
              value={terms}
              onValueChange={(value) => setTerms(value)}
              style={styles.checkbox}
             />*/}
              <Switch
                trackColor={{ false: "#767577", true: "#33a1f9" }}
                thumbColor={terms ? "#33a1f9" : "#f4f3f4"}
                ios_backgroundColor="#33a1f9"
                onValueChange={(value) => setTerms(value)}
                value={terms}
              />          
            <Text style={[styles.normaltext, {marginLeft:10, lineHeight: 25, marginBottom: 10}]}>I agree to <Pressable onPress={() => setModalVisible(true)}><Text style={{color: '#33a1f9'}}>Booing Privacy Policy</Text></Pressable> and {'\n'} <Pressable onPress={() => setModalVisible(true)}><Text style={{color: '#33a1f9'}}>Terms of service</Text></Pressable></Text>
          </View>
        <LinearGradient
          colors={['#33A1F9', '#6DBDFE']}
          style={{borderRadius: 8}}>
          <Pressable
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              height: 60,
            }}
            onPress={onSubmit}
            disabled={!terms}>
            <Text style={[styles.text, terms?{color: 'white'}:{color: '#ffdddd'}]}>Sign Up</Text>
          </Pressable>
        </LinearGradient>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    color: '#33a1f9',
    justifyContent: 'center',
    width: '100%',
  },
  containerImage: {
    backgroundColor: '#33a1f9',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '42.66%',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    resizeMode: "contain"    
  },
  button: {
    fontFamily: 'Rubik-Regular',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 140,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#33a1f9',
  },
  text: {
    fontFamily: 'Rubik-Regular',
    fontFamily: 'Rubik-Regular',
    fontSize: 20,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
  title: {
    fontFamily: 'Rubik-Regular',
    fontFamily: 'Rubik-Regular',
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#797D7F',
    fontWeight: 'bold'
    // marginLeft: 70,
    // marginRight: 70,
  },
  normaltext: {
    fontFamily: 'Rubik-Regular',
    fontFamily: 'Rubik-Regular',
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#797D7F',
  },
  createAccount: {
    fontFamily: 'Rubik-Regular',
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#797D7F',
    textAlign: 'center',
  },
  containerSocialMedia: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  active: {
    color: 'green',
  },
  error: {
    color: 'red'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },  
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    fontFamily: 'Rubik-Bold',
    color: 'white',
    textAlign: 'center',
  },
  modalText: {
    fontFamily: 'Rubik-Regular',
    marginBottom: 15,

    color: 'gray',
  },
  modalnormaltext: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'gray',
  },
  modalboldtext: {
    fontFamily: 'Rubik-Bold',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'black',
  },
  modaltitletext: {
    marginTop: 10,
    fontFamily: 'Rubik-Bold',
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'black',
  },  
  button: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#33a1f9',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },  
});

export default Register;
