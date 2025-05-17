import React, { useEffect, useState, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, Spinner, Center, Flex } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CourseCatalog from './components/CourseCatalog'
import ReadingLog from './components/ReadingLog'
import NoteEditor from './components/NoteEditor'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Subscription from './pages/Subscription'
import Payment from './pages/Payment'
import ProfilePage from './pages/ProfilePage'
import Dashboard from './pages/Dashboard'
import { useAuth } from './contexts/AuthContext'
import EnrollmentProvider from './contexts/EnrollmentContext'
import CourseContent from './components/CourseContent'
import Flashcards from './components/Flashcards'
import Quiz from './components/Quiz'
import HabitTracker from './components/HabitTracker'
import AdaptiveQuiz from './components/AdaptiveQuiz'
import VideoPlayer from './components/VideoPlayer'
import LessonTimeline from './components/LessonTimeline'
import SpacedRepetition from './components/SpacedRepetition'
import AdminCourses from './pages/AdminCourses'

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth()
  return currentUser ? <>{children}</> : <Navigate to="/signin" />
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { currentUser } = useAuth()

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="gray.500" />
      </Center>
    )
  }

  return (
    <EnrollmentProvider>
      <Flex minH="100vh" direction="column" bg="gray.50">
        <Navbar />
        <Box pt="64px" flex="1">
          <Suspense fallback={
            <Center h="100vh">
              <Spinner size="xl" />
            </Center>
          }>
            <Routes>
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route path="/courses" element={<CourseCatalog />} />
              <Route 
                path="/signin" 
                element={currentUser ? <Navigate to="/" replace /> : <SignIn />} 
              />
              <Route 
                path="/signup" 
                element={currentUser ? <Navigate to="/" replace /> : <SignUp />} 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/subscription" 
                element={
                  <PrivateRoute>
                    <Subscription />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/payment" 
                element={
                  <PrivateRoute>
                    <Payment />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/course/:courseId" 
                element={
                  <PrivateRoute>
                    <CourseContent />
                  </PrivateRoute>
                } 
              />
              
              {/* Learning Tools Routes */}
              <Route
                path="/flashcards"
                element={
                  <PrivateRoute>
                    <Flashcards />
                  </PrivateRoute>
                }
              />
              <Route
                path="/quiz"
                element={
                  <PrivateRoute>
                    <Quiz />
                  </PrivateRoute>
                }
              />
              <Route
                path="/habits"
                element={
                  <PrivateRoute>
                    <HabitTracker />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reading-log"
                element={
                  <PrivateRoute>
                    <ReadingLog />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <PrivateRoute>
                    <NoteEditor />
                  </PrivateRoute>
                }
              />
              <Route
                path="/adaptive-quiz"
                element={
                  <PrivateRoute>
                    <AdaptiveQuiz />
                  </PrivateRoute>
                }
              />
              <Route
                path="/video-player"
                element={
                  <PrivateRoute>
                    <VideoPlayer />
                  </PrivateRoute>
                }
              />
              <Route
                path="/timeline"
                element={
                  <PrivateRoute>
                    <LessonTimeline />
                  </PrivateRoute>
                }
              />
              <Route
                path="/spaced-repetition"
                element={
                  <PrivateRoute>
                    <SpacedRepetition />
                  </PrivateRoute>
                }
              />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Box>
        <Footer />
      </Flex>
    </EnrollmentProvider>
  )
}

export default App