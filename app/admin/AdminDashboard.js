"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { QUESTIONS } from "../lib/questions";

export default function AdminDashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("diagnosticos")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setRows(data || []);
    setLoading(false);
  }

  if (loading) return <p className="lede">Carregando diagnósticos...</p>;
  if (error) return <p className="save-note error">Erro ao carregar: {error}</p>;
  if (rows.length === 0) return <p className="lede">Nenhum diagnóstico preenchido ainda.</p>;

  return (
    <div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Nome</th>
            <th>WhatsApp</th>
            <th>Índice</th>
            <th>Fase</th>
            <th>Prioridade</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <RowWithDetail
              key={r.id}
              row={r}
              open={openId === r.id}
              onToggle={() => setOpenId(openId === r.id ? null : r.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function priorityLabel(row) {
  const dims = [
    { label: "Autocontrole", score: row.autocontrole },
    { label: "Autoeficácia", score: row.autoeficacia },
    { label: "Estágio de mudança", score: row.estagio_mudanca },
    { label: "Conscienciosidade", score: row.conscienciosidade },
  ];
  return dims.reduce((min, d) => (d.score < min.score ? d : min), dims[0]).label;
}

function RowWithDetail({ row, open, onToggle }) {
  const date = new Date(row.created_at).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
  return (
    <>
      <tr>
        <td>{date}</td>
        <td>{row.nome}</td>
        <td>{row.whatsapp || "—"}</td>
        <td>
          <span className="pill">{row.indice_geral}</span>
        </td>
        <td>{row.fase}</td>
        <td>{priorityLabel(row)}</td>
        <td>
          <button className="link-btn" onClick={onToggle}>
            {open ? "Fechar" : "Ver respostas"}
          </button>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={7}>
            <div className="row-detail">
              {QUESTIONS.map((q, i) => {
                const a = row.respostas ? row.respostas[i] : null;
                const text =
                  a && typeof a === "object"
                    ? a.label
                    : a || a === 0
                    ? String(a)
                    : "(não respondida)";
                return (
                  <div key={q.id} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "var(--white)" }}>{q.text}</strong>
                    <br />
                    {text}
                  </div>
                );
              })}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
