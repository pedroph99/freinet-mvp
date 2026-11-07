export type GradeStatus = "PENDING_UNITS" | "APPROVED_BY_MEDIA1" | "RECOVERY_REQUIRED" | "APPROVED_BY_RECOVERY" | "FINAL_EXAM_REQUIRED" | "APPROVED_BY_FINAL_EXAM" | "FAILED";

export interface StudentNote {
  id: number;
  type: "TECHNICAL" | "DISCIPLINARY";
  content: string;
  recordedAt: string;
}

export type AttendanceStatus = "PRESENT" | "ABSENT" | "JUSTIFIED" | "LATE" | null;

export interface Lesson {
  id: number;
  date: string;
  topic: string | null;
  description: string | null;
  duration: number | null;
  attendance: Array<{
    studentId: number;
    name: string;
    registrationNumber: string;
    photo: string | null;
    status: AttendanceStatus;
    notes: string | null;
  }>;
  summary: {
    present: number;
    absent: number;
    justified: number;
    late: number;
    recorded: number;
    totalStudents: number;
    attendanceRate: number | null;
  };
}

export interface Student {
  id: number;
  name: string;
  registrationNumber: string;
  status: string;
  photo: string | null;
  email: string | null;
  phone: string | null;
  birthDate: string | null;
  responsibleName: string | null;
  responsiblePhone: string | null;
  emergencyContact: string | null;
  notes: StudentNote[];
  grades: {
    u1: number | null;
    u2: number | null;
    u3: number | null;
    recoveryExam: number | null;
    finalExam: number | null;
    media1: number | null;
    media2: number | null;
    media3: number | null;
    finalAverage: number | null;
    status: GradeStatus;
  };
  attendance: {
    absent: number;
    present: number;
    justified: number;
    late: number;
    recorded: number;
    absenceRate: number | null;
  };
}

export interface Classroom {
  id: number;
  name: string;
  schedule: string | null;
  lessonCount: number;
  lessons: Lesson[];
  students: Student[];
}

export interface Dashboard {
  teacher: { id: number; name: string; specialization: string | null };
  classes: Classroom[];
}

const firstNames = ["Ana", "Bruno", "Carla", "Diego", "Eduarda", "Felipe", "Gabriela", "Henrique", "Isabela", "Joao", "Karen", "Lucas", "Mariana", "Nicolas", "Olivia", "Paulo", "Quezia", "Rafael", "Sofia", "Thiago"];
const lastNames = ["Almeida", "Barbosa", "Cardoso", "Dias", "Esteves", "Ferreira", "Gomes", "Hoffmann", "Ibrahim", "Jesus", "Klein", "Lima", "Moura", "Nascimento", "Oliveira", "Pereira", "Queiroz", "Ramos", "Silva", "Teixeira"];
const technicalNotes = [
  "Demonstra boa coordenação nos exercícios em grupo. Pode avançar com desafios de maior complexidade.",
  "Evoluiu na execução dos movimentos ao longo das últimas aulas. Manter a prática de fundamentos.",
  "Participa das atividades e responde bem às orientações técnicas. Trabalhar constância no ritmo.",
];
const disciplinaryNotes = [
  "Chegou após o início da atividade. Conversamos sobre pontualidade e combinamos acompanhar as próximas aulas.",
  "Precisou de orientação sobre o tempo de fala dos colegas durante a atividade em grupo.",
];
export const lessonTopics = [
  "Movimento e consciência corporal",
  "Fundamentos de coordenação",
  "Jogos cooperativos",
  "Agilidade e deslocamento",
  "Ritmo e expressão corporal",
  "Equilíbrio e postura",
  "Estratégias em equipe",
  "Resistência e circuito",
  "Técnicas de passe",
  "Prática orientada",
  "Desafios de integração",
  "Avaliação prática",
];
const round = (value: number) => Number(value.toFixed(2));

