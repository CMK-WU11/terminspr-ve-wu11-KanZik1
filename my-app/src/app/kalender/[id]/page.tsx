"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/app/utils/auth';

interface Activity {
    id: string;
    name: string;
    weekday: string;
    time: string;
}

export default function Kalender() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchActivities = async () => {
            const token = getCookie('landrupToken');
            const userId = getCookie('landrupUserId');

            if (!token || !userId) {
                router.push('/login');
                return;
            }

            try {
                const res = await fetch(`http://localhost:4000/api/v1/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) throw new Error('Fejl ved hentning af aktiviteter');

                const data = await res.json();

                setActivities(data.activities);
            } catch (error) {
                console.error('Fejl ved hentning af aktiviteter:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-[#5E2E53] p-6 text-white">Indlæser...</div>;
    }

    return (
        <div className="min-h-screen bg-[#5E2E53] p-6">
            <h1 className="text-white text-3xl font-bold mb-8">Mine Aktivitete123123123r</h1>
            {activities.length === 0 ? (
                <p className="text-white">Du har ingen tilmeldte aktiviteter</p>
            ) : (
                <div className="space-y-4">
                    {activities.map(activity => (
                        <div
                            key={activity.id}
                            className="bg-[#E1A1E9] rounded-lg p-4 cursor-pointer"
                            onClick={() => router.push(`/aktiviteter/${activity.id}`)}
                        >
                            <h2 className="text-[#5E2E53] font-bold text-xl">{activity.name}</h2>
                            <p className="text-[#5E2E53]">{activity.weekday} {activity.time}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}