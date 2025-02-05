import axios from 'axios'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { HTTP_URL } from '../../../../config/config'
import { headers } from 'next/headers'


export const runtime = 'nodejs'

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                //api call
                try {
                    if (!credentials?.username || !credentials?.password) {
                        return null;
                    }
                    const res = await axios.post(`${HTTP_URL}/auth/v1/login`, {
                        username: credentials.username,
                        password: credentials.password,
                    });

                    const user = res.data;

                    if (res.status === 200 && user) {
                        return user;
                    }
                    return null;

                } catch (error) {
                    console.error("Error in authorize:", error);
                    return null;
                }


            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        // async session({ session, token }) {
        //     session.user = {
        //         id: token.id,
        //         username: token.username,
        //     };
        //     return session;
        // },
    },
    pages: {
        signIn: '/login'
    }
})

export { handler as GET, handler as POST }