import React, { useEffect } from 'react'
import { VideoGrid } from './VideoGrid'
import { Controls } from './Controls'
import { ChatMessage, JoinRequest, Participant } from '@/types';
import { Chat } from './Chat';
import { initController, start } from '@/lib/Controllers/meetingController';

interface MeetingProps {
  participants: Participant[]
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  pendingRequests: JoinRequest[];
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onLeaveCall: () => void;
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  messages: ChatMessage[];
  onSendMessage: () => void;
}


const MeetingForum: React.FC<MeetingProps> = ({
    participants,
    isMuted,
    isVideoOff,
    isScreenSharing,
    isChatOpen,
    pendingRequests,
    onToggleMute,
    onToggleVideo,
    onToggleScreenShare,
    onToggleChat,
    onLeaveCall,
    onApproveRequest,
    onRejectRequest,
    messages,
    onSendMessage
}) => {
  useEffect(() => {
    // console.log(document.getElementById('localVideo'), 'iwoiewo')
    initController()
    const startButton = document.getElementById('startButton') as HTMLButtonElement;
    startButton.onclick = start
    // start()
   }, [])
  return (
    <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex gap-4">
              <div className={`flex-1 ${isChatOpen ? 'w-3/4' : 'w-full'}`}>
              <button id='startButton'>start</button>
                <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
                  <VideoGrid participants={participants} />
                  <Controls
                    isMuted={isMuted}
                    isVideoOff={isVideoOff}
                    isScreenSharing={isScreenSharing}
                    isChatOpen={isChatOpen}
                    pendingRequests={pendingRequests}
                    onToggleMute={onToggleMute}
                    onToggleVideo={onToggleVideo}
                    onToggleScreenShare={onToggleScreenShare}
                    onToggleChat={onToggleChat}
                    onLeaveCall={onLeaveCall}
                    onApproveRequest={onApproveRequest}
                    onRejectRequest={onRejectRequest}
                  />
                </div>
              </div>
              
              {isChatOpen && (
                <div className="w-1/4 h-[calc(100vh-4rem)]">
                  <Chat messages={messages} onSendMessage={onSendMessage} />
                </div>
              )}
            </div>
          </div>
    </div>
  )
}

export default MeetingForum