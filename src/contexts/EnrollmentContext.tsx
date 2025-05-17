import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserProfile, enrollUserInCourse, updateCourseProgress as updateProgress } from '../services/database';
import { Timestamp } from 'firebase/firestore';

interface Course {
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
}

interface EnrollmentContextType {
  enrolledCourses: Course[];
  addEnrolledCourse: (course: Course) => Promise<void>;
  updateCourseProgress: (courseId: number, progress: number) => Promise<void>;
  loading: boolean;
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

export const useEnrollment = () => {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollment must be used within an EnrollmentProvider');
  }
  return context;
};

export const EnrollmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load enrolled courses from Firestore when component mounts or user changes
  useEffect(() => {
    const loadEnrolledCourses = async () => {
      if (currentUser) {
        try {
          const userProfile = await getUserProfile(currentUser.uid);
          if (userProfile) {
            setEnrolledCourses(userProfile.enrolledCourses);
          }
        } catch (error) {
          console.error('Error loading enrolled courses:', error);
        }
      } else {
        setEnrolledCourses([]);
      }
      setLoading(false);
    };

    loadEnrolledCourses();
  }, [currentUser]);

  const addEnrolledCourse = async (course: Course) => {
    if (!currentUser) return;
    
    try {
      const enrolledCourse = await enrollUserInCourse(currentUser.uid, course);
      setEnrolledCourses(prev => [...prev, enrolledCourse]);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  };

  const updateCourseProgress = async (courseId: number, progress: number) => {
    if (!currentUser) return;

    try {
      const updatedCourse = await updateProgress(currentUser.uid, courseId, progress);
      if (updatedCourse) {
        setEnrolledCourses(prev =>
          prev.map(course =>
            course.id === courseId ? { ...course, ...updatedCourse } : course
          )
        );
      }
    } catch (error) {
      console.error('Error updating course progress:', error);
      throw error;
    }
  };

  return (
    <EnrollmentContext.Provider value={{ enrolledCourses, addEnrolledCourse, updateCourseProgress, loading }}>
      {children}
    </EnrollmentContext.Provider>
  );
};

export default EnrollmentProvider; 