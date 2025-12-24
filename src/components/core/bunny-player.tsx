import { useEffect, useState } from "react";
import { getEmbedUrl } from "../../service/api/bunny.apis";

const BunnyPlayer = ({ videoId }: { videoId: string }) => {
    const [embedUrl, setEmbedUrl] = useState<string>("")
    useEffect(() => {
        getEmbedUrl(videoId).then(data => setEmbedUrl(data.embedUrl));
    }, [videoId]);

    if (!embedUrl) return <div className="animate-pulse bg-richblack-800 h-40 w-full rounded-md">Loading Player...</div>;

    return (
        <div className="relative pt-[56.25%] border-white min-h-[200px] w-full">
            <iframe
                src={embedUrl}
                loading="lazy"
                className="absolute top-0 left-0 w-full h-full border-0 rounded-md"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen={true}
            ></iframe>
        </div>
    );
};

export default BunnyPlayer
