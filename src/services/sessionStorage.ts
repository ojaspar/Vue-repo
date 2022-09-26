/*eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';

import { Token } from '@/types';

export default class SessionStorageService {
    public static setItem(key: string, value: any): void {
        window.sessionStorage.setItem(key, value);
    }

    public static getItem(key: string): any {
        const item = window.sessionStorage.getItem(key);
        return item;
    }

    public static decodeToken(): Token {
        let decoded = this.getItem('token');
        decoded = jwt.decode(decoded);
        return decoded;
    }

    public static removeItem(key: string) {
        window.sessionStorage.removeItem(key);
    }

    public static clear() {
        window.sessionStorage.clear();
    }
}
