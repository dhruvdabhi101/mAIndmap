import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyToken = (token: string): { id: number } | null => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload & { id: number };
    console.log('Decoded token:', decoded);
    return { id: decoded.id };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const verifyAuthentication = async (request: Request, userId: number): Promise<boolean> => {
  console.log('Request headers:', request.headers);

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.split(' ')[1];
  const decodedToken = verifyToken(token);

  if (!decodedToken || decodedToken.id !== userId) {
    return false;
  }

  return true; // Indicate that authentication passed
};
