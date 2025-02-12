'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Search from '@/app/components/search';

export default function Aktiviteter() {
    const [showSearch, setShowSearch] = useState(false);
    const [aktiviteter, setAktiviteter] = useState([]);
    const [filteredAktiviteter, setFilteredAktiviteter] = useState([]);

    useEffect(() => {
        const handleToggleSearch = () => {
            setShowSearch(prev => !prev);
        };

        document.addEventListener('toggleSearch', handleToggleSearch);
        return () => document.removeEventListener('toggleSearch', handleToggleSearch);
    }, []);

    useEffect(() => {
        const loadAktiviteter = async () => {
            const res = await fetch('http://localhost:4000/api/v1/activities');
            const data = await res.json();
            setAktiviteter(data);
            setFilteredAktiviteter(data);
        };
        loadAktiviteter();
    }, []);

    const handleSearch = (searchTerm: string) => {
        if (!searchTerm.trim()) {
            setFilteredAktiviteter(aktiviteter);
            return;
        }

        const filtered = aktiviteter.filter((aktivitet) =>
            aktivitet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${aktivitet.minAge}-${aktivitet.maxAge}`.includes(searchTerm)
        );

        setFilteredAktiviteter(filtered);
    };

    return (
        <div className="min-h-screen bg-[#5E2E53] pb-20">
            <Search
                isVisible={showSearch}
                onSearch={handleSearch}
            />

            <h1 className="text-white text-3xl font-bold p-6">Aktiviteter</h1>

            <div className="flex flex-col gap-4 px-4">
                {filteredAktiviteter.length === 0 ? (
                    <p className="text-white text-center">
                        Der blev ikke fundet nogle aktiviteter. Prøv at søge efter noget andet.
                    </p>
                ) : (
                    filteredAktiviteter.map((aktivitet) => (
                        <Link
                            key={aktivitet.id}
                            href={`/aktiviteter/${aktivitet.id}`}
                            className="block"
                        >
                            <div className="bg-[#E1A1E9] rounded-xl overflow-hidden">
                                <div className="relative h-48">
                                    <img
                                        src={aktivitet.asset.url}
                                        alt={aktivitet.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h2 className="text-[#5E2E53] text-xl font-bold">
                                        {aktivitet.name}
                                    </h2>
                                    <p className="text-[#5E2E53]">
                                        {aktivitet.minAge}-{aktivitet.maxAge} år
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
