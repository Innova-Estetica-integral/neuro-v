/**
 * Error handling utilities
 */

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Extract user-friendly error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'Ha ocurrido un error inesperado';
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
        return (
            error.message.includes('fetch') ||
            error.message.includes('network') ||
            error.message.includes('Failed to fetch')
        );
    }
    return false;
}

/**
 * Handle error with logging and return formatted message
 */
export function handleError(error: unknown, context?: string): string {
    const message = getErrorMessage(error);

    console.error(`[Error${context ? ` in ${context}` : ''}]:`, error);

    if (isNetworkError(error)) {
        return 'Error de conexión. Por favor, verifica tu conexión a internet.';
    }

    return message;
}

/**
 * Format error for API response
 */
export function formatApiError(error: unknown): {
    error: string;
    code?: string;
    statusCode: number;
} {
    if (error instanceof ApiError) {
        return {
            error: error.message,
            code: error.code,
            statusCode: error.statusCode,
        };
    }

    return {
        error: getErrorMessage(error),
        statusCode: 500,
    };
}
