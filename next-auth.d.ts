import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  departementId: string;
  prenom: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
