import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function PostGig() {
    const { user } = useContext(AuthContext);
    const [gig, setGig] = useState({ title: "", description: "", budget: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/gigs", gig);
            alert("Gig posted successfully!");
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to post gig");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#f2f7f2]/20 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full upwork-card text-center !p-12 shadow-2xl"
                >
                    <div className="w-20 h-20 bg-[#f2f7f2] rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-10 h-10 text-[#108a00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[#001e00] mb-4">Post a Job</h2>
                    <p className="text-[#5e6d55] mb-10 leading-relaxed">
                        Log in or sign up to Post a job opportunity and connect with top-tier freelance talent.
                    </p>
                    <div className="space-y-4">
                        <Link to="/login" className="upwork-btn-primary block w-full py-4 text-center text-lg">Log In</Link>
                        <Link to="/register" className="upwork-btn-secondary block w-full py-4 text-center text-lg border-2">Create Account</Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f2f7f2]/20 py-16 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-[#001e00] mb-2">Create a job post</h1>
                    <p className="text-[#5e6d55] text-lg">Detail your project to attract the best freelance talent.</p>
                </div>

                <div className="upwork-card !p-12 shadow-xl shadow-gray-100 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#001e00]">Write a title for your job post</label>
                                <input
                                    type="text"
                                    value={gig.title}
                                    onChange={e => setGig({ ...gig, title: e.target.value })}
                                    className="upwork-input text-lg"
                                    placeholder="e.g. Expert React Developer needed for high-profile fintech project"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#001e00]">Job description</label>
                                <textarea
                                    rows="8"
                                    value={gig.description}
                                    onChange={e => setGig({ ...gig, description: e.target.value })}
                                    className="upwork-input resize-none leading-relaxed"
                                    placeholder="What is the deliverable? What skills are you looking for?"
                                    required
                                />
                            </div>
                            <div className="space-y-2 w-full md:w-1/2">
                                <label className="text-sm font-bold text-[#001e00]">Estimated Budget ($)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={gig.budget}
                                        onChange={e => setGig({ ...gig, budget: e.target.value })}
                                        className="upwork-input !pl-8"
                                        placeholder="500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-[#d5e0d5]">
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="px-8 py-3 text-sm font-bold text-[#108a00] hover:bg-[#f2f7f2] rounded-full transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="upwork-btn-primary px-12 py-3"
                            >
                                {loading ? "Publishing..." : "Post this job"}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
