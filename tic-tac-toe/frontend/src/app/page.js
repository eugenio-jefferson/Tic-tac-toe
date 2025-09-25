"use client";

import { useAuth } from "@/contexts/AuthContext";
import AuthPage from "@/components/AuthPage/AuthPage";
import Dashboard from "@/components/Dashboard/Dashboard";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Carregando...</div>
      </div>
    );
  }

  return <main>{isAuthenticated ? <Dashboard /> : <AuthPage />}</main>;
}
