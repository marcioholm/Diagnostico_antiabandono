"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AdminDashboard from "./AdminDashboard";
import PublicLinkCard from "./PublicLinkCard";

export default function AdminPage() {
  const [session, setSession] = useState(undefined); // undefined = carregando
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError("E-mail ou senha inválidos.");
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (session === undefined) {
    return (
      <div className="app admin-wrap">
        <p className="lede">Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="app admin-wrap">
        <div className="label">
          <span className="dot" />
          Área restrita
        </div>
        <h1>Painel M&K</h1>
        <p className="lede">Acesso exclusivo da equipe M&K.</p>
        <form className="login-card" onSubmit={handleLogin}>
          <div className="field-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="field-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {loginError && <p className="save-note error">{loginError}</p>}
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="app admin-wrap">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="label">
            <span className="dot" />
            Painel M&K
          </div>
          <h1 style={{ fontSize: "clamp(24px,4vw,32px)" }}>Diagnósticos recebidos</h1>
        </div>
        <button className="btn ghost small" onClick={handleLogout}>
          Sair
        </button>
      </div>
      <PublicLinkCard />
      <AdminDashboard />
    </div>
  );
}
