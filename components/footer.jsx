"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Linkedin, Github, Twitter, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Resume Builder", href: "/resume" },
        { label: "Cover Letter", href: "/ai-cover-letter" },
        { label: "Interview Prep", href: "/interview" },
    ];

    const socialLinks = [
        {
            icon: <Linkedin className="h-5 w-5" />,
            href: "https://www.linkedin.com/in/gulam-shabbir-khan-530528223/",
            label: "LinkedIn",
        },
        {
            icon: <Github className="h-5 w-5" />,
            href: "https://github.com/shabbir-kh4n",
            label: "GitHub",
        },
        {
            icon: <Twitter className="h-5 w-5" />,
            href: "https://x.com/Shabbir28604516",
            label: "Twitter",
        },
        {
            icon: <Mail className="h-5 w-5" />,
            href: "mailto:helloshabbirkhanhi@gmail.com",
            label: "Email",
        },
    ];

    const resources = [
        { label: "Blog", href: "#" },
        { label: "Guides", href: "#" },
        { label: "FAQ", href: "#" },
        { label: "Support", href: "#" },
    ];

    return (
        <footer className="bg-background border-t border-muted mt-20">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">AI</span>
                            </div>
                            <span className="font-bold text-lg">Career Coach</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Empower your career with AI-driven tools for resumes, cover letters, and interview preparation.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
                        <nav className="space-y-2 flex flex-col">
                            {quickLinks.map((link, idx) => (
                                <Link
                                    key={`quick-${idx}`}
                                    href={link.href}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
                        <nav className="space-y-2 flex flex-col">
                            {resources.map((link, idx) => (
                                <Link
                                    key={`resource-${idx}`}
                                    href={link.href}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">Follow us on social media</p>
                            <div className="flex gap-3">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="p-2 bg-muted hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all duration-200"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Separator */}
                <Separator className="my-8" />

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <div className="text-center md:text-left">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} AI Career Coach. All rights reserved.
                        </p>
                    </div>

                    {/* Made with Love */}
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>Made with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                        <span>by</span>
                        <a
                            href="https://github.com/shabbir-kh4n"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold hover:text-foreground transition-colors"
                        >
                            Shabbir
                        </a>
                    </div>

                    {/* Legal Links */}
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <Link
                            href="#"
                            className="hover:text-foreground transition-colors duration-200"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-foreground transition-colors duration-200"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative gradient line */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </footer>
    );
}
