import bcrypt from "bcrypt";

export const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  const encryptedPassword = await bcrypt.hash(password, 8); // rounds 8 || salt
  return encryptedPassword;
};

export const isPasswordMatch = async (
  password: string,
  userPassword: string
) => {
  return bcrypt.compare(password, userPassword);
};
