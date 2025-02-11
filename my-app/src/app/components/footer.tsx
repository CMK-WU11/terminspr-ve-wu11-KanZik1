"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const pathname = usePathname();

    if (pathname === "/" || pathname === "/login") {
        return null;
    }

    return (
        <footer className="fixed bottom-0 w-full bg-white border-t border-gray-200">
            <nav className="max-w-screen-x1 mx-auto px-4">
                <div className="flex justify-around items-center h-16">
                    <Link href="/aktiviteter"
                        className={`flex flex-col items-center ${pathname === "/aktiviteter" ? "text-pink-500" : "text-gray-500"
                            }`}>
                        <Image
                            src="/home.png"
                            alt="Aktiviteter"
                            width={24}
                            height={24}
                        />
                        <span className="text-xs mt-1">Aktiviteter</span>
                    </Link>

                    <Link href="/search"
                        className={`flex flex-col items-center ${pathname === "/search" ? "text-pink-500" : "text-gray-500"
                            }`}>
                        <Image
                            src="/search.png"
                            alt="Søg"
                            width={24}
                            height={24}
                        />
                        <span className="text-xs mt-1">Søg</span>
                    </Link>

                    <Link href="/kalender"
                        className={`flex flex-col items-center ${pathname === "/kalender" ? "text-pink-500" : "text-gray-500"
                            }`}>
                        <Image
                            src="/kalender.png"
                            alt="Kalender"
                            width={24}
                            height={24}
                        />
                        <span className="text-xs mt-1">Kalender</span>
                    </Link>
                </div>
            </nav>
        </footer>
    )
}