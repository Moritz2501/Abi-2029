import bcrypt from "bcryptjs";

export async function verifyLoginCredentials(input: {
  expectedUsername: string;
  username: string;
  password: string;
  passwordHash: string;
}) {
  if (input.username !== input.expectedUsername) {
    return false;
  }

  return bcrypt.compare(input.password, input.passwordHash);
}
