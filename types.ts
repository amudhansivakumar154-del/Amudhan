
export enum UserRole {
  ADMIN = 'ADMIN',
  PRINCIPAL = 'PRINCIPAL',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export enum TestType {
  NEET = 'NEET',
  SCHOOL = 'SCHOOL',
  BOARDS = 'BOARDS'
}

export enum QuestionSubject {
  BIOLOGY = 'Biology',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  MATHEMATICS = 'Mathematics',
  ENGLISH = 'English',
  GENERAL = 'General'
}

export interface Question {
  id: string;
  subject: QuestionSubject;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctAnswer: number; // Index of options
  explanation: string;
}

export interface Test {
  id: string;
  title: string;
  type: TestType;
  questions: Question[];
  durationMinutes: number;
  totalMarks: number;
  createdAt: string;
}

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  score: number;
  maxScore: number;
  subjectBreakdown: Record<string, number>;
  timestamp: string;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}
