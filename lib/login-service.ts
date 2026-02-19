import bcrypt from "bcryptjs";

export async function verifyLoginCredentials(input: {
  password: string;
  passwordHash: string;
}) {
  return bcrypt.compare(input.password, input.passwordHash);
}
