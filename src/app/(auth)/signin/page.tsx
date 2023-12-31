"use client";
import { GET_USER } from "@/api/getUser";
import { SIGN_IN } from "@/api/auth";
import { User } from "@/api/types";
import { ApolloClient, ApolloProvider, InMemoryCache, gql, useMutation } from "@apollo/client";
import { Metadata } from "next";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const queryClient = new ApolloClient({
  uri: process.env.chatBackendUrl!,
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${process.env.chatBackendToken}`
  }
});

export default function SignInPage() {
  return (
    <ApolloProvider client={queryClient}>
      <SignInForm />
    </ApolloProvider>
  )
};


function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signIn, { error }] = useMutation(SIGN_IN, {
    onCompleted: (data) => {
      const accessToken = data.signIn;
      queryClient.cache.writeQuery({
        query: gql`
          query SaveAccessToken {
            accessToken
          }
        `,
        data: { accessToken: accessToken },
      })
    }
  });

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    // check user's preference for dark mode, and set it if needed
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    if(prefersDarkMode) toggleDarkMode();
  }, []); 

  const handleSignIn = async () => {
    // Call the signUp mutation
    await signIn({ variables: { email, password } });
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
       <div className="dark:bg-white bg-gray-900 p-8 rounded shadow-md w-96">
         <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-600">Sign Up</h2>
         <form onSubmit={handleSignIn}>
           <div className="mb-4">
             <label htmlFor="email" className={inputLabel}>
               Email
             </label>
             <input
               type="email"
               id="email"
              name="email"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
               className={inputField}
             />
           </div>
           <div className="mb-4">
             <label htmlFor="password" className={inputLabel}>
               Password
             </label>
             <input
               type="password"
               id="password"
              name="password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
               className={inputField}
             />
           </div>
           <button
            type="submit"
             className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 focus:ring focus:ring-indigo-200"
           >
             Sign In
           </button>
        </form>
        <button
          onClick={toggleDarkMode}
          className="w-full p-2 mt-4 rounded text-gray-500 bg-indigo-600 hover:bg-indigo-700 focus:ring focus:ring-indigo-200 dark:bg-gray-600 dark:hover:bg-gray-700"
        >
          Toggle Dark Mode
        </button>
       </div>
     </div>
   );
 };
const inputLabel = `
    block
    text-sm
    font-medium
    text-gray-600
 
`
 const inputField = `
    mt-1
    p-2
    w-full
    border
    rounded
    focus:ring
    focus:ring-indigo-200
 `