import dbConnect from "@/helpers/dbConnect";
import User from "@/models/User";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email } = user;

        try {
          await dbConnect();

          let existingUser = await User.findOne({ email });
          if (!existingUser) {
            const isAdmin = process.env.ADMIN_EMAILS?.split(",").includes(email);
            await User.create({ name, email, isAdmin });
            console.log("User created:", name);
          } else {
            console.log("User already exists:", name);
          }
        } catch (error) {
          console.log("Error signing in:", error);
          return false;
        }
      }
      return true; // ✅ Fix: Allow sign-in to proceed
    },

    async session({ session }) {
      await dbConnect(); // ✅ Fix: Ensure DB connection before querying
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        session.user.isAdmin = user.isAdmin;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
