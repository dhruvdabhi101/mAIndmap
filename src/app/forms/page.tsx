import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./account/account-form";
import { useSession } from "next-auth/react";
import React from "react";

export default function SettingsAccountPage() {

    const [loading, setLoading] = React.useState(false);

    const { data: session, status } = useSession();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Account</h3>
                <p className="text-sm text-muted-foreground">
                    Update your account settings. Set your preferred language and
                    timezone.
                </p>
            </div>
            <Separator />
            <AccountForm user={{ email: session?.user.email!, name: session?.user.name! }} />
        </div>
    )
}