import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Languages from "./pages/Languages";
import Categories from "./pages/Categories";
import Templates from "./pages/Templates";
import CreateTemplate from "./pages/CreateTemplate";
import TemplateDetail from "./pages/TemplateDetail";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Languages />} />
        <Route path="/create" element={<CreateTemplate />} />
        <Route path="/templates/:id" element={<TemplateDetail />} />
        <Route path="/:lenguaje" element={<Categories />} />
        <Route path="/:lenguaje/:categoria" element={<Templates />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
