import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import { useDeck } from "./DeckContext";

type Build = (tl: gsap.core.Timeline, root: HTMLDivElement) => void;

/**
 * Builds the scene's intro timeline (with `step()` pauses) and hands it to
 * the deck, which starts it (after an incoming transition, if there is one).
 * Anything created inside `build` — loops, SplitTexts — lives in the same
 * gsap.context and is reverted when the scene unmounts.
 */
export function useScene(build: Build) {
  const root = useRef<HTMLDivElement>(null);
  const { register } = useDeck();

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true });
      build(tl, root.current!);
      register(tl, root.current!);
    },
    { scope: root },
  );

  return root;
}
