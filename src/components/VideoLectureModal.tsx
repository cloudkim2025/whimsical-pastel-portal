
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
}

const VideoLectureModal: React.FC<VideoLectureModalProps> = ({ isOpen, onClose, course }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<Record<number, string[]>>({});

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Change playback rate
  const changePlaybackRate = () => {
    const rates = [0.5, 1, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  // Add note
  const addNote = () => {
    if (!note.trim()) return;
    
    setNotes(prevNotes => {
      const lectureNotes = prevNotes[currentLecture] || [];
      return {
        ...prevNotes,
        [currentLecture]: [...lectureNotes, note]
      };
    });
    setNote('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl p-0 h-[80vh] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Video Player (Left side - 2/3) */}
          <div className="md:col-span-2 bg-black flex flex-col h-full">
            <div className="flex-grow relative">
              {/* Placeholder for video */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={course?.image || "https://api.dicebear.com/7.x/shapes/svg?seed=video"} 
                  alt="Video Placeholder"
                  className="w-full h-full object-contain"
                />
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      onClick={togglePlay}
                      variant="outline" 
                      size="icon"
                      className="rounded-full bg-white/20 hover:bg-white/30 h-20 w-20 border-white"
                    >
                      <Play size={36} className="text-white" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Video Controls */}
            <div className="bg-black/90 p-4 space-y-2">
              {/* Progress Bar (Placeholder) */}
              <div className="h-1 bg-gray-700 rounded overflow-hidden">
                <div className="h-full bg-ghibli-meadow" style={{ width: '30%' }}></div>
              </div>
              
              {/* Control Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-4 items-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={togglePlay}
                    className="text-white hover:bg-white/10"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleMute}
                    className="text-white hover:bg-white/10"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 h-8 px-2 text-xs"
                    onClick={changePlaybackRate}
                  >
                    {playbackRate}x
                  </Button>
                </div>
                
                <div className="text-white text-sm">
                  00:45 / 12:30
                </div>
              </div>
            </div>
          </div>
          
          {/* Curriculum and Notes (Right side - 1/3) */}
          <div className="md:col-span-1 flex flex-col h-full border-l border-gray-200">
            {/* Curriculum */}
            <div className="flex-grow overflow-y-auto bg-white p-4">
              <h3 className="text-lg font-semibold mb-4 text-ghibli-forest">강의 커리큘럼</h3>
              <div className="space-y-2">
                {course?.curriculum?.map((section: any, sectionIndex: number) => (
                  <div key={sectionIndex} className="mb-4">
                    <h4 className="text-sm font-medium mb-2">{section.title}</h4>
                    {section.lectures.map((lecture: string, lectureIndex: number) => {
                      const globalLectureIndex = course.curriculum.slice(0, sectionIndex).reduce(
                        (acc: number, s: any) => acc + s.lectures.length, 0
                      ) + lectureIndex;
                      
                      return (
                        <Button 
                          key={lectureIndex}
                          variant={currentLecture === globalLectureIndex ? "default" : "outline"}
                          className={`w-full justify-start text-left mb-1 ${currentLecture === globalLectureIndex ? 'bg-ghibli-meadow text-white' : 'text-ghibli-midnight'}`}
                          onClick={() => setCurrentLecture(globalLectureIndex)}
                        >
                          <span className="truncate">{lecture}</span>
                        </Button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Notes */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-col h-1/3">
              <h3 className="text-sm font-semibold mb-2 text-ghibli-forest">강의 메모</h3>
              
              <div className="flex-grow overflow-y-auto mb-3 space-y-2">
                {(notes[currentLecture] || []).map((note, index) => (
                  <div key={index} className="bg-white p-2 rounded shadow-sm text-sm">
                    {note}
                  </div>
                ))}
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="메모를 입력하세요..."
                  className="flex-grow border rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ghibli-meadow"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addNote();
                  }}
                />
                <Button 
                  onClick={addNote}
                  className="rounded-l-none bg-ghibli-meadow hover:bg-ghibli-forest"
                >
                  저장
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoLectureModal;
