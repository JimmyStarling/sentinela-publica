import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CadastrarServicoPage from "./pages/CadastrarServicoPage";
import AvaliacoesPage from "./pages/AvaliacoesPage";
import ChecklistAvaliacaoPage from "./pages/ChecklistAvaliacaoPage";
import ResultadosPage from "./pages/ResultadosPage";
import RelatorioPage from "./pages/RelatorioPage";
import GestaoUsuariosPage from "./pages/GestaoUsuariosPage";
import VersoesChecklistPage from "./pages/VersoesChecklistPage";
import CadastrarOrgaoPage from "./pages/CadastrarOrgaoPage";
import OrgaosPage from "./pages/OrgaosPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/inicio" element={<DashboardPage />} />
      <Route path="/servicos/cadastrar" element={<CadastrarServicoPage />} />
      <Route path="/avaliacoes" element={<AvaliacoesPage />} />
      <Route path="/avaliacoes/checklist" element={<ChecklistAvaliacaoPage />} />
      <Route path="/resultados" element={<ResultadosPage />} />
      <Route path="/relatorios" element={<RelatorioPage />} />
      <Route path="/usuarios" element={<GestaoUsuariosPage />} />
      <Route path="/configuracoes" element={<VersoesChecklistPage />} />
      <Route path="/orgaos" element={<OrgaosPage />} />
      <Route path="/orgaos/cadastrar" element={<CadastrarOrgaoPage />} />

      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  );
}