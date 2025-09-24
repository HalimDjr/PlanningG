"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/user";
import { generateVerificationToken } from "@/lib/tokens";

import { sendVerificationEmail } from "@/lib/mail";
import { currentUser } from "@/lib/current-user";
// import { generateVerificationToken } from "@/lib/tokens";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const user = await currentUser();
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }
  const existingDepartement = await db.departement.findFirst({
    where: { nom: name },
  });

  if (existingDepartement) {
    return { error: "Departement already exists!" };
  }

  const departement = await db.departement.create({
    data: {
      nom: name as string,
    },
  });
  await db.admin.create({
    data: {
      email,
      password: hashedPassword,
      departementId: departement.id,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent!" };
};
