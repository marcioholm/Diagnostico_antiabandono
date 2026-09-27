import { QUESTIONS, BLOCKS, bandFor, DIMENSION_BANDS } from "../lib/questions";

export function Radar({ dims }) {
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

// nome: string | null
// dims: [{key,label,color,score}]
// overall: number
// weakest: dims item
// phase: {tag, label, emphasis, desc}
// qualItems: [{question, answer}]
export default function ResultBlock({ nome, dims, overall, weakest, phase, answers }) {
  const qualIdx = [11, 10, 12, 13, 14]; // Bloco 3: estágio de mudança + respostas abertas
  const qualItems = qualIdx.map((i) => {
    const q = QUESTIONS[i];
    const a = answers[i];
    const answer =
      a && typeof a === "object"
        ? a.label
        : a || a === 0
        ? String(a).trim() || null
        : null;
    return { question: q.text, answer };
  });

  const scoredBlocks = ["autocontrole", "autoeficacia", "conscienciosidade"];
  const answerRows = scoredBlocks.map((blockKey) => {
    const items = QUESTIONS.map((q, i) => ({ q, i }))
      .filter(({ q }) => q.block === blockKey && (q.type === "likert5" || q.type === "scale10"))
      .map(({ q, i }) => {
        const a = answers[i];
        const max = q.type === "likert5" ? 5 : 10;
        const value = typeof a === "number" ? `${a}/${max}` : "—";
        return { text: q.text, value };
      });
    return { blockKey, label: BLOCKS[blockKey].label, color: BLOCKS[blockKey].color, items };
  });

  return (
    <>
      <div className="result-head">
        <div className="label" style={{ justifyContent: "center" }}>
          <span className="dot" />
          {nome ? `Diagnóstico de ${nome}` : "Diagnóstico"}
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

      <div className="answers-section">
        <div className="label">
          <span className="dot" />
          O que você respondeu em cada pergunta
        </div>
        {answerRows.map((block) => (
          <div className="answers-block" key={block.blockKey}>
            <div className="answers-block-title">
              <span className="dot" style={{ background: block.color }} />
              {block.label}
            </div>
            {block.items.map((item, i) => (
              <div className="answer-row" key={i}>
                <span className="qtext">{item.text}</span>
                <span className="answer-value">{item.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="qual-section">
        <div className="label">
          <span className="dot" />
          Resumo qualitativo
        </div>
        {qualItems.map((qi, i) => (
          <div className="qual-item" key={i}>
            <div className="qual-q">{qi.question}</div>
            <div className={`qual-a${qi.answer ? "" : " empty"}`}>
              {qi.answer || "(não respondida)"}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
