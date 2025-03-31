
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, MessageSquare, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

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
  const [currentPlayTime, setCurrentPlayTime] = useState(0); // Track current video playback time

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, we would control the video playback here
    if (!isPlaying) {
      // Start incrementing the play time as a simulation of video progression
      const interval = setInterval(() => {
        setCurrentPlayTime((time) => {
          if (time < 750) { // 12:30 in seconds
            return time + 1;
          } else {
            clearInterval(interval);
            return time;
          }
        });
      }, 1000);
      
      // Store the interval ID to clear it when pausing or unmounting
      return () => clearInterval(interval);
    }
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
      // Add timestamp to the note
      const formattedTime = formatTime(currentPlayTime);
      const noteWithTimestamp = `[${formattedTime}] ${note}`;
      
      return {
        ...prevNotes,
        [currentLecture]: [...lectureNotes, noteWithTimestamp]
      };
    });
    
    toast.success('메모가 저장되었습니다.');
    setNote('');
  };

  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
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
              {/* Progress Bar */}
              <div className="h-1 bg-gray-700 rounded overflow-hidden">
                <div 
                  className="h-full bg-ghibli-meadow" 
                  style={{ width: `${(currentPlayTime / 750) * 100}%` }}
                ></div>
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
                  {formatTime(currentPlayTime)} / 12:30
                </div>
              </div>
            </div>
          </div>
          
          {/* Curriculum and Notes (Right side - 1/3) */}
          <div className="md:col-span-1 flex flex-col h-full border-l border-gray-200 bg-white">
            {/* Tabs for Curriculum and Notes */}
            <div className="flex border-b border-gray-200">
              <button 
                className="flex-1 py-3 px-4 font-medium border-b-2 border-ghibli-meadow text-ghibli-forest"
              >
                강의 커리큘럼
              </button>
            </div>
            
            {/* Curriculum */}
            <div className="h-[45%] overflow-y-auto bg-white p-4">
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
            
            {/* Notes Section */}
            <div className="flex flex-col h-[55%] border-t border-gray-200">
              {/* Notes Header */}
              <div className="bg-ghibli-cloud/30 p-3 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-ghibli-forest" />
                  <h3 className="text-sm font-semibold text-ghibli-forest">강의 메모</h3>
                </div>
                <div className="text-xs text-ghibli-stone">
                  {(notes[currentLecture] || []).length}개의 메모
                </div>
              </div>
              
              {/* Notes Display Area */}
              <div className="flex-grow overflow-y-auto p-3 space-y-2 bg-gray-50">
                {/* Future: Lecture Transcript with Notes */}
                <div className="text-xs text-ghibli-stone mb-2">
                  <p>* 추후 백엔드 연동 시 강의 프롬프트가 표시될 예정입니다</p>
                </div>
                
                {/* Notes */}
                {(notes[currentLecture] || []).length > 0 ? (
                  (notes[currentLecture] || []).map((noteText, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-3 rounded shadow-sm text-sm border-l-2 border-ghibli-meadow animate-fadeIn"
                    >
                      {noteText}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-ghibli-stone">
                    <p>아직 작성된 메모가 없습니다</p>
                    <p className="text-xs mt-1">영상을 시청하며 메모를 작성해보세요</p>
                  </div>
                )}
              </div>
              
              {/* Note Input */}
              <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex flex-col">
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="강의를 듣고 메모를 작성해보세요..."
                    className="resize-none text-sm min-h-[80px] mb-2 border-ghibli-meadow/30 focus:border-ghibli-meadow"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        addNote();
                      }
                    }}
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-ghibli-stone">
                      Ctrl+Enter로 빠르게 저장
                    </div>
                    <Button 
                      onClick={addNote}
                      disabled={!note.trim()}
                      className="bg-ghibli-meadow hover:bg-ghibli-forest"
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-1" /> 메모 저장
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoLectureModal;
