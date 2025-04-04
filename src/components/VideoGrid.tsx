import React from 'react';
import { Camera, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import type { Participant } from '../types';
import { cn } from '@/lib/utils';

interface VideoGridProps {
  participants: Participant[];
}

export const VideoGrid: React.FC<VideoGridProps> = ({ participants }) => {

  return (
    <div className={`grid grid-cols-2 gap-4 p-4 w-full h-[83vh]`}>
      {participants.map((participant) => (
        <div
          key={participant.id}
          className={cn(
            "relative aspect-video rounded-xl overflow-hidden",
            "bg-card text-card-foreground shadow-lg transition-all",
            "hover:ring-2 hover:ring-ring",
            "dark:bg-card/90"
          )}
        >
          {!participant.isVideoOff ? (
            <img
              src={`https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&auto=format&fit=crop&q=80`}
              alt={participant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl text-primary">
                  {participant.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-3 flex items-center justify-between">
            <span className="font-medium">{participant.name}</span>
            <div className="flex gap-2">
              {participant.isMuted ? (
                <MicOff className="w-5 h-5 text-destructive" />
              ) : (
                <Mic className="w-5 h-5 text-muted-foreground" />
              )}
              {participant.isVideoOff ? (
                <VideoOff className="w-5 h-5 text-destructive" />
              ) : (
                <Video className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};