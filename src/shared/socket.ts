import { io } from "socket.io-client";
// import ss from "socket.io-stream";
import ManageApps from '../utils/manageApps';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import RNFS from 'react-native-fs';
import {store} from '../shared';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {downloadByOffer} from './slices/Fragmentation/FragmentationService';
let socketIns = null;
const answerConnections = {};
const offerConnections = {};
const MAXIMUM_SIZE_DATA_TO_SEND = 150000;
const BUFFER_THRESHOLD  = 150000;
// const SOCKET_URL = "http://10.0.2.2:3001/";
const SOCKET_URL = "https://booing-server.onrender.com/";

export default function useSocket() {
  const user_id = store.getState().authentication.userId;
  let callbackFunction = null;
  const initSocket = function() {
    if (socketIns) return socketIns;
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      socketIns = socket
      socket.emit("joinUser", {user_id: user_id})
    });
    socket.on("reconnect", () => {
      console.log("you are reconnected")
    });
    socket.on("disconnect", (reason) => {
      console.log("you are disconnected")
    });
    socket.on('joined', (data) => {
      console.log("you are joined, your info is ", data)
    })
    socket.on('newUser', (data) => {
      console.log("new user joined", data)
    })
    socket.on("offer", (res) => {
      const peer = new RTCPeerConnection({
        iceServers: [
          {
          urls: 'turn:relay1.expressturn.com:3478',
          credential: '6Fs9mHa4Brr0FMV4',
          username: 'ef4QJS09JGT9H1TKXK'
          },
          {urls:'stun:stun.l.google.com:19302'},
          {urls:'stun:stun1.l.google.com:19302'},
          {urls:'stun:stun2.l.google.com:19302'},
          {urls:'stun:stun3.l.google.com:19302'},
          {urls:'stun:stun4.l.google.com:19302'}
        ]
      });
      if (answerConnections[res.from]) {
        answerConnections[res.from].close();
        delete answerConnections[res.from];
      }
      peer.oniceconnectionstatechange = (e, a) => {
        console.log("-->>>>>>>>--oniceconnectionstatechange => ", e, a)
      }
      answerConnections[res.from] = peer;
      peer.onicecandidate = e => {
        if (e.candidate) {
          // console.log("answer->onicecandidate")
          socket.emit('icecandidate', {from: user_id, to: res.from, candidate: e.candidate, isOffer: false})
        }
      } 

      peer.ondatachannel = event => {
        console.log("answer->ondatachannel")
        const receiveChannel = event.channel;
        let queue = [];
        let paused = false;
        const shiftQueue = () => {
         paused = false;
         let message = queue.shift();
         while (message) {
           if (
             receiveChannel.bufferedAmount &&
             receiveChannel.bufferedAmount > BUFFER_THRESHOLD
           ) {
             paused = true;
             queue.unshift(message);
             const listener = () => {
               receiveChannel.removeEventListener("bufferedamountlow", listener);
               shiftQueue();
             };
             receiveChannel.addEventListener("bufferedamountlow", listener);
             return;
           }
           try {
             receiveChannel.send(message);
             message = queue.shift();
           } catch (error) {
             throw new Error(
               `Error to send the next data: ${error.name} ${error.message}`
             );
           }
         }
        }
        const sendFrag = (data) => {
           queue.push(data);
           if (paused) {
             return;
           }
           shiftQueue();
         }
        receiveChannel.onmessage = async (e) => {
          console.log("receiveChannel.onmessage")
          const message = JSON.parse(e.data);
          if (message.type === "send") {
            const isFileExist = await ManageApps.isFileExist(message.data);
            if (isFileExist) {
              if (res.from !== user_id) {
                Toast.show({
                  type: 'info',
                  text1: 'sending fragment! '+ message.data
                });
              }
              const fragment = await ManageApps.getFileContent(message.data);
              sendFrag(
               JSON.stringify({
                type: 'info',
                 totalLength: fragment.length,
                 dataSize: MAXIMUM_SIZE_DATA_TO_SEND,
               })
              );              
              for (
                let index = 0;
                index < fragment.length;
                index += MAXIMUM_SIZE_DATA_TO_SEND
              ) {
                sendFrag(
                  fragment.slice(index, index + MAXIMUM_SIZE_DATA_TO_SEND)
                );
              }
              sendFrag('end');
            } else {
              receiveChannel.send(JSON.stringify({type: 'nofile'}))
            }
          } else if (message.type === "received") {
            peer.close();
            delete answerConnections[res.from];
          }
        };
        receiveChannel.onopen = e => {
          receiveChannel.send("answer->please receive the data: " + "answerConnections[res.from]['reqdata']")
        };
        receiveChannel.onclose = e => {
        };
      }
      peer.setRemoteDescription(new RTCSessionDescription(res.offer)).then(function() {
        peer.createAnswer().then(function (answer) { 
          peer.setLocalDescription(answer); 
          // console.log("answer->send answer")
          socket.emit('answer', {from: user_id, to: res.from, answer: answer})
        }, function (error) { 
          alert("Error when creating an answer"); 
        })
      })      
    })
    socket.on('icecandidate', (res) => {
      if (res.isOffer) {
        // console.log("socket->icecandidate from offer", res)
        answerConnections[res.from].addIceCandidate(new RTCIceCandidate(res.candidate))
      } else {
        console.log("socket->icecandidate from answer", res)
        offerConnections[res.from].addIceCandidate(new RTCIceCandidate(res.candidate))
      }
    })
    socket.on('answer', (res) => {
      console.log("socket->receive answer", res)
      offerConnections[res.from].setRemoteDescription(new RTCSessionDescription(res.answer));
    })
    socket.on('sendingData', async (res) => {
      console.log("receive fragment")
      const {fragmentID, uid} = res;
      const name = `${fragmentID}-${uid}-${res.user_id}.json`;
      const isExist = await ManageApps.isFileExist(name);
      if (!isExist) {
        if (user_id !== res.user_id) {
          Toast.show({
            type: 'success',
            text1: 'received fragment! '+ name
          });
        }
        await ManageApps.saveFile(name, res.fragment);
      }
    })
    socket.on('deleteFile', async (res) => {
      console.log("receive delete file list")
      const list = res.list;
      for ( let i = 0; i < list.length; i++ ) {
        const path = `file://${RNFS.DocumentDirectoryPath}/${list[i]}`;
        const isExist = await RNFS.exists(path);
        if (isExist) {          
          await RNFS.unlink(path);
          console.log('successfully deleted fragmentation.'+list[i])
        }
      } 
    })
    socket.on('recreateOfferAnswer', async function(data) {
      console.log(data.filename)
      callbackFunction(true)
      await downloadByOffer(data.filename)
    })
    socket.on('offline', (data) => {
      console.log("offerConnections[data.to].callbackFunc");
      clearTimeout(offerConnections[data.to].timer);
      offerConnections[data.to].callbackFunc(false)
      offerConnections[data.to].close();
      delete offerConnections[data.to]
    })
    socket.on('moreSpaceOffer', (data) => {
      Toast.show({
        type: 'info',
        text1: 'Your cloud space be fulled. about '+data.full+"%",
        text2: 'You can see our offer in Offer Page',
        visibilityTime: 8000
      });
    })
    return socket;
  }

  const createOffer = async function(callId, filename, fragmentID, callbackFunc) {
    console.log(callId, filename, fragmentID)
    const peer = new RTCPeerConnection({
      iceServers: [
          {
            urls: 'turn:relay1.expressturn.com:3478',
            credential: '6Fs9mHa4Brr0FMV4',
            username: 'ef4QJS09JGT9H1TKXK'
          },        
          {urls:'stun:stun.l.google.com:19302'},
          {urls:'stun:stun1.l.google.com:19302'},
          {urls:'stun:stun2.l.google.com:19302'},
          {urls:'stun:stun3.l.google.com:19302'},
          {urls:'stun:stun4.l.google.com:19302'}
        ]
    });
    offerConnections[callId] = peer;
    peer.callbackFunc = callbackFunc;
    peer.timerr = null;
    peer.onicecandidate = e => {
      if (e.candidate) {
        console.log("offer->onicecandidate", e.candidate)
        socketIns.emit('icecandidate', {from: user_id, to: callId, candidate: e.candidate, isOffer: true})
      }
    }
    peer.oniceconnectionstatechange = (e, a) => {
      console.log("--<<<<<<<<--oniceconnectionstatechange => ", e, a)
    }
    const dataChannel =  peer.createDataChannel("dataChannel");
    let receivedBuffer = [];
    let totalBytesFileBuffer = 0;
    let totalBytesArrayBuffers = 0;
    let reconnectCount = 0
    const getCompleteFile = ( receivedArrayBuffers ) => {
      let offset = "";
      receivedArrayBuffers.forEach((arrayBuffer) => {
       offset += arrayBuffer;
      });
      callbackFunc(offset)
      return true;
    };
    dataChannel.onmessage = e => {
      if (peer.timerr) {
        clearTimeout(peer.timerr);
        peer.timerr = null
      }
      console.log("offer->dataChannel->onmessage")
      const { data } = e;
      try {
        if (totalBytesFileBuffer === 0) {
           const initMessage = JSON.parse(data);
           if (initMessage.type==='info') {
             totalBytesFileBuffer = initMessage.totalLength || 0;
           } else if (initMessage.type === 'nofile') {
            callbackFunc(false)
           }
        } else if(data === 'end') {
            getCompleteFile(
              receivedBuffer
            );
            dataChannel.send(JSON.stringify({type: 'received'}));
            dataChannel.close();
            peer.close();
            delete offerConnections[callId]
            receivedBuffer = [];
            totalBytesFileBuffer = 0;
            totalBytesArrayBuffers = 0;

        } else {
            receivedBuffer.push(data);
            totalBytesArrayBuffers += data.length;
            
        }
      } catch (err) {
        receivedBuffer = [];
        totalBytesFileBuffer = 0;
        totalBytesArrayBuffers = 0;
        // reconnectCount++;
        // dataChannel.send(JSON.stringify({type:'send', data:filename, fragmentID: fragmentID}));
        // if (reconnectCount > 3) {
        // }
        callbackFunc(false);
        console.log('error', reconnectCount, fragmentID)
      }
    };      
    dataChannel.onopen = e => {
      console.log("dataChannel opned!")
      dataChannel.send(JSON.stringify({type:'send', data:filename, fragmentID: fragmentID}));
    };
    dataChannel.onclose = e => {
      console.log("dataChannel closed")
    };     

    peer.createOffer().then(offer => {
      peer.setLocalDescription(new RTCSessionDescription(offer));
      // if (user_id !== callId) {
        peer.timerr = setTimeout(() => {
          console.log("FFFFFFFFFFFFFFFFFAILD!!!!!!!!!!!")
          peer.close();
          delete offerConnections[callId];
          callbackFunc(false);
        }, 5000)
      // }
      socketIns.emit('offer', {from: user_id, to: callId, offer: offer, reqdata: filename, isOffer: true});
    })

  }
  const recreateOffer = async function (filename, callbackFunc) {
    console.log('recreateOffer')
    await downloadByOffer(filename)
    callbackFunc(true);
  }
  const sendTrafficData = async function (data) {
    socketIns.emit('traffic', data);
  }
  const logout = function () {
    socketIns.emit('logout');
  }
  return {initSocket, createOffer,recreateOffer}
}
