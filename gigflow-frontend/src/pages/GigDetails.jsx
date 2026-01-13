import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function GigDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [gig, setGig] = useState(null);
    const [bids, setBids] = useState([]);
    const [msg, setMsg] = useState("");
    const [price, setPrice] = useState("");
    const [contact, setContact] = useState("");
    const [upiId, setUpiId] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id, user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const gigRes = await api.get(`/gigs/${id}`);
            setGig(gigRes.data);
            document.title = `${gigRes.data.title} | GigFlow`;

            if (gigRes.data && user && gigRes.data.ownerId._id === user.id) {
                const bidsRes = await api.get(`/bids/${id}`);
                setBids(bidsRes.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBid = async (e) => {
        e.preventDefault();
        if (!user) { navigate("/login"); return; }
        setSubmitting(true);
        try {
            await api.post("/bids", {
                gigId: id,
                message: msg,
                price: Number(price),
                contact,
                upiId
            });
            alert("Proposal submitted successfully!");
            setMsg(""); setPrice(""); setContact(""); setUpiId("");
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleHire = async (bidId) => {
        try {
            if (!confirm("Are you sure you want to hire this freelancer?")) return;
            await api.patch(`/bids/${bidId}/hire`);
            fetchData();
        } catch (err) {
            alert("Error during hiring progress.");
        }
    };

    const markPaid = async (bidId, stage) => {
        try {
            const endpoint = stage === 1 ? 'pay-initial' : 'pay-final';
            await api.patch(`/bids/${bidId}/${endpoint}`);
            fetchData();
        } catch (err) {
            alert("Failed to update payment status.");
        }
    };

    const getUpiLink = (upi, name, amount) => {
        return `upi://pay?pa=${upi}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
    };

    if (loading) return <div className="flex justify-center p-32"><div className="w-8 h-8 border-3 border-[#108a00]/20 border-t-[#108a00] rounded-full animate-spin"></div></div>;
    if (!gig) return <div className="max-w-7xl mx-auto p-12 text-center text-red-600 font-bold">Gig not found or has been removed.</div>;

    const isOwner = user && gig.ownerId._id === user.id;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
                <main className="flex-1">
                    <header className="mb-8 p-8 upwork-card border-b-0 rounded-b-none">
                        <h1 className="text-3xl font-bold text-[#001e00] mb-4">{gig.title}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-[#5e6d55] font-medium">
                            <span className="flex items-center gap-1.5 text-[#108a00]">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#108a00] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#108a00]"></span>
                                </span>
                                Active {gig.status}
                            </span>
                            <span className="border-l border-[#d5e0d5] pl-6">Budget: <span className="text-[#001e00] font-bold">${gig.budget}</span></span>
                            <span className="border-l border-[#d5e0d5] pl-6">Posted by: <span className="text-[#001e00] font-bold">{gig.ownerId.name}</span></span>
                        </div>
                    </header>

                    <article className="p-8 upwork-card rounded-t-none">
                        <h2 className="text-xl font-bold text-[#001e00] mb-4">Job Description</h2>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-[#001e00] whitespace-pre-wrap leading-relaxed font-medium">
                                {gig.description}
                            </p>
                        </div>
                    </article>

                    {bids.some(b => b.status === 'hired') && (
                        <div className="mt-8 p-8 upwork-card bg-[#f2f7f2] border-[#108a00]/30">
                            <h2 className="text-xl font-bold text-[#108a00] mb-2">🎉 Freelancer Hired!</h2>
                            <p className="text-sm text-[#5e6d55]">The work should now be in progress. Follow the 50/50 payment milestones on the right.</p>
                        </div>
                    )}
                </main>

                <aside className="lg:w-[450px]">
                    <div className="sticky top-24">
                        {!isOwner ? (
                            <div className="upwork-card shadow-sm">
                                <h3 className="text-xl font-bold mb-6">Submit a Proposal</h3>
                                {gig.status !== 'open' ? (
                                    <div className="p-4 bg-[#f2f7f2] rounded-lg border border-[#d5e0d5] text-[#5e6d55] text-center font-bold">
                                        This gig is no longer accepting bids.
                                    </div>
                                ) : (
                                    <form onSubmit={handleBid} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-black text-[#5e6d55] uppercase tracking-wider mb-2">Cover Letter</label>
                                            <textarea
                                                value={msg}
                                                onChange={e => setMsg(e.target.value)}
                                                className="upwork-input h-32 resize-none"
                                                placeholder="Why are you a good fit?"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black text-[#5e6d55] uppercase tracking-wider mb-2">Total Bid ($)</label>
                                                <input
                                                    type="number"
                                                    value={price}
                                                    onChange={e => setPrice(e.target.value)}
                                                    className="upwork-input"
                                                    placeholder="100"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-[#5e6d55] uppercase tracking-wider mb-2">Phone</label>
                                                <input
                                                    type="text"
                                                    value={contact}
                                                    onChange={e => setContact(e.target.value)}
                                                    className="upwork-input"
                                                    placeholder="91..."
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-[#5e6d55] uppercase tracking-wider mb-2">UPI ID</label>
                                            <input
                                                type="text"
                                                value={upiId}
                                                onChange={e => setUpiId(e.target.value)}
                                                className="upwork-input"
                                                placeholder="user@upi"
                                                required
                                            />
                                        </div>
                                        <button type="submit" disabled={submitting} className="upwork-btn-primary w-full mt-4">
                                            {submitting ? "Submitting..." : "Send Proposal"}
                                        </button>
                                    </form>
                                )}
                            </div>
                        ) : (
                            <div className="upwork-card">
                                <div className="flex justify-between items-center mb-8 border-b border-[#d5e0d5] pb-4">
                                    <h3 className="text-xl font-bold">Received Bids</h3>
                                    <span className="px-2 py-0.5 bg-[#f2f7f2] text-[#108a00] rounded text-sm font-bold">{bids.length}</span>
                                </div>
                                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                    <AnimatePresence>
                                        {bids.map((b) => (
                                            <motion.div
                                                key={b._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`p-6 rounded-2xl border transition-all ${b.status === 'hired' ? 'border-[#108a00] bg-[#f2f7f2]/30' : 'border-[#d5e0d5] bg-white shadow-sm'}`}
                                            >
                                                <div className="flex justify-between mb-3">
                                                    <span className="font-bold text-[#001e00]">{b.freelancerId?.name}</span>
                                                    <span className="font-bold text-[#108a00] text-lg">${b.price}</span>
                                                </div>
                                                <p className="text-xs text-[#5e6d55] mb-4 italic line-clamp-3">"{b.message}"</p>

                                                <div className="py-3 border-y border-[#d5e0d5]/50 mb-5 flex gap-4 text-[11px] font-bold text-[#001e00]">
                                                    <span className="flex items-center gap-1"><span className="text-[#108a00]">📞</span> {b.freelancerContact}</span>
                                                    <span className="flex items-center gap-1"><span className="text-[#108a00]">💳</span> {b.freelancerUpi}</span>
                                                </div>

                                                {b.status === 'pending' && gig.status === 'open' ? (
                                                    <button
                                                        onClick={() => handleHire(b._id)}
                                                        className="w-full py-2.5 bg-[#108a00] text-white text-xs font-bold rounded-full hover:bg-[#14a800] transition-all"
                                                    >
                                                        Hire this Freelancer
                                                    </button>
                                                ) : b.status === 'hired' ? (
                                                    <div className="space-y-4">
                                                        {/* Stage 1: Half Advance */}
                                                        <div className={`p-4 rounded-xl border-2 ${b.initialPaymentPaid ? 'bg-white border-[#108a00]' : 'bg-white border-dashed border-[#d5e0d5]'}`}>
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="text-xs font-black uppercase text-[#5e6d55]">Stage 1: Advance (50%)</span>
                                                                <span className="font-bold text-[#108a00]">${b.price / 2}</span>
                                                            </div>
                                                            {!b.initialPaymentPaid ? (
                                                                <div className="flex gap-2">
                                                                    <a href={getUpiLink(b.freelancerUpi, b.freelancerId?.name, b.price / 2)} className="flex-1 py-1.5 bg-[#108a00] text-white text-[10px] font-bold rounded-lg text-center hover:bg-[#14a800]">Pay via UPI</a>
                                                                    <button onClick={() => markPaid(b._id, 1)} className="px-3 py-1.5 borer border-[#d5e0d5] text-[10px] font-bold rounded-lg hover:bg-gray-50">Done</button>
                                                                </div>
                                                            ) : (
                                                                <div className="text-[#108a00] text-[10px] font-black uppercase flex items-center gap-1.5">
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                                    Paid Completed
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Stage 2: Half Final */}
                                                        <div className={`p-4 rounded-xl border-2 ${b.finalPaymentPaid ? 'bg-white border-[#108a00]' : 'bg-white border-dashed border-[#d5e0d5]'}`}>
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="text-xs font-black uppercase text-[#5e6d55]">Stage 2: Completion (50%)</span>
                                                                <span className="font-bold text-[#108a00]">${b.price / 2}</span>
                                                            </div>
                                                            {!b.finalPaymentPaid ? (
                                                                <div className="flex gap-2">
                                                                    <a href={getUpiLink(b.freelancerUpi, b.freelancerId?.name, b.price / 2)} className="flex-1 py-1.5 bg-[#108a00] text-white text-[10px] font-bold rounded-lg text-center hover:bg-[#14a800]">Pay via UPI</a>
                                                                    <button onClick={() => markPaid(b._id, 2)} className="px-3 py-1.5 border border-[#d5e0d5] text-[10px] font-bold rounded-lg hover:bg-gray-50">Done</button>
                                                                </div>
                                                            ) : (
                                                                <div className="text-[#108a00] text-[10px] font-black uppercase flex items-center gap-1.5">
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                                    Final Released
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg text-[#5e6d55] bg-gray-100">
                                                        {b.status}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {bids.length === 0 && <p className="text-center text-[#5e6d55] py-20 text-sm italic">Waiting for quality proposals...</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
