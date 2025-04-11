import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
        phone: string;
        role: string;
    };
}
