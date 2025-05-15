import axios from 'axios'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { HTTP_URL } from '../../../../config/config'


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

                    const { token } = res.data;

                    if (!token) {
                        throw new Error("No token received");
                    }
                    //Decode JWT to extract userid
                    const decodedToken = jwt.decode(token) as { userId: string }

                    if (!decodedToken || !decodedToken.userId) {
                        throw new Error("Invalid token");
                    }

                    return {
                        id: decodedToken.userId,
                        token,
                    };
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
                token.accessToken = (user as any).token
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as string,
                    accessToken: token.accessToken as string,
                }
            }
        },
    },
    pages: {
        signIn: '/login'
    }
})

export { handler as GET, handler as POST }