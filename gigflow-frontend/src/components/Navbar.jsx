import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#d5e0d5] px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-1 group">
                        <span className="text-2xl font-black tracking-tighter text-[#108a00] group-hover:text-[#14a800] transition-colors">
                            GigFlow
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#108a00] mt-auto mb-1.5"></div>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-sm font-semibold text-[#001e00] hover:text-[#108a00] transition-colors">Find Gigs</Link>
                        <Link to="/post" className="text-sm font-semibold text-[#001e00] hover:text-[#108a00] transition-colors">Post a Gig</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-bold text-[#001e00] leading-none">{user.name}</span>
                                <span className="text-[11px] text-[#5e6d55] font-medium">Freelancer</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-bold text-[#108a00] hover:underline transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 sm:gap-6">
                            <Link to="/login" className="text-sm font-bold text-[#001e00] hover:text-[#108a00] transition-colors">Log in</Link>
                            <Link to="/register" className="upwork-btn-primary text-sm shadow-sm">Sign up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
