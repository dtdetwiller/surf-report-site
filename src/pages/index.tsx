import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import React from "react";
import Link from "next/link";

const Home: NextPage = () => {

  const { data: sessionData } = useSession();

  console.log("session", sessionData)

  return (
    <>
      <Head>
        <title>Ones</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center items-center-h-screen gap-10">

        <div className="text-white">
          <h1 className="text-500 text-4xl">🌊 Ones</h1>
        </div>

        <AuthShowcase />

      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {

  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>

      { !sessionData &&
        <button
        className="btn"
        onClick={() => void signIn()}
        >
          Sign out
        </button>
      }

      { sessionData?.user.roles.includes('admin') &&
        <Link href="/admin">
          <button className="btn">
            Admin Page
          </button>
        </Link>
      }

    </div>
  );
};
