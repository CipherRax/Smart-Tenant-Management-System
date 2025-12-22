(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/(auth)/verify/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
var _s = __turbopack_context__.k.signature();
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Mail, RefreshCw, ArrowRight, Shield, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
export default function VerifyEmailPage() {
    _s();
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [user, setUser] = useState(null);
    useEffect({
        "VerifyEmailPage.useEffect": ()=>{
            checkUser();
            // Set up interval to check email confirmation
            const intervalId = setInterval(checkUser, 5000); // Check every 5 seconds
            return ({
                "VerifyEmailPage.useEffect": ()=>clearInterval(intervalId)
            })["VerifyEmailPage.useEffect"];
        }
    }["VerifyEmailPage.useEffect"], []);
    const checkUser = async ()=>{
        try {
            const { data: { user: currentUser }, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error getting user:', error);
                return;
            }
            if (currentUser) {
                setUser(currentUser);
                setEmail(currentUser.email || '');
                // Check if email is confirmed
                if (currentUser.email_confirmed_at) {
                    // Email is verified! Redirect to dashboard
                    toast.success('Email verified successfully!');
                    router.push('/dashboard');
                }
            } else {
                // No user found, check if we have email in localStorage as fallback
                try {
                    const registrationData = localStorage.getItem('adminRegistrationData');
                    if (registrationData) {
                        const data = JSON.parse(registrationData);
                        setEmail(data.email);
                    } else {
                        // No user and no localStorage data, redirect to signup
                        router.push('/signIn');
                    }
                } catch (e) {
                    router.push('/signIn');
                }
            }
        } catch (error) {
            console.error('Error checking user:', error);
        }
    };
    const handleResendEmail = async ()=>{
        setIsResending(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email
            });
            if (error) {
                toast.error('Failed to resend verification email');
                console.error('Resend error:', error);
            } else {
                setResendSuccess(true);
                toast.success('Verification email resent!');
                // Hide success message after 5 seconds
                setTimeout(()=>{
                    setResendSuccess(false);
                }, 5000);
            }
        } catch (error) {
            toast.error('An error occurred');
            console.error('Resend error:', error);
        } finally{
            setIsResending(false);
        }
    };
    const handleGoToDashboard = async ()=>{
        setIsChecking(true);
        try {
            // Force refresh session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                toast.error('Please verify your email first');
                return;
            }
            if (session?.user.email_confirmed_at) {
                // Clear localStorage data
                localStorage.removeItem('adminRegistrationData');
                router.push('/dashboard');
            } else {
                toast.error('Please verify your email first');
            }
        } catch (error) {
            toast.error('An error occurred');
            console.error('Dashboard check error:', error);
        } finally{
            setIsChecking(false);
        }
    };
    const handleSignOut = async ()=>{
        await supabase.auth.signOut();
        localStorage.removeItem('adminRegistrationData');
        router.push('/signIn');
    };
    return /*#__PURE__*/ _jsxDEV("div", {
        className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4",
        children: /*#__PURE__*/ _jsxDEV("div", {
            className: "w-full max-w-2xl",
            children: [
                /*#__PURE__*/ _jsxDEV("div", {
                    className: "text-center mb-8",
                    children: [
                        /*#__PURE__*/ _jsxDEV("div", {
                            className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-4",
                            children: /*#__PURE__*/ _jsxDEV(Mail, {
                                className: "h-8 w-8 text-white"
                            }, void 0, false, {
                                fileName: "[project]/app/(auth)/verify/page.tsx",
                                lineNumber: 138,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(auth)/verify/page.tsx",
                            lineNumber: 137,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ _jsxDEV("h1", {
                            className: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
                            children: "Verify Your Email"
                        }, void 0, false, {
                            fileName: "[project]/app/(auth)/verify/page.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ _jsxDEV("p", {
                            className: "text-muted-foreground mt-2",
                            children: "Check your inbox to complete your registration"
                        }, void 0, false, {
                            fileName: "[project]/app/(auth)/verify/page.tsx",
                            lineNumber: 143,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(auth)/verify/page.tsx",
                    lineNumber: 136,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV(Card, {
                    className: "border-0 shadow-2xl",
                    children: [
                        /*#__PURE__*/ _jsxDEV(CardHeader, {
                            className: "text-center",
                            children: [
                                /*#__PURE__*/ _jsxDEV(CardTitle, {
                                    children: "Almost there!"
                                }, void 0, false, {
                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ _jsxDEV(CardDescription, {
                                    children: "We've sent a verification email to:"
                                }, void 0, false, {
                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ _jsxDEV("div", {
                                    className: "mt-2",
                                    children: /*#__PURE__*/ _jsxDEV("p", {
                                        className: "text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
                                        children: email
                                    }, void 0, false, {
                                        fileName: "[project]/app/(auth)/verify/page.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this),
                                user && /*#__PURE__*/ _jsxDEV("div", {
                                    className: "mt-4",
                                    children: /*#__PURE__*/ _jsxDEV(Alert, {
                                        className: "bg-blue-50 border-blue-200",
                                        children: /*#__PURE__*/ _jsxDEV(AlertDescription, {
                                            className: "text-blue-800",
                                            children: user.email_confirmed_at ? '✅ Email verified! Redirecting...' : '📧 Awaiting email verification'
                                        }, void 0, false, {
                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                            lineNumber: 164,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(auth)/verify/page.tsx",
                                        lineNumber: 163,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                    lineNumber: 162,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(auth)/verify/page.tsx",
                            lineNumber: 149,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ _jsxDEV(CardContent, {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ _jsxDEV(Alert, {
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(CheckCircle, {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                            lineNumber: 176,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(AlertTitle, {
                                            children: "Important!"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                            lineNumber: 177,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(AlertDescription, {
                                            children: [
                                                "You must verify your email before you can access your dashboard.",
                                                user?.email_confirmed_at && ' Your email is now verified!'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                            lineNumber: 178,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ _jsxDEV("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ _jsxDEV("div", {
                                            className: "flex items-start gap-3",
                                            children: [
                                                /*#__PURE__*/ _jsxDEV("div", {
                                                    className: "flex-shrink-0 mt-1",
                                                    children: /*#__PURE__*/ _jsxDEV("div", {
                                                        className: "h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center",
                                                        children: /*#__PURE__*/ _jsxDEV("span", {
                                                            className: "text-blue-600 text-sm font-bold",
                                                            children: "1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                                            lineNumber: 188,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(auth)/verify/page.tsx",
                                                        lineNumber: 187,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ _jsxDEV("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsxDEV("h4", {
                                                            className: "font-medium",
                                                            children: "Check your inbox"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                                            lineNumber: 192,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV("p", {
                                                            className: "text-sm text-muted-foreground",
                                                            children: 'Look for an email from TenantFlow with the subject "Verify your email address"'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                                            lineNumber: 193,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                            lineNumber: 185,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV("div", {
                                            className: "flex items-start gap-3",
                                            children: [
                                                /*#__PURE__*/ _jsxDEV("div", {
                                                    className: "flex-shrink-0 mt-1",
                                                    children: /*#__PURE__*/ _jsxDEV("div", {
                                                        className: "h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center",
                                                        children: /*#__PURE__*/ _jsxDEV("span", {
                                                            className: "text-blue-600 text-sm font-bold",
                                                            children: "2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                                            lineNumber: 202,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(auth)/verify/page.tsx",
                                                        lineNumber: 201,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                                    lineNumber: 200,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ _jsxDEV("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsxDEV("h4", {
                                                            className: "font-medium",
                                                            children: "Click the verification link"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                                            lineNumber: 206,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV("p", {
                                                            className: "text-sm text-muted-foreground",
                                                            children: "Click the link in the email to confirm your email address"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                                            lineNumber: 207,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                                    lineNumber: 205,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                            lineNumber: 199,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV("div", {
                                            className: "flex items-start gap-3",
                                            children: [
                                                /*#__PURE__*/ _jsxDEV("div", {
                                                    className: "flex-shrink-0 mt-1",
                                                    children: /*#__PURE__*/ _jsxDEV("div", {
                                                        className: "h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center",
                                                        children: /*#__PURE__*/ _jsxDEV("span", {
                                                            className: "text-blue-600 text-sm font-bold",
                                                            children: "3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                                            lineNumber: 216,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(auth)/verify/page.tsx",
                                                        lineNumber: 215,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ _jsxDEV("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsxDEV("h4", {
                                                            className: "font-medium",
                                                            children: "Access your dashboard"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                                            lineNumber: 220,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV("p", {
                                                            className: "text-sm text-muted-foreground",
                                                            children: "Once verified, you'll be redirected to your dashboard automatically"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                                            lineNumber: 221,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                            lineNumber: 213,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, this),
                                resendSuccess && /*#__PURE__*/ _jsxDEV(Alert, {
                                    className: "bg-green-50 border-green-200",
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(CheckCircle, {
                                            className: "h-4 w-4 text-green-600"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                            lineNumber: 230,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(AlertDescription, {
                                            className: "text-green-800",
                                            children: "Verification email resent successfully!"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                            lineNumber: 231,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                    lineNumber: 229,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(auth)/verify/page.tsx",
                            lineNumber: 174,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ _jsxDEV(CardFooter, {
                            className: "flex flex-col space-y-4",
                            children: [
                                /*#__PURE__*/ _jsxDEV("div", {
                                    className: "flex flex-col sm:flex-row gap-4 w-full",
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            variant: "outline",
                                            onClick: handleResendEmail,
                                            disabled: isResending,
                                            className: "flex-1",
                                            children: isResending ? /*#__PURE__*/ _jsxDEV(_Fragment, {
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV(RefreshCw, {
                                                        className: "h-4 w-4 mr-2 animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(auth)/verify/page.tsx",
                                                        lineNumber: 248,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Sending..."
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ _jsxDEV(_Fragment, {
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV(RefreshCw, {
                                                        className: "h-4 w-4 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(auth)/verify/page.tsx",
                                                        lineNumber: 253,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Resend Verification Email"
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                            lineNumber: 240,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            onClick: handleGoToDashboard,
                                            disabled: isChecking,
                                            className: "flex-1",
                                            children: isChecking ? /*#__PURE__*/ _jsxDEV(_Fragment, {
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV(Loader2, {
                                                        className: "h-4 w-4 mr-2 animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(auth)/verify/page.tsx",
                                                        lineNumber: 266,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Checking..."
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ _jsxDEV(_Fragment, {
                                                children: [
                                                    "Go to Dashboard",
                                                    /*#__PURE__*/ _jsxDEV(ArrowRight, {
                                                        className: "ml-2 h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(auth)/verify/page.tsx",
                                                        lineNumber: 272,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                            lineNumber: 259,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                    lineNumber: 239,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ _jsxDEV("div", {
                                    className: "flex flex-col sm:flex-row gap-4 w-full",
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            variant: "ghost",
                                            onClick: checkUser,
                                            className: "flex-1",
                                            children: [
                                                /*#__PURE__*/ _jsxDEV(RefreshCw, {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 17
                                                }, this),
                                                "Check Verification Status"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                            lineNumber: 279,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            variant: "outline",
                                            onClick: handleSignOut,
                                            className: "flex-1",
                                            children: "Sign Out"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(auth)/verify/page.tsx",
                                            lineNumber: 288,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                    lineNumber: 278,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ _jsxDEV("div", {
                                    className: "text-center w-full pt-4 border-t",
                                    children: /*#__PURE__*/ _jsxDEV("p", {
                                        className: "text-sm text-muted-foreground",
                                        children: [
                                            "Didn't receive the email? Check your spam folder or",
                                            ' ',
                                            /*#__PURE__*/ _jsxDEV(Button, {
                                                variant: "link",
                                                className: "p-0 h-auto text-primary",
                                                onClick: handleResendEmail,
                                                disabled: isResending,
                                                children: "click here to resend"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(auth)/verify/page.tsx",
                                                lineNumber: 300,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(auth)/verify/page.tsx",
                                        lineNumber: 298,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                    lineNumber: 297,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(auth)/verify/page.tsx",
                            lineNumber: 238,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(auth)/verify/page.tsx",
                    lineNumber: 148,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("div", {
                    className: "mt-6 p-4 bg-gray-50 rounded-lg",
                    children: [
                        /*#__PURE__*/ _jsxDEV("h3", {
                            className: "text-sm font-medium mb-2",
                            children: "Debug Info:"
                        }, void 0, false, {
                            fileName: "[project]/app/(auth)/verify/page.tsx",
                            lineNumber: 315,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ _jsxDEV("pre", {
                            className: "text-xs bg-gray-100 p-2 rounded overflow-auto",
                            children: [
                                "Email: ",
                                email,
                                user && `\nUser ID: ${user.id}`,
                                user && `\nEmail Verified: ${user.email_confirmed_at ? 'Yes' : 'No'}`,
                                user && `\nConfirmed At: ${user.email_confirmed_at || 'Not yet'}`
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(auth)/verify/page.tsx",
                            lineNumber: 316,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(auth)/verify/page.tsx",
                    lineNumber: 314,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("div", {
                    className: "mt-8 grid grid-cols-1 md:grid-cols-2 gap-6",
                    children: [
                        /*#__PURE__*/ _jsxDEV(Card, {
                            className: "border-0 shadow-sm",
                            children: /*#__PURE__*/ _jsxDEV(CardContent, {
                                className: "pt-6",
                                children: [
                                    /*#__PURE__*/ _jsxDEV("div", {
                                        className: "flex items-center gap-3 mb-3",
                                        children: [
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "p-2 bg-blue-100 rounded-lg",
                                                children: /*#__PURE__*/ _jsxDEV(Shield, {
                                                    className: "h-5 w-5 text-blue-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                                    lineNumber: 329,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(auth)/verify/page.tsx",
                                                lineNumber: 328,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ _jsxDEV("h3", {
                                                className: "font-semibold",
                                                children: "Security First"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(auth)/verify/page.tsx",
                                                lineNumber: 331,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(auth)/verify/page.tsx",
                                        lineNumber: 327,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ _jsxDEV("p", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Email verification ensures that only you can access your account and protects against unauthorized access."
                                    }, void 0, false, {
                                        fileName: "[project]/app/(auth)/verify/page.tsx",
                                        lineNumber: 333,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(auth)/verify/page.tsx",
                                lineNumber: 326,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(auth)/verify/page.tsx",
                            lineNumber: 325,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ _jsxDEV(Card, {
                            className: "border-0 shadow-sm",
                            children: /*#__PURE__*/ _jsxDEV(CardContent, {
                                className: "pt-6",
                                children: [
                                    /*#__PURE__*/ _jsxDEV("div", {
                                        className: "flex items-center gap-3 mb-3",
                                        children: [
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "p-2 bg-purple-100 rounded-lg",
                                                children: /*#__PURE__*/ _jsxDEV(Mail, {
                                                    className: "h-5 w-5 text-purple-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(auth)/verify/page.tsx",
                                                    lineNumber: 343,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(auth)/verify/page.tsx",
                                                lineNumber: 342,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ _jsxDEV("h3", {
                                                className: "font-semibold",
                                                children: "Need Help?"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(auth)/verify/page.tsx",
                                                lineNumber: 345,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(auth)/verify/page.tsx",
                                        lineNumber: 341,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ _jsxDEV("p", {
                                        className: "text-sm text-muted-foreground",
                                        children: "If you're having trouble verifying your email, please contact our support team."
                                    }, void 0, false, {
                                        fileName: "[project]/app/(auth)/verify/page.tsx",
                                        lineNumber: 347,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(auth)/verify/page.tsx",
                                lineNumber: 340,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(auth)/verify/page.tsx",
                            lineNumber: 339,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(auth)/verify/page.tsx",
                    lineNumber: 324,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("div", {
                    className: "mt-8 text-center",
                    children: /*#__PURE__*/ _jsxDEV("p", {
                        className: "text-sm text-muted-foreground",
                        children: [
                            "By verifying your email, you agree to our",
                            ' ',
                            /*#__PURE__*/ _jsxDEV(Link, {
                                href: "/terms",
                                className: "text-primary hover:underline",
                                children: "Terms of Service"
                            }, void 0, false, {
                                fileName: "[project]/app/(auth)/verify/page.tsx",
                                lineNumber: 357,
                                columnNumber: 13
                            }, this),
                            ' ',
                            "and",
                            ' ',
                            /*#__PURE__*/ _jsxDEV(Link, {
                                href: "/privacy",
                                className: "text-primary hover:underline",
                                children: "Privacy Policy"
                            }, void 0, false, {
                                fileName: "[project]/app/(auth)/verify/page.tsx",
                                lineNumber: 361,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(auth)/verify/page.tsx",
                        lineNumber: 355,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(auth)/verify/page.tsx",
                    lineNumber: 354,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(auth)/verify/page.tsx",
            lineNumber: 135,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(auth)/verify/page.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
_s(VerifyEmailPage, "suE5/cbsgLbOTTG1YAVtcI9SUVE=", false, function() {
    return [
        useRouter
    ];
});
_c = VerifyEmailPage;
var _c;
__turbopack_context__.k.register(_c, "VerifyEmailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_%28auth%29_verify_page_tsx_93bd0bdf._.js.map