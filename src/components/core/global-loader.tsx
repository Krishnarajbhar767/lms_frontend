import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export default function GlobalLoader() {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();

    const showLoader = isFetching > 0 || isMutating > 0;

    return (
        <>
            {
                showLoader && <div className="fixed top-0 left-0 z-[100000000] w-full h-[4px] overflow-hidden bg-transparent shadow-[0_0_15px_rgba(255,214,10,0.3)]">

                    <div className="relative h-full w-full">
                        {/* Primary flowing wave - using theme yellow */}
                        <div className="absolute inset-0 bg-linear-to-r from-yellow-500 via-yellow-50 to-yellow-500 bg-size-[200%_100%] animate-wave-flow"></div>

                        {/* Secondary lighter wave for depth */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent bg-size-[200%_100%] animate-wave-flow-fast"></div>
                    </div>

                    <style>{`
                @keyframes wave-flow {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .animate-wave-flow {
                    animation: wave-flow 3s linear infinite;
                }
                .animate-wave-flow-fast {
                    animation: wave-flow 2s linear infinite;
                    opacity: 0.5;
                }
            `}</style>
                </div>
            }
        </>

    );
}