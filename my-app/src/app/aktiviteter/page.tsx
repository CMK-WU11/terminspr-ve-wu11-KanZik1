import Link from "next/link";

async function getAktiviteter() {
    try {
        const res = await fetch('http://localhost:4000/api/v1/activities', {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);

        }

        return res.json();
    } catch (error) {
        console.error('Api Fejl:', error);
        return [];
    }
}

export default async function Aktiviteter() {
    const aktiviteter = await getAktiviteter();

    return (
        <main className="min-h-screen bg-[#5E2E53]">
            <h1 className="text-white text-3xl font-bold p-6">Aktiviteter</h1>

            <div className="flex flex-col gap-4 px-4 pb-20">
                {aktiviteter.map((aktivitet) => (
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
                ))}
            </div>
        </main>
    );
}
