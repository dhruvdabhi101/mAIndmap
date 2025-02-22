"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, LoaderCircleIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
            if (res?.ok) {
                router.push(`/dashboard`);
            } else {
                toast.error(res?.error ?? "An error occurred");
            }
        } catch (error: any) {
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-md rounded-2xl bg-[#ffffff] sm:p-8 space-y-8 border-2 p-8">
                <div className="text-center">
                    <h2 className="sm:text-3xl text-2xl font-bold tracking-tight">
                        Sign in to your account
                    </h2>
                </div>
                <form className="space-y-6" onSubmit={loginUser}>
                    <div>
                        <Label htmlFor="email">Email address</Label>
                        <div className="mt-1">
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full hover:border-primary"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="mt-1">
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full hover:border-primary"
                            />
                        </div>
                    </div>
                    <div>
                        <Button type="submit" className="w-full bg-accent/90 hover:bg-accent transition-all">
                            {loading ? (
                                <LoaderCircleIcon className="animate-spin" />
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </div>
                    <div>
                        <p className="mt-4 max-sm:text-sm text-[#6b7280]">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="font-medium text-[#3b82f6] hover:underline"
                                prefetch={false}
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;