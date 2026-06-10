import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Languages from "./pages/Languages";
import Categories from "./pages/Categories";
import Templates from "./pages/Templates";
import CreateTemplate from "./pages/CreateTemplate";
import EditTemplate from "./pages/EditTemplate";
import TemplateDetail from "./pages/TemplateDetail";
import ThemeToggle from "./components/ThemeToggle";
import "./styles/theme.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Languages />} />
        <Route path="/create" element={<CreateTemplate />} />
        <Route path="/templates/:id/edit" element={<EditTemplate />} />
        <Route path="/templates/:id" element={<TemplateDetail />} />
        <Route path="/:lenguaje" element={<Categories />} />
        <Route path="/:lenguaje/:categoria" element={<Categories />} />
        <Route
          path="/:lenguaje/:categoria/:subcategoria"
          element={<Templates />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
