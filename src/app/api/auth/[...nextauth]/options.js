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
            const newUser = await User.create({ name, email, isAdmin });
            console.log("User created:", newUser.name);
          } else {
            console.log("User already exists:", existingUser.name);
          }
        } catch (error) {
          console.log("Error signing in:", error);
          return false;
        }
      }
      return true;
    },

    async session({ session }) {
      await dbConnect();
      const user = await User.findOne({ email: session.user.email });

      if (user) {
        session.user.id = user._id.toString();  // ✅ Add MongoDB ID to the session
        session.user.isAdmin = user.isAdmin;    // Include isAdmin field
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
