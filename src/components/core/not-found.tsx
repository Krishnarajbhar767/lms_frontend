import { useNavigate } from "react-router-dom";
import Button from "./button";
import { FaArrowLeft, FaHome } from "react-icons/fa";

export default function NotFound() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen flex items-center justify-center bg-richblack-900 px-4">
            <div className="max-w-xl w-full text-center">
                {/* Big 404 */}
                <h1 className="text-[6rem] sm:text-[8rem] font-extrabold text-white/20 leading-none select-none">
                    404
                </h1>

                {/* Message */}
                <h2 className="mt-4 text-2xl sm:text-3xl font-semibold text-white">
                    Page not found
                </h2>
                <p className="mt-3 text-sm sm:text-base text-white/60">
                    The page you’re trying to reach doesn’t exist or may have been moved.
                    Please check the URL or return to a safe place.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    {/* <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/40"
                    >
                        Go to Home
                    </Link> */}
                    <Button onClick={() => navigate("/")} className="flex items-center gap-2">
                        <FaHome /> Go to Home
                    </Button>

                    <Button onClick={() => navigate(-1)} className="flex items-center gap-2" variant="outline">
                        <FaArrowLeft /> Go Back
                    </Button>
                </div>

                {/* Footer hint */}
                <p className="mt-10 text-xs text-white/40">
                    Error code: 404
                </p>
            </div>
        </div>
    );
}
