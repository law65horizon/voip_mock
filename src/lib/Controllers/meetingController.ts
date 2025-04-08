// let pc: any;
// let localstream: any;
// let localVideo: HTMLVideoElement = document.getElementById('localVideo') as HTMLVideoElement;
// const remoteVideo: HTMLVideoElement = document.getElementById('remoteVideo') as HTMLVideoElement;
// const startButton: HTMLButtonElement = document.getElementById('startButton') as HTMLButtonElement;
// const leaveCallButton: HTMLButtonElement = document.getElementById('leaveCallButton') as HTMLButtonElement;
// console.log(startButton, 'pop');

// document.addEventListener('DOMContentLoaded', () => {
//     const ms = document.getElementById('localVideo')
//     console.log(ms, 'ms')
// })


// const signaling = new BroadcastChannel(('webrtc'));
// signaling.onmessage = e => {
//     if(!localstream) {
//         console.log('not ready yet');
//         return;
//     }
//      switch (e.data.type) {
//         case 'offer': 
//             handleOffer(e.data);
//             break;
//         case 'answer': 
//             handleAnswer(e.data);
//             break;
//         case 'candidate':
//             handleCandidate(e.data);
//             break;
//         case 'ready': 
//             if(pc) {
//                 console.log('already in call, ignoring');
//                 return;
//             }
//             makeCall();
//             break;
//         case 'bye': 
//             if(pc) {
//                 hangup();
//             }
//             break;
//         default:
//             console.log('unhandled', e);
//             break;
//      }
// }

// // startButton.onclick = async () => {
// export const start = async () => {
//     console.log('doiw', startButton);
//     localstream = await navigator.mediaDevices.getUserMedia({audio:true, video: true});
//     localVideo.srcObject = localstream;

//     startButton.disabled = true;
//     leaveCallButton.disabled = false;

//     signaling.postMessage({type: 'ready'});
// }

// export const end = async () => {
//     hangup();
//     signaling.postMessage({type: 'bye'});
// }


// export const createPeerConnection = async () => {
//     pc = new RTCPeerConnection();
//     pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
//         const message : {type: string; candidate: string | null; sdpMid: string | null; sdpMLineIndex: any} = {
//             type: 'candidate',
//             candidate: null,
//             sdpMid: null,
//             sdpMLineIndex: null
//         };
//         if (e.candidate) {
//             message.candidate = e.candidate.candidate;
//             message.sdpMid = e.candidate.sdpMid;
//             message.sdpMLineIndex = e.candidate.sdpMLineIndex;
//         }
//         signaling.postMessage(message);
//     };
//     pc.ontrack = (e: RTCTrackEvent) => {
//         remoteVideo.srcObject = e.streams[0];
//     };
//     localstream.getTracks().forEach((track: any) => pc.addTrack(track. localstream));
// }


// export const makeCall = async() => {
//     await createPeerConnection();

//     const offer: RTCSessionDescription = await pc.createOffer();
//     signaling.postMessage({type: 'offer', sdp: offer.sdp});
//     await pc.setLocalDescription(offer);
// }

// async function hangup() {
//     if(pc) {
//         pc.close();
//         pc = null;
//     }
//     localstream.getTracks().forEach((track:any) => track.stop());
//     localstream = null;
//     startButton.disabled = false;
//     leaveCallButton.disabled = true;
    
// }

// async function handleOffer(offer: any) {
//     if(pc){
//         console.error('existing peerconnection');
//         return;
//     }
//     await createPeerConnection();
//     await pc.setRemoteDescription(offer);

//     const answer: RTCSessionDescription = await pc.createAnswer();
//     signaling.postMessage({type: 'answer', sdp: answer.sdp});
// }

// async function handleAnswer(answer: any) {
//     if(pc) {
//         console.error('no peerconnection');
//         return;
//     }
//      await pc.setRemoteDescription(answer);
// }

// async function handleCandidate(candidate: RTCPeerConnectionIceEvent) {
//     if(!pc) {
//         console.error('no peerconnection');
//         return;
//     }
//     if(!candidate.candidate) {
//         await pc.addIceCandidate(null);
//     }
//     else{
//         await pc.addIceCandidate(candidate);
//     }
// }




// controller.ts

// let pc: RTCPeerConnection | null = null;



// // controller.ts

