// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// The `authOptions` object now exports a configuration object
export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            // Ensure these environment variables are set in your .env.local file
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    // The pages object allows you to specify a custom sign-in page
    pages: {
        signIn: "/auth/signin",
    },
    // You can add more configuration options here, like callbacks, etc.
};

// NextAuth.js App Router requires a handler that exports GET and POST methods
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


