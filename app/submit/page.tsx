import Link from "next/link";
import { redirect } from "next/navigation";
import { CompensationForm } from "@/components/CompensationForm";
import { currentUser } from "@/lib/auth";
export default async function Submit() { const user = await currentUser(); if (!user) redirect("/sign-in"); return <main className="mx-auto max-w-2xl px-5 py-12"><Link href="/" className="text-sm font-bold underline">← Back to explore</Link><h1 className="mt-6 text-4xl font-black">Add compensation</h1><p className="mt-2 text-gray-600">Submitting as <span className="font-semibold">{user.email}</span>. Your entry is normalized into annual USD values. Missing bonus and equity can be submitted as 0.</p><CompensationForm /></main>; }
