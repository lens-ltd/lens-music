import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
        permissions?: string[];
        roleName?: string;
    }
};
