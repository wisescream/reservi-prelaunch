
  import { createRoot } from "react-dom/client";
  import { inject } from '@vercel/analytics';
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Inject Vercel Analytics into the global scope
  inject();

  createRoot(document.getElementById("root")!).render(<App />);
  