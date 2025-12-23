import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function TestPage() {
    const supabase = await createClient();

    let connectionStatus = 'Conectando...';
    let leads = [];
    let error = null;

    try {
        const { data, error: dbError } = await supabase
            .from('leads')
            .select('*')
            .limit(5);

        if (dbError) {
            error = dbError.message;
            connectionStatus = '❌ Error de conexión';
        } else {
            connectionStatus = '✅ Conectado exitosamente';
            leads = data || [];
        }
    } catch (err) {
        error = err instanceof Error ? err.message : 'Error desconocido';
        connectionStatus = '❌ Error de conexión';
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8">
                    🔌 Test de Conexión Supabase
                </h1>

                {/* Connection Status */}
                <div className="glass-dark rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-4">
                        Estado de Conexión
                    </h2>
                    <p className="text-2xl">{connectionStatus}</p>
                    {error && (
                        <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
                            <p className="text-red-300 font-mono text-sm">{error}</p>
                        </div>
                    )}
                </div>

                {/* Environment Variables */}
                <div className="glass-dark rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-4">
                        Variables de Entorno
                    </h2>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-purple-300">NEXT_PUBLIC_SUPABASE_URL:</span>
                            <span className="text-green-400">
                                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ No configurada'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-purple-300">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                            <span className="text-green-400">
                                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada'}
                            </span>
                        </div>
                        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
                            <p className="text-gray-400 mt-4">
                                URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}
                            </p>
                        )}
                    </div>
                </div>

                {/* Leads Data */}
                {leads.length > 0 && (
                    <div className="glass-dark rounded-xl p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4">
                            📊 Leads en la Base de Datos ({leads.length})
                        </h2>
                        <div className="space-y-4">
                            {leads.map((lead: any) => (
                                <div
                                    key={lead.id}
                                    className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-purple-300 text-sm">Nombre</p>
                                            <p className="text-white font-semibold">{lead.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-purple-300 text-sm">Email</p>
                                            <p className="text-white">{lead.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-purple-300 text-sm">Perfil Psicográfico</p>
                                            <p className="text-white font-semibold capitalize">
                                                {lead.psych_profile}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-purple-300 text-sm">Nivel de Escasez</p>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex-1 bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-yellow-500 to-red-500 h-2 rounded-full"
                                                        style={{ width: `${lead.scarcity_level}%` }}
                                                    />
                                                </div>
                                                <span className="text-white font-bold">{lead.scarcity_level}%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-purple-300 text-sm">Abandonado</p>
                                            <p className="text-white">
                                                {lead.is_abandoned ? '❌ Sí' : '✅ No'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-purple-300 text-sm">Creado</p>
                                            <p className="text-white text-sm">
                                                {new Date(lead.created_at).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back to Home */}
                <div className="mt-8 text-center">
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        ← Volver al Inicio
                    </a>
                </div>
            </div>
        </main>
    );
}
