import { createContext, useContext } from "react";

export type DeckContextValue = {
  /**
   * Scene hands its intro timeline to the deck so arrows can drive it. The
   * deck starts it: at the end (arrived going back), after the incoming
   * transition, or right away.
   */
  register: (tl: gsap.core.Timeline, root: HTMLElement) => void;
  /** True when we arrived by going back: scene should render its final state. */
  enterAtEnd: boolean;
  autoplay: boolean;
};

export const DeckContext = createContext<DeckContextValue | null>(null);

export function useDeck() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("useDeck must be used inside <Deck>");
  return ctx;
}
