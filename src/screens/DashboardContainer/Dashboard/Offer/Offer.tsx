import React from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { OfferImage } from '../../../../images/export'
import OfferHeader from './OfferHeader/OfferHeader'

const Offer = () => {
    return (
        <View style={styles.container}>
            <View style={styles.containerImage}>
                <OfferHeader />
            </View>
            <ScrollView style={styles.scrollView}>
                <View style={styles.body}>
                    <View style={styles.cardContainer}>
                        <View style={styles.cardHeader}>
                            <View style={{
                                alignSelf: 'flex-end',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'red',
                                width: '20%',
                                height: '20%',
                                borderBottomLeftRadius: 60,
                                borderTopRightRadius: 20,
                            }}>
                                <Text style={styles.whitetext}>-71%</Text>
                            </View>
                            <View style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={styles.redtext}>2TB Booing Space</Text>
                                <Text style={styles.normaltext}>LEFTTIME</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: '#797D7F', fontSize: 24, textDecorationLine: 'line-through' }}> 1400 </Text>
                                    <Text style={{ color: '#797D7F', fontSize: 14, textDecorationLine: 'line-through' }}> EUR</Text>
                                    <Text style={{ color: '#797D7F', fontSize: 28, }}>/</Text>
                                    <Text style={{ color: 'black', fontSize: 28, fontWeight: 'bold' }}>400</Text>
                                    <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}> EUR</Text>
                                </View>

                                <Text style={{
                                    color: 'black', fontSize: 14, lineHeight: 21, fontWeight: 'bold', letterSpacing: 0.25,
                                }}>
                                    ON-TIME PAYMENT
                                </Text>

                            </View>
                            <Pressable style={styles.button} >
                                <Text style={styles.whitetext}>
                                    BUY NOW
                                </Text>
                            </Pressable>

                        </View>
                        <View style={styles.cardBody}>
                            <Image style={styles.image} source={OfferImage} />
                        </View>
                    </View>
                    <View style={{ marginTop: 0, marginBottom: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Text style={styles.bottomText}>
                            No Monthly Or Year Patments, No Further Costs, Just One
                        </Text>
                        <Text style={styles.bottomText}>
                        Payment To Get Your Secure Lifetime Cloud Storage .
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default Offer

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        marginHorizontal: 0,
        width: '100%',
        height: '100%'
    },
    body: {
        flex: 1,
        marginTop: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
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
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContainer: {
        flexDirection: 'column',
        marginTop: 40,
        width: '90%',
        height:'90%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#797D7F',
        borderRadius: 20
    },
    cardHeader: {
        // padding: 10,
        backgroundColor: 'white',
        borderTopStyle: 'solid',
        borderColor: '#797D7F',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        alignItems: 'center'

    },
    cardBody: {
        paddingBottom: 1,
        alignItems:'center', 
        justifyContent:'center',
        borderTopStyle: 'solid',
        borderColor: '#797D7F',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        width: '100%',
        height:'40%',
    },
    image: {
        width: '100%',
        borderRadius:20
       
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'red',
        marginTop: 10,
    },
    whitetext: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    boldtext: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
    },

    normaltext: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#797D7F',
        marginTop: 10,
        marginBottom: 10,
    },
    redtext: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'red',
    },
    bottomText: {
        fontSize: 12,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#797D7F',
    }
})