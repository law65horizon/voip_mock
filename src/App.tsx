import { useState, useCallback } from 'react';
// import { VideoGrid } from './components/VideoGrid';
// import { Controls } from './components/Controls';
// import { Chat } from './components/Chat';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { ThemeToggle } from './components/theme-toggle';
import type { Participant, ChatMessage, User, JoinRequest } from './types';
import MeetingForum from './components/MeetingForum';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Video call states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  

  // Join requests state
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([
    {
      id: '1',
      userId: '4',
      userName: 'Alice Johnson',
      meetingId: '1',
      status: 'pending',
      timestamp: new Date()
    },
    {
      id: '2',
      userId: '5',
      userName: 'Bob Wilson',
      meetingId: '1',
      status: 'pending',
      timestamp: new Date()
    }
  ]);

  // Simulated participants data
  const [participants] = useState<Participant[]>([
    {
      id: '1',
      name: 'You',
      isScreenSharing: isScreenSharing,
      isMuted: isMuted,
      isVideoOff: isVideoOff,
    },
    {
      id: '2',
      name: 'John_Doe',
      isScreenSharing: false,
      isMuted: false,
      isVideoOff: false,
    },
    {
      id: '3',
      name: 'John_Does',
      isScreenSharing: false,
      isMuted: false,
      isVideoOff: false,
    },
  ]);

  const handleAuth = useCallback((data: { email: string; password: string; name?: string }) => {
    setUser({
      id: '1',
      email: data.email,
      name: data.name || data.email.split('@')[0],
    });
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setIsInCall(false);
  }, []);

  const handleStartMeeting = useCallback(async() => {
    setIsInCall(true);
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const handleToggleVideo = useCallback(() => {
    setIsVideoOff((prev) => !prev);
  }, []);

  const handleToggleScreenShare = useCallback(() => {
    setIsScreenSharing((prev) => !prev);
  }, []);

  const handleToggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  const handleLeaveCall = useCallback(() => {
    setIsInCall(false);
  }, []);

  const handleSendMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: '1',
      senderName: 'You',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const handleApproveRequest = useCallback((requestId: string) => {
    setJoinRequests(prev => prev.filter(request => request.id !== requestId));
  }, []);

  const handleRejectRequest = useCallback((requestId: string) => {
    setJoinRequests(prev => prev.filter(request => request.id !== requestId));
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <AuthForm
          mode={authMode}
          onSubmit={handleAuth}
          onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
        />
      </div>
    );
  }

  if (!isInCall) {
    return (
      <Dashboard
        user={user}
        onStartMeeting={handleStartMeeting}
        onLogout={handleLogout}
      />
    );
  }
  return (<>
    <MeetingForum 
      isChatOpen={isChatOpen}
      isMuted={isMuted}
      isVideoOff={isVideoOff}
      participants={participants}
      isScreenSharing={isScreenSharing}
      pendingRequests={joinRequests}
      onToggleMute={handleToggleMute}
      onToggleVideo={handleToggleVideo}
      onToggleScreenShare={handleToggleScreenShare}
      onToggleChat={handleToggleChat}
      handleSendMessage={handleSendMessage}
      onLeaveCall={handleLeaveCall}
      onApproveRequest={handleApproveRequest}
      onRejectRequest={handleRejectRequest}
      messages={messages}
      
    />
    {/* <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4">
          <div className={`flex-1 ${isChatOpen ? 'w-3/4' : 'w-full'}`}>
            <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
              <VideoGrid participants={participants} />
              <Controls
                isMuted={isMuted}
                isVideoOff={isVideoOff}
                isScreenSharing={isScreenSharing}
                isChatOpen={isChatOpen}
                pendingRequests={joinRequests}
                onToggleMute={handleToggleMute}
                onToggleVideo={handleToggleVideo}
                onToggleScreenShare={handleToggleScreenShare}
                onToggleChat={handleToggleChat}
                onLeaveCall={handleLeaveCall}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
              />
            </div>
          </div>
          
          {isChatOpen && (
            <div className="w-1/4 h-[calc(100vh-4rem)]">
              <Chat messages={messages} onSendMessage={handleSendMessage} />
            </div>
          )}
        </div>
      </div>
    </div> */}
  </>);
}

export default App;