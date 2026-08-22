/** Shape of a goal card. The content itself is server-side (api/_data). */
export type GoalCard = {
  title: string;
  category: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: { label: string; color: string };
  people: string[];
  progress?: { done: number; total: number; percent: number };
  dueDays?: number;
};
