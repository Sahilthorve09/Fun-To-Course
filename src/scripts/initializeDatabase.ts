import { db } from '../config/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

const sampleCourses = [
  {
    id: 1,
    title: 'Advanced JavaScript Mastery',
    description: 'Master modern JavaScript concepts and best practices',
    price: 499,
    duration: '8 weeks',
    category: 'Programming',
    imageUrl: 'https://example.com/js-course.jpg',
    level: 'Advanced',
    rating: 4.8,
    students: 1200
  },
  {
    id: 2,
    title: 'Full Stack Web Development',
    description: 'Learn to build complete web applications from scratch',
    price: 699,
    duration: '12 weeks',
    category: 'Web Development',
    imageUrl: 'https://example.com/fullstack-course.jpg',
    level: 'Intermediate',
    rating: 4.9,
    students: 2500
  },
  {
    id: 3,
    title: 'Data Science Fundamentals',
    description: 'Introduction to data science and machine learning',
    price: 599,
    duration: '10 weeks',
    category: 'Data Science',
    imageUrl: 'https://example.com/data-science-course.jpg',
    level: 'Beginner',
    rating: 4.7,
    students: 1800
  }
];

const initializeDatabase = async () => {
  try {
    // Initialize courses collection
    for (const course of sampleCourses) {
      await setDoc(doc(db, 'courses', course.id.toString()), course);
      console.log(`Added course: ${course.title}`);
    }
    
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Run the initialization
initializeDatabase(); 