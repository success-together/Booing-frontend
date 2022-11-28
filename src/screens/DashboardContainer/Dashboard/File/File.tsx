import React, { ReactNode } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { extractExtension } from '../../../../utils/util-functions';


interface FileProps  {
    selected: boolean;
    onPress: (id: string) => void;
    id: string;
    path: string;
    name: string;
    logo?:string;
    Icon: (size: number, color: string) => Element;
}

const Selected = () => {
    return (<View style={styles.selected}>
        <Feather name='check-circle' size={19} color={'#BDECB6'}/>
    </View>);

}

const File = ({path, selected, logo, id, name, onPress, Icon}: FileProps) => {
    const extension = path ? extractExtension(path) : null;
    const source = {uri: `data:image/${extension};base64,${logo}` };

    return <TouchableOpacity onPress={() => onPress(id)} style={styles.container}>
        {selected && <Selected />}
        {extension && logo ? <Image source={source} style={styles.image} /> : <View style={{width: 80, position: 'relative'}}><Text style={{padding: 10}}>{name}</Text><View style={{position: 'absolute', top: 0,  left: 0, width: 80, height: '100%', zIndex: -1}}>{Icon(70, "#ffffff63") as ReactNode}</View></View>}
    </TouchableOpacity>;
}


const styles = StyleSheet.create({
    container: {
        minWidth: 80,
        marginRight: 6,
        position: 'relative',
        borderRadius: 8,
        backgroundColor: '#D9D9D9',
        overflow: 'hidden'
    },
    image: {
        width: 80,
        height: 80
    },
    selected: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 25,
        height: 25,
        backgroundColor: '#FFF',
        borderRadius: 25 / 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999
    }
})


export default File;
