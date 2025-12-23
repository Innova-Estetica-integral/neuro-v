/**
 * Password validation utilities
 */

export interface PasswordStrength {
    score: number; // 0-4
    label: 'weak' | 'fair' | 'good' | 'strong' | 'very strong';
    feedback: string[];
}

export function validatePassword(password: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
        score++;
    } else {
        feedback.push('Mínimo 8 caracteres');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        score++;
    } else {
        feedback.push('Al menos 1 mayúscula');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        score++;
    } else {
        feedback.push('Al menos 1 minúscula');
    }

    // Number check
    if (/[0-9]/.test(password)) {
        score++;
    } else {
        feedback.push('Al menos 1 número');
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }

    // Additional length bonus
    if (password.length >= 12) {
        score++;
    }

    // Cap at 4
    score = Math.min(score, 4);

    const labels: PasswordStrength['label'][] = ['weak', 'fair', 'good', 'strong', 'very strong'];

    return {
        score,
        label: labels[score],
        feedback: feedback.length > 0 ? feedback : ['Contraseña segura']
    };
}

export function getPasswordStrengthColor(score: number): string {
    const colors = [
        'bg-red-500',      // 0: weak
        'bg-orange-500',   // 1: fair
        'bg-yellow-500',   // 2: good
        'bg-green-500',    // 3: strong
        'bg-emerald-600'   // 4: very strong
    ];
    return colors[score] || colors[0];
}
