import { SignJWT } from 'jose';
import { JWT_SECRET } from './encryptJWT.js';

const signJWT = async (payload, expiresIn = '30d') => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
};

export default signJWT;
