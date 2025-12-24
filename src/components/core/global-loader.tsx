import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export default function GlobalLoader() {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();

    const showLoader = isFetching > 0 || isMutating > 0;

    return (
        <div className="fixed top-0 left-0 z-50 w-full h-[3px] overflow-hidden bg-transparent">
            {showLoader && (
                <div className="h-full bg-yellow-50 animate-progress origin-left"></div>
            )}
            <style>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(-30%); }
                    100% { transform: translateX(100%); }
                }
                .animate-progress {
                    animation: progress 1.5s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
}