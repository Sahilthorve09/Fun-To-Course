import { Timestamp } from 'firebase/firestore';

export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  imageUrl: string;
  level: string;
  rating: number;
  students: number;
  progress?: number;
  lastAccessed?: string;
  enrolledAt?: Timestamp;
  instructor?: string;
  syllabus?: {
    title: string;
    duration: string;
    topics: string[];
  }[];
  learningOutcomes?: string[];
  prerequisites?: string[];
} 