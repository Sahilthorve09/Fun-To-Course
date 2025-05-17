import React, { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  Text,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Divider,
  Progress,
  Button,
  HStack,
  Badge,
  Heading,
  Collapse,
  useDisclosure,
  IconButton,
  Tooltip
} from '@chakra-ui/react'
import { FaCheckCircle, FaCircle, FaClock, FaChevronDown, FaChevronUp, FaLock, FaUnlock } from 'react-icons/fa'

interface Lesson {
  id: number
  title: string
  description: string
  completed: boolean
  duration: number // in minutes
  locked: boolean
}

const initialLessons: Lesson[] = [
  {
    id: 1,
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming concepts and thinking like a programmer.',
    completed: true,
    duration: 30,
    locked: false
  },
  {
    id: 2,
    title: 'Variables and Data Types',
    description: 'Understanding different types of data and how to store them in variables.',
    completed: true,
    duration: 45,
    locked: false
  },
  {
    id: 3,
    title: 'Control Flow',
    description: 'Learn about conditional statements and loops to control program flow.',
    completed: false,
    duration: 60,
    locked: false
  },
  {
    id: 4,
    title: 'Functions and Methods',
    description: 'Write reusable code using functions and understand method concepts.',
    completed: false,
    duration: 75,
    locked: true
  },
  {
    id: 5,
    title: 'Object-Oriented Programming',
    description: 'Master the principles of object-oriented programming.',
    completed: false,
    duration: 90,
    locked: true
  }
]

const LessonTimeline: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons)
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null)
  
  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBgColor = useColorModeValue('gray.50', 'gray.600')

  const completedLessons = lessons.filter(lesson => lesson.completed).length
  const progress = (completedLessons / lessons.length) * 100
  const totalDuration = lessons.reduce((acc, lesson) => acc + lesson.duration, 0)
  const completedDuration = lessons
    .filter(lesson => lesson.completed)
    .reduce((acc, lesson) => acc + lesson.duration, 0)

  const toggleLesson = (lessonId: number) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId)
  }

  const markAsCompleted = (lessonId: number) => {
    setLessons(lessons.map(lesson =>
      lesson.id === lessonId
        ? { ...lesson, completed: !lesson.completed }
        : lesson
    ))
  }

  const unlockLesson = (lessonId: number) => {
    setLessons(lessons.map(lesson =>
      lesson.id === lessonId
        ? { ...lesson, locked: false }
        : lesson
    ))
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Learning Path</Heading>
          <Text color="gray.600">Track your progress through the course</Text>
        </Box>

        <Box
          bg={bgColor}
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          shadow="md"
        >
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="medium">Overall Progress</Text>
              <Text>{completedLessons} of {lessons.length} completed</Text>
            </HStack>
            <Progress value={progress} size="sm" colorScheme="green" borderRadius="full" />
            
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">
                Total Time: {totalDuration} minutes
              </Text>
              <Text fontSize="sm" color="gray.500">
                Completed: {completedDuration} minutes
              </Text>
            </HStack>
          </VStack>
        </Box>

        <List spacing={4}>
          {lessons.map((lesson, index) => (
            <Box
              key={lesson.id}
              bg={bgColor}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
              overflow="hidden"
              transition="all 0.2s"
              _hover={{ bg: hoverBgColor }}
            >
              <ListItem p={4}>
                <HStack justify="space-between">
                  <HStack flex={1}>
                    <ListIcon
                      as={lesson.completed ? FaCheckCircle : FaCircle}
                      color={lesson.completed ? 'green.500' : 'gray.400'}
                      boxSize={5}
                    />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="lg" fontWeight="medium">
                        {lesson.title}
                      </Text>
                      <HStack>
                        <Badge colorScheme={lesson.locked ? 'red' : 'green'}>
                          {lesson.locked ? 'Locked' : 'Available'}
                        </Badge>
                        <HStack spacing={1} color="gray.500">
                          <FaClock />
                          <Text fontSize="sm">{lesson.duration} min</Text>
                        </HStack>
                      </HStack>
                    </VStack>
                  </HStack>

                  <HStack>
                    {lesson.locked ? (
                      <Tooltip label="Complete previous lessons to unlock">
                        <IconButton
                          aria-label="Unlock lesson"
                          icon={<FaLock />}
                          size="sm"
                          onClick={() => unlockLesson(lesson.id)}
                          isDisabled={index > 0 && !lessons[index - 1].completed}
                        />
                      </Tooltip>
                    ) : (
                      <Button
                        size="sm"
                        colorScheme={lesson.completed ? 'green' : 'gray'}
                        onClick={() => markAsCompleted(lesson.id)}
                      >
                        {lesson.completed ? 'Completed' : 'Mark Complete'}
                      </Button>
                    )}
                    <IconButton
                      aria-label="Toggle lesson details"
                      icon={expandedLesson === lesson.id ? <FaChevronUp /> : <FaChevronDown />}
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleLesson(lesson.id)}
                    />
                  </HStack>
                </HStack>

                <Collapse in={expandedLesson === lesson.id}>
                  <Box pt={4}>
                    <Text color="gray.600">{lesson.description}</Text>
                  </Box>
                </Collapse>
              </ListItem>
            </Box>
          ))}
        </List>
      </VStack>
    </Container>
  )
}

export default LessonTimeline