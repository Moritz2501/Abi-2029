import bcrypt from "bcryptjs";

export async function verifyBudgetPasswordHash(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
