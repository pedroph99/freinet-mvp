import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, ChevronDown, CircleHelp, Clock3, Search, Users, X } from "lucide-react";
import AppChrome from "./AppChrome";
import StudentAvatar from "./StudentAvatar";
import { type Classroom, type Lesson, loadDashboard, seedPreview } from "./data";

const number = (value: number | null) => value === null ? "—" : value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const shortClass = (name: string) => name.split(" - ")[0];
const dateLong = (value: string) => new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
const day = (value: string) => new Date(value).toLocaleDateString("pt-BR", { day: "2-digit" });
const month = (value: string) => new Date(value).toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");

type LessonItem = { lesson: Lesson; classroom: Classroom };

export default function LessonsPage() {
  const [dashboard, setDashboard] = useState(seedPreview);
  const [source, setSource] = useState<"loading" | "live" | "preview">("loading");
  const [retryKey, setRetryKey] = useState(0);
  const [selectedClass, setSelectedClass] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [rosterFilter, setRosterFilter] = useState<"all" | "absent">("all");

  useEffect(() => {
    let active = true;
    loadDashboard().then((data) => { if (active) { setDashboard(data); setSource("live"); } }).catch(() => { if (active) { setDashboard(seedPreview); setSource("preview"); } });
    return () => { active = false; };
  }, [retryKey]);

  const classes = useMemo(() => selectedClass === "all" ? dashboard.classes : dashboard.classes.filter((classroom) => String(classroom.id) === selectedClass), [dashboard, selectedClass]);
  const lessons = useMemo<LessonItem[]>(() => classes.flatMap((classroom) => classroom.lessons.map((lesson) => ({ classroom, lesson }))).sort((a, b) => new Date(b.lesson.date).getTime() - new Date(a.lesson.date).getTime() || b.lesson.id - a.lesson.id), [classes]);
  const filtered = useMemo(() => lessons.filter(({ lesson, classroom }) => `${lesson.topic ?? ""} ${classroom.name}`.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR"))), [lessons, search]);
  const selected = filtered.find(({ lesson }) => lesson.id === selectedLessonId) ?? filtered[0];
  const records = lessons.reduce((sum, { lesson }) => sum + lesson.summary.recorded, 0);
  const attended = lessons.reduce((sum, { lesson }) => sum + lesson.summary.present + lesson.summary.late, 0);
  const absences = lessons.reduce((sum, { lesson }) => sum + lesson.summary.absent, 0);
  const rate = records ? attended / records * 100 : null;
  const trend = lessons.slice(0, 8).reverse();
  const roster = selected?.lesson.attendance.filter((entry) => rosterFilter === "all" || entry.status === "ABSENT") ?? [];

  if (source === "loading") return <div className="loading-screen" role="status"><img className="loading-mark" src="/freinet-mark.svg" alt="" /><h1>Carregando aulas</h1><p>Reunindo as chamadas das suas turmas.</p></div>;

  return <AppChrome teacherName={dashboard.teacher.name} source={source} active="lessons">
    <div className="page-content lessons-page">
      <div className="page-heading"><div><h1>Gerenciamento de aulas</h1><p>Aulas dadas, presença registrada e acompanhamento de cada turma.</p></div><div className="class-picker"><label htmlFor="lessons-class-select">Turma</label><div><select id="lessons-class-select" value={selectedClass} onChange={(event) => { setSelectedClass(event.target.value); setSelectedLessonId(null); setRosterFilter("all"); }}><option value="all">Todas as turmas</option>{dashboard.classes.map((classroom) => <option key={classroom.id} value={classroom.id}>{shortClass(classroom.name)}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></div></div></div>
      {source === "preview" && <div className="preview-notice" role="status"><CircleHelp size={17} /><span>Backend indisponível. Exibindo aulas e presenças calculadas a partir da seed.</span><button onClick={() => { setSource("loading"); setRetryKey((value) => value + 1); }}>Tentar novamente</button></div>}

      <section className="lesson-metrics" aria-label="Resumo de aulas e frequência">
        <div className="lesson-lead"><div className="lesson-lead-top"><CalendarDays size={19} /><span>Período registrado</span></div><strong>{lessons.length}</strong><span>{lessons.length === 1 ? "aula dada" : "aulas dadas"} em {classes.length} {classes.length === 1 ? "turma" : "turmas"}</span>{lessons.length > 0 && <div className="lesson-period">{dateLong(lessons[lessons.length - 1].lesson.date)} <span>até</span> {dateLong(lessons[0].lesson.date)}</div>}</div>
        <div className="lesson-metric"><span>Presença média</span><strong>{number(rate)}%</strong><small>presentes e atrasos em {records} registros</small><div className="metric-bar"><span style={{ width: `${rate ?? 0}%` }} /></div></div>
        <div className="lesson-metric"><span>Faltas registradas</span><strong>{absences}</strong><small>{lessons.length ? `${number(absences / lessons.length)} por aula, em média` : "Nenhuma aula registrada"}</small><div className="lesson-metric-icon absence"><X size={18} /></div></div>
        <div className="lesson-metric"><span>Alunos acompanhados</span><strong>{new Set(classes.flatMap((classroom) => classroom.students.map((student) => student.id))).size}</strong><small>com matrícula nas turmas exibidas</small><div className="lesson-metric-icon students"><Users size={18} /></div></div>
      </section>

      <section className="lesson-insights" aria-label="Painéis de frequência">
        <div className="trend-panel"><div className="lesson-panel-heading"><div><h2>Presença nas últimas aulas</h2><p>Proporção de presentes, atrasos e faltas por chamada.</p></div><span>Últimas {trend.length}</span></div>{trend.length ? <div className="trend-chart">{trend.map(({ classroom, lesson }) => { const total = lesson.summary.recorded || 1; const attendedPart = (lesson.summary.present + lesson.summary.late) / total * 100; const absentPart = lesson.summary.absent / total * 100; return <div className="trend-row" key={`${classroom.id}-${lesson.id}`}><span>{shortClass(classroom.name)} <small>· {day(lesson.date)} {month(lesson.date)}</small></span><div className="trend-track" title={`${lesson.summary.present + lesson.summary.late} presentes, ${lesson.summary.absent} faltas`}><i style={{ width: `${attendedPart}%` }} /><b style={{ width: `${absentPart}%` }} /></div><strong>{number(lesson.summary.attendanceRate)}%</strong></div>; })}</div> : <p className="lesson-empty">Nenhuma chamada registrada.</p>}<div className="trend-legend"><span><i className="legend-present" />Presença</span><span><i className="legend-absent" />Falta</span><span><i className="legend-unmarked" />Outros ou sem registro</span></div></div>
        <div className="class-summary-panel"><div className="lesson-panel-heading"><div><h2>Turmas em foco</h2><p>Comparativo das turmas selecionadas.</p></div></div><div className="class-summary-list">{classes.map((classroom) => { const classLessons = classroom.lessons; const classRecords = classLessons.reduce((sum, lesson) => sum + lesson.summary.recorded, 0); const classPresent = classLessons.reduce((sum, lesson) => sum + lesson.summary.present + lesson.summary.late, 0); const classAbsences = classLessons.reduce((sum, lesson) => sum + lesson.summary.absent, 0); const classRate = classRecords ? classPresent / classRecords * 100 : null; return <div className="class-summary-row" key={classroom.id}><div className="class-summary-head"><strong>{shortClass(classroom.name)}</strong><span>{classLessons.length} aulas · {classroom.students.length} alunos</span></div><div className="class-summary-number">{number(classRate)}% <span>de presença</span></div><div className="class-summary-track"><span style={{ width: `${classRate ?? 0}%` }} /></div><small>{classAbsences} {classAbsences === 1 ? "falta" : "faltas"} registradas</small></div>; })}</div></div>
      </section>

      <section className="lessons-workspace" aria-label="Aulas e lista de presença"><div className="lesson-list-panel"><div className="lesson-list-heading"><div><h2>Aulas realizadas</h2><p>Selecione uma aula para conferir a lista de presença.</p></div><span>{filtered.length} {filtered.length === 1 ? "aula" : "aulas"}</span></div><label className="search lesson-search"><Search size={17} /><input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setSelectedLessonId(null); }} placeholder="Buscar assunto ou turma" aria-label="Buscar assunto ou turma" /></label><div className="lesson-list">{filtered.length ? filtered.map(({ lesson, classroom }) => <button type="button" key={`${classroom.id}-${lesson.id}`} className={`lesson-row${selected?.lesson.id === lesson.id && selected?.classroom.id === classroom.id ? " selected" : ""}`} aria-pressed={selected?.lesson.id === lesson.id && selected?.classroom.id === classroom.id} onClick={() => { setSelectedLessonId(lesson.id); setRosterFilter("all"); }}><span className="lesson-date"><strong>{day(lesson.date)}</strong><small>{month(lesson.date)}</small></span><span className="lesson-row-main"><strong>{lesson.topic || "Aula sem assunto"}</strong><small>{shortClass(classroom.name)} · {lesson.duration ? `${lesson.duration} min` : "Duração não informada"}</small></span><span className="lesson-row-numbers"><strong>{lesson.summary.present + lesson.summary.late}/{lesson.summary.totalStudents}</strong><small>presentes</small></span><span className={`absence-count${lesson.summary.absent ? " has-absence" : ""}`}>{lesson.summary.absent} {lesson.summary.absent === 1 ? "falta" : "faltas"}</span><ArrowRight size={17} className="lesson-row-arrow" /></button>) : <div className="lesson-empty">Nenhuma aula encontrada. Tente outro assunto ou turma.</div>}</div></div>
        <aside className="roster-panel" aria-label="Lista de presença da aula selecionada">{selected ? <><div className="roster-heading"><span>Chamada da aula</span><h2>{selected.lesson.topic || "Aula sem assunto"}</h2><p>{shortClass(selected.classroom.name)} <span>·</span> {dateLong(selected.lesson.date)} <span>·</span> {selected.lesson.duration ? `${selected.lesson.duration} min` : "Duração não informada"}</p></div><div className="roster-summary"><div><Check size={15} /><strong>{selected.lesson.summary.present + selected.lesson.summary.late}</strong><span>presentes</span></div><div className="roster-summary-absent"><X size={15} /><strong>{selected.lesson.summary.absent}</strong><span>faltas</span></div><div><Clock3 size={15} /><strong>{number(selected.lesson.summary.attendanceRate)}%</strong><span>presença</span></div></div><div className="roster-toolbar"><h3>Lista de presença</h3><div className="roster-filters"><button className={rosterFilter === "all" ? "active" : ""} aria-pressed={rosterFilter === "all"} onClick={() => setRosterFilter("all")}>Todos</button><button className={rosterFilter === "absent" ? "active" : ""} aria-pressed={rosterFilter === "absent"} onClick={() => setRosterFilter("absent")}>Faltas</button></div></div><div className="roster-list">{roster.length ? roster.map((entry) => <div className="roster-student" key={entry.studentId}><StudentAvatar name={entry.name} photo={entry.photo} /><div><strong>{entry.name}</strong><small>{entry.registrationNumber}</small></div><span className={`attendance-status ${entry.status === "ABSENT" ? "absent" : entry.status === "LATE" ? "late" : entry.status === "JUSTIFIED" ? "justified" : entry.status === null ? "unmarked" : "present"}`}>{entry.status === "ABSENT" ? "Faltou" : entry.status === "LATE" ? "Atraso" : entry.status === "JUSTIFIED" ? "Justificada" : entry.status === null ? "Sem registro" : "Presente"}</span></div>) : <div className="roster-empty">Nenhuma falta registrada nesta aula.</div>}</div><div className="roster-footer">{selected.lesson.summary.recorded} de {selected.lesson.summary.totalStudents} presenças registradas</div></> : <div className="roster-placeholder"><CalendarDays size={28} /><h2>Selecione uma aula</h2><p>A lista de presença aparecerá aqui.</p></div>}</aside></section>
    </div>
  </AppChrome>;
}