// Mirrors backend/prisma/seed.js so the MVP can be reviewed before Postgres is started.
export const seedPreview: Dashboard = {
  teacher: { id: 1, name: "Professor Exemplo", specialization: "Educação Física" },
  classes: [0, 1].map((classIndex) => ({
    id: classIndex + 1,
    name: `Turma ${classIndex === 0 ? "A" : "B"} - Professor Exemplo`,
    schedule: classIndex === 0 ? "Seg/Qua 18:00-20:00" : "Ter/Qui 18:00-20:00",
    lessonCount: 12,
    lessons: [],
    students: Array.from({ length: 10 }, (_, studentIndex) => {
      const i = classIndex * 10 + studentIndex;
      const first = firstNames[i];
      const last = lastNames[(i * 3) % lastNames.length];
      const base = 4.4 + ((i * 7) % 13) * 0.42;
      const u1 = Math.min(10, Number(base.toFixed(1)));
      const u2 = Math.min(10, Number((base + ((i % 3) - 1) * 0.6).toFixed(1)));
      const u3 = Math.min(10, Number((base + ((i % 4) - 1.5) * 0.4).toFixed(1)));
      const media1 = round((u1 + u2 + u3) / 3);
      const recoveryExam = media1 < 7 ? Number(Math.min(10, 5.8 + (i % 5) * 0.8).toFixed(1)) : null;
      const media2 = recoveryExam === null ? null : round((media1 + recoveryExam) / 2);
      const finalExam = media2 !== null && media2 < 7 ? Number(Math.min(10, 5.5 + (i % 4) * 0.9).toFixed(1)) : null;
      const media3 = media2 !== null && finalExam !== null ? round((media2 + finalExam) / 2) : null;
      const finalAverage = media1 >= 7 ? media1 : media2 !== null && media2 >= 7 ? media2 : media3 ?? media2 ?? media1;
      const status: GradeStatus = media1 >= 7 ? "APPROVED_BY_MEDIA1" : media2 !== null && media2 >= 7 ? "APPROVED_BY_RECOVERY" : media3 !== null ? (media3 >= 7 ? "APPROVED_BY_FINAL_EXAM" : "FAILED") : "RECOVERY_REQUIRED";
      const absent = Array.from({ length: 12 }, (_, lessonIndex) => ((lessonIndex * 7 + i * 3) % 12) < i % 5).filter(Boolean).length;
      const makePhone = (index: number) => `+55 11 9${String(1000 + index).padStart(4, "0")}-${String(1000 + (index * 7) % 10000).padStart(4, "0")}`;
      return {
        id: i + 1,
        name: `${first} ${last}`,
        registrationNumber: `REG-${String(i + 1).padStart(4, "0")}`,
        status: "ACTIVE",
        photo: `https://i.pravatar.cc/300?img=${i + 1}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@example.com`,
        phone: makePhone(i),
        birthDate: new Date(1998 + i % 8, i % 12, (i * 7) % 27 + 1).toISOString(),
        responsibleName: `Resp ${first} ${last}`,
        responsiblePhone: makePhone(i + 20),
        emergencyContact: `Emerg ${first} ${last}`,
        notes: [
          {
            id: i * 2 + 1,
            type: "TECHNICAL" as const,
            content: technicalNotes[i % technicalNotes.length],
            recordedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
          },
          ...(i % 3 === 0 ? [{
            id: i * 2 + 2,
            type: "DISCIPLINARY" as const,
            content: disciplinaryNotes[i % disciplinaryNotes.length],
            recordedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          }] : []),
        ].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)),
        grades: { u1, u2, u3, recoveryExam, finalExam, media1, media2, media3, finalAverage, status },
        attendance: { absent, present: 12 - absent, justified: 0, late: 0, recorded: 12, absenceRate: round(absent / 12 * 100) },
      };
    }),
  })),
};

seedPreview.classes.forEach((classroom, classIndex) => {
  classroom.lessons = lessonTopics.map((topic, lessonIndex) => {
    const date = new Date();
    date.setDate(date.getDate() - (11 - lessonIndex) * 3);
    const attendance: Lesson["attendance"] = classroom.students.map((student, studentIndex) => {
      const globalIndex = classIndex * 10 + studentIndex;
      const absent = ((lessonIndex * 7 + globalIndex * 3) % 12) < globalIndex % 5;
      return {
        studentId: student.id,
        name: student.name,
        registrationNumber: student.registrationNumber,
        photo: student.photo,
        status: absent ? "ABSENT" : "PRESENT",
        notes: null,
      };
    });
    const absent = attendance.filter((entry) => entry.status === "ABSENT").length;
    return {
      id: classIndex * 12 + lessonIndex + 1,
      date: date.toISOString(),
      topic,
      description: null,
      duration: 120,
      attendance,
      summary: { present: attendance.length - absent, absent, justified: 0, late: 0, recorded: attendance.length, totalStudents: classroom.students.length, attendanceRate: round((attendance.length - absent) / attendance.length * 100) },
    };
  });
});

const apiBase = import.meta.env.VITE_API_URL || "/api";

export async function loadDashboard(): Promise<Dashboard> {
  const login = await fetch(`${apiBase}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: import.meta.env.VITE_DEMO_EMAIL || "professor@example.com",
      password: import.meta.env.VITE_DEMO_PASSWORD || "SenhaProf123!",
    }),
  });
  if (!login.ok) throw new Error("Não foi possível entrar com o professor da seed.");
  const session: { token: string } = await login.json();
  const response = await fetch(`${apiBase}/teachers/dashboard`, {
    headers: { Authorization: `Bearer ${session.token}` },
  });
  if (!response.ok) throw new Error("Não foi possível carregar os dados do professor.");
  return response.json();
}
