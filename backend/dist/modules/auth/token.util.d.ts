import { RequestUser } from '../../common/types';
export declare function signToken(payload: RequestUser): string;
export declare function verifyToken(token: string): RequestUser;
