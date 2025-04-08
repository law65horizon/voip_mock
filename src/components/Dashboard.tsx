import React, { useState } from 'react';
import { Plus, Video, Users, Calendar, LogOut, Lock, Globe, UserPlus } from 'lucide-react';
import type { Meeting, User, JoinRequest } from '../types';
import { CreateMeetingModal } from './CreateMeetingModal';
import { JoinRequestModal } from './JoinRequestModal';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface DashboardProps {
  user: User;
  onStartMeeting: (isPrivate: boolean) => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onStartMeeting, onLogout }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  
  // Simulated meetings data
  const [meetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Team Standup',
      createdBy: user.id,
      createdAt: new Date(),
      participants: ['1', '2', '3'],
      status: 'scheduled',
      isPrivate: true,
      pendingRequests: ['4', '5']
    },
    {
      id: '2',
      title: 'Project Review',
      createdBy: user.id,
      createdAt: new Date(),
      participants: ['1', '2'],
      status: 'scheduled',
      isPrivate: false
    }
  ]);

  // Simulated join requests
  const [joinRequests] = useState<JoinRequest[]>([
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

  const handleCreateMeeting = (data: { title: string; isPrivate: boolean }) => {
    console.log('Creating meeting:', data);
    setShowCreateModal(false);
    onStartMeeting(data.isPrivate);
  };

  const handleApproveRequest = (requestId: string) => {
    console.log('Approving request:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejecting request:', requestId);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold text-foreground">MeetUp</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-foreground">{user.name}</span>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="text-foreground hover:text-foreground/80"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <div className="flex gap-2">
              {joinRequests.length > 0 && (
                <Button
                  onClick={() => setShowRequestsModal(true)}
                  className="flex items-center"
                  variant="secondary"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Join Requests ({joinRequests.length})
                </Button>
              )}
              <Button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center"
                id='startButton'
              >
                <Plus className="h-5 w-5 mr-2" />
                New Meeting
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Scheduled Meetings
                    </dt>
                    <dd className="text-3xl font-semibold text-foreground">
                      {meetings.filter(m => m.status === 'scheduled').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      Total Participants
                    </dt>
                    <dd className="text-3xl font-semibold text-foreground">
                      {meetings.reduce((acc, m) => acc + m.participants.length, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-foreground mb-4">Your Meetings</h2>
            <Card>
              <ul className="divide-y divide-border">
                {meetings.map((meeting) => (
                  <li key={meeting.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Video className="h-5 w-5 text-muted-foreground mr-3" />
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-primary truncate mr-2">
                              {meeting.title}
                            </p>
                            {meeting.isPrivate ? (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex items-center gap-2">
                          {meeting.pendingRequests && meeting.pendingRequests.length > 0 && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              {meeting.pendingRequests.length} pending
                            </span>
                          )}
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {meeting.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-muted-foreground">
                            <Users className="flex-shrink-0 mr-1.5 h-4 w-4" />
                            {meeting.participants.length} participants
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-muted-foreground sm:mt-0">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          <p>
                            Created {new Date(meeting.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </main>

      {showCreateModal && (
        <CreateMeetingModal
          onClose={() => setShowCreateModal(false)}
          onCreateMeeting={handleCreateMeeting}
        />
      )}

      {showRequestsModal && (
        <JoinRequestModal
          requests={joinRequests}
          onClose={() => setShowRequestsModal(false)}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      )}
    </div>
  );
};