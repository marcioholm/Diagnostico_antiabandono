"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { QUESTIONS, overallPhase } from "../lib/questions";
import ResultBlock from "../components/ResultBlock";

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

function rowToDims(row) {
  return [
    { key: "autocontrole", label: "Autocontrole", color: "#ff5757", score: row.autocontrole },
    { key: "autoeficacia", label: "Autoeficácia", color: "#ff25aa", score: row.autoeficacia },
    { key: "constancia", label: "Estágio de mudança", color: "#8c52ff", score: row.estagio_mudanca },
    { key: "conscienciosidade", label: "Conscienciosidade", color: "#fbfaf9", score: row.conscienciosidade },
  ];
}

function priorityLabel(row) {
  const dims = rowToDims(row);
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
            {open ? "Fechar" : "Ver diagnóstico"}
          </button>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={7}>
            <div className="row-detail" style={{ color: "var(--white)" }}>
              <SubmissionDetail row={row} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function SubmissionDetail({ row }) {
  const dims = rowToDims(row);
  const weakest = dims.reduce((min, d) => (d.score < min.score ? d : min), dims[0]);
  const phase = overallPhase(row.indice_geral);
  const respostas = row.respostas || [];

  const qualItems = [11, 10, 12, 13, 14].map((i) => {
    const q = QUESTIONS[i];
    const a = respostas[i];
    const answer =
      a && typeof a === "object"
        ? a.label
        : a || a === 0
        ? String(a).trim() || null
        : null;
    return { question: q.text, answer };
  });

  return (
    <ResultBlock
      nome={row.nome}
      dims={dims}
      overall={row.indice_geral}
      weakest={weakest}
      phase={phase}
      qualItems={qualItems}
    />
  );
}
