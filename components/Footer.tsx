import Link from "next/link";
import Image from "next/image";
import {
    Mail, Github, Linkedin,
    Home, Bookmark, BadgePlus,
    Shield, FileText,
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-black text-white mt-16">
            <div className="px-10 py-10">
                {/* 4-column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.3fr_0.7fr_0.7fr_1.3fr] gap-3">
                    {/* Logo + About Us */}
                    <div className="flex flex-col gap-3 pr-6">
                        <Link href="/" className="mb-1">
                            <Image
                                src="/footer_logo.png"
                                alt="NovaFound Logo"
                                width={80}
                                height={80}
                                className="rounded-lg bg-white p-2"
                            />
                        </Link>
                        <h3 className="font-semibold text-base uppercase tracking-wider text-primary">
                            About Us
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            NovaFound is where entrepreneurs pitch ideas, connect with
                            innovators, vote on ventures, and compete in virtual competitions.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-base uppercase tracking-wider text-primary">
                            Quick Links
                        </h3>
                        <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
                            <Home className="size-4 shrink-0" /> Home
                        </Link>
                        <Link href="/saved" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
                            <Bookmark className="size-4 shrink-0" /> Saved Startups
                        </Link>
                        <Link href="/startup/create" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
                            <BadgePlus className="size-4 shrink-0" /> Create Startup
                        </Link>
                    </div>

                    {/* Legal */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-base uppercase tracking-wider text-primary">
                            Legal
                        </h3>
                        <Link href="/privacy-policy" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
                            <Shield className="size-4 shrink-0" /> Privacy Policy
                        </Link>
                        <Link href="/terms-and-conditions" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
                            <FileText className="size-4 shrink-0" /> Terms &amp; Conditions
                        </Link>
                    </div>

                    {/* Connect */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-base uppercase tracking-wider text-primary">
                            Connect
                        </h3>
                        <a href="mailto:lakshasharma17@gmail.com" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
                            <Mail className="size-4 shrink-0" /> lakshasharma17@gmail.com
                        </a>
                        <a href="https://github.com/laksh1270" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
                            <Github className="size-4 shrink-0" /> GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/laksh-sharma-1284b3255/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
                            <Linkedin className="size-4 shrink-0" /> LinkedIn
                        </a>
                    </div>
                </div>

                {/* Divider & Copyright */}
                <div className="border-t border-gray-800 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <p className="text-xs text-gray-500">
                        © 2026 NovaFound. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-500">
                        Built with ❤️ for Entrepreneurs
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
