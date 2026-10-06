import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import { gsap } from "./gsap";
import { pausesOf } from "./anim";
import { DeckContext } from "./DeckContext";
import type { Transition, TransitionCtx } from "./transition";
import { transitions } from "../transitions";

export type SceneDef = {
  id: string;
  /** Shown in the footer, e.g. "03 · Design System e Reuso". */
  block: string;
  Component: ComponentType;
  /** Autoplay/export: how long to hold each step before advancing (ms). */
  hold?: number;
  /** Flow scene: plays in one go, must not use step(). */
  flow?: boolean;
};

const STAGE_W = 1920;
const STAGE_H = 1080;
const DEFAULT_HOLD = 2800;

declare global {
  interface Window {
    __deckReady?: boolean;
    __deckDone?: boolean;
    __tl?: gsap.core.Timeline;
    __scenes?: { id: string; block: string; flow: boolean }[];
  }
}

function indexFromHash(total: number) {
  const n = parseInt(window.location.hash.slice(1), 10);
  return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), total - 1) : 0;
}

export function Deck({ scenes }: { scenes: SceneDef[] }) {
  const autoplay = useMemo(() => new URLSearchParams(window.location.search).has("autoplay"), []);
  window.__scenes = scenes.map((s) => ({ id: s.id, block: s.block, flow: !!s.flow }));
  const [index, setIndex] = useState(() => (autoplay ? 0 : indexFromHash(scenes.length)));
  const [enterAtEnd, setEnterAtEnd] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [scale, setScale] = useState(1);

  const indexRef = useRef(index);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const busy = useRef(false);
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  // custom transition: the running half, and what out() left for in()
  const transTl = useRef<gsap.core.Timeline | null>(null);
  const pendingIn = useRef<{ t: Transition<unknown>; state: unknown } | null>(null);
  const arrivedVia = useRef(false);

  indexRef.current = index;

  const box = useCallback((el: Element) => {
    const s = wrap.current!.parentElement!.getBoundingClientRect();
    const k = s.width / STAGE_W;
    const r = el.getBoundingClientRect();
    const x = (r.left - s.left) / k;
    const y = (r.top - s.top) / k;
    const w = r.width / k;
    const h = r.height / k;
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  }, []);

  const ctxFor = useCallback(
    (scene: HTMLElement): TransitionCtx => ({ scene, layer: layer.current!, box }),
    [box],
  );

  // --- layout: fit 1920x1080 into the window -------------------------------
  useLayoutEffect(() => {
    const fit = () =>
      setScale(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  // --- navigation ----------------------------------------------------------
  const goTo = useCallback(
    (i: number, atEnd = false) => {
      if (i < 0 || i >= scenes.length || busy.current) return;
      busy.current = true;

      // Custom transition for this pair (forward only)
      const t = i === indexRef.current + 1 ? transitions[`${scenes[indexRef.current].id}>${scenes[i].id}`] : undefined;
      const from = wrap.current?.querySelector<HTMLElement>(".scene");
      if (t && from) {
        const tl = gsap.timeline({ paused: true });
        const state = t.out(ctxFor(from), tl);
        tl.eventCallback("onComplete", () => {
          transTl.current = null;
          pendingIn.current = { t, state };
          tlRef.current = null;
          setEnterAtEnd(false);
          setIndex(i);
        });
        transTl.current = tl;
        tl.play();
        return;
      }

      // Exit with anticipation: a small dip in the travel direction's
      // opposite, then the scene leaves accelerating (slow in).
      const dir = i > indexRef.current ? 1 : -1;
      gsap
        .timeline({
          onComplete: () => {
            tlRef.current = null;
            setEnterAtEnd(atEnd);
            setIndex(i);
          },
        })
        .to(wrap.current, { y: 14 * dir, scale: 0.99, duration: 0.18, ease: "power1.out" })
        .to(wrap.current, { y: -90 * dir, autoAlpha: 0, duration: 0.42, ease: "power3.in" });
    },
    [scenes, ctxFor],
  );

  const next = useCallback(() => {
    // during a custom transition, a press skips to its end
    if (transTl.current) {
      transTl.current.progress(1);
      return;
    }
    const tl = tlRef.current;
    if (tl && tl.progress() < 1) {
      if (tl.paused()) {
        tl.play();
        return;
      }
      // Still animating: jump to the next stop instead of skipping the step.
      const t = tl.time();
      const stop = pausesOf(tl).find((p) => p > t + 0.001);
      if (stop === undefined) tl.progress(1);
      // Almost there: treat the press as "next step" rather than swallowing it.
      else if (stop - t < 0.3) tl.seek(stop + 0.001).play();
      else tl.seek(stop + 0.001).pause();
      return;
    }
    goTo(indexRef.current + 1);
  }, [goTo]);

  const prev = useCallback(() => goTo(indexRef.current - 1, true), [goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea, select")) return;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
        case "Enter":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
        case "Backspace":
          e.preventDefault();
          prev();
          break;
        case "Home":
          goTo(0);
          break;
        case "End":
          goTo(scenes.length - 1);
          break;
        case "f":
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, scenes.length]);

  // --- scene enter ---------------------------------------------------------
  useLayoutEffect(() => {
    if (!fontsReady) return;
    // after a custom transition the stage never went dark: no fade
    if (arrivedVia.current) gsap.set(wrap.current, { autoAlpha: 1, y: 0, scale: 1 });
    else gsap.fromTo(wrap.current, { autoAlpha: 0, y: 0, scale: 1 }, { autoAlpha: 1, duration: 0.25, ease: "none" });
    arrivedVia.current = false;
    gsap.to(progress.current, {
      scaleX: (index + 1) / scenes.length,
      duration: 1.2,
      ease: "expo.out",
    });
    busy.current = transTl.current !== null;
    if (!autoplay) history.replaceState(null, "", `#${index + 1}`);
    window.__deckReady = true;
  }, [index, fontsReady, scenes.length, autoplay]);

  // --- autoplay (used by the MP4 export) -----------------------------------
  useEffect(() => {
    if (!autoplay || !fontsReady) return;
    let waitingSince: number | null = null;
    const id = window.setInterval(() => {
      const tl = tlRef.current;
      if (!tl || busy.current) return;
      const idle = tl.paused() || tl.progress() === 1;
      if (!idle) {
        waitingSince = null;
        return;
      }
      const now = performance.now();
      waitingSince ??= now;
      const hold = scenes[indexRef.current].hold ?? DEFAULT_HOLD;
      if (now - waitingSince < hold) return;
      waitingSince = null;
      if (indexRef.current === scenes.length - 1 && tl.progress() === 1) {
        window.__deckDone = true;
        window.clearInterval(id);
        return;
      }
      next();
    }, 50);
    return () => window.clearInterval(id);
  }, [autoplay, fontsReady, next, scenes]);

  const ctx = useMemo(
    () => ({
      register: (tl: gsap.core.Timeline, root: HTMLElement) => {
        tlRef.current = tl;
        window.__tl = tl; // inspected by scripts/snap.mjs and check-layout.mjs
        const def = scenes[indexRef.current];
        if (import.meta.env.DEV && def.flow && pausesOf(tl).length > 0) {
          console.warn(`[deck] cena "${def.id}" é de fluxo (flow: true) mas usa step().`);
        }

        const pending = pendingIn.current;
        pendingIn.current = null;
        if (enterAtEnd) {
          layer.current?.replaceChildren();
          tl.progress(1).pause();
        } else if (pending) {
          // Runs inside the scene's gsap.context: reverted with the scene.
          arrivedVia.current = true;
          const t = gsap.timeline({
            onComplete: () => {
              transTl.current = null;
              busy.current = false;
              layer.current?.replaceChildren();
              if (tl.paused() && tl.progress() === 0) tl.play(0);
            },
          });
          pending.t.in({ ...ctxFor(root), tl }, t, pending.state);
          transTl.current = t;
        } else {
          layer.current?.replaceChildren();
          tl.play(0);
        }
      },
      enterAtEnd,
      autoplay,
    }),
    [enterAtEnd, autoplay, scenes, ctxFor],
  );

  const scene = scenes[index];
  const Scene = scene.Component;

  return (
    <div
      className="viewport"
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        if ((e.target as HTMLElement).closest("[data-interactive]")) return;
        next();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        prev();
      }}
    >
      <div
        className="stage"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <div ref={wrap} style={{ position: "absolute", inset: 0, visibility: "hidden" }}>
          {fontsReady && (
            <DeckContext.Provider value={ctx}>
              <Scene key={scene.id} />
            </DeckContext.Provider>
          )}
        </div>
        <div ref={layer} className="transition-layer" />
        {!fontsReady && <div className="loading">carregando…</div>}
        <div className="grain" />
        <div className="hud-title">{scene.block}</div>
        <div className="hud-counter">
          <b>{String(index + 1).padStart(2, "0")}</b> / {String(scenes.length).padStart(2, "0")}
        </div>
        <div ref={progress} className="hud-progress" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
