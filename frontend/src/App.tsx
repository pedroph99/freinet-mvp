import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, BookOpen, ChevronDown, CircleHelp, Search, TrendingDown, TrendingUp, Users } from "lucide-react";
import { type Dashboard, type Student, loadDashboard, seedPreview } from "./data";
import StudentDialog from "./StudentDialog";
import StudentAvatar from "./StudentAvatar";
import AppChrome from "./AppChrome";

const number = (value: number | null, digits = 1) => value === null ? "—" : value.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const shortClass = (name: string) => name.split(" - ")[0];

function App() {
  const [dashboard, setDashboard] = useState<Dashboard>(seedPreview);
  const [source, setSource] = useState<"loading" | "live" | "preview">("loading");
  const [selectedClass, setSelectedClass] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<{ student: Student; className: string } | null>(null);
  const [sort, setSort] = useState<"average" | "absences">("average");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    loadDashboard().then((data) => { if (active) { setDashboard(data); setSource("live"); } }).catch(() => { if (active) { setDashboard(seedPreview); setSource("preview"); } });
    return () => { active = false; };
  }, [retryKey]);

  const visibleClasses = useMemo(() => selectedClass === "all" ? dashboard.classes : dashboard.classes.filter((classroom) => String(classroom.id) === selectedClass), [dashboard, selectedClass]);
  const students = useMemo(() => visibleClasses.flatMap((classroom) => classroom.students.map((student) => ({ student, className: shortClass(classroom.name) }))), [visibleClasses]);
  const ranked = useMemo(() => [...students].sort((a, b) => sort === "average" ? (b.student.grades.finalAverage ?? -1) - (a.student.grades.finalAverage ?? -1) || a.student.name.localeCompare(b.student.name) : b.student.attendance.absent - a.student.attendance.absent || a.student.name.localeCompare(b.student.name)), [students, sort]);
  const filtered = useMemo(() => ranked.filter(({ student }) => `${student.name} ${student.registrationNumber}`.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR").trim())), [ranked, search]);
  const withGrades = students.filter(({ student }) => student.grades.finalAverage !== null);
  const average = withGrades.length ? withGrades.reduce((sum, { student }) => sum + student.grades.finalAverage!, 0) / withGrades.length : null;
  const totalAbsences = students.reduce((sum, { student }) => sum + student.attendance.absent, 0);
  const averageAbsences = students.length ? totalAbsences / students.length : null;
  const recorded = students.reduce((sum, { student }) => sum + student.attendance.recorded, 0);
  const absenceRate = recorded ? totalAbsences / recorded * 100 : null;
  const attention = students.filter(({ student }) => student.grades.finalAverage !== null && student.grades.finalAverage < 7).length;
  const byAverage = [...students].filter(({ student }) => student.grades.finalAverage !== null).sort((a, b) => b.student.grades.finalAverage! - a.student.grades.finalAverage!);
  const best = byAverage[0];
  const lowest = byAverage.at(-1);
  const distribution = [0, 0, 0, 0];
  withGrades.forEach(({ student }) => { const grade = student.grades.finalAverage!; distribution[grade < 5 ? 0 : grade < 7 ? 1 : grade < 9 ? 2 : 3]++; });
  const maxDistribution = Math.max(...distribution, 1);

  if (source === "loading") return <div className="loading-screen" role="status"><img className="loading-mark" src="/freinet-mark.svg" alt="" /><h1>Carregando painel do professor</h1><p>Conectando às turmas, notas e presenças.</p></div>;

  return <>
    <AppChrome teacherName={dashboard.teacher.name} source={source} active="dashboard">
      <div className="page-content">
        <div className="page-heading"><div><h1>Visão geral da turma</h1><p>Acompanhe o desempenho e a frequência dos seus alunos em um só lugar.</p></div><div className="class-picker"><label htmlFor="class-select">Turma</label><div><select id="class-select" value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}><option value="all">Todas as turmas</option>{dashboard.classes.map((classroom) => <option key={classroom.id} value={classroom.id}>{shortClass(classroom.name)}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></div></div></div>
        {source === "preview" && <div className="preview-notice" role="status"><CircleHelp size={17} /><span>Backend indisponível. Estes são dados de prévia calculados a partir da seed; alterações no banco não aparecem aqui.</span><button onClick={() => { setSource("loading"); setRetryKey((value) => value + 1); }}>Tentar novamente</button></div>}

        <section className="overview" aria-label="Indicadores de desempenho">
          <div className="average-panel"><div className="panel-label">Média geral</div><div className="average-number">{number(average)}<span>/ 10</span></div><p>Média atual dos {withGrades.length} alunos com notas lançadas.</p><div className="average-rule"><span style={{ width: `${average === null ? 0 : average * 10}%` }} /></div><div className="average-foot"><span>0</span><span>Meta de aprovação · 7,0</span><span>10</span></div></div>
          <div className="mini-stat"><div className="stat-icon teal"><Users size={19} /></div><div><span>Alunos</span><strong>{students.length}</strong><small>em {visibleClasses.length} {visibleClasses.length === 1 ? "turma" : "turmas"}</small></div></div>
          <div className="mini-stat"><div className="stat-icon amber"><TrendingDown size={19} /></div><div><span>Precisam de atenção</span><strong>{attention}</strong><small>com média abaixo de 7,0</small></div></div>
          <div className="mini-stat"><div className="stat-icon blue"><BookOpen size={19} /></div><div><span>Taxa de faltas</span><strong>{number(absenceRate)}%</strong><small>{totalAbsences} faltas · média {number(averageAbsences)} por aluno</small></div></div>
        </section>

        <section className="insights" aria-label="Análise das notas"><div className="distribution"><div className="section-title"><div><h2>Distribuição das médias</h2><p>Como os alunos se distribuem por faixa de nota.</p></div></div><div className="bars">{[["Abaixo de 5", "0–4,9"], ["De 5 a 6,9", "5–6,9"], ["De 7 a 8,9", "7–8,9"], ["9 ou mais", "9–10"]].map(([label, range], index) => <div className="bar-row" key={label}><span>{label}</span><div className="bar-track"><div className={`bar-fill bar-${index}`} style={{ width: `${distribution[index] / maxDistribution * 100}%` }} /></div><strong>{distribution[index]}</strong><small>{range}</small></div>)}</div></div><div className="highlights"><h2>Destaques da turma</h2><div className="highlight-row"><div className="highlight-icon up"><TrendingUp size={19} /></div><div><span>Melhor média</span><strong>{best?.student.name || "Nenhum aluno"}</strong><small>{best ? `${best.className} · média ${number(best.student.grades.finalAverage)}` : "Aguardando notas"}</small></div><button onClick={() => best && setSelectedStudent(best)} disabled={!best} aria-label={`Ver ${best?.student.name || "aluno"}`}><ArrowRight size={18} /></button></div><div className="highlight-row"><div className="highlight-icon down"><TrendingDown size={19} /></div><div><span>Menor média</span><strong>{lowest?.student.name || "Nenhum aluno"}</strong><small>{lowest ? `${lowest.className} · média ${number(lowest.student.grades.finalAverage)}` : "Aguardando notas"}</small></div><button onClick={() => lowest && setSelectedStudent(lowest)} disabled={!lowest} aria-label={`Ver ${lowest?.student.name || "aluno"}`}><ArrowRight size={18} /></button></div></div></section>

        <section id="ranking" className="ranking-section"><div className="ranking-heading"><div><h2>Ranking de alunos</h2><p>Notas e frequência de {students.length} alunos {selectedClass === "all" ? "em todas as turmas" : `da ${shortClass(visibleClasses[0]?.name || "turma")}`}.</p></div><div className="table-tools"><label className="search"><Search size={17} /><input type="search" placeholder="Buscar aluno ou matrícula" aria-label="Buscar aluno ou matrícula" value={search} onChange={(event) => setSearch(event.target.value)} /></label><button className="sort-button" onClick={() => setSort(sort === "average" ? "absences" : "average")} title="Alternar ordenação"><ArrowDown size={16} /> {sort === "average" ? "Por média" : "Por faltas"}</button></div></div><p className="table-hint">Deslize a tabela para ver todas as notas e faltas →</p><div className="table-scroll"><table><thead><tr><th scope="col">Posição</th><th scope="col">Aluno</th><th scope="col">Turma</th><th scope="col">U1</th><th scope="col">U2</th><th scope="col">U3</th><th scope="col">Média</th><th scope="col">Faltas</th><th scope="col">Taxa de faltas</th><th scope="col"><span className="sr-only">Detalhes</span></th></tr></thead><tbody>{filtered.map(({ student, className }) => <tr key={`${className}-${student.id}`}><td className="position">{String(ranked.findIndex((item) => item.student.id === student.id && item.className === className) + 1).padStart(2, "0")}</td><td><div className="student-cell"><StudentAvatar name={student.name} photo={student.photo} /><div><strong>{student.name}</strong><small>{student.registrationNumber}</small></div></div></td><td>{className}</td><td className="numeric">{number(student.grades.u1)}</td><td className="numeric">{number(student.grades.u2)}</td><td className="numeric">{number(student.grades.u3)}</td><td><span className={`grade-badge ${student.grades.finalAverage !== null && student.grades.finalAverage < 7 ? "grade-low" : ""}`}>{number(student.grades.finalAverage)}</span></td><td className="numeric">{student.attendance.absent}</td><td className="numeric muted">{student.attendance.absenceRate === null ? "—" : `${number(student.attendance.absenceRate)}%`}</td><td><button className="details-button" onClick={() => setSelectedStudent({ student, className })}>Ver detalhes <ArrowRight size={15} /></button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state">Nenhum aluno encontrado. Tente outro nome ou matrícula.</div>}</div><div className="table-footer"><span>Mostrando {filtered.length} de {students.length} alunos</span><span>Ordenado por {sort === "average" ? "média atual" : "número de faltas"}</span></div></section>
      </div>
    </AppChrome>
    {selectedStudent && <StudentDialog student={selectedStudent.student} className={selectedStudent.className} onClose={() => setSelectedStudent(null)} />}
  </>;
}

export default App;
