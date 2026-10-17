import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  CheckCheck,
  ChevronDown,
  FileText,
  HelpCircle,
  Home,
  LayoutList,
  LogOut,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import Logo from "./Logo";

interface SubItem {
  label: string;
  to: string;
}

interface MenuItem {
  label: string;
  to?: string;
  icon: LucideIcon;
  children?: SubItem[];
}

const menu: MenuItem[] = [
  { label: "Início", to: "/inicio", icon: Home },
  {
    label: "Órgãos",
    icon: Building2,
    children: [
      { label: "Listar órgãos", to: "/orgaos" },
      { label: "Cadastrar órgão", to: "/orgaos/cadastrar" },
    ],
  },
  {
    label: "Serviços",
    icon: LayoutList,
    children: [
      { label: "Listar serviços", to: "/servicos" },
      { label: "Cadastrar serviço", to: "/servicos/cadastrar" },
    ],
  },
  { label: "Avaliações", to: "/avaliacoes", icon: CheckCheck },
  { label: "Relatórios", to: "/relatorios", icon: FileText },
  { label: "Usuários", to: "/usuarios", icon: Users },
  { label: "Configurações do Checklist", to: "/configuracoes", icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [abertos, setAbertos] = useState<string[]>(["Órgãos", "Serviços"]);

  function toggleSubmenu(label: string) {
    setAbertos((atual) =>
      atual.includes(label)
        ? atual.filter((l) => l !== label)
        : [...atual, label],
    );
  }

  return (
    <aside className="flex w-55 shrink-0 flex-col bg-navy px-3 py-5 text-white">
      <div className="flex items-center gap-2 px-2.5">
        <Logo className="h-4 w-4" />
        <span className="text-sm font-bold">Sentinela Pública</span>
      </div>

      <nav className="mt-8 flex flex-col gap-1.5">
        {menu.map((item) => {
          const Icon = item.icon;

          // Item simples (sem filhos)
          if (!item.children) {
            return (
              <NavLink
                key={item.label}
                to={item.to!}
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={14} />
                {item.label}
              </NavLink>
            );
          }

          // Item com submenu
          const aberto = abertos.includes(item.label);

          return (
            <div key={item.label} className="flex flex-col">
              <button
                type="button"
                onClick={() => toggleSubmenu(item.label)}
                className="flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <Icon size={14} />
                  {item.label}
                </span>
                <ChevronDown
                  size={12}
                  className={`transition-transform ${aberto ? "rotate-180" : ""}`}
                />
              </button>

              {aberto && (
                <div className="mt-1 ml-6 flex flex-col gap-0.5">
                  {item.children.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      end
                      className={({ isActive }: { isActive: boolean }) =>
                        `rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                          isActive
                            ? "bg-blue-600/80 text-white"
                            : "text-slate-400 hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3 px-2.5 text-xs text-slate-300">
        <button className="flex items-center gap-2 text-left hover:text-white">
          <HelpCircle size={14} />
          Ajuda
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-left hover:text-white"
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </aside>
  );
}