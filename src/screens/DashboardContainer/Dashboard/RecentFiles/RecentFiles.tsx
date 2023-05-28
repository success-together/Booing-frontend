import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, ScrollView, Pressable, Dimensions, Modal, Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/native';
import NoDataFound from '../../../../Components/NoDataFound/NoDataFound';
import FolderIcon from '../../../../Components/FolderIcon/FolderIcon';
import {setRootLoading} from '../../../../shared/slices/rootSlice';
import { getRecentFiles } from '../../../../shared/slices/Directories/DirectoriesService';
import ShowFileWrapper from '../../Files/Uploads/LayoutWrapper/ShowFileWrapper';
import {getDisplayComponent} from '../../Files/RecycleBin/RecycleBin';
import {AXIOS_ERROR, BaseUrl, store} from '../../../../shared';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import useSocket from '../../../../shared/socket';
import * as Progress from 'react-native-progress';
import {formatUri} from '../../Files/Uploads/Videos/Videos';

let isFileFetching = false;

const formatRecentFolderName = (name: string) => {
  return name.length <= 8 ? name : name.slice(0, 8) + '...';
};

const DirectoireView = ({file, navigation}) => {
  return <TouchableOpacity
    onPress={() =>
      navigation.navigate('Folder', {
        id: file._id,
        historyStack: [file._id],
      })
    }>
    <FolderIcon />
    <Text style={styles.folderText}>
      {formatRecentFolderName(file.filename)}
    </Text>
  </TouchableOpacity>    
}

