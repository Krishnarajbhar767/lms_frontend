
import { Link } from "react-router-dom";
import logo from "../../assets/logo/logo-white.jpg";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";
import { COMPANY_DATA } from "../../COMPANY_DATA";
const Footer = () => {
    return (
        <div className="bg-richblack-800 flex-1">
            <div className="flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14">
                <div className="border-b w-[100%] flex flex-col lg:flex-row pb-5 border-richblack-700">

                    {/* SECTION 1 ------------------------------------------------------------ */}
                    <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">

                        {/* Company */}
                        <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7">
                            <img src={logo} alt="logo" className="object-contain" />
                            <h1 className="text-richblack-50 font-semibold text-[16px]">Company</h1>

                            <div className="flex flex-col gap-2">
                                <Link className="hover:text-richblack-50 text-[14px]" to="/about">About</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/careers">Careers</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/affiliates">Affiliates</Link>
                            </div>

                            <div className="flex gap-3 text-lg mt-3">
                                <FaFacebook />
                                <FaGoogle />
                                <FaTwitter />
                                <FaYoutube />
                            </div>
                        </div>

                        {/* Resources */}
                        <div className="w-[48%] lg:w-[30%] mb-7">
                            <h1 className="text-richblack-50 font-semibold text-[16px]">Resources</h1>

                            <div className="flex flex-col gap-2 mt-2">
                                <Link className="hover:text-richblack-50 text-[14px]" to="/articles">Articles</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/blog">Blog</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/chart-sheet">Chart Sheet</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/code-challenges">Code Challenges</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/docs">Docs</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/projects">Projects</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/videos">Videos</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/workspaces">Workspaces</Link>
                            </div>

                            <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">Support</h1>
                            <Link className="hover:text-richblack-50 text-[14px] mt-2" to="/help-center">
                                Help Center
                            </Link>
                        </div>

                        {/* Plans & Community */}
                        <div className="w-[48%] lg:w-[30%] mb-7">
                            <h1 className="text-richblack-50 font-semibold text-[16px]">Plans</h1>

                            <div className="flex flex-col gap-2 mt-2">
                                <Link className="hover:text-richblack-50 text-[14px]" to="/paid-memberships">Paid memberships</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/for-students">For students</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/business-solutions">Business solutions</Link>
                            </div>

                            <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">Community</h1>

                            <div className="flex flex-col gap-2 mt-2">
                                <Link className="hover:text-richblack-50 text-[14px]" to="/forums">Forums</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/chapters">Chapters</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/events">Events</Link>
                            </div>
                        </div>

                    </div>

                    {/* SECTION 2 ------------------------------------------------------------ */}
                    <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">

                        {/* Static Footer Columns */}
                        <div className="w-[48%] lg:w-[30%] mb-7">
                            <h1 className="text-richblack-50 font-semibold text-[16px]">Development</h1>
                            <div className="flex flex-col gap-2 mt-2">
                                <Link className="hover:text-richblack-50 text-[14px]" to="/frontend">Frontend</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/backend">Backend</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/fullstack">Full Stack</Link>
                            </div>
                        </div>

                        <div className="w-[48%] lg:w-[30%] mb-7">
                            <h1 className="text-richblack-50 font-semibold text-[16px]">Design</h1>
                            <div className="flex flex-col gap-2 mt-2">
                                <Link className="hover:text-richblack-50 text-[14px]" to="/ui-ux">UI/UX</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/graphics">Graphics</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/illustrations">Illustrations</Link>
                            </div>
                        </div>

                        <div className="w-[48%] lg:w-[30%] mb-7">
                            <h1 className="text-richblack-50 font-semibold text-[16px]">Business</h1>
                            <div className="flex flex-col gap-2 mt-2">
                                <Link className="hover:text-richblack-50 text-[14px]" to="/startup">Startup</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/marketing">Marketing</Link>
                                <Link className="hover:text-richblack-50 text-[14px]" to="/finance">Finance</Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-14 text-sm">
                <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">

                    <div className="flex flex-row">
                        <Link className="px-3 border-r border-richblack-700 hover:text-richblack-50" to="/privacy-policy">Privacy Policy</Link>
                        <Link className="px-3 border-r border-richblack-700 hover:text-richblack-50" to="/cookie-policy">Cookie Policy</Link>
                        <Link className="px-3 hover:text-richblack-50" to="/terms">Terms</Link>
                    </div>

                    <div className="text-center">
                        Made with ❤️ Krishna © 2025 {COMPANY_DATA.name}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
