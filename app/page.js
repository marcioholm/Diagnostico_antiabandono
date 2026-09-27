"use client";

import { useState, useRef, useEffect } from "react";
import {
  QUESTIONS,
  BLOCKS,
  LIKERT5_CAPS,
  SCALE10_CAPS,
  DIMENSION_BANDS,
  bandFor,
  computeScores,
} from "./lib/questions";
import { supabase } from "./lib/supabaseClient";

const TOTAL = QUESTIONS.length;

export default function Home() {
  const [step, setStep] = useState("intro"); // intro | quiz | results
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(TOTAL).fill(null));
  const [textDraft, setTextDraft] = useState("");
  const [result, setResult] = useState(null);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error

  const q = QUESTIONS[current];
  const block = q ? BLOCKS[q.block] : null;

  useEffect(() => {
    if (q && (q.type === "textarea" || q.type === "shorttext")) {
      setTextDraft(answers[current] || "");
    }
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  function startQuiz() {
    setCurrent(0);
    setAnswers(Array(TOTAL).fill(null));
    setStep("quiz");
  }

  function advance(nextAnswers) {
    if (current < TOTAL - 1) {
      setCurrent(current + 1);
    } else {
      finish(nextAnswers);
    }
  }

  function selectAndAdvance(value) {
    const next = [...answers];
    next[current] = value;
    setAnswers(next);
    advance(next);
  }

  function submitText(skip) {
    const next = [...answers];
    next[current] = skip ? answers[current] || "" : textDraft.trim();
    setAnswers(next);
    advance(next);
  }

  function goBack() {
    if (current > 0) setCurrent(current - 1);
  }

  async function finish(finalAnswers) {
    const scored = computeScores(finalAnswers);
    setResult(scored);
    setStep("results");
    saveSubmission(finalAnswers, scored);
  }

  async function saveSubmission(finalAnswers, scored) {
    setSaveState("saving");
    try {
      const { error } = await supabase.from("diagnosticos").insert([
        {
          nome: nome || "Não informado",
          whatsapp: whatsapp || null,
          autocontrole: scored.dims[0].score,
          autoeficacia: scored.dims[1].score,
          estagio_mudanca: scored.dims[2].score,
          conscienciosidade: scored.dims[3].score,
          indice_geral: scored.overall,
          fase: `${scored.phase.label} ${scored.phase.emphasis}`.trim(),
          respostas: finalAnswers,
        },
      ]);
      if (error) throw error;
      setSaveState("saved");
    } catch (e) {
      console.error(e);
      setSaveState("error");
    }
  }

  function restart() {
    setStep("intro");
    setNome("");
    setWhatsapp("");
    setResult(null);
    setSaveState("idle");
  }

  return (
    <div className="app">
      {step === "intro" && (
        <IntroScreen
          nome={nome}
          setNome={setNome}
          whatsapp={whatsapp}
          setWhatsapp={setWhatsapp}
          onStart={startQuiz}
        />
      )}

      {step === "quiz" && q && (
        <section className="screen active">
          <div className="progress-wrap">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(current / TOTAL) * 100}%` }}
              />
            </div>
            <div className="progress-meta">
              <span>Pergunta {current + 1} de {TOTAL}</span>
              <span>{block.label}</span>
            </div>
          </div>

          <div className="q-pillar-tag" style={{ color: block.color }}>
            <span className="dot" style={{ background: block.color }} />
            Bloco · {block.label}
          </div>
          <div className="q-text">{q.text}</div>

          {q.type === "likert5" && (
            <>
              <div className="scale-row">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    className="scale-btn"
                    style={
                      answers[current] === v
                        ? { borderColor: block.color, background: "var(--surface-2)" }
                        : undefined
                    }
                    onClick={() => selectAndAdvance(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="scale-caps">
                <span>{LIKERT5_CAPS[0]}</span>
                <span>{LIKERT5_CAPS[1]}</span>
              </div>
            </>
          )}

          {q.type === "scale10" && (
            <>
              <div className="scale-row">
                {Array.from({ length: 11 }, (_, v) => v).map((v) => (
                  <button
                    key={v}
                    className="scale-btn"
                    style={
                      answers[current] === v
                        ? { borderColor: block.color, background: "var(--surface-2)" }
                        : undefined
                    }
                    onClick={() => selectAndAdvance(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="scale-caps">
                <span>{SCALE10_CAPS[0]}</span>
                <span>{SCALE10_CAPS[1]}</span>
              </div>
            </>
          )}

          {q.type === "mcq" && (
            <div className="options">
              {q.options.map((opt) => (
                <button
                  key={opt.v}
                  className="opt"
                  style={
                    answers[current] && answers[current].v === opt.v
                      ? { borderColor: block.color, background: "var(--surface-2)" }
                      : undefined
                  }
                  onClick={() => selectAndAdvance(opt)}
                >
                  <span className="dot-badge">{opt.v}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          {(q.type === "textarea" || q.type === "shorttext") && (
            <div className="field-wrap">
              {q.type === "textarea" ? (
                <textarea
                  placeholder={q.placeholder}
                  value={textDraft}
                  onChange={(e) => setTextDraft(e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  placeholder={q.placeholder}
                  value={textDraft}
                  onChange={(e) => setTextDraft(e.target.value)}
                />
              )}
              <div className="field-actions">
                <button className="btn small" onClick={() => submitText(false)}>
                  {current === TOTAL - 1 ? "Ver resultado" : "Continuar"}
                </button>
                <button className="skip-link" onClick={() => submitText(true)}>
                  Pular
                </button>
              </div>
            </div>
          )}

          {current > 0 && (
            <button className="nav-back" onClick={goBack}>
              ← Voltar
            </button>
          )}
        </section>
      )}

      {step === "results" && result && (
        <ResultsScreen
          nome={nome}
          answers={answers}
          result={result}
          saveState={saveState}
          onRestart={restart}
        />
      )}
    </div>
  );
}

function IntroScreen({ nome, setNome, whatsapp, setWhatsapp, onStart }) {
  return (
    <section className="screen active">
      <div className="label">
        <span className="dot" />
        Diagnóstico M&K
      </div>
      <h1>
        Antes do plano, seu <span className="accent">ponto de partida real</span>
      </h1>
      <p className="lede">
        20 perguntas rápidas, baseadas em conceitos validados de ciência
        comportamental — autocontrole, autoeficácia, estágio de mudança e
        conscienciosidade. Nada de julgamento: só clareza sobre por onde
        começar.
      </p>

      <div className="pillars-preview">
        {Object.values(BLOCKS).map((b) => (
          <div className="pillar-row" key={b.label}>
            <span className="bump" style={{ background: b.color }} />
            <div>
              <div className="pname">{b.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="field-group">
        <label htmlFor="nome">Seu nome</label>
        <input
          id="nome"
          type="text"
          placeholder="Como podemos te chamar?"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>
      <div className="field-group">
        <label htmlFor="whatsapp">WhatsApp (opcional)</label>
        <input
          id="whatsapp"
          type="text"
          placeholder="(00) 00000-0000"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
      </div>

      <button className="btn" disabled={!nome.trim()} onClick={onStart}>
        Começar diagnóstico
      </button>
      <div className="time-note">20 perguntas · ~5 minutos</div>
    </section>
  );
}

function ResultsScreen({ nome, answers, result, saveState, onRestart }) {
  const printRef = useRef(null);
  const { dims, overall, weakest, phase } = result;
  const qualIdx = [10, 12, 13, 14];

  function handlePrint() {
    window.print();
  }

  return (
    <section className="screen active" ref={printRef}>
      <div className="result-head">
        <div className="label" style={{ justifyContent: "center" }}>
          <span className="dot" />
          Diagnóstico de {nome || "você"}
        </div>
        <div className="phase-tag">{phase.tag} · Índice {overall}</div>
        <div className="phase-title">
          {phase.label} <span className="accent">{phase.emphasis}</span>
        </div>
        <p className="phase-desc">{phase.desc}</p>
      </div>

      <Radar dims={dims} />

      <div className="score-cards">
        {dims.map((d) => {
          const band = bandFor(d.score);
          const isFocus = d.key === weakest.key;
          return (
            <div
              key={d.key}
              className={`score-card${isFocus ? " focus" : ""}`}
              style={{ borderLeftColor: d.color }}
            >
              <div className="score-num" style={{ color: d.color }}>
                {d.score}
              </div>
              <div>
                <div className="score-name">
                  {d.label} {isFocus && <span className="badge">Prioridade</span>}
                </div>
                <div className="score-bar-track">
                  <div
                    className="score-bar-fill"
                    style={{ width: `${d.score}%`, background: d.color }}
                  />
                </div>
                <div className="score-text">{DIMENSION_BANDS[d.key][band]}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="qual-section">
        <div className="label">
          <span className="dot" />
          Resumo qualitativo (para a Maria)
        </div>
        {[11, ...qualIdx.filter((i) => i !== 11)].map((i) => {
          const question = QUESTIONS[i];
          const a = answers[i];
          const text =
            a && typeof a === "object"
              ? a.label
              : a && String(a).trim()
              ? String(a).trim()
              : "(não respondida)";
          return (
            <div className="qual-item" key={i}>
              <div className="qual-q">{question.text}</div>
              <div className={`qual-a${a ? "" : " empty"}`}>{text}</div>
            </div>
          );
        })}
      </div>

      <div className="cta-block no-print">
        <div className="label" style={{ justifyContent: "center" }}>
          <span className="dot" />
          Próximo passo
        </div>
        <p className="lede" style={{ margin: "10px auto 20px", textAlign: "center" }}>
          Este diagnóstico é o ponto de partida. Um coach M&K pode montar,
          junto com você, um plano específico a partir do que mais pesa no seu
          resultado agora.
        </p>
        <div className="cta-row">
          <button className="btn" onClick={handlePrint}>
            Baixar meu diagnóstico (PDF)
          </button>
          <button className="btn ghost" onClick={onRestart}>
            Refazer diagnóstico
          </button>
        </div>
        <div
          className={`save-note${saveState === "error" ? " error" : ""}`}
        >
          {saveState === "saving" && "Salvando seu diagnóstico..."}
          {saveState === "saved" && "Diagnóstico salvo com sucesso."}
          {saveState === "error" &&
            "Não conseguimos salvar seu diagnóstico agora — o download em PDF continua disponível."}
        </div>
      </div>

      <footer>
        <div className="wordmark">M&K Fitness Center</div>
      </footer>
    </section>
  );
}

function Radar({ dims }) {
  const cx = 150, cy = 140, R = 100;
  const n = dims.length;
  const angles = dims.map((_, i) => -90 + (360 / n) * i);
  const pointAt = (angleDeg, radius) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };
  const dataPts = dims.map((d, i) => pointAt(angles[i], (Math.max(d.score, 4) / 100) * R));
  const anchorFor = (a) => {
    const norm = ((a % 360) + 360) % 360;
    if (norm > 10 && norm < 170) return "start";
    if (norm > 190 && norm < 350) return "end";
    return "middle";
  };

  return (
    <div className="radar-wrap">
      <svg width="300" height="290" viewBox="0 0 300 290">
        <defs>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5757" />
            <stop offset="45%" stopColor="#ff25aa" />
            <stop offset="100%" stopColor="#8c52ff" />
          </linearGradient>
        </defs>
        {[0.33, 0.66, 1].map((f) => (
          <polygon
            key={f}
            points={angles.map((a) => { const p = pointAt(a, R * f); return `${p.x},${p.y}`; }).join(" ")}
            fill="none"
            stroke="#2c2a32"
          />
        ))}
        {angles.map((a, i) => {
          const p = pointAt(a, R);
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#2c2a32" />;
        })}
        <polygon
          points={dataPts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="url(#radarFill)"
          fillOpacity="0.28"
          stroke="url(#radarFill)"
          strokeWidth="2.5"
        />
        {dataPts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4.5" fill={dims[i].color} stroke="#0b0b0d" strokeWidth="1.5" />
        ))}
        {dims.map((d, i) => {
          const a = angles[i];
          const p = pointAt(a, R + 26);
          const anchor = anchorFor(a);
          return (
            <text key={d.key} x={p.x} y={p.y - 2} textAnchor={anchor} fill="#fbfaf9" fontSize="10.5" fontWeight="700">
              {d.label.toUpperCase()}
              <tspan x={p.x} dy="16" fill="#9c98a3" fontWeight="600">{d.score}</tspan>
            </text>
          );
        })}
      </svg>
    </div>
  );
}
