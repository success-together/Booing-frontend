import React from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import InviteFriendsHeader from './InviteFriendsHeader/InviteFriendsHeader'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Clipboard from '@react-native-clipboard/clipboard'
import { whatsapp, share, telegram, mail } from '../../../../images/export'

const InviteFriends = () => {
    return (
        <View style={styles.container}>
            <View style={styles.containerImage}>
                <InviteFriendsHeader />
            </View>
            <ScrollView style={styles.scrollView}>
                <View style={styles.body}>
                    <View style={styles.firstContainer}>
                        <View style={{ flexDirection: 'row', padding: 20, justifyContent: 'space-between' }}>
                            <AntDesign name="arrowleft"
                                size={24}
                                color="white" />
                            <Pressable style={styles.trackInvite}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>
                                    Track Invites
                                </Text>
                            </Pressable>
                        </View>
                        <View style={{ width: '50%', padding: 0, paddingLeft: 20, marginLeft: 20 }}>
                            <Text style={styles.whitetext}>
                                Invite And Get
                            </Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', letterSpacing: 0.25, lineHeight: 21, marginLeft: 10 }}>
                                5,000,000 BOOs
                            </Text>
                        </View>
                        <View style={{ padding: 10, marginLeft: 20, marginTop: 10 }}>
                            <Text style={{ color: 'white', fontSize: 14 }}>
                                Share Your Link
                            </Text>
                            <View style={{ flexDirection: 'row', backgroundColor: 'black', padding: 10, marginTop: 8, borderRadius: 10, justifyContent: 'space-between', alignItems: 'center', width: '90%' }}>
                                <Text style={{ color: 'white', fontSize: 14, }}>
                                    Https://Booing.Com/Invite/Ath
                                </Text>
                                <TouchableOpacity onPress={() => Clipboard.setString('Https://Booing.Com/Invite/Ath')}
                                    style={{ backgroundColor: '#2E6B95', padding: 8, borderRadius: 10, }}>
                                    <Text style={{ color: 'white' }}>
                                        Copy
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', padding: 8, marginTop: 10, marginBottom: 10 }}>
                                <Image style={styles.image} source={whatsapp} />
                                <Image style={styles.image} source={telegram} />
                                <Image style={styles.image} source={mail} />
                                <Image style={styles.image} source={share} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.secondContainer}>
                        <View style={{padding: 20,}}>
                            <Text style={styles.whitetext}>
                                They Get
                            </Text>
                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'90%', marginTop:20}}>
                                <AntDesign name='checkcircleo' color={'green'} size={20}/>
                                <Text style={{color:'white', fontSize:14}}>
                                    In Addition To Free 15GB, They Will Get An Additional Premium Services For Free.
                                </Text>
                            </View>
                        </View>
                        <View style={{padding: 20,}}>
                            <Text  style={styles.whitetext}>
                                You Get
                            </Text>
                             <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'90%', marginTop:20}}>
                                <AntDesign name='checkcircleo' color={'green'} size={20}/>
                                <Text style={{color:'white', fontSize:14, marginLeft:20}}>
                                     5 MM Boos When 3 Friends Buy More Space With "Plus Plan".
                                </Text>
                            </View>
                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'90%', marginTop:20}}>
                                <Feather name='x-circle' color={'red'} size={20}/>
                                <Text style={{color:'white', fontSize:14}}>
                                  Same Users On Multiple Device Don't Aplly.
                                </Text>
                            </View>
                        </View>
                        <View style={{padding:20, marginLeft:20}}>
                            <Text style={{fontSize:14, color:'#33a1f9'}}>
                                Terms And Conditions
                            </Text>
                        </View>

                    </View>

                </View>
            </ScrollView>
        </View>
    )
}

export default InviteFriends

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
        alignItems: 'center'

    },
    cardBody: {
        flexDirection: 'column',
        padding: 20,
        backgroundColor: 'white'
    },
    firstContainer: {
        flexDirection: 'column',
        width: '100%',
        backgroundColor: '#24597F',
        flex: 0.5
    },
    secondContainer: {
        flexDirection: 'column',
        width: '100%',
        backgroundColor: 'black',
        flex: 0.5
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
        backgroundColor: '#2E6B95'
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 12,
        marginRight: 20
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
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
    },
    whitetext: {
        fontSize: 22,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    normaltext: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#797D7F',
    },
    boldtext: {
        fontSize: 18,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
    },
    containerFolder: {
        flexDirection: 'row',
    },
});