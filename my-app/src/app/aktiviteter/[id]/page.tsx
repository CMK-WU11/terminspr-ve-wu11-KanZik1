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
        <div className="min-h-screen bg-[#5E2E53]">
            <div className="relative h-[480px]">
                <img
                    src={aktivitet.asset.url}
                    alt={aktivitet.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4">
                    <button className="bg-[#E1A1E9] text-[#5E2E53] px-8 py-3 rounded-lg font-bold">
                        Tilmeld
                    </button>
                </div>
            </div>

            <div className="p-6">
                <h1 className="text-white text-2xl font-bold mb-3">
                    {aktivitet.name}
                </h1>

                <p className="text-white mb-3">
                    {aktivitet.minAge}-{aktivitet.maxAge} år
                </p>

                <p className="text-white opacity-90">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
            </div>
        </div>
    );
}
