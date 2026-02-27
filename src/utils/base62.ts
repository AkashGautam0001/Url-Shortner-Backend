const BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function toBase62(number: number): string {
    if (number === 0) return '0'

    let result = ''
    let n = number;

    while (n > 0) {
        const remainder = n % 62;
        result = BASE62_CHARS[remainder] + result;
        n = Math.floor(n / 62);
    }

    return result;
}

export function fromBase62(base62String: string): number {
    let result = 0;
    for (let i = 0; i < base62String.length; i++) {
        const char = base62String[i];
        const digit = BASE62_CHARS.indexOf(char);
        result = result * 62 + digit;
    }
    return result;
}