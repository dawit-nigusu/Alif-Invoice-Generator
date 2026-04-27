import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import alifLogo from "./assets/alif logo.jpg";

const setFavicon = (href: string) => {
  let favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }
  favicon.href = href;
};

setFavicon(alifLogo);

createRoot(document.getElementById("root")!).render(<App />);
