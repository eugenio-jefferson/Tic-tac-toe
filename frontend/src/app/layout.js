import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { GameProvider } from "@/contexts/GameContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Tic-Tac-Toe"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>
        <AuthProvider>
          <GameProvider>{children}</GameProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
