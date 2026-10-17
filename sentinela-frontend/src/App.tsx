import { Navigate, Route, Routes } from "react-router-dom";

import RotaProtegida from "./auth/RotaProtegida";

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
import ServicosPage from "./pages/ServicosPage";

export default function App() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/" element={<LoginPage />} />

      {/* Telas internas: exigem sessão */}
      <Route element={<RotaProtegida />}>
        <Route path="/inicio" element={<DashboardPage />} />
        <Route path="/orgaos" element={<OrgaosPage />} />
        <Route path="/orgaos/cadastrar" element={<CadastrarOrgaoPage />} />
        <Route path="/servicos" element={<ServicosPage />} />
        <Route path="/servicos/cadastrar" element={<CadastrarServicoPage />} />
        <Route path="/avaliacoes" element={<AvaliacoesPage />} />
        <Route
          path="/avaliacoes/checklist"
          element={<ChecklistAvaliacaoPage />}
        />
        <Route path="/resultados" element={<ResultadosPage />} />
        <Route path="/relatorios" element={<RelatorioPage />} />
        <Route path="/usuarios" element={<GestaoUsuariosPage />} />
        <Route path="/configuracoes" element={<VersoesChecklistPage />} />

        {/* URL desconhecida: com sessão vai ao início, sem sessão o
            RotaProtegida manda para o login. */}
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Route>
    </Routes>
  );
}
