async function getAktivitet(id: string) {
    try {
        const res = await fetch(`http://localhost:4000/api/v1/activities/${id}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.json();
    } catch (error) {
        console.error('API Fejl:', error);
        return null;
    }
}

export default async function AktivitetDetaljer({ params }: { params: { id: string } }) {
    const aktivitet = await getAktivitet(params.id);

    if (!aktivitet) {
        return <div>Aktivitet ikke fundet</div>;
    }

    return (
        <main className="min-h-screen bg-[#5E2E53] text-white">
            <div className="relative h-64">
                <img
                    src={aktivitet.asset.url}
                    alt={aktivitet.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">{aktivitet.name}</h1>
                <p className="mb-2">{aktivitet.weekday} {aktivitet.time}</p>
                <p className="mb-4">{aktivitet.description}</p>
                <p className="mb-4">Alder: {aktivitet.minAge}-{aktivitet.maxAge} år</p>

                <button className="w-full bg-[#E1A1E9] text-[#5E2E53] py-3 rounded-lg font-bold">
                    Tilmeld
                </button>
            </div>
        </main>
    );
}