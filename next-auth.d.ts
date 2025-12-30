declare module "next-auth" {
import { JWT } from 'jsonwebtoken';
    interface Session {
        id: string;
    }
    
    interface JWT {
        id: string;
    }
}