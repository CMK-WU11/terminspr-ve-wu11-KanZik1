"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === "/" || pathname === "/login") {
        return null;
    }

    const handleCalendarClick = (e: React.MouseEvent) => {
        e.preventDefault();

        const userToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('landrupToken='));

        if (userToken) {
            router.push('/kalender');
        } else {
            router.push('/login');
        }
    };

    return (
        <footer className="fixed bottom-0 w-full bg-white border-t border-gray-200">
            <nav className="max-w-screen-xl mx-auto px-4">
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

                    {/* Opdateret søgeknap */}
                    <button
                        className="flex flex-col items-center text-gray-500"
                        onClick={() => document.dispatchEvent(new Event('toggleSearch'))}
                    >
                        <Image
                            src="/search.png"
                            alt="Søg"
                            width={24}
                            height={24}
                        />
                        <span className="text-xs mt-1">Søg</span>
                    </button>

                    <button
                        onClick={handleCalendarClick}
                        className={`flex flex-col items-center ${pathname === "/kalender" ? "text-pink-500" : "text-gray-500"}`}>
                        <Image
                            src="/kalender.png"
                            alt="Kalender"
                            width={24}
                            height={24}
                        />
                        <span className="text-xs mt-1">Kalender</span>
                    </button>

                </div>
            </nav>
        </footer>
    );
}
