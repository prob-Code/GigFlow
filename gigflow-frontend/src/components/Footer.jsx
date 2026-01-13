import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-[#001e00] text-white py-16 px-6 mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-white/10 pb-12">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-1">
                            <span className="text-2xl font-black tracking-tighter text-white">
                                GigFlow
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#14a800] mt-auto mb-1.5"></div>
                        </Link>
                        <p className="text-[#9aaa97] text-sm leading-relaxed">
                            The world's work marketplace. Find top talent or the best freelance opportunities today.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">For Clients</h4>
                        <ul className="space-y-3 text-[#9aaa97] text-sm">
                            <li><Link to="/post" className="hover:text-white transition-colors hover:underline underline-offset-4">Post a Job</Link></li>
                            <li><Link to="/" className="hover:text-white transition-colors hover:underline underline-offset-4">Browse Gigs</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Hiring Advice</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">For Freelancers</h4>
                        <ul className="space-y-3 text-[#9aaa97] text-sm">
                            <li><Link to="/" className="hover:text-white transition-colors hover:underline underline-offset-4">Find Work</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors hover:underline underline-offset-4">UP Work Rules</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Freelancing News</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Support</h4>
                        <ul className="space-y-3 text-[#9aaa97] text-sm">
                            <li><Link to="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Help Center</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Trust & Safety</Link></li>
                            <li><button className="hover:text-white transition-colors hover:underline underline-offset-4">Contact Us</button></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] text-[#9aaa97]">
                    <div className="flex gap-6">
                        <span>© 2024 - 2026 GigFlow® Global Inc.</span>
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="p-2 rounded-full border border-white/10 hover:bg-white/5 cursor-pointer transition-all">FB</span>
                        <span className="p-2 rounded-full border border-white/10 hover:bg-white/5 cursor-pointer transition-all">TW</span>
                        <span className="p-2 rounded-full border border-white/10 hover:bg-white/5 cursor-pointer transition-all">LI</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
