// Validación de nombre completo (debe tener al menos nombre y apellido)
export function validateFullName(name: string): { isValid: boolean; error?: string } {
    const trimmed = name.trim();
    if (!trimmed) {
        return { isValid: false, error: 'El nombre es requerido' };
    }

    const parts = trimmed.split(/\s+/).filter(p => p.length > 0);
    if (parts.length < 2) {
        return { isValid: false, error: 'Debe ingresar al menos Nombre y Apellido' };
    }

    // Validar que cada nombre/apellido empiece con mayúscula
    const isCapitalized = parts.every(part => /^[A-ZÁÉÍÓÚÑ]/.test(part));
    if (!isCapitalized) {
        return { isValid: false, error: 'Nombre y Apellidos deben comenzar con Mayúscula' };
    }

    return { isValid: true };
}

// Capitalizar primera letra de cada palabra
export function capitalizeWords(text: string): string {
    return text
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Validación de email
export function validateEmail(email: string): { isValid: boolean; error?: string } {
    const trimmed = email.trim();
    if (!trimmed) {
        return { isValid: false, error: 'El correo es requerido' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
        return { isValid: false, error: 'Correo electrónico inválido' };
    }

    return { isValid: true };
}

// Validación de WhatsApp chileno (+569XXXXXXXX)
export function validateWhatsApp(phone: string): { isValid: boolean; error?: string } {
    const cleaned = phone.replace(/\s+/g, '');

    if (!cleaned) {
        return { isValid: false, error: 'El WhatsApp es requerido' };
    }

    // Formatos válidos: +56912345678, 56912345678, 912345678
    const phoneRegex = /^(\+?56)?9\d{8}$/;
    if (!phoneRegex.test(cleaned)) {
        return { isValid: false, error: 'WhatsApp inválido. Formato: +56912345678' };
    }

    return { isValid: true };
}

// Formatear WhatsApp a formato estándar
export function formatWhatsApp(phone: string): string {
    const cleaned = phone.replace(/\s+/g, '').replace(/^\+/, '');

    if (cleaned.startsWith('569')) {
        return '+' + cleaned;
    } else if (cleaned.startsWith('56')) {
        return '+' + cleaned;
    } else if (cleaned.startsWith('9')) {
        return '+56' + cleaned;
    }

    return phone;
}

// Validación de RUT chileno
export function validateRUT(rut: string): { isValid: boolean; error?: string } {
    const cleaned = rut.replace(/[.-]/g, '').trim();

    if (!cleaned) {
        return { isValid: false, error: 'El RUT es requerido' };
    }

    if (cleaned.length < 8) {
        return { isValid: false, error: 'RUT muy corto' };
    }

    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1).toUpperCase();

    // Verificar que el cuerpo sean solo números
    if (!/^\d+$/.test(body)) {
        return { isValid: false, error: 'RUT inválido' };
    }

    // Calcular dígito verificador
    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedDV = 11 - (sum % 11);
    const calculatedDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : expectedDV.toString();

    if (dv !== calculatedDV) {
        return { isValid: false, error: 'RUT inválido (dígito verificador incorrecto)' };
    }

    return { isValid: true };
}

// Formatear RUT (12.345.678-9)
export function formatRUT(rut: string): string {
    const cleaned = rut.replace(/[.-]/g, '').trim();
    if (cleaned.length < 2) return rut;

    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);

    // Agregar puntos cada 3 dígitos
    const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formatted}-${dv}`;
}
