import { Roles } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'

export const checkRole = async (role: Roles): Promise<boolean> => {
  const { sessionClaims } = await auth();
  console.log("session", sessionClaims?.metadata?.role);
  // If sessionClaims or sessionClaims.metadata is undefined, return false
  return sessionClaims?.metadata?.role === role;
};
