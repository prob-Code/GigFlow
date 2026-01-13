import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const { setUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await api.post("/auth/login", { email, password });
            setUser(res.data.user);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await api.post("/auth/google", { credential: credentialResponse.credential });
            setUser(res.data.user);
            navigate("/");
        } catch (err) {
            setError("Google Authentication failed.");
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#f2f7f2]/30 px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[500px]"
            >
                <div className="upwork-card !p-12 border-[#d5e0d5] shadow-2xl shadow-gray-200">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-[#001e00] mb-2">Log in to GigFlow</h2>
                    </div>

                    {error && <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm text-center font-medium">
                        {error}
                    </div>}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#001e00]">Username or Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="upwork-input"
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between">
                                <label className="text-sm font-bold text-[#001e00]">Password</label>
                                <Link to="#" className="text-xs font-bold text-[#108a00] hover:underline">Forgot password?</Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="upwork-input"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="upwork-btn-primary w-full py-3.5 text-lg"
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    <div className="relative my-10 text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#d5e0d5]"></div></div>
                        <span className="relative px-4 text-xs font-bold uppercase tracking-widest text-[#5e6d55] bg-white">or</span>
                    </div>

                    <div className="flex justify-center mb-8">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError("Google Login failed")}
                            shape="pill"
                            text="continue_with"
                            width="100%"
                        />
                    </div>

                    <div className="text-center pt-8 border-t border-[#d5e0d5]">
                        <p className="text-sm text-[#5e6d55]">
                            Don't have an account? <Link to="/register" className="text-[#108a00] hover:underline font-bold">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
