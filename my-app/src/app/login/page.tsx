'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('http://localhost:4000/auth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            setError('Forkert brugernavn eller adgangskode');
            return;
        }

        const data = await res.json();
        const validUntil = data.validUntil;

        const cookieOptions = rememberMe ? 'expires=' + validUntil : '';


        console.log({ mikkel: data })
        document.cookie = `landrupToken=${data.token}; ${cookieOptions}; path=/`;
        document.cookie = `landrupUserId=${data.userId}; ${cookieOptions}; path=/`;
        document.cookie = `landrupRole=${data.role}; ${cookieOptions}; path=/`;

        router.push('/kalender');
    };

    return (
        <div className="min-h-screen bg-[#5E2E53] p-6">
            <h1 className="text-white text-3xl font-bold mb-8">Log ind</h1>
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="brugernavn"
                    className="w-full bg-[#ffffff20] text-white placeholder-white/60 rounded-lg py-3 px-4"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="adgangskode"
                    className="w-full bg-[#ffffff20] text-white placeholder-white/60 rounded-lg py-3 px-4"
                    required
                />
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="rememberMe" className="text-white">Husk mig</label>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-[#E1A1E9] text-[#5E2E53] font-bold py-3 px-4 rounded-lg">Log ind</button>
            </form>
        </div>
    );
}