"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setShowButton(true);
    }, 1500);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/splash-image.jpg')" }}
    >
      <h1 className="racing-sans text-5xl font-bold text-white mb-10 tracking-widest">
        LANDRUP
        <br />
        DANS
      </h1>
      {showButton && (

        <button
          className="absolute bottom-10 px-6 py-3 bg-[#5E2E53] text-white rounded-lg transition-opacity duration-500"
          onClick={() => router.push("/aktiviteter")}
        >
          Kom i gang
        </button>
      )}
    </div>
  );
}
