import React, { useCallback, useEffect, useState } from 'react';
import { Button, FlatList, PermissionsAndroid, SafeAreaView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import File from '../File/File';
import { ReadDirItem } from 'react-native-fs';
import { deleteFile, deleteFiles } from '../../../../utils/filesManagment';
import Toast from 'react-native-toast-message';
import ManageApps from '../../../../utils/manageApps';
import { PERMISSIONS, request } from 'react-native-permissions';


const icons = {
    'Pictures' : (size: number, color = '#8F8F8F') => <AntDesign name='picture' size={size} color={color} />,
    'Music' :(size: number, color = '#8F8F8F') => <MaterialCommunityIcons name='music-box-outline' size={size}  color={color}/>,
    'Downloads' :(size: number, color = '#8F8F8F') => <MaterialCommunityIcons name='file-download-outline' size={size}  color={color}/>,
    'Videos': (size: number, color = '#8F8F8F') =><MaterialCommunityIcons name='file-video-outline' size={size} color={color} />,
    // 'ScreenShots' :(size: number, color = '#8F8F8F') => <MaterialCommunityIcons name='cellphone-screenshot' size={size} color={color} />,
    'Cache':(size: number, color = '#8F8F8F') => <MaterialCommunityIcons name='cached' size={size} color={color} />,
    'Applications': (size: number, color = '#8F8F8F') =><MaterialIcons name='phone-android' size={size} color={color} />
};

interface RenderFileData {
    item: {
        id: string;
        path: string;
        logo?: string;
        name: string;
    }
}

interface FilesListProps {
    data: [];
    label: keyof typeof icons;
    removeDeletedItems: Function;
}

interface DeleteBtnProps {
    onPress: () => void;
}

const DeleteBtn = ({onPress}: DeleteBtnProps) => {
return (
    <TouchableOpacity style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row',  padding: 5, backgroundColor: '#CB2821', shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: .25, shadowRadius: 3.84, elevation: 5, borderRadius: 5}} onPress={onPress}>
        <Feather name='trash-2' size={20} color='#FFF' />
        <Text style={{marginLeft: 3, fontWeight: "500", color: "#FFF"}}>Delete</Text>
    </TouchableOpacity>
)
}


export default function FilesList({data, label, removeDeletedItems}: FilesListProps) {
    const [selectedFilesIds, setSelectedFilesIds] = useState<string[]>([]);
    const [showDeleteBtn, setShowDeleteBtn] = useState(false);

    const onPress = useCallback((id: string) => {
        setSelectedFilesIds((prev) => {
            prev.includes(id) ? prev.splice(prev.indexOf(id), 1) : prev.push(id);
            return [...prev];
        });
    }, [selectedFilesIds]);

    const onDeleteFilesPress = useCallback(async () => {
        // add permission check here (WRITE_TO_EXTERNAL_STORAGE)
        const paths = selectedFilesIds.reduce<string[]>((acc, id) => {
            const item = data.find((e: RenderFileData['item']) => e.id === id);
            if(item) {
                acc.push((item as any).path);
                return acc;
            }
            return acc;
        }, []);


        let isDeleted;
        
            if(label === 'Pictures') {
                isDeleted = await ManageApps.deleteImages(paths);
            }
            if(label ==='Videos') {
                isDeleted = await ManageApps.deleteVideos(paths);
            } 
            if(label === 'Music') {
                isDeleted = await ManageApps.deleteAudios(paths);
            }

       if(isDeleted) {
            removeDeletedItems(selectedFilesIds, label);
            return Toast.show({
                type: "success",
                text1: "items deleted successfully",
            });
       }
    }, [selectedFilesIds])

    const renderFile = useCallback(({item: {name, id, path, logo}}: RenderFileData) => {
        return (
        <File name={name} path={path} id={id} logo={logo} onPress={onPress} selected={selectedFilesIds.includes(id)} Icon={icons[label]} /> 
        )
    }, [selectedFilesIds,onPress,data]);


    useEffect(() => {
        if(selectedFilesIds.length !== 0 && !showDeleteBtn) {
            setShowDeleteBtn(true);
        }
        if(selectedFilesIds.length === 0 && showDeleteBtn) {
            setShowDeleteBtn(false);
        }
        
        return () => {
        if(selectedFilesIds.length === 0 && showDeleteBtn) {
            setShowDeleteBtn(false);
        }
        }
    }, [selectedFilesIds]);

    const onDeleteAppsPress = async () => {

        const apps = selectedFilesIds.reduce<any[]>((acc, id) => {
            const item = data.find((e: RenderFileData['item']) => e.id === id);
            if(item) {
                acc.push(item);
                return acc;
            }
            return acc;
        }, []);


        const deleted = await ManageApps.deleteAppCache(apps[0].packageName);

        Toast.show({
            text1: typeof deleted === 'string' ? deleted: deleted ? "cache deleted !" : "cannot delete cache"
        });
    }
    
    return (
    <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.headerTitle}>
                {icons[label](20)}
                <Text style={{marginLeft: 10, color: '#8F8F8F'}}>{label}</Text>
            </View>
            <View style={{height: 30}}>
                {showDeleteBtn && <DeleteBtn onPress={label !== 'Applications' ? onDeleteFilesPress : onDeleteAppsPress}/>}
            </View>
        </View>
        <SafeAreaView style={{paddingTop: 10, paddingBottom: 10}}>
            {data.length !== 0 ? <FlatList
                data={data}
                renderItem={renderFile}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            /> : <Text>No Items Found !</Text> }
            
        </SafeAreaView>
    </View>
    );
}



const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerTitle: {
        display: 'flex',
        flexDirection: 'row',
    },
    filesContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    }
})