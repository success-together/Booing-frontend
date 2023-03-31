import React, {useState, useEffect} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ToastAndroid,
  Modal,
  Linking,
  BackHandler
} from 'react-native';
import InviteFriendsHeader from './InviteFriendsHeader/InviteFriendsHeader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import { store, BaseUrl } from '../../../../shared';
import {whatsapp, share, telegram, mail} from '../../../../images/export';

const InviteFriends = ({navigation}: {navigation: any}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [shareLink, setShareLink] = useState('Https://Booing.Com/Invite/Ath');
  const terms_cond = () => {
    Alert.alert(
      'Terms and Conditions of Booing',
      'These Terms govern the use of this Application, and, any other related Agreement or legal relationship with the Owner in a legally binding way. Capitalized words are defined in the relevant dedicated section of this document. The User must read this document carefully. This Application is provided by: NEVIL SRL - VIA COCCO ORTU 98, CAGLIARI,CA,09121, Italia Owner contact email: info@nevil.biz',
      [
        {
          text: 'CANCEL',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => null},
      ],
    );
  };
  const getUserData = () => {
    setShareLink('Https://Booing.Com/Invite/'+store.getState().authentication.loggedInUser._id);
  };

  useEffect(() => {
    try {
      getUserData();
    } catch (error) {
      console.log(error);
    }
  }, []);  
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
  const copied = () => {
    ToastAndroid.show('Link copied.', ToastAndroid.SHORT);
  };
  const handleShare = async(where) => {
    console.log('handleShare')
      const shareOptions = {
        message: `please join with us.\n ${shareLink}`,
      };
      Share.open(shareOptions);
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <InviteFriendsHeader />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.body}>
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
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Agreed</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </Modal>
          <View style={styles.firstContainer}>
            <View
              style={{
                flexDirection: 'row',
                padding: 20,
                justifyContent: 'space-between',
              }}>
              <AntDesign
                name="arrowleft"
                size={24}
                color="white"
                onPress={() => {
                  navigation.navigate('Account');
                }}
              />
              <Pressable style={styles.trackInvite}>
                <Text
                  style={{fontFamily: 'Rubik-Bold',
    fontSize: 14,  color: 'white'}}>
                  Track Invites
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                width: '50%',
                padding: 0,
                paddingLeft: 20,
                marginLeft: 20,
              }}>
              <Text style={styles.whitetext}>Invite And Get</Text>
              <Text
                style={{
              fontFamily: 'Rubik-Bold', fontSize: 18,
                  
                  color: 'white',
                  letterSpacing: 0.25,
                  lineHeight: 21,
                  marginLeft: 10,
                }}>
                5,000,000 BOOs
              </Text>
            </View>
            <View style={{padding: 10, marginLeft: 20, marginTop: 10}}>
              <Text style={{color: 'white', fontFamily: 'Rubik-Regular',
    fontSize: 14}}>
                Share Your Link
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'black',
                  padding: 10,
                  marginTop: 8,
                  borderRadius: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '90%',
                }}>
                <Text style={{color: 'white', fontFamily: 'Rubik-Regular',
    fontSize: 14}}>
                  {shareLink}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString(shareLink);
                    copied();
                  }}
                  style={{
                    backgroundColor: '#2E6B95',
                    padding: 8,
                    borderRadius: 10,
                  }}>
                  <Text style={{color: 'white'}}>Copy</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 8,
                  marginTop: 10,
                  marginBottom: 10,
                }}>
{/*                <Pressable onPress={() => handleShare('whatsapp')}>
                  <Image style={styles.image} source={whatsapp} />
                </Pressable>
                <Pressable onPress={() => handleShare('telegram')}>
                  <Image style={styles.image} source={telegram} />
                </Pressable>
                <Pressable onPress={() => handleShare('mail')}>
                  <Image style={styles.image} source={mail} />
                </Pressable>
                <Pressable onPress={() => handleShare('share')}>
                  <Image style={styles.image} source={share} />
                </Pressable>*/}
                <TouchableOpacity onPress={() => handleShare()}>
                  <Text style={styles.shareLink}>Click here to share this link with your friends.</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.secondContainer}>
            <View style={{padding: 20}}>
              <Text style={styles.whitetext}>They Get</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '90%',
                  marginTop: 20,
                }}>
                <AntDesign name="checkcircleo" color={'green'} size={20} />
                <Text style={{color: 'white', fontFamily: 'Rubik-Regular',
    fontSize: 14}}>
                  In Addition To Free 15GB, They Will Get An Additional Premium
                  Services For Free.
                </Text>
              </View>
            </View>
            <View style={{padding: 20}}>
              <Text style={styles.whitetext}>You Get</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '90%',
                  marginTop: 20,
                }}>
                <AntDesign name="checkcircleo" color={'green'} size={20} />
                <Text style={{color: 'white', fontFamily: 'Rubik-Regular',
    fontSize: 14, marginLeft: 20}}>
                  5 MM Boos When 3 Friends Buy More Space With "Plus Plan".
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '90%',
                  marginTop: 20,
                }}>
                <Feather name="x-circle" color={'red'} size={20} />
                <Text style={{color: 'white', fontFamily: 'Rubik-Regular',
    fontSize: 14}}>
                  Same Users On Multiple Device Don't Aplly.
                </Text>
              </View>
            </View>
            <Pressable
              style={{padding: 20, marginLeft: 20}}
              onPress={() => setModalVisible(true)}>
              <Text style={{fontFamily: 'Rubik-Regular',
    fontSize: 14, color: '#33a1f9'}}>
                Terms And Conditions
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default InviteFriends;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginHorizontal: 0,
    width: '100%',
  },
  body: {
    flex: 1,
    marginTop: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    flexDirection: 'column',
    padding: 20,
    backgroundColor: 'white',
  },
  firstContainer: {
    flexDirection: 'column',
    width: '100%',
    backgroundColor: '#24597F',
    flex: 0.5,
  },
  secondContainer: {
    flexDirection: 'column',
    width: '100%',
    backgroundColor: 'black',
    flex: 0.5,
  },
  cardHeader: {
    padding: 10,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    // backgroundColor: "#33a1f9",
    alignItems: 'center',
    color: '#33a1f9',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    // flexWrap: "wrap",
    // flexDirecton: "row",
  },
  containerImage: {
    backgroundColor: '#33a1f9',
    width: '100%',
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackInvite: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#2E6B95',
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 12,
    marginRight: 20,
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
  text: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  whitetext: {
    fontFamily: 'Rubik-Bold',
    fontSize: 22,
    lineHeight: 21,
    
    letterSpacing: 0.25,
    color: 'white',
  },
  normaltext: {
    fontFamily: 'Rubik-Bold',
    fontSize: 14,
    lineHeight: 21,
    
    letterSpacing: 0.25,
    color: '#797D7F',
  },
  boldtext: {
    fontFamily: 'Rubik-Bold',
    fontSize: 18,
    lineHeight: 21,
    
    letterSpacing: 0.25,
    color: 'black',
  },
  containerFolder: {
    flexDirection: 'row',
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
    color: 'white',
    fontFamily: 'Rubik-Bold',
    textAlign: 'center',
  },
  modalText: {
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
  shareLink: {
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  }
});
