"use client"

import type { NextPage } from "next";
import { trpc } from "@/utils/trpc";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Todos from "@/components/Todos";
import { CreateTodo } from "@/components/create-post";

const Home: NextPage = () => {

  return (
    <>
      <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> Turbo
          </h1>
          <AuthShowcase />
          <CrudShowcase />
        </div>
      </main>
    </>
  );
};

export default Home;




const AuthShowcase: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined,
    { enabled: !!isSignedIn },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isSignedIn && (
        <>
          <p className="text-center text-2xl text-white">
            {secretMessage && (
              <span>
                {" "}
                {secretMessage} click the user button!
                <br />
              </span>
            )}
          </p>
          <div className="flex items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "3rem",
                    height: "3rem",
                  },
                },
              }}
            />
          </div>
        </>
      )}
      {!isSignedIn && (
        <p className="text-center text-2xl text-white">
          <Link href="/sign-in">Sign In</Link>
        </p>
      )}
    </div>
  );
};


function CrudShowcase() {

  return (
    <div className="w-full max-w-xs">
      <Todos />
      <br />
      <hr />
      <br />
      <CreateTodo />
    </div>
  );
}
