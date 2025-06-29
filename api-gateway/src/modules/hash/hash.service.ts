import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashService {
    async hashPassword(password: string): Promise<string> {
        try {
            const hashed = await bcrypt.hash(password, 10);
            return hashed;
        } catch (e) {
            console.error('Error in hashPassword:', e);
            throw e;
        }
    }

    async comparePassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}
