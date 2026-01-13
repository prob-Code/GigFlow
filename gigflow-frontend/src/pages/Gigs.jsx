import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

export default function Gigs() {
    const [gigs, setGigs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Find the Best Freelance Gigs | GigFlow";
        fetchGigs();
    }, [search]);

    const fetchGigs = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/gigs?search=${search}`);
            setGigs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(() => setLoading(false), 300);
        }
    };

    const seedData = async () => {
        try {
            await api.post("/seed");
            fetchGigs();
        } catch (err) {
            alert("Registration/Login required to explore sample works!");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#001e00] mb-4">
                    Find your next freelance opportunity
                </h1>
                <p className="text-lg text-[#5e6d55] mb-8 max-w-2xl">
                    Browse professional gigs posted by clients from around the world.
                </p>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <input
                            role="searchbox"
                            aria-label="Search for gigs"
                            type="text"
                            placeholder="Search by title..."
                            className="upwork-input !px-12 text-lg shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5e6d55]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <button
                        onClick={seedData}
                        className="upwork-btn-secondary px-8"
                    >
                        Explore All Gigs
                    </button>
                </div>
            </header>

            <main>
                {loading ? (
                    <div className="flex justify-center p-32">
                        <div className="w-8 h-8 border-3 border-[#108a00]/20 border-t-[#108a00] rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {gigs.length > 0 ? gigs.map((gig, idx) => (
                                <motion.article
                                    key={gig._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="upwork-card flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[11px] font-bold text-[#108a00] bg-[#f2f7f2] px-2.5 py-1 rounded">
                                                {gig.status.toUpperCase()}
                                            </span>
                                            <span className="text-xl font-bold text-[#001e00]">${gig.budget}</span>
                                        </div>
                                        <Link to={`/gigs/${gig._id}`} className="block group">
                                            <h2 className="text-xl font-bold mb-3 text-[#001e00] group-hover:text-[#108a00] group-hover:underline transition-all line-clamp-2">
                                                {gig.title}
                                            </h2>
                                        </Link>
                                        <p className="text-[#5e6d55] text-sm leading-relaxed line-clamp-3 mb-6">
                                            {gig.description}
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-[#d5e0d5] flex items-center justify-between">
                                        <span className="text-xs font-semibold text-[#5e6d55]">Client: {gig.ownerId?.name || "Member"}</span>
                                        <Link to={`/gigs/${gig._id}`} className="text-xs font-bold text-[#108a00] hover:underline">
                                            View Details
                                        </Link>
                                    </div>
                                </motion.article>
                            )) : (
                                <div className="col-span-full py-20 text-center upwork-card bg-[#f2f7f2]/30 border-dashed">
                                    <p className="text-[#5e6d55] text-lg font-medium">No matches found for your search.</p>
                                    <button onClick={seedData} className="mt-4 text-[#108a00] font-bold hover:underline">See Sample Opportunities</button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
}
