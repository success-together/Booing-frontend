import React, {useState, useEffect} from 'react';
import {Text, Button, View} from 'react-native';
import RNFS from 'react-native-fs';
import mime from 'mime-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {types} from '../../shared';

import { AppRegistry } from 'react-native';

const ScanStorage = async (data) => {
	console.log('ScanStorage')
	console.log(data);
	setTimeout(() => {
		console.log('end scaning');
		return true;
	}, 10000)
	setTimeout(() => {
		console.log('still alive????????');
	}, 15000)
}
console.log('ScanStorage start')
// AppRegistry.registerHeadlessTask('ScanStorage', () => ScanStorage);

const Splash = () => {
	const [fetching, setFetching] = useState('');
	const [lastUpdate, setLastUpdate] = useState(0);
	const [fileList, setFileList] = useState([]);
	const isFocused = useIsFocused();
	const delay = (delayInms) => {
		return new Promise(resolve => setTimeout(resolve, delayInms));
	}  
	async function fetchFiles(filePath) {
		setFetching(filePath);
		// const delaytime = await delay(1500);	
		const files = await RNFS.readdir(filePath);
		const subPath = filePath.split('/').pop();
		let allFiles = [];
		if (files) {
			for (let i = 0; i < files.length; i++) {
				const rpath = `${filePath}/${files[i]}`;
			    const fileStat = await RNFS.stat(rpath);
			    // console.log(fileStat.path)
				const rsubPath = files[i].split('/').pop();
			    if (fileStat.isDirectory()) {
			    	if (files[i] !== 'Android' && !files[i].startsWith('.')) {
						const subFiles = await fetchFiles(rpath);
						if (Object.keys(subFiles).length !== 0) {
							allFiles = [ ...allFiles, ...subFiles];
						}
			    	}
			    } else {
			    	if (fileStat.mtime <= lastUpdate) {
			    		const file = fileList.find(obj => obj.path===fileStat.path);
			    		if (file) {
				    		allFiles.push(file);
				    		console.log(rpath, 'not changed files')
				    		continue ;
			    		}
			    	}
			    	console.log('new File ', fileStat.path)
			    	const hash = await RNFS.hash(fileStat.path, 'md5');
			    	allFiles.push({
						ctime: fileStat.ctime,
						mtime: fileStat.mtime,
						path: fileStat.path,
						size: fileStat.size,
						hash: hash
			    	})
			    }
			}
		}
		return allFiles;
	}
	const separateByCategory = async (files) => {
		const allFilesByCategory = {document: [], apk: [], video: [], audio: [], image: [], download: []};
		for (let i = 0; i < files.length; i++) {
			const mimeType = await mime.lookup(files[i]['path']);
			const validType = Object.keys(types).find(key => (types as any)[key](mimeType));
			if (validType) {
				allFilesByCategory[validType].push(files[i]);
			}
		}
		console.log(allFilesByCategory)
	}
	const handleSearch = async () => {
		console.log('fetchFiles')
		const fetchTime = Date.now();
		const files = await fetchFiles(RNFS.ExternalStorageDirectoryPath);
		// console.log(files)
		setLastUpdate(fetchTime);
		setFileList(files);
		findDuplicatedFiles(files);
		// separateByCategory(files);
		// await AsyncStorage.setItem('fileData', JSON.stringify(files));
		// await AsyncStorage.setItem('fetchTime', `${fetchTime}`);
		// separateByCategory(files);

	}
	const findDuplicatedFiles = (files) => {
		const duplicateArr = {};
		files.forEach((obj) => {
		  if (duplicateArr.hasOwnProperty(obj.hash)) {
		    duplicateArr[obj.hash].push(obj);
		  } else {
		    duplicateArr[obj.hash] = [obj];
		  }
		});
		for (const [key, value] of Object.entries(duplicateArr)) {
		  if (value.length === 1) {
		    delete duplicateArr[key];
		  }
		}		
		console.log(duplicateArr)
	}
	const handleRetrieve = async () => {
		const fileData = await AsyncStorage.getItem('fileData')
		if (fileData) setFileList(fileData)
		const fetchTime = await AsyncStorage.getItem('fetchTime')
		if (fetchTime) setLastUpdate(fetchTime)
		// console.log(await AsyncStorage.getItem('fileData'))
		// console.log(await AsyncStorage.getItem('fetchTime'))
	}
	useEffect(() => {
		(async () => {
		})()
	}, [])
	useEffect(() => {
		// console.log(fileList)
	}, [fileList])
	return (
		<>
			<Text>fetching ... {fetching} </Text>
			<View>
				<Button title="Fetch" onPress={() => handleSearch()} />
				<Button title="Retrieve" onPress={() => handleRetrieve()} style={{marginTop: 20}} />
			</View>

		</>
	)
}

export default Splash;