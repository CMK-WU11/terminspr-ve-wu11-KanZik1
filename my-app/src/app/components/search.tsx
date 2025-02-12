'use client';

type SearchProps = {
    isVisible: boolean;
    onSearch: (searchTerm: string) => void;
}

export default function Search({ isVisible, onSearch }: SearchProps) {
    if (!isVisible) return null;

    return (
        <div className="pt-8 px-6 pb-0">
            <input
                type="text"
                placeholder="Søg"
                className="w-full bg-[#ffffff20] text-white placeholder-white/60 rounded-lg py-3 px-4"
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
}