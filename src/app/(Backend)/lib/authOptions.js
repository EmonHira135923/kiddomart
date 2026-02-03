import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { getUsers } from "./dbConnect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const userCollection = await getUsers();
        const user = await userCollection.findOne({ email: credentials.email });

        if (!user) throw new Error("User found hoy nai bhai!");

        const isMatched = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isMatched) throw new Error("Password vhul dichen!");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          phone: user.phone,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const userCollection = await getUsers();
        const isExist = await userCollection.findOne({ email: user.email });

        if (!isExist) {
          await userCollection.insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: account.provider,
            role: "user", // Default role
            phone: "",
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      const userCollection = await getUsers();

      // First login
      if (user) {
        if (account?.provider === "google") {
          const dbUser = await userCollection.findOne({ email: user.email });

          if (dbUser) {
            token.id = dbUser._id.toString(); // MongoDB ID
            token.role = dbUser.role || "user";
            token.phone = dbUser.phone || "";
          }
        } else {
          // Credentials login
          token.id = user.id;
          token.role = user.role;
          token.phone = user.phone;
        }
      }

      // 🔥 SAFETY FALLBACK (MOST IMPORTANT)
      if (!token.id && token.sub) {
        token.id = token.sub; // Google UID fallback
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          ...session.user, // name, email, image retain
          id: token.id || null, // MongoDB user _id
          role: token.role || "user",
          phone: token.phone || "",
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
};
