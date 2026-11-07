require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"]
});

const firstNames = [
  "Ana",
  "Bruno",
  "Carla",
  "Diego",
  "Eduarda",
  "Felipe",
  "Gabriela",
  "Henrique",
  "Isabela",
  "Joao",
  "Karen",
  "Lucas",
  "Mariana",
  "Nicolas",
  "Olivia",
  "Paulo",
  "Quezia",
  "Rafael",
  "Sofia",
  "Thiago"
];

const lastNames = [
  "Almeida",
  "Barbosa",
  "Cardoso",
  "Dias",
  "Esteves",
  "Ferreira",
  "Gomes",
  "Hoffmann",
  "Ibrahim",
  "Jesus",
  "Klein",
  "Lima",
  "Moura",
  "Nascimento",
  "Oliveira",
  "Pereira",
  "Queiroz",
  "Ramos",
  "Silva",
  "Teixeira"
];

const lessonTopics = [
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
  "Avaliação prática"
];

function pick(arr, index) {
  return arr[index % arr.length];
}

function padNumber(value, size) {
  return String(value).padStart(size, "0");
}

function makeCpf(index) {
  const base = 10000000000 + index;
  return String(base);
}

function makePhone(index) {
  return `+55 11 9${padNumber(1000 + index, 4)}-${padNumber(1000 + (index * 7) % 10000, 4)}`;
}

function makeBirthDate(index) {
  const year = 1998 + (index % 8);
  const month = (index % 12) + 1;
  const day = ((index * 7) % 27) + 1;
  return new Date(year, month - 1, day);
}

function makeStudentPhoto(index) {
  return `https://i.pravatar.cc/300?img=${index + 1}`;
}

