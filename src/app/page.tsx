"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Share2, Layout, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mobile menu slide-in variants for Framer Motion
  const mobileMenuVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-accent" />
            <span className="text-xl font-semibold">
              m<span className="text-accent">AI</span>ndmap
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              How it works
            </a>
            <Button className="bg-primary text-white hover:bg-primary/90">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-In Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white p-6"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <X className="h-6 w-6 text-gray-700" />
              </button>
            </div>
            <nav className="mt-10 space-y-6">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-600 hover:text-gray-900 transition-colors text-lg"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-600 hover:text-gray-900 transition-colors text-lg"
              >
                How it works
              </a>
              <Button
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                <Link href="/login">Get Started</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-1/2 top-0 -z-10 h-[800px] w-[800px] rounded-full bg-accent/20 opacity-20 blur-[100px]" />

        <div className="container mx-auto px-6">
          <div className={`text-center max-w-4xl mx-auto relative ${spaceGrotesk.className}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <span className="px-4 py-2 rounded-full bg-accent/10 text-accent inline-block mb-6 text-sm font-medium">
                Revolutionize Your Thinking
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
                Transform Your Ideas Into Beautiful Mind Maps
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Harness the power of AI to create stunning, interconnected mind maps that bring your thoughts to life.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-6">
                  Start Mapping Free
                </Button>
                <Button variant="outline" className="text-lg px-8 py-6">
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-4"
            >
              Powerful Features
            </motion.h2>
            <p className="text-gray-600 text-lg">Everything you need to organize your thoughts effectively</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-white shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Thinking?</h2>
            <p className="text-xl text-gray-600 mb-10">
              Join thousands of users who are already organizing their thoughts better with MindFlow AI.
            </p>
            <Button className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6">
              <Link href="/login">
                Get Started For Free
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-accent" />
                <span className="text-lg font-semibold">MindFlow AI</span>
              </div>
              <p className="text-gray-600 text-sm">
                Transform your thoughts into beautiful mind maps with the power of AI.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm">
                    How it works
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-gray-600 hover:text-gray-900 text-sm">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-600 hover:text-gray-900 text-sm">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/careers" className="text-gray-600 hover:text-gray-900 text-sm">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy-policy" className="text-gray-600 hover:text-gray-900 text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/tos" className="text-gray-600 hover:text-gray-900 text-sm">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/refund-policy" className="text-gray-600 hover:text-gray-900 text-sm">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} MindFlow AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Twitter
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                LinkedIn
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    title: "AI-Powered Generation",
    description:
      "Transform your ideas into structured mind maps with just a few clicks using advanced AI.",
    icon: <Sparkles className="w-6 h-6 text-accent" />,
  },
  {
    title: "Real-time Collaboration",
    description:
      "Work together with your team in real-time, sharing ideas and building upon each other's thoughts.",
    icon: <Share2 className="w-6 h-6 text-accent" />,
  },
  {
    title: "Smart Layouts",
    description:
      "Choose from multiple intelligent layout options that automatically organize your mind maps.",
    icon: <Layout className="w-6 h-6 text-accent" />,
  },
];

export default Index;