const FileView = ({file, handleShow}) => {
  return <TouchableOpacity style={{alignItems: 'center'}} onPress={() => handleShow(file._id)} >
    {file.category === 'image' &&
      <FastImage
        source={{uri: file.thumbnail}}
        resizeMode="cover"
        style={{
          height: 45,
          width: 51,
        }}
      />
    }
    {file.category === 'video' && 
      (file.thumbnail?
        <FastImage
          source={{uri: file.thumbnail}}
          resizeMode="cover"
          style={{
            height: 45,
            width: 51,
          }}
        />:
        <MaterialCommunityIcons
          name="file-video-outline"
          size={50}
          color='grey'
        />
      )
    }
    {file.category === 'music' &&
      <MaterialCommunityIcons
        name="music-box-outline"
        size={50}
        color='grey'
      />
    }
    
    <Text style={styles.folderText}>
      {formatRecentFolderName(file.filename)}
    </Text>
  </TouchableOpacity>    
}	
const RecentFiles = ({navigation}: {navigation: any}) => {
	const [recentFiles, setRecentFiles] = useState([]);
	const [isShowingFile, setIsShowingFile] = useState<{
		show: boolean;
		type?: string;
		uri?: string;
		title?: string;
		image?: boolean;
	}>({
    show: false,
    uri: undefined,
    title: undefined,
    type: undefined,
		image: true,
	});
	const user_id = store.getState().authentication.userId;
	const isFocused = useIsFocused();
	const {createOffer, recreateOffer} = useSocket();
	const [isFetching, setIsFetching] = useState(false);
	const [fetchProcess, setFetchProcess] = useState(0);
  const [removeFilesAfterFinish, setRemoveFilesAfterFinish] = useState<
    string[]
  >([]);	
  const closeModal = useCallback(() => {
    setIsShowingFile({
      show: false,
      uri: undefined,
      title: undefined,
      type: undefined,
    });  	
  }, [isShowingFile])
	const WIDTH = Dimensions.get('window').width;
	const progressSize = WIDTH*0.8; 

  const addRemoveFileBeforeSave = useCallback((path: string) => {
    setRemoveFilesAfterFinish(prev => [...new Set([...prev, path])]);
  }, []);
  const handleAbort = () => {
    setIsFetching(false);
    isFileFetching = false;
  }
  const showFile = useCallback(
    async (id: string) => {
      const file = recentFiles.find(e => e._id === id);
      let arrayBuffer = ""
      let state = true;
      setFetchProcess(0);
      setIsFetching(true);
      isFileFetching = true;
      // store.dispatch(setRootLoading(true)); 
      const len = file["updates"].length;
      for (let i = 0; i < file["updates"].length; i++) {
        const filename = `${file["updates"][i]['fragmentID']}-${file["updates"][i]['uid']}-${file["updates"][i]['user_id']}.json`
        for (let j = 0; j < file["updates"][i]['devices'].length; j++) {
          const success = new Promise((resolve, reject) => {
            createOffer(file["updates"][i]['devices'][j]['device_id'], filename, file["updates"][i]['fragmentID'], function(res) {
              if (res === false) {
                resolve(false);
              } else {
                arrayBuffer += res;
                resolve(true);
              }
            })
          })
          state = await success;
          if (!isFileFetching) {
            Toast.show({
              type: 'error',
              text1: 'aborted fetch file.',
            });
            return true;
          }                    
          if (state) break;
        }
        if (!state) break;
        setFetchProcess((i+1)/len);
      }
      if (state) {
         const uri = "data:"+file.type+";base64,"+arrayBuffer;
         const type = file.category;

         // setIsShowingFile({show: true, uri: uri, title: file['updates'][0]['fileName'], type: file['category']});
        if (type === 'video' || type === 'audio' || type === 'document') {
          const formated = await formatUri(
            file.type,
            uri,
            Math.floor(Math.random() * 412515125).toString(),
          );

          if (formated) {
            const {changed, path} = formated;
            if (changed) {
              addRemoveFileBeforeSave(path);
            }
            setIsFetching(false);
            isFileFetching = false
            setIsShowingFile({
              show: true,
              uri: path,
              title: file['updates'][0]['fileName'],
              type: type as any,
              image: false
            });         
            return;   
          } else {
            return Toast.show({
              type: 'error',
              text1: `cannot play audio ${file['updates'][0]['fileName']}`,
            });
          }
        } else {
          setIsFetching(false);
          isFileFetching = false          
          setIsShowingFile({
            show: true,
            uri: uri,
            title: file['updates'][0]['fileName'],
            type: type as any,
            image: true,
          });     
          return;  
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'cannot fetch file.',
        });
      }
    },
    [recentFiles],
  );

	useEffect(() => {
		if (isFocused) {
			(async () => {
		      await getRecentFiles({user_id: user_id})
		        .then(response => {
		          if (response.success) {
		            setRecentFiles(response.data);
		          }
		        })
		        .catch(e => {
		          if (e.name === AXIOS_ERROR && !e.message.includes('code 500')) {
		            return Toast.show({
		              type: 'error',
		              text1: e.response?.data?.message,
		            });
		          }
		        });
			})();
		} else {
      if (removeFilesAfterFinish.length !== 0) {
        for (const file of removeFilesAfterFinish) {
          RNFS.unlink(file)
            .then(() => {
              console.log(`${file} is deleted`);
            })
            .catch(e => {});
        }
      }
		}
	}, [isFocused])
	return (
	    <View >
	      {
	        isFetching ? (   
	          <View

	            style={{
	              display: 'flex',
	              justifyContent: 'center',
	              alignItems: 'center',
	              marginTop: 30,
	            }}>
	            <Progress.Bar progress={fetchProcess} width={progressSize} />
	            <Text style={{marginTop: 20, color: "#000000"}}>fetching file ... {fetchProcess?(fetchProcess*100).toFixed(2):0}%</Text>
	            <TouchableOpacity
	              style={{
	                width: 82,
	                height: 49,
	                backgroundColor: '#33a1f9',
	                color: '#FFFFFF',
	                borderRadius: 5,
	                justifyContent: 'center',
	                alignItems: 'center',
	                marginTop: 20
	              }}
	              onPress={handleAbort}>
	              <Text style={{color: '#FFFFFF', fontWeight: '500'}}>Abort</Text>
	            </TouchableOpacity>
	          </View>
	        ) : (              
		          <View
		            style={{
		              width: '100%',
		              justifyContent: 'center',
		              alignItems: 'center',
		            }}>
		            {recentFiles.length !== 0 ? (
		              <View style={styles.recentFilesContainer}>
		                <View
		                  style={{
		                    flexDirection: 'row',
		                    alignItems: 'center',
		                    width: '100%',
		                    justifyContent: 'flex-start',
		                    flexWrap: 'wrap',
		                    paddingBottom: 20,
		                  }}>
		                  {recentFiles.map((file, ind) => {
		                    return <View key={ind} style={{
		                        alignItems: 'center',
		                        padding: 25,
		                        borderRadius: 25,
		                        width: '33%',
		                        height: 100,
		                      }}>
		                      {file.isDirectory?(<DirectoireView file={file} navigation={navigation} />):(<FileView file={file} handleShow={showFile} />)}
		                      </View>
		                  })}
		                </View>
		              </View>
		            ) : (
		              <NoDataFound style={{marginBottom: 20}} />
		            )}            

		          </View>
	        )
	      }
	      <Modal
	        animationType="slide"
	        transparent={true}
	        visible={isShowingFile.show}
	        onRequestClose={() => {
	          closeModal();
	        }}>

          <ShowFileWrapper
            title={isShowingFile.title}
            image={isShowingFile.image}
            uri={isShowingFile.uri}
            displayComponent={getDisplayComponent(
              isShowingFile.type,
              isShowingFile.uri,
            )}
            setIsShowingFile={setIsShowingFile}
          />
       </Modal>
	    </View>
	)
}

const styles = StyleSheet.create({
	showFileWrapper: {
    position: 'absolute',
    top: 0,
    left:0,
    width: '100%',
    height: '100%',
    zIndex: 99999,
    backgroundColor: 'red'
	},
  recentFilesContainer: {
    flexDirection: 'column',
    marginTop: 20,
    justifyContent: 'center',
    alignItem: 'center',
    width: '100%',
    marginBottom: 40,
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  folderText: {
    color: '#000',
    alignItem: 'center',
    textAlign: 'center'
  }
})

export default RecentFiles;