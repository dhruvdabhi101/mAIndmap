"use client"

import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { AccountForm } from "./account-form";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";
import { redirect } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function SettingsAccountPage() {

    const [loading, setLoading] = React.useState(true);
    const { data: session, status } = useSession();

    React.useEffect(() => {
        if (status === "authenticated") {
            setLoading(false);
            console.log("User is authenticated:", session);
        } else if (status === "unauthenticated") {
            setLoading(false);
            redirect("/login");
        } else {
            setLoading(true);
            console.log("Loading...");
        }
    }, [status]);

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="min-h-screen bg-[#fafafa] px-4 py-8 md:px-8"
        >
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-block">
                        <button className="group relative flex items-center gap-2 rounded-full bg-white p-2 shadow-sm transition-all hover:shadow-md">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                            <span className="absolute left-10 opacity-0 transition-all group-hover:opacity-100">
                                Back
                            </span>
                        </button>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="rounded-2xl bg-white p-8 shadow-sm"
                >
                    <div className="mb-6">
                        <h1 className="text-3xl font-light tracking-tight text-gray-900">Account Settings</h1>
                        <p className="mt-2 text-base text-gray-500">
                            View and manage your account details
                        </p>
                    </div>

                    <Separator className="my-6" />

                    <AccountForm user={{ email: session?.user.email!, name: session?.user.name! }} />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SettingsAccountPage;