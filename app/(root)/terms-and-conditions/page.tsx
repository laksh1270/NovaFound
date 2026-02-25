import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
    return (
        <>
            {/* Hero Banner */}
            <section className="pink_container !min-h-[200px]">
                <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
                    Terms &amp; Conditions
                </h1>
                <p className="text-white/80 text-center mt-3 text-sm">
                    Last updated: February 23, 2026
                </p>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-12">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-10"
                >
                    <ArrowLeft className="size-4" />
                    Back to Home
                </Link>

                <div className="space-y-10">
                    {[
                        {
                            title: "1. Acceptance of Terms",
                            content:
                                "By accessing and using NovaFound, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use the platform.",
                        },
                        {
                            title: "2. Use of the Platform",
                            content:
                                "NovaFound is a platform for entrepreneurs to pitch startup ideas, connect with innovators, and participate in virtual competitions. You agree to use the platform only for lawful purposes and in accordance with these terms. You must not misuse, disrupt, or attempt to gain unauthorized access to the platform.",
                        },
                        {
                            title: "3. User Accounts",
                            content:
                                "To access certain features, you must sign in using a supported authentication provider (e.g., GitHub). You are responsible for maintaining the confidentiality of your account and for all activities that occur under it. You agree to provide accurate and up-to-date information.",
                        },
                        {
                            title: "4. User Content",
                            content:
                                'You retain ownership of the content you submit to NovaFound, including startup pitches, descriptions, and media. By submitting content, you grant NovaFound a non-exclusive, royalty-free license to display, distribute, and promote your content on the platform. You are solely responsible for the content you post and must ensure it does not infringe on any third-party rights.',
                        },
                        {
                            title: "5. Prohibited Conduct",
                            content:
                                "You agree not to: post false, misleading, or fraudulent startup information; harass, abuse, or threaten other users; upload malicious code or attempt to compromise the platform's security; use the platform for spam or unauthorized commercial purposes; or violate any applicable laws or regulations.",
                        },
                        {
                            title: "6. Intellectual Property",
                            content:
                                "The NovaFound name, logo, design, and all associated branding are the property of NovaFound. You may not use, reproduce, or distribute any of our intellectual property without prior written consent.",
                        },
                        {
                            title: "7. Limitation of Liability",
                            content:
                                'NovaFound is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform. We do not guarantee the accuracy, completeness, or reliability of any content posted by users.',
                        },
                        {
                            title: "8. Termination",
                            content:
                                "We reserve the right to suspend or terminate your account at any time if you violate these terms or engage in conduct that we deem harmful to the platform or its users. Upon termination, your right to use the platform ceases immediately.",
                        },
                        {
                            title: "9. Changes to Terms",
                            content:
                                "We may modify these Terms and Conditions at any time. Changes will be posted on this page with an updated effective date. Your continued use of NovaFound after changes constitutes acceptance of the revised terms.",
                        },
                    ].map((section, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h2 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                                    {i + 1}
                                </span>
                                {section.title.replace(/^\d+\.\s*/, "")}
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    ))}

                    {/* Contact */}
                    <div className="bg-black text-white rounded-2xl p-6">
                        <h2 className="text-lg font-bold mb-3">10. Contact Us</h2>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            If you have questions about these Terms and Conditions, please
                            contact us at{" "}
                            <a
                                href="mailto:lakshasharma17@gmail.com"
                                className="text-primary hover:underline font-medium"
                            >
                                lakshasharma17@gmail.com
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
