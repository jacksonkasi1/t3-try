"use client";

import "@/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "@/utils/trpc";

interface TRPCReactProviderProps {
    children: React.ReactNode;
}

const TRPCReactProvider: React.FC<TRPCReactProviderProps> = ({ children }) => {
    return (
        // Wrap your entire app with QueryClientProvider and provide the QueryClient
        <ClerkProvider>{children}</ClerkProvider>
    );
};

export default trpc.withTRPC(TRPCReactProvider);
