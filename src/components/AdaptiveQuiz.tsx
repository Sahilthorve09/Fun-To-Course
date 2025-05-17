import { useState } from 'react'
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  Progress,
  Badge,
  useToast,
  HStack,
  Container,
  Heading
} from '@chakra-ui/react'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  difficulty: 'easy' | 'medium' | 'hard'
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is React?",
    options: [
      "A JavaScript library for building user interfaces",
      "A database management system",
      "A programming language",
      "An operating system"
    ],
    correctAnswer: 0,
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "What is the virtual DOM?",
    options: [
      "A direct copy of the actual DOM",
      "A lightweight copy of the actual DOM",
      "A browser feature",
      "A programming language"
    ],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 3,
    question: "What are React hooks used for?",
    options: [
      "Styling components",
      "Managing state and side effects",
      "Creating class components",
      "Handling routing"
    ],
    correctAnswer: 1,
    difficulty: 'hard'
  }
]

const AdaptiveQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userLevel, setUserLevel] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showResults, setShowResults] = useState(false)
  const toast = useToast()

  const filteredQuestions = questions.filter(q => q.difficulty === userLevel)

  const handleAnswer = (value: string) => {
    setSelectedAnswer(value)
    setAnswers({
      ...answers,
      [filteredQuestions[currentQuestion].id]: parseInt(value)
    })
  }

  const updateDifficulty = (correct: boolean) => {
    if (correct && userLevel !== 'hard') {
      if (score >= 2) {
        setUserLevel(userLevel === 'easy' ? 'medium' : 'hard')
        setScore(0)
        toast({
          title: 'Level Up!',
          description: `Moving to ${userLevel === 'easy' ? 'medium' : 'hard'} difficulty`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      } else {
        setScore(score + 1)
      }
    } else if (!correct) {
      if (userLevel !== 'easy' && score <= -2) {
        setUserLevel(userLevel === 'hard' ? 'medium' : 'easy')
        setScore(0)
        toast({
          title: 'Level Adjusted',
          description: `Moving to ${userLevel === 'hard' ? 'medium' : 'easy'} difficulty`,
          status: 'info',
          duration: 2000,
          isClosable: true,
        })
      } else {
        setScore(score - 1)
      }
    }
  }

  const handleNext = () => {
    const currentQ = filteredQuestions[currentQuestion]
    const isCorrect = parseInt(selectedAnswer) === currentQ.correctAnswer
    
    updateDifficulty(isCorrect)

    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
    } else {
      setShowResults(true)
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setSelectedAnswer('')
    setUserLevel('easy')
    setScore(0)
  }

  if (!filteredQuestions.length) {
    return (
      <Container maxW="container.md" py={8}>
        <VStack spacing={6}>
          <Heading size="lg">No questions available</Heading>
          <Button colorScheme="blue" onClick={handleRetry}>
            Start Over
          </Button>
        </VStack>
      </Container>
    )
  }

  if (showResults) {
    const correctAnswers = Object.entries(answers).filter(
      ([id, answer]) => 
        questions.find(q => q.id === parseInt(id))?.correctAnswer === answer
    ).length

    const percentage = (correctAnswers / Object.keys(answers).length) * 100

    return (
      <Container maxW="container.md" py={8}>
        <VStack spacing={6}>
          <Heading size="lg">Quiz Results</Heading>
          <Box w="100%">
            <Progress value={percentage} colorScheme={percentage >= 70 ? "green" : "red"} />
          </Box>
          <Text fontSize="xl">Score: {percentage.toFixed(0)}%</Text>
          <Text>Highest Level Reached: {userLevel}</Text>
          <Button colorScheme="blue" onClick={handleRetry}>
            Try Again
          </Button>
        </VStack>
      </Container>
    )
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Adaptive Quiz</Heading>
          <Badge colorScheme={
            userLevel === 'easy' ? 'green' :
            userLevel === 'medium' ? 'yellow' : 'red'
          } p={2} fontSize="md">
            {userLevel.toUpperCase()}
          </Badge>
        </HStack>

        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.200">
          <VStack spacing={6} align="stretch">
            <Text fontSize="xl" fontWeight="medium">
              {filteredQuestions[currentQuestion].question}
            </Text>

            <RadioGroup onChange={handleAnswer} value={selectedAnswer}>
              <Stack spacing={4}>
                {filteredQuestions[currentQuestion].options.map((option, index) => (
                  <Radio key={index} value={index.toString()}>
                    {option}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>

            <Button
              colorScheme="blue"
              onClick={handleNext}
              isDisabled={!selectedAnswer}
              width="full"
            >
              {currentQuestion === filteredQuestions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </VStack>
        </Box>

        <HStack justify="space-between">
          <Text>Question {currentQuestion + 1} of {filteredQuestions.length}</Text>
          <Text>Current Score: {score}</Text>
        </HStack>
      </VStack>
    </Container>
  )
}

export default AdaptiveQuiz