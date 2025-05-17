import { useState } from 'react'
import { Box, Checkbox, Progress, Text, VStack, HStack, Button } from '@chakra-ui/react'
import { format } from 'date-fns'

interface Habit {
  id: number
  name: string
  completed: boolean
}

const initialHabits: Habit[] = [
  { id: 1, name: "Study for 2 hours", completed: false },
  { id: 2, name: "Complete 3 practice problems", completed: false },
  { id: 3, name: "Review notes", completed: false },
  { id: 4, name: "Watch educational video", completed: false },
  { id: 5, name: "Read a chapter", completed: false }
]

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [date] = useState(new Date())

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ))
  }

  const calculateProgress = () => {
    const completed = habits.filter(habit => habit.completed).length
    return (completed / habits.length) * 100
  }

  const resetHabits = () => {
    setHabits(initialHabits)
  }

  const progress = calculateProgress()

  return (
    <VStack spacing={6} py={8} align="stretch" maxW="600px" mx="auto">
      <HStack justify="space-between">
        <Text fontSize="2xl" fontWeight="bold">Daily Habits</Text>
        <Text>{format(date, 'MMMM d, yyyy')}</Text>
      </HStack>

      <Box borderRadius="lg" bg="white" p={6} shadow="sm">
        <VStack spacing={4} align="stretch">
          {habits.map(habit => (
            <Checkbox
              key={habit.id}
              isChecked={habit.completed}
              onChange={() => toggleHabit(habit.id)}
              size="lg"
            >
              <Text fontSize="lg">{habit.name}</Text>
            </Checkbox>
          ))}
        </VStack>
      </Box>

      <Box>
        <Text mb={2}>Daily Progress</Text>
        <Progress
          value={progress}
          colorScheme={progress === 100 ? "green" : "blue"}
          borderRadius="full"
          size="lg"
        />
        <Text mt={2} textAlign="right" color={progress === 100 ? "green.500" : "gray.600"}>
          {progress.toFixed(0)}% Complete
        </Text>
      </Box>

      <Button colorScheme="gray" onClick={resetHabits}>
        Reset All
      </Button>
    </VStack>
  )
}

export default HabitTracker