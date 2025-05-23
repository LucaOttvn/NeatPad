import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { ScreenSizeProvider } from "@/contexts/screenSizeContext";
import { UserProvider } from "@/contexts/userContext";
import { FolderProvider } from "@/contexts/foldersContext";
import { NotesProvider } from "@/contexts/notesContext";
import { ModalsProvider } from "@/contexts/modalsContext";
import { SideMenusProvider } from "@/contexts/sideMenusContext";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SideMenusProvider>
          <ModalsProvider>
            <NotesProvider>
              <FolderProvider>
                <ScreenSizeProvider>
                  <UserProvider>{children}</UserProvider>
                </ScreenSizeProvider>
              </FolderProvider>
            </NotesProvider>
          </ModalsProvider>
        </SideMenusProvider>
      </body>
    </html>
  );
}
