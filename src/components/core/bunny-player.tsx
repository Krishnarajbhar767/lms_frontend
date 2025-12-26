import { useEffect, useState } from "react";
import { getEmbedUrl } from "../../service/api/bunny.apis";
import { FaPlay } from "react-icons/fa";

const BunnyPlayer = ({ videoId }: { videoId: string }) => {
    const [embedUrl, setEmbedUrl] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Only fetch embed URL when the user actually wants to play
        if (isPlaying && !embedUrl) {
            setIsLoading(true);
            getEmbedUrl(videoId).then(data => {
                setEmbedUrl(data.embedUrl);
                setIsLoading(false);
            }).catch(() => setIsLoading(false));
        }
    }, [videoId, isPlaying, embedUrl]);

    return (
        <div className="relative w-full aspect-video bg-richblack-900 rounded-md overflow-hidden border border-richblack-700 group">
            {!isPlaying ? (
                // Premium Play Overlay
                <div
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-black/60 bg-richblack-800/40 backdrop-blur-[2px]"
                >
                    <div className="w-16 h-16 flex items-center justify-center bg-yellow-50 rounded-full text-richblack-900 shadow-[0_0_20px_rgba(255,214,10,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:bg-yellow-100">
                        <FaPlay className="ml-1 text-2xl animate-pulse-slow" />
                    </div>
                    <p className="mt-4 text-richblack-50 font-medium tracking-wide uppercase text-xs opacity-80 group-hover:opacity-100 transition-opacity">
                        Watch Lesson
                    </p>
                </div>
            ) : (
                <>
                    {/* Loading State */}
                    {isLoading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-richblack-900/90 backdrop-blur-sm">
                            <div className="w-12 h-12 border-4 border-yellow-50/20 border-t-yellow-50 rounded-full animate-spin mb-4" />
                            <p className="text-richblack-200 text-sm font-medium animate-pulse">Preparing Video...</p>
                        </div>
                    )}

                    {/* The Player */}
                    {embedUrl && (
                        <iframe
                            src={embedUrl.includes('?') ? `${embedUrl}&autoplay=true` : `${embedUrl}?autoplay=true`}
                            className="absolute top-0 left-0 w-full h-full border-0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    )}
                </>
            )}
        </div>
    );
};

export default BunnyPlayer;
