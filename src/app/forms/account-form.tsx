"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface AccountFormProps {
    user: {
        name: string;
        email: string;
    };
}

export function AccountForm({ user }: AccountFormProps) {
    const inputVariants = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
    };

    return (
        <div className="space-y-6">
            <motion.div
                variants={inputVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative rounded-lg bg-gray-50/50 p-4 transition-all hover:bg-gray-50"
            >
                <Label className="text-sm font-medium text-gray-500">Name</Label>
                <Input
                    value={user.name}
                    readOnly
                    className="mt-1 border-none bg-transparent text-lg font-light tracking-wide text-gray-900 focus-visible:ring-0"
                />
            </motion.div>

            <motion.div
                variants={inputVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.5, delay: 0.4 }}
                className="group relative rounded-lg bg-gray-50/50 p-4 transition-all hover:bg-gray-50"
            >
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <Input
                    value={user.email}
                    readOnly
                    className="mt-1 border-none bg-transparent text-lg font-light tracking-wide text-gray-900 focus-visible:ring-0"
                />
            </motion.div>
        </div>
    );
}