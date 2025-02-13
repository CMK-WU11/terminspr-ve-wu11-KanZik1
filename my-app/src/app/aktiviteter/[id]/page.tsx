"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/app/utils/auth';
import { use } from 'react';

interface Props {
    params: Promise<{
        id: string
    }>
}

export default function AktivitetDetaljer({ params }: Props) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [aktivitet, setAktivitet] = useState<any>(null);
    const [roster, setRoster] = useState<any>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [userAge, setUserAge] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string | null>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const aktivitetRes = await fetch(`http://localhost:4000/api/v1/activities/${resolvedParams.id}`);
                const aktivitetData = await aktivitetRes.json();

                console.log({ aktivitetData: aktivitetData });
                setAktivitet(aktivitetData);

                const token = getCookie('landrupToken');
                const userId = getCookie('landrupUserId');
                const role = getCookie('landrupRole');
                setRole(role);

                if (token && userId) {
                    if (role == "default") {
                        const userRes = await fetch(`http://localhost:4000/api/v1/users/${userId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const userData = await userRes.json();
                        setUserAge(userData.age);

                        console.log({ rosterData: userData, id: resolvedParams.id })
                        setIsEnrolled(userData.activities.some((act: any) => act.id == resolvedParams.id));
                    } else if (role == "instructor") {

                        const result = await fetch(`http://localhost:4000/api/v1/users/${userId}/roster/${userId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const rosterData = await result.json();
                        setRoster(rosterData);
                        console.log({ rosterData: rosterData });
                    }
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Fejl ved datahentning:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [resolvedParams.id]);

    const handleTilmeld = async () => {
        const token = getCookie('landrupToken');
        const userId = getCookie('landrupUserId');

        if (!token || !userId) {
            router.push('/login');
            return;
        }

        if (userAge < aktivitet.minAge || userAge > aktivitet.maxAge) {
            alert('Du opfylder ikke alderskravet for denne aktivitet');
            return;
        }

        try {
            const res = await fetch(`http://localhost:4000/api/v1/users/${userId}/activities/${resolvedParams.id}`, {
                method: isEnrolled ? 'DELETE' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                setIsEnrolled(!isEnrolled);
                alert(isEnrolled ? 'Du har forladt aktiviteten' : 'Du er nu tilmeldt aktiviteten!');
                router.push('/kalender');
            } else {
                const errorData = await res.text();
                alert(`Fejl: ${errorData}`);
            }
        } catch (error) {
            console.error('Fejl ved tilmelding/afmelding:', error);
            alert('Der skete en fejl');
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#5E2E53] p-6 text-white">Indlæser...</div>;
    }

    if (!aktivitet) {
        return <div className="min-h-screen bg-[#5E2E53] p-6 text-white">Aktivitet ikke fundet</div>;
    }

    return role == "default" ? (
        <div className="min-h-screen bg-[#5E2E53]">
            <div className="relative h-[480px]">
                <img
                    src={aktivitet.asset.url}
                    alt={aktivitet.name}
                    className="w-full h-full object-cover"
                />
                {getCookie('landrupToken') && (
                    <div className="absolute bottom-4 right-4">
                        <button
                            onClick={handleTilmeld}
                            className="bg-[#E1A1E9] text-[#5E2E53] px-8 py-3 rounded-lg font-bold"
                        >
                            {isEnrolled ? 'Forlad' : 'Tilmeld'}
                        </button>
                    </div>
                )}
            </div>

            <div className="p-6 text-white">
                <h1 className="text-2xl font-bold mb-3">{aktivitet.name}</h1>
                <p className="mb-2">{aktivitet.weekday} {aktivitet.time}</p>
                <p className="mb-3">{aktivitet.minAge}-{aktivitet.maxAge} år</p>
                <p className="opacity-90">{aktivitet.description}</p>
            </div>
        </div>
    ) : role == "instructor" ? (
        <div className="min-h-screen bg-[#5E2E53] p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">{aktivitet.name}</h2>

            <ul className="space-y-2">
                {aktivitet && aktivitet.users.map((user: any) => (
                    <li key={user.id} className="bg-[#E1A1E9] bg-opacity-20 p-3 rounded">
                        {user.firstname} {user.lastname} - {user.age} år
                    </li>
                ))}
            </ul>
        </div>
    ) : (
        <h2>No role attached</h2>
    );
}