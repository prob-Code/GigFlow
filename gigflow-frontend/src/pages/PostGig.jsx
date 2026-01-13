import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

export default function PostGig() {
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
