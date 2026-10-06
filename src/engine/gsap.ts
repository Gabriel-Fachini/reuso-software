import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(useGSAP, SplitText, DrawSVGPlugin, MotionPathPlugin, ScrambleTextPlugin);

gsap.defaults({ ease: "power3.out", duration: 0.9 });

export { gsap, useGSAP, SplitText };
