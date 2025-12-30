'use client';
export default function TestPage() {
    return (
        <div className="min-h-screen bg-red-500 flex items-center justify-center">
            <div className="bg-white p-10 rounded-3xl shadow-2xl">
                <h1 className="text-4xl font-black text-black">Tailwind Test</h1>
                <p className="text-gray-500 mt-4">If you see a red background and this text is gray, Tailwind is working.</p>
            </div>
        </div>
    );
}
