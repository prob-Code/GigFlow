import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await api.post("/auth/register", form);
            alert("Account created successfully. Please login.");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row">
            {/* Visual Side */}
            <div className="lg:w-1/2 bg-[#108a00] p-12 lg:p-24 flex flex-col justify-center text-white">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl lg:text-7xl font-bold mb-8 tracking-tighter leading-none">
                        Join the world's <br /> work marketplace.
                    </h1>
                    <ul className="space-y-6 text-xl opacity-90">
                        <li className="flex gap-4">
                            <span className="w-6 h-6 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center text-xs">✓</span>
                            Find opportunities for every stage of your career
                        </li>
                        <li className="flex gap-4">
                            <span className="w-6 h-6 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center text-xs">✓</span>
                            Control when, where, and how you work
                        </li>
                        <li className="flex gap-4">
                            <span className="w-6 h-6 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center text-xs">✓</span>
                            Explore different ways to earn
                        </li>
                    </ul>
                </motion.div>
            </div>

            {/* Form Side */}
            <div className="lg:w-1/2 bg-white p-8 lg:p-24 flex flex-col justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-[#001e00] mb-2">Sign up to find work you love</h2>
                        <p className="text-[#5e6d55]">It takes less than a minute. Already have an account? <Link to="/login" className="text-[#108a00] hover:underline font-bold">Log in</Link></p>
                    </div>

                    <div className="upwork-card !p-10 border-[#d5e0d5] shadow-xl shadow-gray-100">
                        {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm text-center font-medium">
                            {error}
                        </div>}

                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-[#001e00]">Full Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="upwork-input"
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-[#001e00]">Email Address</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="upwork-input"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-[#001e00]">Password</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="upwork-input"
                                    placeholder="Choose a strong password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="upwork-btn-primary w-full py-4 text-lg"
                            >
                                {loading ? "Creating account..." : "Create my account"}
                            </button>
                        </form>

                        <p className="mt-8 text-xs text-[#5e6d55] text-center leading-relaxed">
                            By creating an account, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
