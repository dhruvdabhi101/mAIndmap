"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AccountForm({
    user,
}: {
    user: {
        name: string
        email: string
    }
}) {

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
                <Label className="text-lg font-medium">Name: </Label>
                <Input value={user.name} className="hover:border-accent" readOnly />
            </div>
            <div className="flex items-center gap-2">
                <Label className="text-lg font-medium">Email: </Label>
                <Input value={user.email} className="hover:border-accent" readOnly />
            </div>
        </div>
    )
}
