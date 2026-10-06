import type { CSSProperties } from "react";

// ds-allow-file: o caos é proposital — cores e estilos fora do padrão.
/**
 * The "same company, same button" mess. Every piece uses the deck palette,
 * just applied with no rules — on purpose.
 */
type Piece = { x: number; y: number; r: number; kind: "btn" | "input"; text: string; s: CSSProperties };

const base: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "var(--font-sans)",
  whiteSpace: "nowrap",
};

export const chaosPieces: Piece[] = [
  { x: 0, y: 20, r: -3, kind: "btn", text: "Comprar", s: { background: "#ff8709", color: "#fff", borderRadius: 100, height: 64, padding: "0 34px", fontSize: 26, fontWeight: 600 } },
  { x: 300, y: 0, r: 2, kind: "btn", text: "CONTINUAR", s: { background: "#ff6a00", color: "#0e100f", borderRadius: 4, height: 54, padding: "0 22px", fontSize: 20, fontWeight: 800, letterSpacing: "0.12em" } },
  { x: 610, y: 40, r: -1, kind: "btn", text: "Pedir agora", s: { border: "3px solid #ffa53d", color: "#ffa53d", borderRadius: 14, height: 76, padding: "0 30px", fontSize: 30, fontWeight: 500 } },
  { x: 950, y: 6, r: 4, kind: "btn", text: "Finalizar", s: { background: "#e65c00", color: "#fffce1", borderRadius: 0, height: 60, padding: "0 40px", fontSize: 26, fontWeight: 700, fontStyle: "italic" } },
  { x: 1250, y: 36, r: -4, kind: "btn", text: "Continuar", s: { background: "#0ae448", color: "#0e100f", borderRadius: 100, height: 58, padding: "0 28px", fontSize: 24, fontWeight: 600 } },

  { x: 40, y: 190, r: 3, kind: "btn", text: "Finalizar →", s: { color: "#ff8709", textDecoration: "underline", fontSize: 30, fontWeight: 500, height: 50 } },
  { x: 330, y: 170, r: -2, kind: "btn", text: "Confirmar", s: { border: "2px dashed #fffce1", color: "#fffce1", borderRadius: 8, height: 62, padding: "0 26px", fontSize: 24, fontWeight: 400 } },
  { x: 640, y: 200, r: 5, kind: "btn", text: "comprar", s: { background: "#f100cb", color: "#fff", borderRadius: 100, height: 44, padding: "0 18px", fontSize: 18, fontWeight: 600 } },
  { x: 900, y: 160, r: -3, kind: "btn", text: "Pedir", s: { background: "#fffce1", color: "#ff8709", borderRadius: 6, height: 86, padding: "0 46px", fontSize: 38, fontWeight: 700 } },
  { x: 1240, y: 190, r: 2, kind: "btn", text: "OK!", s: { background: "#ff7a1a", color: "#fff", borderRadius: 24, height: 66, padding: "0 30px", fontSize: 28, fontWeight: 800 } },

  { x: 20, y: 340, r: -2, kind: "input", text: "Seu e-mail", s: { border: "1px solid #374151", background: "#121412", color: "#7d7f75", borderRadius: 8, height: 60, width: 330, padding: "0 20px", fontSize: 22, justifyContent: "flex-start" } },
  { x: 420, y: 350, r: 3, kind: "input", text: "E-MAIL", s: { borderBottom: "3px solid #ff8709", color: "#ff8709", height: 56, width: 280, fontSize: 20, letterSpacing: "0.1em", justifyContent: "flex-start" } },
  { x: 770, y: 330, r: -4, kind: "input", text: "Digite seu e-mail...", s: { background: "#fffce1", color: "#7d7f75", borderRadius: 100, height: 64, width: 360, padding: "0 26px", fontSize: 22, justifyContent: "flex-start" } },
  { x: 1190, y: 345, r: 2, kind: "input", text: "email@", s: { border: "2px solid #0ae448", color: "#0ae448", borderRadius: 0, height: 52, width: 300, padding: "0 14px", fontSize: 22, fontFamily: "var(--font-mono)", justifyContent: "flex-start" } },
];

export function Chaos({ style, className = "" }: { style?: CSSProperties; className?: string }) {
  return (
    <div className={`chaos ${className}`} style={{ position: "relative", width: 1560, height: 440, ...style }}>
      {chaosPieces.map((p, i) => (
        <div key={i} className="chaos-piece abs" style={{ left: p.x, top: p.y, rotate: `${p.r}deg` }}>
          <div className="chaos-inner" style={{ ...base, ...p.s }}>
            {p.text}
          </div>
        </div>
      ))}
    </div>
  );
}
