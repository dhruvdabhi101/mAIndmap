"use client";
import { useState } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoaderCircleIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import axios, { isAxiosError } from "axios";

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role] = useState("user");
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    const signUpUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post("/api/users/signup", {
                name,
                email,
                password,
                role,
            });
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            if (result?.ok) {
                toast.success("Account created successfully");
            } else {
                toast.error(result?.error ?? "An error occurred");
            }
            setLoading(false);
            router?.push(`/dashboard`);
        } catch (err: any) {
            if (isAxiosError(err)) {
                toast.error(err.response?.data.message ?? "An error occurred");
            }
            setLoading(false);
        }
    };
    return (
        <div className="flex items-center justify-center h-screen px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 sm:p-8 bg-white rounded-lg border-2 p-8">
                <div className="text-center">
                    <h2 className="sm:text-3xl text-2xl font-bold tracking-tight text-gray-900">
                        Sign up for an account
                    </h2>
                </div>
                <form className="space-y-6" onSubmit={signUpUser}>
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            className="mt-1 hover:border-primary"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 hover:border-primary"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 hover:border-primary"
                            placeholder="*******"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-accent/90 text-white hover:bg-accent">
                        {loading ? (
                            <LoaderCircleIcon className="animate-spin" />
                        ) : (
                            "Sign up"
                        )}
                    </Button>
                    <div>
                        <p className="mt-4 max-sm:text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-blue-600 hover:underline"
                                prefetch={false}
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;