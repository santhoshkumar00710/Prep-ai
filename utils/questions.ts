import { InterviewQuestion } from '@/types/interview';

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // Behavioral
  { id: 'b1', category: 'behavioral', question: 'Tell me about yourself and your professional background.', hint: 'Listening for: clarity, structure, and confidence.' },
  { id: 'b2', category: 'behavioral', question: 'Can you describe a time when you had to balance competing stakeholder priorities while maintaining technical integrity?', hint: 'Listening for: prioritization framework, communication, and compromise.' },
  { id: 'b3', category: 'behavioral', question: 'Tell me about a time you failed. What did you learn from it?', hint: 'Listening for: accountability, growth mindset, and self-awareness.' },
  { id: 'b4', category: 'behavioral', question: 'Describe a situation where you had to lead a team through a difficult challenge.', hint: 'Listening for: leadership style, empathy, and results.' },
  { id: 'b5', category: 'behavioral', question: 'How do you handle disagreements with your manager or teammates?', hint: 'Listening for: communication skills, professionalism, and conflict resolution.' },
  { id: 'b6', category: 'behavioral', question: 'Tell me about your greatest professional achievement.', hint: 'Listening for: impact, ownership, and measurable results.' },
  { id: 'b7', category: 'behavioral', question: 'How do you prioritize tasks when everything seems urgent?', hint: 'Listening for: time management, decisiveness, and frameworks.' },
  { id: 'b8', category: 'behavioral', question: 'Describe a time you had to adapt quickly to a major change at work.', hint: 'Listening for: adaptability, resilience, and attitude.' },
  // Technical
  { id: 't1', category: 'technical', question: 'How would you design a scalable real-time notification system?', hint: 'Listening for: system design, scalability thinking, and trade-offs.' },
  { id: 't2', category: 'technical', question: 'Explain the difference between SQL and NoSQL databases. When would you use each?', hint: 'Listening for: technical depth and situational judgment.' },
  { id: 't3', category: 'technical', question: 'What is your approach to code reviews, and what do you look for?', hint: 'Listening for: quality standards, mentorship, and collaboration.' },
  { id: 't4', category: 'technical', question: 'How do you ensure the security of a web application?', hint: 'Listening for: security awareness, OWASP principles, and best practices.' },
  { id: 't5', category: 'technical', question: 'Describe your experience with CI/CD pipelines.', hint: 'Listening for: DevOps knowledge and automation mindset.' },
  // Situational
  { id: 's1', category: 'situational', question: 'If you joined a team with significant technical debt, how would you approach it?', hint: 'Listening for: strategy, pragmatism, and communication.' },
  { id: 's2', category: 'situational', question: 'How would you handle a critical production bug discovered 30 minutes before a major release?', hint: 'Listening for: crisis management, composure, and decision-making.' },
  { id: 's3', category: 'situational', question: 'A key team member leaves right before a major deadline. What do you do?', hint: 'Listening for: leadership, resourcefulness, and stakeholder management.' },
];

export function getRandomQuestion(usedIds: string[] = []): InterviewQuestion {
  const available = INTERVIEW_QUESTIONS.filter(q => !usedIds.includes(q.id));
  const pool = available.length > 0 ? available : INTERVIEW_QUESTIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}
