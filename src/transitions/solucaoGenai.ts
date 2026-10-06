import { gsap } from "../engine/gsap";
import { circle, defineTransition, exitText, fallOut, morphTo, swap, takeOver } from "../engine/transition";

/*
 * 11 → 12  "Times viram agentes"
 *
 * out: the architecture falls away; each microfrontend card collapses into
 *      its pulsing team dot.
 * in:  the dots multiply and fly into the row of AI agents, squaring up into
 *      them on arrival.
 */
export const solucaoGenai = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    exitText(tl, scene, ".title, .title2", 0);
    tl.to($(".c-1, .c-2, .c-3"), { drawSVG: "0% 0%", duration: 0.4, ease: "power2.in" }, 0);
    fallOut(tl, $(".n-figma, .n-react, .n-mobile, .mobile-label, .mfe-label, .metric, .learn"), 0.05, { each: 0.04 });

    const dots = $(".mfe-dot");
    gsap.killTweensOf(dots);
    const stand = dots.map((d, i) => {
      const b = box(d);
      const c = circle(layer, { x: b.cx, y: b.cy }, 16, getComputedStyle(d).backgroundImage);
      const card = d.closest(".mfe");
      if (card) {
        const cb = box(card);
        gsap.set(card, { transformOrigin: `${b.cx - cb.x}px ${b.cy - cb.y}px` });
        tl.to(card, { scale: 0, autoAlpha: 0, duration: 0.4, ease: "back.in(1.8)" }, 0.2 + i * 0.05);
      }
      tl.set(c, { autoAlpha: 1 }, 0.55 + i * 0.05);
      tl.to(c, { width: 44, height: 44, duration: 0.5, ease: "elastic.out(1, 0.45)" }, 0.55 + i * 0.05);
      return c;
    });
    return { dots: stand };
  },

  in(ctx, tl, { dots }) {
    const agents = [...ctx.scene.querySelectorAll(".agent")];
    if (!dots.length) return;
    agents.forEach((agent, i) => {
      let dot = dots[i % dots.length];
      if (i >= dots.length) {
        // mitosis: a copy splits off its parent
        const parent = dot;
        dot = parent.cloneNode(true) as HTMLDivElement;
        parent.after(dot);
        gsap.set(dot, { x: gsap.getProperty(parent, "x"), y: gsap.getProperty(parent, "y"), autoAlpha: 1 });
      }
      const inner = agent.querySelector(".agent-inner");
      const nat = takeOver(ctx, agent);
      gsap.set(agent, { autoAlpha: 0 });
      const at = 0.15 + i * 0.07;
      if (inner) tl.set(dot, { backgroundImage: getComputedStyle(inner).backgroundImage }, at);
      morphTo(tl, dot, nat, at, { duration: 0.75, radius: 20, ease: "back.inOut(1.3)" });
      swap(tl, dot, agent, at + 0.7);
      tl.fromTo(agent, { scaleX: 1.2, scaleY: 0.8 }, { scaleX: 1, scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.45)", immediateRender: false }, at + 0.7);
    });
    dots.slice(agents.length).forEach((d) => tl.to(d, { scale: 0, duration: 0.3 }, 0));
    tl.call(() => void ctx.tl.play(0), [], 0);
  },
});
