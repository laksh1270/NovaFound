import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <>
            {/* Hero Banner */}
            <section className="pink_container !min-h-[200px]">
                <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
                    Privacy Policy
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
                            title: "1. Information We Collect",
                            content:
                                "When you use NovaFound, we may collect information you provide directly, such as your name, email address, and profile details when you sign in through GitHub or other authentication providers. We also collect information about the startups you submit, including titles, descriptions, categories, and media.",
                        },
                        {
                            title: "2. How We Use Your Information",
                            content:
                                "We use the information we collect to operate, maintain, and improve NovaFound. This includes displaying your profile and submitted startups, enabling the voting and commenting features, personalizing your experience, and communicating updates about the platform.",
                        },
                        {
                            title: "3. Information Sharing",
                            content:
                                "We do not sell your personal information to third parties. Your public profile information and submitted startups are visible to other users of the platform. We may share anonymized, aggregated data for analytics purposes.",
                        },
                        {
                            title: "4. Data Security",
                            content:
                                "We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security of your information.",
                        },
                        {
                            title: "5. Cookies & Tracking",
                            content:
                                "NovaFound uses cookies and similar technologies to maintain your session, remember your preferences, and analyze platform usage. You can control cookie settings through your browser preferences.",
                        },
                        {
                            title: "6. Third-Party Services",
                            content:
                                "We use third-party services such as Sanity for content management and GitHub for authentication. These services have their own privacy policies, and we encourage you to review them.",
                        },
                        {
                            title: "7. Your Rights",
                            content:
                                "You have the right to access, update, or delete your personal information at any time. You may also request a copy of the data we hold about you by contacting us.",
                        },
                        {
                            title: "8. Changes to This Policy",
                            content:
                                "We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page. Your continued use of NovaFound after changes constitutes acceptance of the updated policy.",
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
                        <h2 className="text-lg font-bold mb-3">9. Contact Us</h2>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact
                            us at{" "}
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
