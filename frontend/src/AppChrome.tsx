import { BookOpen, CalendarDays, LayoutDashboard, Users } from "lucide-react";
import type { ReactNode } from "react";

export default function AppChrome({ teacherName, source, active, children }: { teacherName: string; source: "live" | "preview"; active: "dashboard" | "lessons"; children: ReactNode }) {
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="/" aria-label="Freinet, ir para visão geral"><img className="brand-mark" src="/freinet-mark.svg" alt="" /><span>frei<span>net</span></span></a>
      <nav aria-label="Navegação principal">
        <a className={`nav-link${active === "dashboard" ? " active" : ""}`} href="/" title="Visão geral"><LayoutDashboard size={18} /><span className="nav-long">Visão geral</span><span className="nav-short">Geral</span></a>
        <a className="nav-link" href="/#ranking" title="Alunos"><Users size={18} /><span>Alunos</span></a>
        <a className={`nav-link${active === "lessons" ? " active" : ""}`} href="/aulas" title="Gerenciamento de aulas"><CalendarDays size={18} /><span className="nav-long">Gerenciamento de aulas</span><span className="nav-short">Aulas</span></a>
      </nav>
      <div className="sidebar-bottom"><div className="sidebar-note"><BookOpen size={18} /><p>Um olhar mais claro para cada trajetória.</p></div><div className="teacher-profile"><div className="teacher-avatar">PE</div><div><strong>{teacherName}</strong><span>Professor</span></div></div></div>
    </aside>
    <main id={active === "dashboard" ? "visao-geral" : "gerenciamento-de-aulas"} className="main-content">
      <header className="topbar"><div className="breadcrumbs">Painel <span>/</span> {active === "dashboard" ? "Visão geral" : "Gerenciamento de aulas"}</div><div className="topbar-right"><span className={`source-indicator ${source === "live" ? "source-live" : ""}`}>{source === "live" ? "Dados do backend" : "Prévia da seed"}</span><div className="top-avatar">PE</div></div></header>
      <nav className="workspace-tabs" aria-label="Áreas do painel"><a className={active === "dashboard" ? "workspace-tab active" : "workspace-tab"} aria-current={active === "dashboard" ? "page" : undefined} href="/">Visão geral</a><a className={active === "lessons" ? "workspace-tab active" : "workspace-tab"} aria-current={active === "lessons" ? "page" : undefined} href="/aulas">Gerenciamento de aulas</a></nav>
      {children}
    </main>
  </div>;
}
