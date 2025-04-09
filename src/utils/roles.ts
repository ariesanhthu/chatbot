import { Roles } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'

export const checkRole = async (role: Roles): Promise<boolean> => {
  const { sessionClaims } = await auth();
  
  // If sessionClaims or sessionClaims.metadata is undefined, return false
  return sessionClaims?.metadata?.role === role;
};
