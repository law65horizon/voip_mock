let pc: any;
let localstream: any;
const localVideo: HTMLVideoElement = document.getElementById('localVideo') as HTMLVideoElement;
const remoteVideo: HTMLVideoElement = document.getElementById('remoteVideo') as HTMLVideoElement;
const startButton: HTMLButtonElement = document.getElementById('startButton') as HTMLButtonElement;
const leaveCallButton: HTMLButtonElement = document.getElementById('leaveCallButton') as HTMLButtonElement;
console.log(startButton, 'pop');
const signaling = new BroadcastChannel(('webrtc'));
signaling.onmessage = e => {
    if(!localstream) {
        console.log('not ready yet');
        return;
    }
     switch (e.data.type) {
        case 'offer': 
            handleOffer(e.data);
            break;
        case 'answer': 
            handleAnswer(e.data);
            break;
        case 'candidate':
            handleCandidate(e.data);
            break;
        case 'ready': 
            if(pc) {
                console.log('already in call, ignoring');
                return;
            }
            makeCall();
            break;
        case 'bye': 
            if(pc) {
                hangup();
            }
            break;
        default:
            console.log('unhandled', e);
            break;
     }
}

// startButton.onclick = async () => {
export const start = async () => {
    console.log('doiw', startButton);
    localstream = await navigator.mediaDevices.getUserMedia({audio:true, video: true});
    localVideo.srcObject = localstream;

    startButton.disabled = true;
    leaveCallButton.disabled = false;

    signaling.postMessage({type: 'ready'});
}

export const end = async () => {
    hangup();
    signaling.postMessage({type: 'bye'});
}


export const createPeerConnection = async () => {
    pc = new RTCPeerConnection();
    pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
        const message : {type: string; candidate: string | null; sdpMid: string | null; sdpMLineIndex: any} = {
            type: 'candidate',
            candidate: null,
            sdpMid: null,
            sdpMLineIndex: null
        };
        if (e.candidate) {
            message.candidate = e.candidate.candidate;
            message.sdpMid = e.candidate.sdpMid;
            message.sdpMLineIndex = e.candidate.sdpMLineIndex;
        }
        signaling.postMessage(message);
    };
    pc.ontrack = (e: RTCTrackEvent) => {
        remoteVideo.srcObject = e.streams[0];
    };
    localstream.getTracks().forEach((track: any) => pc.addTrack(track. localstream));
}


export const makeCall = async() => {
    await createPeerConnection();

    const offer: RTCSessionDescription = await pc.createOffer();
    signaling.postMessage({type: 'offer', sdp: offer.sdp});
    await pc.setLocalDescription(offer);
}

async function hangup() {
    if(pc) {
        pc.close();
        pc = null;
    }
    localstream.getTracks().forEach((track:any) => track.stop());
    localstream = null;
    startButton.disabled = false;
    leaveCallButton.disabled = true;
    
}

async function handleOffer(offer: any) {
    if(pc){
        console.error('existing peerconnection');
        return;
    }
    await createPeerConnection();
    await pc.setRemoteDescription(offer);

    const answer: RTCSessionDescription = await pc.createAnswer();
    signaling.postMessage({type: 'answer', sdp: answer.sdp});
}

async function handleAnswer(answer: any) {
    if(pc) {
        console.error('no peerconnection');
        return;
    }
     await pc.setRemoteDescription(answer);
}

async function handleCandidate(candidate: RTCPeerConnectionIceEvent) {
    if(!pc) {
        console.error('no peerconnection');
        return;
    }
    if(!candidate.candidate) {
        await pc.addIceCandidate(null);
    }
    else{
        await pc.addIceCandidate(candidate);
    }
}



// import { useEffect, useRef } from "react";


// const meetingController = () => {
//     let pc: any;
//     let localstream: any;
//     const localVideoRef = useRef<HTMLVideoElement>(null)
//     const remoteVideoRef = useRef<HTMLVideoElement>(null)
//     const startButtonRef = useRef<HTMLButtonElement>(null)
//     const leaveCallButtonRef = useRef<HTMLButtonElement>(null)
//     let localVideo: any
//     let remoteVideo: any
//     let startButton: any
//     let leaveCallButton: any
    