let pc: any
let localstream: MediaStream | null = null;
let localVideo: HTMLVideoElement | null = null;
let remoteVideo: HTMLVideoElement | null = null;
let startButton: HTMLButtonElement | null = null;
let leaveCallButton: HTMLButtonElement | null = null;

export function initController() {
  // These elements are assumed to be available on initial load.
  // For the video element that is rendered later, we'll query it when needed.
  localVideo = document.getElementById('You') as HTMLVideoElement;
  remoteVideo = document.getElementById('John_Doe') as HTMLVideoElement;
  startButton = document.getElementById('startButton') as HTMLButtonElement;
  leaveCallButton = document.getElementById('leaveCallButton') as HTMLButtonElement;

  if (!localVideo || !remoteVideo || !leaveCallButton || !startButton) {
    console.error('Essential DOM elements not found during initialization');
  } 
}

const signaling = new BroadcastChannel('webrtc');
signaling.onmessage = e => {
  console.log('misissipi')
  if (!localstream) {
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
      if (pc) {
        console.log('already in call, ignoring');
        return;
      }
      makeCall();
      break;
    case 'bye': 
      if (pc) {
        hangup();
      }
      break;
    default:
      console.log('unhandled', e);
      break;
  }
};

export const start = async () => {
  // Since the localVideo element is rendered only after a button click,
  // we query it at the time this function runs.
  if (!localVideo) {
    console.error('localVideo element not found. It might not be rendered yet.');
    return;
  }
  // if (!startButton || !leaveCallButton) {
  //   console.error('Control buttons not found.');
  //   return;
  // }

  try {
    localstream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    console.log('loclal', localstream)
    localVideo.srcObject = localstream;
    // startButton.disabled = true;
    // leaveCallButton.disabled = false;
    signaling.postMessage({ type: 'ready' });
  } catch (err) {
    console.error('Error accessing media devices.', err);
  }
};

export const end = async () => {
  hangup();
  signaling.postMessage({ type: 'bye' });
};

export const createPeerConnection = async () => {
  pc = new RTCPeerConnection();

  pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
    const message = {
      type: 'candidate',
      candidate: e.candidate ? e.candidate.candidate : null,
      sdpMid: e.candidate ? e.candidate.sdpMid : null,
      sdpMLineIndex: e.candidate ? e.candidate.sdpMLineIndex : null
    };
    signaling.postMessage(message);
  };

  pc.ontrack = (e: RTCTrackEvent) => {
    const stream = e.streams[0];
    if (remoteVideo && remoteVideo.srcObject !== stream) {
      remoteVideo.pause();
      remoteVideo.srcObject = stream;
      remoteVideo.load();
  
      // Wait for the video to be ready before calling play()
      // remoteVideo.oncanplay = () => {
        remoteVideo.play().catch(error => {
          console.error("Playback error:", error);
        });
      // };
    }
  };
  
  

  localstream?.getTracks().forEach((track: MediaStreamTrack) => {
    if (pc && localstream) {
      pc.addTrack(track, localstream);
    }
  });
};

export const makeCall = async () => {
  await createPeerConnection();
  if (!pc) return;

  const offer = await pc.createOffer();
  console.log('makecall')
  await pc.setLocalDescription(offer);
  signaling.postMessage({ type: 'offer', sdp: offer.sdp });
};

async function hangup() {
  if (pc) {
    pc.close();
    pc = null;
  }
  if (localstream) {
    localstream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    localstream = null;
  }
  if (startButton && leaveCallButton) {
    startButton.disabled = false;
    leaveCallButton.disabled = true;
  }
}

async function handleOffer(offer: any) {
  if (pc) {
    console.error('Existing peer connection.');
    return;
  }
  await createPeerConnection();
  if (!pc) return;
  await pc.setRemoteDescription(offer);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  signaling.postMessage({ type: 'answer', sdp: answer.sdp });
  console.log('offer')
}

async function handleAnswer(answer: any) {
  if (!pc) {
    console.error('No peer connection.');
    return;
  }
  await pc.setRemoteDescription(answer);
}

async function handleCandidate(candidate: any) {
  if (!pc) {
    console.error('No peer connection.');
    return;
  }
  if (!candidate.candidate) {
    await pc.addIceCandidate(null);
  } else {
    await pc.addIceCandidate(candidate);
  }
}


