import { useState } from 'react'
import { Box, Button, Radio, RadioGroup, Stack, Text, VStack, Progress } from '@chakra-ui/react'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the virtual DOM in React?",
    options: [
      "A direct copy of the actual DOM",
      "A lightweight copy of the actual DOM",
      "A programming concept",
      "A browser feature"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "What are React hooks used for?",
    options: [
      "Styling components",
      "Managing state and side effects in functional components",
      "Creating class components",
      "Handling routing"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What is JSX?",
    options: [
      "A JavaScript engine",
      "A database query language",
      "A syntax extension for JavaScript",
      "A testing framework"
    ],
    correctAnswer: 2
  }
]

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [value, setValue] = useState<string>('')

  const handleAnswer = (value: string) => {
    setValue(value)
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: parseInt(value)
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setValue(answers[questions[currentQuestion + 1]?.id]?.toString() || '')
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++
      }
    })
    return (correct / questions.length) * 100
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setValue('')
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <VStack spacing={6} py={8}>
        <Text fontSize="2xl" fontWeight="bold">Quiz Results</Text>
        <Box w="100%" maxW="400px">
          <Progress value={score} colorScheme={score >= 70 ? "green" : "red"} />
        </Box>
        <Text fontSize="xl">Your score: {score.toFixed(0)}%</Text>
        <Button colorScheme="blue" onClick={handleRetry}>
          Try Again
        </Button>
      </VStack>
    )
  }

  return (
    <VStack spacing={8} py={8} align="stretch" maxW="600px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold">
        Question {currentQuestion + 1} of {questions.length}
      </Text>
      <Text fontSize="xl">{questions[currentQuestion].question}</Text>
      
      <RadioGroup onChange={handleAnswer} value={value}>
        <Stack spacing={4}>
          {questions[currentQuestion].options.map((option, index) => (
            <Radio key={index} value={index.toString()}>
              {option}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>

      <Button
        colorScheme="blue"
        onClick={handleNext}
        isDisabled={!value}
      >
        {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
      </Button>
    </VStack>
  )
}

export default Quiz