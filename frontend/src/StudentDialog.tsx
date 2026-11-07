import { useEffect, useRef, useState } from "react";
import { Activity, BookOpen, CalendarDays, ClipboardList, Mail, Phone, ShieldCheck, X } from "lucide-react";
import { type Student, type StudentNote } from "./data";
import StudentAvatar from "./StudentAvatar";

const number = (value: number | null) => value === null ? "—" : value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const dateLabel = (value: string | null) => value ? new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "Não informado";
const statusLabel = (student: Student) => ({
  PENDING_UNITS: "Notas pendentes",
  APPROVED_BY_MEDIA1: "Aprovado pela média",
  RECOVERY_REQUIRED: "Recuperação pendente",
  APPROVED_BY_RECOVERY: "Aprovado na recuperação",
  FINAL_EXAM_REQUIRED: "Prova final pendente",
  APPROVED_BY_FINAL_EXAM: "Aprovado na prova final",
  FAILED: "Não aprovado",
})[student.grades.status];

function NoteGroup({ title, type, notes }: { title: string; type: StudentNote["type"]; notes: StudentNote[] }) {
  const matching = notes.filter((note) => note.type === type);
  const Icon = type === "TECHNICAL" ? Activity : ShieldCheck;
  return <section className={`note-group ${type === "DISCIPLINARY" ? "note-disciplinary" : ""}`} aria-label={title}>
    <div className="note-group-heading"><div className="note-group-icon"><Icon size={17} /></div><div><h3>{title}</h3><p>{type === "TECHNICAL" ? "Observações sobre evolução e prática." : "Registros de convivência e acompanhamento."}</p></div><span className="note-count">{matching.length}</span></div>
    {matching.length ? <div className="note-list">{matching.map((note) => <article className="note-entry" key={note.id}><div className="note-entry-date"><CalendarDays size={14} /><time dateTime={note.recordedAt}>{dateLabel(note.recordedAt)}</time></div><p>{note.content}</p></article>)}</div> : <p className="notes-empty">Nenhuma anotação {type === "TECHNICAL" ? "técnica" : "disciplinar"} registrada.</p>}
  </section>;
}

export default function StudentDialog({ student, className, onClose }: { student: Student; className: string; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "notes">("overview");
  const closeRef = useRef<HTMLButtonElement>(null);
  const overviewRef = useRef<HTMLButtonElement>(null);
  const notesRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const dialog = closeRef.current?.closest("[role=dialog]");
        const focusable = Array.from(dialog?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]") || []);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; opener?.focus(); };
  }, [onClose]);

  const onTabKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = activeTab === "overview" ? "notes" : "overview";
    setActiveTab(next);
    (next === "overview" ? overviewRef : notesRef).current?.focus();
  };

  const isPending = ["RECOVERY_REQUIRED", "FINAL_EXAM_REQUIRED", "PENDING_UNITS"].includes(student.grades.status);
  const needsAttention = isPending || student.grades.status === "FAILED";
  const notes = student.notes ?? [];
  const technicalCount = notes.filter((note) => note.type === "TECHNICAL").length;
  const disciplinaryCount = notes.filter((note) => note.type === "DISCIPLINARY").length;

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="student-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="dialog-top"><span>Perfil do aluno</span><button ref={closeRef} className="icon-button" onClick={onClose} aria-label="Fechar detalhes"><X size={20} /></button></div>
      <div className="dialog-identity"><StudentAvatar name={student.name} photo={student.photo} large /><div><h2 id="dialog-title">{student.name}</h2><p>{student.registrationNumber} <span className="dot">·</span> {className} <span className="dot">·</span> {student.status === "ACTIVE" ? "Matrícula ativa" : "Matrícula inativa"}</p></div></div>
      <div className="dialog-tabs" role="tablist" aria-label="Informações do aluno">
        <button ref={overviewRef} id="student-overview-tab" role="tab" aria-selected={activeTab === "overview"} aria-controls="student-overview-panel" tabIndex={activeTab === "overview" ? 0 : -1} onClick={() => setActiveTab("overview")} onKeyDown={onTabKey}><BookOpen size={16} /> Visão geral</button>
        <button ref={notesRef} id="student-notes-tab" role="tab" aria-selected={activeTab === "notes"} aria-controls="student-notes-panel" tabIndex={activeTab === "notes" ? 0 : -1} onClick={() => setActiveTab("notes")} onKeyDown={onTabKey}><ClipboardList size={16} /> Anotações <span className="tab-count">{notes.length}</span></button>
      </div>

      {activeTab === "overview" ? <div id="student-overview-panel" role="tabpanel" aria-labelledby="student-overview-tab" className="dialog-panel">
        <div className="dialog-highlight"><div><span>{isPending ? "Média atual" : "Média final"}</span><strong>{number(student.grades.finalAverage)}</strong></div><div><span>Faltas</span><strong>{student.attendance.absent}<small> / {student.attendance.recorded} aulas</small></strong></div><span className={`status-pill ${needsAttention ? "status-attention" : "status-good"}`}>{statusLabel(student)}</span></div>
        <div className="dialog-section"><h3>Notas por unidade</h3><div className="grade-grid">{[["Unidade 1", student.grades.u1], ["Unidade 2", student.grades.u2], ["Unidade 3", student.grades.u3], ["Recuperação", student.grades.recoveryExam], ["Prova final", student.grades.finalExam]].map(([label, value]) => <div key={label as string}><span>{label}</span><strong>{number(value as number | null)}</strong></div>)}</div></div>
        <div className="dialog-section"><h3>Frequência</h3><div className="attendance-grid"><div><strong>{student.attendance.present}</strong><span>Presenças</span></div><div><strong>{student.attendance.absent}</strong><span>Faltas</span></div><div><strong>{student.attendance.justified}</strong><span>Justificadas</span></div><div><strong>{student.attendance.late}</strong><span>Atrasos</span></div><div><strong>{number(student.attendance.absenceRate)}%</strong><span>Taxa de faltas</span></div></div></div>
        <div className="dialog-section"><h3>Dados e contato</h3><dl className="contact-list"><div><dt>Data de nascimento</dt><dd>{dateLabel(student.birthDate)}</dd></div><div><dt>E-mail</dt><dd>{student.email ? <a href={`mailto:${student.email}`}><Mail size={13} />{student.email}</a> : "Não informado"}</dd></div><div><dt>Telefone</dt><dd>{student.phone ? <a href={`tel:${student.phone.replace(/[^+\d]/g, "")}`}><Phone size={13} />{student.phone}</a> : "Não informado"}</dd></div><div><dt>Responsável</dt><dd>{student.responsibleName || "Não informado"}</dd></div><div><dt>Contato do responsável</dt><dd>{student.responsiblePhone || "Não informado"}</dd></div><div><dt>Contato de emergência</dt><dd>{student.emergencyContact || "Não informado"}</dd></div></dl></div>
      </div> : <div id="student-notes-panel" role="tabpanel" aria-labelledby="student-notes-tab" className="dialog-panel notes-panel"><p className="notes-intro">Registros do professor sobre o acompanhamento de {student.name.split(" ")[0]}. <strong>{technicalCount} {technicalCount === 1 ? "anotação técnica" : "anotações técnicas"}</strong> e <strong>{disciplinaryCount} {disciplinaryCount === 1 ? "anotação disciplinar" : "anotações disciplinares"}</strong>.</p><NoteGroup title="Anotações técnicas" type="TECHNICAL" notes={notes} /><NoteGroup title="Anotações disciplinares" type="DISCIPLINARY" notes={notes} /></div>}
    </section>
  </div>;
}
