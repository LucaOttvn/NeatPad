import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { UserProvider } from "@/contexts/userContext";
import { FolderProvider } from "@/contexts/foldersContext";
import { NotesProvider } from "@/contexts/notesContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeatPad",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/images/logo.png" /></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotesProvider>
          <FolderProvider>
            <UserProvider>{children}</UserProvider>
          </FolderProvider>
        </NotesProvider>
      </body>
    </html>
  );
}
