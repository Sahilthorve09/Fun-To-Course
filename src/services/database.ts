import { db } from '../config/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  Timestamp,
  addDoc,
  deleteDoc
} from 'firebase/firestore';

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
  syllabus?: Array<{
    title: string;
    duration: string;
    topics: string[];
  }>;
  learningOutcomes?: string[];
  prerequisites?: string[];
}

interface UserCourse extends Course {
  progress: number;
  lastAccessed: string;
  enrolledAt: Timestamp;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  enrolledCourses: UserCourse[];
  paymentHistory: PaymentRecord[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface PaymentRecord {
  id: string;
  courseId: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  transactionId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Course Operations
export const createCourse = async (courseData: Course) => {
  try {
    await setDoc(doc(db, 'courses', courseData.id.toString()), courseData);
    return courseData;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const getCourse = async (courseId: number) => {
  try {
    const courseDoc = await getDoc(doc(db, 'courses', courseId.toString()));
    return courseDoc.exists() ? courseDoc.data() as Course : null;
  } catch (error) {
    console.error('Error getting course:', error);
    throw error;
  }
};

export const getAllCourses = async () => {
  try {
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    return coursesSnapshot.docs.map(doc => doc.data() as Course);
  } catch (error) {
    console.error('Error getting all courses:', error);
    throw error;
  }
};

// User Operations
export const createUserProfile = async (uid: string, email: string): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  const now = Timestamp.now();
  
  const newProfile: UserProfile = {
    uid,
    email,
    enrolledCourses: [],
    paymentHistory: [],
    createdAt: now,
    updatedAt: now
  };

  await setDoc(userRef, newProfile);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

export const enrollUserInCourse = async (uid: string, course: Course): Promise<Course> => {
  const userRef = doc(db, 'users', uid);
  const now = Timestamp.now();
  
  const enrolledCourse = {
    ...course,
    progress: 0,
    enrolledAt: now,
    lastAccessed: now.toDate().toLocaleDateString()
  };

  await updateDoc(userRef, {
    enrolledCourses: [...(await getUserProfile(uid))?.enrolledCourses || [], enrolledCourse],
    updatedAt: now
  });

  return enrolledCourse;
};

export const updateCourseProgress = async (uid: string, courseId: number, progress: number): Promise<Course | null> => {
  const userProfile = await getUserProfile(uid);
  if (!userProfile) return null;

  const updatedCourses = userProfile.enrolledCourses.map(course => {
    if (course.id === courseId) {
      return {
        ...course,
        progress,
        lastAccessed: new Date().toLocaleDateString()
      };
    }
    return course;
  });

  await updateDoc(doc(db, 'users', uid), {
    enrolledCourses: updatedCourses,
    updatedAt: Timestamp.now()
  });

  return updatedCourses.find(course => course.id === courseId) || null;
};

// Payment Functions
export const createPaymentRecord = async (uid: string, payment: Omit<PaymentRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentRecord> => {
  const paymentsRef = collection(db, 'users', uid, 'payments');
  const now = Timestamp.now();
  
  const newPayment: Omit<PaymentRecord, 'id'> = {
    ...payment,
    createdAt: now,
    updatedAt: now
  };
  
  const paymentDoc = await addDoc(paymentsRef, newPayment);
  return {
    id: paymentDoc.id,
    ...newPayment
  };
};

export const updatePaymentStatus = async (uid: string, paymentId: string, status: PaymentRecord['status'], transactionId?: string): Promise<void> => {
  const paymentRef = doc(db, 'users', uid, 'payments', paymentId);
  await updateDoc(paymentRef, {
    status,
    transactionId,
    updatedAt: Timestamp.now()
  });
};

// Initialize sample courses
export const initializeSampleCourses = async () => {
  const sampleCourses: Course[] = [
    {
      id: 1,
      title: 'Complete JavaScript Course',
      description: 'Master modern JavaScript from the basics to advanced topics with practical projects.',
      price: 499,
      duration: '8 weeks',
      category: 'Web Development',
      imageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80',
      level: 'Beginner',
      rating: 4.8,
      students: 1500,
      syllabus: [
        {
          title: 'JavaScript Fundamentals',
          duration: '2 weeks',
          topics: ['Variables', 'Data Types', 'Functions', 'Objects', 'Arrays']
        },
        {
          title: 'DOM Manipulation',
          duration: '2 weeks',
          topics: ['Selectors', 'Events', 'DOM Methods', 'Event Handling']
        }
      ],
      learningOutcomes: [
        'Understand JavaScript fundamentals',
        'Build interactive web applications',
        'Work with modern JavaScript features',
        'Debug JavaScript applications'
      ],
      prerequisites: [
        'Basic HTML and CSS knowledge',
        'No prior JavaScript experience required'
      ]
    },
    {
      id: 2,
      title: 'Full Stack Web Development',
      description: 'Learn to build complete web applications with modern technologies.',
      price: 799,
      duration: '12 weeks',
      category: 'Web Development',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      level: 'Intermediate',
      rating: 4.9,
      students: 1200,
      syllabus: [
        {
          title: 'Frontend Development',
          duration: '4 weeks',
          topics: ['React', 'Redux', 'TypeScript', 'Responsive Design']
        },
        {
          title: 'Backend Development',
          duration: '4 weeks',
          topics: ['Node.js', 'Express', 'MongoDB', 'REST APIs']
        }
      ],
      learningOutcomes: [
        'Build full-stack web applications',
        'Work with modern frameworks',
        'Implement authentication and authorization',
        'Deploy applications to production'
      ],
      prerequisites: [
        'JavaScript fundamentals',
        'Basic understanding of web development',
        'HTML and CSS knowledge'
      ]
    },
    {
      id: 3,
      title: 'Data Science Fundamentals',
      description: 'Get started with data science using Python and popular libraries.',
      price: 699,
      duration: '10 weeks',
      category: 'Data Science',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      level: 'Beginner',
      rating: 4.7,
      students: 800,
      syllabus: [
        {
          title: 'Python for Data Science',
          duration: '3 weeks',
          topics: ['Python Basics', 'NumPy', 'Pandas', 'Data Visualization']
        },
        {
          title: 'Machine Learning Basics',
          duration: '3 weeks',
          topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation']
        }
      ],
      learningOutcomes: [
        'Work with Python for data analysis',
        'Perform data visualization',
        'Build basic machine learning models',
        'Understand statistical concepts'
      ],
      prerequisites: [
        'Basic programming knowledge',
        'Understanding of mathematics',
        'No prior Python experience required'
      ]
    },
    {
      id: 4,
      title: 'UI/UX Design Masterclass',
      description: 'Learn to create beautiful and user-friendly interfaces with modern design principles.',
      price: 599,
      duration: '8 weeks',
      category: 'UI/UX Design',
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
      level: 'Beginner',
      rating: 4.9,
      students: 950,
      syllabus: [
        {
          title: 'Design Fundamentals',
          duration: '2 weeks',
          topics: ['Color Theory', 'Typography', 'Layout Principles', 'Design Systems']
        },
        {
          title: 'User Experience',
          duration: '3 weeks',
          topics: ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing']
        }
      ],
      learningOutcomes: [
        'Create user-centered designs',
        'Build effective design systems',
        'Conduct user research',
        'Create interactive prototypes'
      ],
      prerequisites: [
        'No prior design experience required',
        'Basic computer skills'
      ]
    },
    {
      id: 5,
      title: 'Mobile App Development with React Native',
      description: 'Build cross-platform mobile applications using React Native and modern tools.',
      price: 899,
      duration: '10 weeks',
      category: 'Mobile Development',
      imageUrl: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=800&q=80',
      level: 'Intermediate',
      rating: 4.8,
      students: 750,
      syllabus: [
        {
          title: 'React Native Basics',
          duration: '3 weeks',
          topics: ['Components', 'Navigation', 'State Management', 'Native Modules']
        },
        {
          title: 'Advanced Features',
          duration: '3 weeks',
          topics: ['API Integration', 'Push Notifications', 'App Store Deployment']
        }
      ],
      learningOutcomes: [
        'Build native mobile apps',
        'Implement complex UI features',
        'Handle device features',
        'Deploy to app stores'
      ],
      prerequisites: [
        'React.js knowledge',
        'JavaScript fundamentals',
        'Basic mobile development concepts'
      ]
    },
    {
      id: 6,
      title: 'Cloud Computing with AWS',
      description: 'Master cloud computing concepts and AWS services for modern applications.',
      price: 999,
      duration: '12 weeks',
      category: 'Cloud Computing',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      level: 'Advanced',
      rating: 4.9,
      students: 600,
      syllabus: [
        {
          title: 'AWS Fundamentals',
          duration: '4 weeks',
          topics: ['EC2', 'S3', 'RDS', 'Lambda']
        },
        {
          title: 'Advanced Services',
          duration: '4 weeks',
          topics: ['CloudFormation', 'ECS', 'API Gateway', 'CloudWatch']
        }
      ],
      learningOutcomes: [
        'Design cloud architectures',
        'Implement serverless applications',
        'Manage cloud infrastructure',
        'Optimize cloud costs'
      ],
      prerequisites: [
        'Basic cloud computing knowledge',
        'Linux fundamentals',
        'Basic networking concepts'
      ]
    },
    {
      id: 7,
      title: 'Cybersecurity Fundamentals',
      description: 'Learn essential cybersecurity concepts and practical defense techniques.',
      price: 799,
      duration: '10 weeks',
      category: 'Cybersecurity',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      level: 'Intermediate',
      rating: 4.7,
      students: 450,
      syllabus: [
        {
          title: 'Security Basics',
          duration: '3 weeks',
          topics: ['Network Security', 'Cryptography', 'Security Protocols']
        },
        {
          title: 'Threat Defense',
          duration: '3 weeks',
          topics: ['Penetration Testing', 'Incident Response', 'Security Tools']
        }
      ],
      learningOutcomes: [
        'Understand security principles',
        'Implement security measures',
        'Detect and prevent threats',
        'Handle security incidents'
      ],
      prerequisites: [
        'Networking fundamentals',
        'Basic programming knowledge',
        'System administration basics'
      ]
    }
  ];

  try {
    for (const course of sampleCourses) {
      await setDoc(doc(db, 'courses', course.id.toString()), course);
    }
    console.log('Sample courses initialized successfully');
  } catch (error) {
    console.error('Error initializing sample courses:', error);
    throw error;
  }
};

export const clearAndInitializeCourses = async () => {
  try {
    // Get all existing courses
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    
    // Delete all existing courses
    const deletePromises = coursesSnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    await Promise.all(deletePromises);

    // Initialize new courses
    await initializeSampleCourses();
    
    console.log('Courses reinitialized successfully');
  } catch (error) {
    console.error('Error reinitializing courses:', error);
    throw error;
  }
}; 