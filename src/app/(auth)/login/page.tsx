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
import { FcGoogle } from "react-icons/fc";

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
                          <FcGoogle size={10}/>
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
