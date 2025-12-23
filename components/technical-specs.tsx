'use client';

interface TechnicalSpecsProps {
    service: {
        name: string;
        technology: string;
        certifications: string[];
        efficacy: string;
        safetyRating: string;
        clinicalStudies: number;
    };
}

export default function TechnicalSpecs({ service }: TechnicalSpecsProps) {
    return (
        <div className="glass-dark rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">
                Especificaciones Técnicas
            </h3>

            <div className="space-y-6">
                {/* Technology */}
                <div>
                    <h4 className="text-sm font-semibold text-blue-300 mb-2">
                        TECNOLOGÍA
                    </h4>
                    <p className="text-white text-lg">{service.technology}</p>
                </div>

                {/* Efficacy */}
                <div>
                    <h4 className="text-sm font-semibold text-blue-300 mb-2">
                        EFICACIA COMPROBADA
                    </h4>
                    <p className="text-white text-lg">{service.efficacy}</p>
                </div>

                {/* Safety */}
                <div>
                    <h4 className="text-sm font-semibold text-blue-300 mb-2">
                        ÍNDICE DE SEGURIDAD
                    </h4>
                    <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-green-500 h-3 rounded-full"
                                style={{ width: service.safetyRating }}
                            />
                        </div>
                        <span className="text-white font-bold">{service.safetyRating}</span>
                    </div>
                </div>

                {/* Clinical Studies */}
                <div>
                    <h4 className="text-sm font-semibold text-blue-300 mb-2">
                        ESTUDIOS CLÍNICOS
                    </h4>
                    <p className="text-white text-3xl font-bold">
                        {service.clinicalStudies}+
                    </p>
                    <p className="text-gray-400 text-sm">Investigaciones publicadas</p>
                </div>

                {/* Certifications */}
                <div>
                    <h4 className="text-sm font-semibold text-blue-300 mb-4">
                        CERTIFICACIONES
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        {service.certifications.map((cert, index) => (
                            <div
                                key={index}
                                className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 text-center"
                            >
                                <svg
                                    className="w-8 h-8 text-blue-400 mx-auto mb-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="text-white text-xs font-semibold">{cert}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-xs text-center">
                    Todos los procedimientos son realizados por profesionales certificados
                    siguiendo protocolos internacionales de seguridad
                </p>
            </div>
        </div>
    );
}
