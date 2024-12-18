import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user";
import bcrypt from "bcrypt";
import dbConnect from "@/utils/dbConnect";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      async authorize(credentials, req) {
        dbConnect();

        const { email, password } = credentials;

        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("Email hoặc mật khẩu không đúng");
        }

        // If the user has no password (i.e., they signed up via a social network), throw an error
        if (!user.password) {
          throw new Error("Vui lòng đăng nhập qua phương thức bạn đã sử dụng để đăng ký.");
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
          throw new Error("Email hoặc mật khẩu không đúng");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      dbConnect();

      const { email } = user;

      // Try to find a user with the provided email
      let dbUser = await User.findOne({ email });

      // If the user doesn't exist, create a new one
      if (!dbUser) {
        dbUser = await User.create({
          email,
          name: user.name,
          image: user.image,
        });
      }

      return true;
    },
    // add user profile/role to token and session
    jwt: async ({ token, user }) => {
      const userByEmail = await User.findOne({ email: token.email });
      userByEmail.password = undefined;
      token.user = userByEmail;
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