async function main() {
  const students = Array.from({ length: 20 }, (_, i) => {
    const first = pick(firstNames, i);
    const last = pick(lastNames, i * 3);
    const fullName = `${first} ${last}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@example.com`;

    return {
      person: {
        create: {
          name: fullName,
          email,
          phone: makePhone(i),
          cpf: makeCpf(i + 1),
          birthDate: makeBirthDate(i)
        }
      },
      registrationNumber: `REG-${padNumber(i + 1, 4)}`,
      photo: makeStudentPhoto(i),
      responsibleName: `Resp ${first} ${last}`,
      responsiblePhone: makePhone(i + 20),
      emergencyContact: `Emerg ${first} ${last}`
    };
  });

  for (const data of students) {
    await prisma.studentProfile.upsert({
      where: { registrationNumber: data.registrationNumber },
      create: data,
      update: {}
    });
  }

  // --- Create a teacher user, two classes and enroll students ---
  const teacherEmail = "professor@example.com";
  const teacherPlainPassword = "SenhaProf123!";

  // create person for teacher
  const teacherPerson = await prisma.person.upsert({
    where: { cpf: "99999999999" },
    create: {
      name: "Professor Exemplo",
      email: teacherEmail,
      phone: "+55 11 90000-0000",
      cpf: "99999999999",
      birthDate: new Date(1980, 0, 1)
    },
    update: {}
  });

  // create teacher profile
  const teacherProfile = await prisma.teacherProfile.upsert({
    where: { personId: teacherPerson.id },
    create: {
      personId: teacherPerson.id,
      specialization: "Educação Física"
    },
    update: {}
  });

  // hash password and create user
  const hashed = await bcrypt.hash(teacherPlainPassword, 10);
  await prisma.user.upsert({
    where: { email: teacherEmail },
    create: {
      personId: teacherPerson.id,
      email: teacherEmail,
      password: hashed,
      role: "TEACHER"
    },
    update: { password: hashed }
  });

  // create two classes for this teacher
  async function ensureClass(name, schedule) {
    const existing = await prisma.class.findFirst({ where: { name, teacherId: teacherProfile.id } });
    return existing || prisma.class.create({
      data: { name, description: "Turma gerada pelo seed", schedule, startDate: new Date(), teacherId: teacherProfile.id }
    });
  }
  const classA = await ensureClass("Turma A - Professor Exemplo", "Seg/Qua 18:00-20:00");
  const classB = await ensureClass("Turma B - Professor Exemplo", "Ter/Qui 18:00-20:00");

  // fetch created students to enroll
  const createdStudents = await prisma.studentProfile.findMany({
    where: { registrationNumber: { in: students.map((student) => student.registrationNumber) } }
  });
  const studentsByRegistration = new Map(createdStudents.map((student) => [student.registrationNumber, student]));
  const orderedStudents = students.map((student) => studentsByRegistration.get(student.registrationNumber));

  // enroll first 10 in classA and next 10 in classB
  for (let i = 0; i < orderedStudents.length; i++) {
    const stu = orderedStudents[i];
    if (!stu) throw new Error(`Student ${students[i].registrationNumber} was not created`);
    const targetClassId = i < 10 ? classA.id : classB.id;
    const base = 4.4 + ((i * 7) % 13) * 0.42;
    const u1 = Math.min(10, Number(base.toFixed(1)));
    const u2 = Math.min(10, Number((base + ((i % 3) - 1) * 0.6).toFixed(1)));
    const u3 = Math.min(10, Number((base + ((i % 4) - 1.5) * 0.4).toFixed(1)));
    const initialAverage = Number(((u1 + u2 + u3) / 3).toFixed(2));
    const recoveryExam = initialAverage < 7 ? Number(Math.min(10, 5.8 + (i % 5) * 0.8).toFixed(1)) : null;
    const recoveryAverage = recoveryExam === null ? null : Number(((initialAverage + recoveryExam) / 2).toFixed(2));
    const finalExam = recoveryAverage !== null && recoveryAverage < 7
      ? Number(Math.min(10, 5.5 + (i % 4) * 0.9).toFixed(1))
      : null;
    await prisma.classStudent.upsert({
      where: { classId_studentId: { classId: targetClassId, studentId: stu.id } },
      create: { classId: targetClassId, studentId: stu.id, u1, u2, u3, recoveryExam, finalExam },
      update: { u1, u2, u3, recoveryExam, finalExam }
    });
  }

  const technicalNotes = [
    "Demonstra boa coordenação nos exercícios em grupo. Pode avançar com desafios de maior complexidade.",
    "Evoluiu na execução dos movimentos ao longo das últimas aulas. Manter a prática de fundamentos.",
    "Participa das atividades e responde bem às orientações técnicas. Trabalhar constância no ritmo."
  ];
  const disciplinaryNotes = [
    "Chegou após o início da atividade. Conversamos sobre pontualidade e combinamos acompanhar as próximas aulas.",
    "Precisou de orientação sobre o tempo de fala dos colegas durante a atividade em grupo."
  ];
  for (const [index, student] of orderedStudents.entries()) {
    if (!student) continue;
    const technicalKey = `seed-technical-${student.registrationNumber}`;
    await prisma.studentNote.upsert({
      where: { seedKey: technicalKey },
      create: {
        studentId: student.id,
        teacherId: teacherProfile.id,
        type: "TECHNICAL",
        content: technicalNotes[index % technicalNotes.length],
        recordedAt: new Date(Date.now() - 7 * 86400000),
        seedKey: technicalKey
      },
      update: {}
    });
    if (index % 3 === 0) {
      const disciplinaryKey = `seed-disciplinary-${student.registrationNumber}`;
      await prisma.studentNote.upsert({
        where: { seedKey: disciplinaryKey },
        create: {
          studentId: student.id,
          teacherId: teacherProfile.id,
          type: "DISCIPLINARY",
          content: disciplinaryNotes[index % disciplinaryNotes.length],
          recordedAt: new Date(Date.now() - 2 * 86400000),
          seedKey: disciplinaryKey
        },
        update: {}
      });
    }
  }

  // Twelve lessons per class make attendance rates and ranking meaningful.
  for (const [classIndex, classroom] of [classA, classB].entries()) {
    const classStudents = orderedStudents.slice(classIndex * 10, classIndex * 10 + 10);
    for (let lessonIndex = 0; lessonIndex < 12; lessonIndex++) {
      const date = new Date();
      date.setDate(date.getDate() - (11 - lessonIndex) * 3);
      const topic = lessonTopics[lessonIndex];
      const legacyTopic = `Aula ${lessonIndex + 1}`;
      let lesson = await prisma.lesson.findFirst({ where: { classId: classroom.id, topic: { in: [topic, legacyTopic] } } });
      if (lesson && lesson.topic !== topic) {
        lesson = await prisma.lesson.update({ where: { id: lesson.id }, data: { topic } });
      }
      if (!lesson) {
        lesson = await prisma.lesson.create({ data: { classId: classroom.id, date, topic, duration: 120 } });
      }
      for (const [studentIndex, student] of classStudents.entries()) {
        if (!student) continue;
        const globalIndex = classIndex * 10 + studentIndex;
        const absenceCount = globalIndex % 5;
        const absent = ((lessonIndex * 7 + globalIndex * 3) % 12) < absenceCount;
        await prisma.attendance.upsert({
          where: { lessonId_studentId: { lessonId: lesson.id, studentId: student.id } },
          create: { lessonId: lesson.id, studentId: student.id, status: absent ? "ABSENT" : "PRESENT", checkedAt: lesson.date },
          update: {}
        });
      }
    }
  }

  console.log("SEED: teacher created -> email:", teacherEmail, ", password:", teacherPlainPassword);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
