"use client"

import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./account-form";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


export default function SettingsAccountPage() {
    const [loading, setLoading] = useState(false);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/login");
        } else if (status === "loading") {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [status])
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold">Account</h3>
            </div>
            <Separator />
            <AccountForm user={{ email: session?.user.email!, name: session?.user.name! }} />
        </div>
    )
}