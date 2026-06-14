import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const LIKERT_OPTIONS = [
  { text: 'Strongly Disagree', value: 1 },
  { text: 'Disagree', value: 2 },
  { text: 'Neutral', value: 3 },
  { text: 'Agree', value: 4 },
  { text: 'Strongly Agree', value: 5 },
];

async function main() {
  // Idempotent: wipe in dependency order so re-running seed is safe.
  await prisma.evaluation.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.questionSection.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.evaluationPeriod.deleteMany();

  // Departments
  const [se, ne, ai] = await Promise.all([
    prisma.department.create({ data: { name: 'Software Engineering' } }),
    prisma.department.create({ data: { name: 'Network Engineering' } }),
    prisma.department.create({ data: { name: 'Artificial Intelligence' } }),
  ]);

  // Courses (each belongs to a department)
  const courseData = [
    { name: 'Introduction to Programming', courseCode: 'CS101', instructor: 'Al-Khwarizmi', courseCredits: 3, departmentId: se.id },
    { name: 'Data Structures and Algorithms', courseCode: 'CS202', instructor: 'Ibn al-Haytham', courseCredits: 4, departmentId: se.id },
    { name: 'Software Engineering', courseCode: 'CS505', instructor: 'Al-Biruni', courseCredits: 3, departmentId: se.id },
    { name: 'Database Management', courseCode: 'CS404', instructor: 'Ibn Sina', courseCredits: 4, departmentId: ne.id },
    { name: 'Operating Systems', courseCode: 'CS707', instructor: 'Ibn Rushd', courseCredits: 3, departmentId: ne.id },
    { name: 'Web Development', courseCode: 'CS303', instructor: 'Al-Farabi', courseCredits: 3, departmentId: ai.id },
    { name: 'Artificial Intelligence', courseCode: 'CS606', instructor: 'Jabir ibn Hayyan', courseCredits: 4, departmentId: ai.id },
  ];
  await prisma.course.createMany({ data: courseData });
  const courses = await prisma.course.findMany();
  const byDept = (deptId: number) => courses.filter((c) => c.departmentId === deptId);

  // Question sections + questions
  const sections = [
    {
      title: 'Evaluating the quality of content delivery',
      questions: [
        'Explanation of the course material is clear and understandable',
        'Course topics are clear and related to the course content',
        'Notes/presentations cover all course topics',
        'Course books/references (digital or physical) are reliable and up-to-date',
      ],
    },
    {
      title: 'Evaluating instructor interaction and teaching skills',
      questions: [
        'Introducing the course plan (learning objectives, content, and references)',
        'Introducing the assessment system and grade distribution',
        'The instructor delivers information clearly and answers student questions',
        'The instructor is available and responsive outside of class',
      ],
    },
  ];

  for (const [i, section] of sections.entries()) {
    await prisma.questionSection.create({
      data: {
        title: section.title,
        position: i,
        questions: {
          create: section.questions.map((text) => ({
            text,
            options: JSON.stringify(LIKERT_OPTIONS),
          })),
        },
      },
    });
  }

  // Admin
  const adminHash = await bcrypt.hash('password', 10);
  await prisma.user.create({
    data: { email: 'admin@eval.local', name: 'Administrator', role: 'admin', isApproved: true, passwordHash: adminHash },
  });

  // Students — enrolled by department curriculum (deterministic, not random)
  const studentHash = await bcrypt.hash('password', 10);
  const students = [
    { name: 'Omar Al-Farouq', email: 'omar@eval.local', studentId: '1001', dept: se, semester: 3, approved: true },
    { name: 'Layla Al-Hassan', email: 'layla@eval.local', studentId: '1002', dept: ne, semester: 5, approved: true },
    { name: 'Khalid Al-Sabah', email: 'khalid@eval.local', studentId: '1003', dept: ai, semester: 1, approved: true },
    { name: 'Aisha Al-Mansoori', email: 'aisha@eval.local', studentId: '1004', dept: se, semester: 7, approved: false },
    { name: 'Faisal Al-Nasser', email: 'faisal@eval.local', studentId: '1005', dept: ne, semester: 2, approved: true },
  ];

  for (const s of students) {
    const enrolledCourses = byDept(s.dept.id);
    await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        studentId: s.studentId,
        role: 'student',
        departmentId: s.dept.id,
        semester: s.semester,
        isApproved: s.approved,
        passwordHash: studentHash,
        enrollments: { create: enrolledCourses.map((c) => ({ courseId: c.id })) },
      },
    });
  }

  // Active evaluation period: open now (± 14 days)
  const now = new Date();
  await prisma.evaluationPeriod.create({
    data: {
      name: `Spring ${now.getFullYear()}`,
      startsAt: new Date(now.getTime() - 14 * 24 * 3600 * 1000),
      endsAt: new Date(now.getTime() + 14 * 24 * 3600 * 1000),
      message: 'Course evaluations are open. Please complete them before the deadline.',
    },
  });

  console.log('Seed complete: 3 departments, 7 courses, 2 sections, 1 admin, 5 students, 1 open period.');
  console.log('Login: admin@eval.local / password  ·  omar@eval.local / password');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
