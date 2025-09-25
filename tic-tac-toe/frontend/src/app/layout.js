import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { GameProvider } from "@/contexts/GameContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tic-Tac-Toe Multiplayer",
  description:
    "A distributed multiplayer tic-tac-toe game built with NestJS and Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <GameProvider>{children}</GameProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
