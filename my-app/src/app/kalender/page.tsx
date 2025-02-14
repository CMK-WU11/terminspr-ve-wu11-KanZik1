"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from '../utils/auth';

interface Activity {
    id: string;
    name: string;
    weekday: string;
    time: string;
}

export default function Kalender() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = getCookie('landrupToken');
        const role = getCookie('landrupRole');
        const id = getCookie('landrupUserId');

        if (!token) {
            router.push('/login');
            return;
        }

        setUserRole(role);
        setUserId(id);

        fetchActivities(token, role, id);
    }, []);

    const fetchActivities = async (token: string, role: string, userId: string) => {
        try {
            console.log('Fetching activities for role:', role, 'userId:', userId); // Debug log

            if (role === 'instructor') {
                const res = await fetch(`http://localhost:4000/api/v1/activities`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    console.error('Fejl status:', res.status);
                    throw new Error('Fejl ved hentning af aktiviteter');
                }

                const allActivities = await res.json();
                console.log('Alle aktiviteter:', allActivities);

                // Konverter userId til number da API'et returnerer instructorId som number
                const instructorActivities = allActivities.filter((activity: any) => {
                    console.log('Activity instructorId:', activity.instructorId, 'Type:', typeof activity.instructorId);
                    console.log('UserId:', userId, 'Type:', typeof userId);
                    return activity.instructorId === Number(userId);
                });

                console.log('Instructor aktiviteter efter filtrering:', instructorActivities);
                setActivities(instructorActivities);
            } else if (role === 'default') {
                const res = await fetch(`http://localhost:4000/api/v1/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error('Fejl ved hentning af aktiviteter');
                const userData = await res.json();
                setActivities(userData.activities || []);
            }
        } catch (error) {
            console.error('Fejl:', error);
            if (error instanceof Error && error.message.includes('401')) {
                router.push('/login');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#5E2E53] p-6">
            <h1 className="text-white text-3xl font-bold mb-8">Kalender</h1>
            <div className="space-y-4">
                {activities && activities.length > 0 ? (
                    activities.map((activity: any) => (
                        <div key={activity.id} className="bg-[#E1A1E9] bg-opacity-20 p-4 rounded-lg">
                            <h3 className="text-white text-xl font-bold">{activity.name}</h3>
                            <p className="text-white">{activity.weekday} - {activity.time}</p>

                            {userRole === 'instructor' && activity.users && (
                                <div className="mt-2">
                                    <h4 className="text-white font-semibold">Tilmeldte deltagere:</h4>
                                    <ul className="text-white">
                                        {activity.users.map((user: any) => (
                                            <li key={user.id} className="ml-4">
                                                • {user.firstname} {user.lastname}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-white">Ingen aktiviteter fundet</p>
                )}
            </div>
        </div>
    );
}