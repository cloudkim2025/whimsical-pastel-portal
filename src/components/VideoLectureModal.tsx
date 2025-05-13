import React, {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogTitle} from '@/components/ui/dialog';
import {videoAPI} from '@/api/video';

interface VideoPlayerModalProps {
    isOpen: boolean,
    onClose: () => void,
    lectureId: number,
    course?: any
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({isOpen, onClose, lectureId, course}) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVideoUrl = async () => {
        if (!lectureId) return;
        setLoading(true);
        setError(null);

        try {
            const res = await videoAPI.getVideoStreamUrl(lectureId);
            console.log('🎥 video URL:', res.data.url);
            setVideoUrl(res.data.url);
        } catch (err) {
            console.error('비디오 URL 요청 실패:', err);
            setError('비디오를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchVideoUrl();
        } else {
            setVideoUrl(null); // 닫힐 때 정리
        }
    }, [isOpen, lectureId]);

    const handleVideoError = () => {
        console.error('Video playback error:', videoUrl);
        setError('비디오 재생 중 오류가 발생했습니다.');
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) onClose();
        }}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden">
                <DialogTitle className="sr-only">비디오 강의 재생</DialogTitle>
                <div className="w-full aspect-video flex items-center justify-center bg-black">
                    {loading && (
                        <p className="text-white text-lg">비디오를 불러오는 중...</p>
                    )}

                    {!loading && error && (
                        <div className="text-red-400 text-sm p-4 text-center">
                            <p>{error}</p>
                            <button
                                className="mt-2 px-3 py-1 bg-blue-600 rounded-md text-white text-sm"
                                onClick={fetchVideoUrl}
                            >
                                다시 시도
                            </button>
                        </div>
                    )}

                    {!loading && !error && videoUrl && (
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            crossOrigin="anonymous"
                            key={videoUrl}
                            onPlay={() => console.log('🔈 비디오 재생 시작')}
                            onLoadedData={() => console.log('✅ 비디오 로딩 완료')}
                            onError={(e) => {
                                console.error('❌ 비디오 재생 에러', e);
                            }}
                            style={{width: "100%", height: "100%"}}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VideoPlayerModal;