//     useEffect(() => {
//        localVideo  = localVideoRef.current
//        remoteVideo = remoteVideoRef.current 
//        startButton  = startButtonRef.current
//        leaveCallButton = leaveCallButtonRef.current
//     }, [])

//     console.log(startButton, 'pop')
//     const signaling = new BroadcastChannel(('webrtc'))
//     signaling.onmessage = e => {
//         if(!localstream) {
//             console.log('not ready yet')
//             return
//         }
//         switch (e.data.type) {
//             case 'offer': 
//                 handleOffer(e.data)
//                 break;
//             case 'answer': 
//                 handleAnswer(e.data)
//                 break;
//             case 'candidate':
//                 handleCandidate(e.data)
//                 break;
//             case 'ready': 
//                 if(pc) {
//                     console.log('already in call, ignoring')
//                     return;
//                 }
//                 makeCall();
//                 break;
//             case 'bye': 
//                 if(pc) {
//                     hangup()
//                 }
//                 break
//             default:
//                 console.log('unhandled', e)
//                 break
//         }
//     }
    
//     // startButton.onclick = async () => {
//     startButton.onclick = async () => {
//         console.log('doiw', startButton)
//         localstream = await navigator.mediaDevices.getUserMedia({audio:true, video: true})
//         localVideo.srcObject = localstream;
    
//         startButton.disabled = true;
//         leaveCallButton.disabled = false
    
//         signaling.postMessage({type: 'ready'})
//     }
    
//     leaveCallButton.onclick = async () => {
//         hangup();
//         signaling.postMessage({type: 'bye'})
//     }
    
    
//     const createPeerConnection = async () => {
//         pc = new RTCPeerConnection()
//         pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
//             const message : {type: string; candidate: string | null; sdpMid: string | null; sdpMLineIndex: any} = {
//                 type: 'candidate',
//                 candidate: null,
//                 sdpMid: null,
//                 sdpMLineIndex: null
//             }
//             if (e.candidate) {
//                 message.candidate = e.candidate.candidate
//                 message.sdpMid = e.candidate.sdpMid
//                 message.sdpMLineIndex = e.candidate.sdpMLineIndex
//             }
//             signaling.postMessage(message)
//         }
//         pc.ontrack = (e: RTCTrackEvent) => {
//             remoteVideo.srcObject = e.streams[0]
//         }
//         localstream.getTracks().forEach((track: any) => pc.addTrack(track. localstream))
//     }
    
    
//     const makeCall = async() => {
//         await createPeerConnection()
    
//         const offer: RTCSessionDescription = await pc.createOffer()
//         signaling.postMessage({type: 'offer', sdp: offer.sdp})
//         await pc.setLocalDescription(offer)
//     }
    
//     async function hangup() {
//         if(pc) {
//             pc.close();
//             pc = null;
//         }
//         localstream.getTracks().forEach((track:any) => track.stop())
//         localstream = null;
//         startButton.disabled = false;
//         leaveCallButton.disabled = true;
        
//     }
    
//     async function handleOffer(offer: any) {
//         if(pc){
//             console.error('existing peerconnection')
//             return
//         }
//         await createPeerConnection()
//         await pc.setRemoteDescription(offer)
    
//         const answer: RTCSessionDescription = await pc.createAnswer()
//         signaling.postMessage({type: 'answer', sdp: answer.sdp})
//     }
    
//     async function handleAnswer(answer: any) {
//         if(pc) {
//             console.error('no peerconnection')
//             return
//         }
//          await pc.setRemoteDescription(answer)
    
//     }
    
//     async function handleCandidate(candidate: RTCPeerConnectionIceEvent) {
//         if(!pc) {
//             console.error('no peerconnection')
//             return
//         }
//         if(!candidate.candidate) {
//             await pc.addIceCandidate(null)
//         }
//         else{
//             await pc.addIceCandidate(candidate)
//         }
//     }
// }

// export default meetingController


