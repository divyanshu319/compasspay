import Link from "next/link";
import { CompanyDirectory } from "@/components/CompanyDirectory";
export default function CompaniesPage() { return <main className="mx-auto max-w-6xl px-5 py-12"><Link href="/" className="text-sm font-bold underline">← Explore compensation</Link><h1 className="mt-6 text-4xl font-black">Company intelligence</h1><p className="mt-2 max-w-2xl text-gray-600">Browse aggregated compensation data by company, then inspect the pay mix and level progression behind each result.</p><div className="mt-8"><CompanyDirectory /></div></main>; }
