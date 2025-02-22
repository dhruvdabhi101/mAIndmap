import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import { SidebarNav } from "./component/sidebar-nav";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Forms",
    description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
    {
        title: "Account",
        href: "/forms/account",
    },
    {
        title: "Payment",
        href: "/forms/payment",
    },
];

interface SettingsLayoutProps {
    children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <div className="space-y-6 p-10 pb-16">
            <div className="flex gap-5 items-center">
                <div>
                    <Link href="/dashboard" className="inline-block">
                        <div className="group flex flex-col items-center relative">
                            <ArrowLeft className="cursor-pointer rounded-lg" />

                            <div className="absolute top-full mt-1 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md">
                                Go back to home
                            </div>
                        </div>
                    </Link>

                </div>
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings and set e-mail preferences.
                    </p>
                </div>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className="flex-1 lg:max-w-2xl">{children}</div>
            </div>
        </div>
    );
}
