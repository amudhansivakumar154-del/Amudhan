
import { Question, QuestionSubject, UserRole, User } from './types';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Dr. Sarah Admin', role: UserRole.ADMIN, email: 'admin@eduquest.ai' },
  { id: '2', name: 'Principal Miller', role: UserRole.PRINCIPAL, email: 'principal@highschool.edu' },
  { id: '3', name: 'Mr. Sharma (Physics)', role: UserRole.TEACHER, email: 'sharma@highschool.edu' },
  { id: '4', name: 'Alice Johnson', role: UserRole.STUDENT, email: 'alice@student.edu' },
];

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q1',
    subject: QuestionSubject.PHYSICS,
    topic: 'Mechanics',
    difficulty: 'Medium',
    question: 'A ball is thrown vertically upwards. What is its velocity at the highest point?',
    options: ['9.8 m/s', '0 m/s', 'Infinite', 'Depends on mass'],
    correctAnswer: 1,
    explanation: 'At the maximum height, the instantaneous velocity of an object thrown vertically upward is zero.'
  },
  {
    id: 'q2',
    subject: QuestionSubject.BIOLOGY,
    topic: 'Genetics',
    difficulty: 'Hard',
    question: 'Which of the following describes the phenotype of an organism?',
    options: ['Genetic makeup', 'Physical appearance', 'Total number of genes', 'Environmental impact'],
    correctAnswer: 1,
    explanation: 'Phenotype refers to the observable physical properties of an organism.'
  },
  {
    id: 'q3',
    subject: QuestionSubject.CHEMISTRY,
    topic: 'Atomic Structure',
    difficulty: 'Easy',
    question: 'Which subatomic particle has a negative charge?',
    options: ['Proton', 'Neutron', 'Electron', 'Positron'],
    correctAnswer: 2,
    explanation: 'Electrons are subatomic particles with a negative charge.'
  },
  {
    id: 'q4',
    subject: QuestionSubject.MATHEMATICS,
    topic: 'Calculus',
    difficulty: 'Hard',
    question: 'What is the derivative of sin(x) with respect to x?',
    options: ['cos(x)', '-cos(x)', 'tan(x)', 'sin(x)'],
    correctAnswer: 0,
    explanation: 'The derivative of the sine function is the cosine function.'
  }
];
