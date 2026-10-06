import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { Deck } from "./engine/Deck";
import { scenes } from "./scenes";

createRoot(document.getElementById("root")!).render(<Deck scenes={scenes} />);
