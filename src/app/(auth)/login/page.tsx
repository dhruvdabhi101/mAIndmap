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

// Inline Google Icon Component
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48">
        <path
            fill="#EA4335"
            d="M24 9.5c3.12 0 5.9 1.08 8.04 2.83l6-6C34.26 3.32 29.46 1 24 1 14.46 1 6.45 6.93 2.64 14.16l7.03 5.47C11.08 13.43 17.96 9.5 24 9.5z"
        />
        <path
            fill="#FBBC05"
            d="M46.56 24.45c0-1.5-.14-2.94-.41-4.33H24v8.18h12.67c-.55 3-2.21 5.57-4.67 7.28l7.36 5.7c4.3-3.97 6.77-9.83 6.77-17.83z"
        />
        <path
            fill="#4285F4"
            d="M24 47c6.48 0 11.92-2.14 15.89-5.82l-7.36-5.7c-2.04 1.37-4.64 2.17-8.53 2.17-6.54 0-12.08-4.4-14.06-10.29H2.64l-7.03 5.47C6.45 41.07 14.46 47 24 47z"
        />
        <path
            fill="#34A853"
            d="M9.94 28.91a14.99 14.99 0 0 1 0-9.82l-7.03-5.47C1.05 18.64 0 21.14 0 24c0 2.86 1.05 5.36 2.91 7.36l7.03-5.45z"
        />
    </svg>
);

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
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
            toast.error(error.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setGoogleLoading(true);
            // Call next-auth signIn with google provider
            const res = await signIn("google", { callbackUrl: "/dashboard" });
            // In case signIn doesn't automatically redirect, you can handle it here
            if (res?.error) {
                toast.error(res.error);
                setGoogleLoading(false);
            }
        } catch (error: any) {
            console.error("Google sign-in error:", error);
            toast.error(error.message || "Google sign-in failed");
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-md rounded-2xl bg-white sm:p-8 space-y-8 border-2 p-8">
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
                </form>
                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                </div>
                {/* Google Login Button */}
                <div>
                    <Button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full bg-transparent text-primary border-2 hover:text-secondary border-primary hover:border-primary transition-all flex items-center justify-center space-x-2"
                    >
                        {googleLoading ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                            <GoogleIcon />
                        )}
                        <span>Sign in with Google</span>
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
            </div>
        </div>
    );
};

export default LoginPage;
