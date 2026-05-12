import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateUsername(firstName: string, lastName: string): string {
  const cleanFirst = firstName.trim().slice(0, 2).toUpperCase().padEnd(2, 'X');
  const cleanLast = lastName.trim().slice(0, 2).toUpperCase().padEnd(2, 'X');
  return `${cleanFirst}${cleanLast}`;
}

export async function generateUniqueUsername(
  firstName: string,
  lastName: string
): Promise<string> {
  const baseUsername = generateUsername(firstName, lastName);
  let username = baseUsername;
  let suffix = 0;

  while (
    await prisma.user.findUnique({
      where: { username },
    })
  ) {
    suffix += 1;
    username = `${baseUsername}${suffix}`;
    if (suffix > 50) {
      throw new Error('Konnte keinen eindeutigen Benutzernamen generieren');
    }
  }

  return username;
}

export function canManageUser(
  currentUserRole: string,
  targetUserRole: string
): boolean {
  const roleHierarchy: Record<string, number> = {
    USER: 0,
    PLANUNG: 1,
    KASSE: 1,
    ADMIN: 2,
    ROOT: 3,
  };

  return (roleHierarchy[currentUserRole] || 0) > (roleHierarchy[targetUserRole] || 0);
}

export function isRootAdmin(role: string): boolean {
  return role === 'ROOT';
}
