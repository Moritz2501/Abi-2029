import bcrypt from 'bcryptjs';

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
  const first = firstName.substring(0, 2).toUpperCase();
  const last = lastName.substring(0, 2).toUpperCase();
  return `${first}${last}`;
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
