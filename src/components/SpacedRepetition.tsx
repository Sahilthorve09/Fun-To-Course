import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  useColorModeValue,
  SimpleGrid
} from '@chakra-ui/react'
import { format, addDays } from 'date-fns'

interface Card {
  id: number
  front: string
  back: string
  level: number
  nextReview: Date
  lastReviewed: Date | null
}

const initialCards: Card[] = [
  {
    id: 1,
    front: "What is a closure in JavaScript?",
    back: "A function that has access to variables in its outer scope even after the outer function has returned",
    level: 0,
    nextReview: new Date(),
    lastReviewed: null
  },
  {
    id: 2,
    front: "Explain React's Virtual DOM",
    back: "A lightweight copy of the actual DOM that React uses to optimize rendering performance",
    level: 0,
    nextReview: new Date(),
    lastReviewed: null
  },
  {
    id: 3,
    front: "What is TypeScript?",
    back: "A typed superset of JavaScript that compiles to plain JavaScript",
    level: 0,
    nextReview: new Date(),
    lastReviewed: null
  }
]

const SpacedRepetition: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(initialCards)
  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [stats, setStats] = useState({
    mastered: 0,
    learning: 0,
    new: initialCards.length
  })

  const reviewIntervals = [1, 3, 7, 14, 30] // Days between reviews for each level

  useEffect(() => {
    updateCurrentCard()
  }, [])

  const updateCurrentCard = () => {
    const now = new Date()
    const dueCards = cards.filter(card => card.nextReview <= now)
    if (dueCards.length > 0) {
      setCurrentCard(dueCards[0])
    } else {
      setCurrentCard(null)
    }
  }

  const handleResponse = (remembered: boolean) => {
    if (!currentCard) return

    const updatedCard = { ...currentCard }
    const now = new Date()

    if (remembered) {
      updatedCard.level = Math.min(updatedCard.level + 1, reviewIntervals.length - 1)
    } else {
      updatedCard.level = Math.max(updatedCard.level - 1, 0)
    }

    updatedCard.lastReviewed = now
    updatedCard.nextReview = addDays(now, reviewIntervals[updatedCard.level])

    const updatedCards = cards.map(card =>
      card.id === currentCard.id ? updatedCard : card
    )

    setCards(updatedCards)
    setIsFlipped(false)

    // Update stats
    const newStats = {
      mastered: updatedCards.filter(c => c.level >= 3).length,
      learning: updatedCards.filter(c => c.level > 0 && c.level < 3).length,
      new: updatedCards.filter(c => c.level === 0).length
    }
    setStats(newStats)

    // Get next card
    const nextDueCard = updatedCards.find(card => card.nextReview <= now && card.id !== currentCard.id)
    setCurrentCard(nextDueCard || null)
  }

  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  if (!currentCard) {
    return (
      <VStack spacing={6} py={8} align="stretch" maxW="600px" mx="auto">
        <Text fontSize="2xl" fontWeight="bold">Spaced Repetition</Text>
        <Box p={6} bg={cardBg} borderRadius="lg" shadow="sm" textAlign="center">
          <Text fontSize="lg">No cards due for review!</Text>
          <Text color="gray.600" mt={2}>
            Next review: {
              cards.length > 0
                ? format(Math.min(...cards.map(c => c.nextReview.getTime())), 'MMMM d, yyyy')
                : 'No cards'
            }
          </Text>
        </Box>
        <SimpleGrid columns={3} spacing={4}>
          <Box p={4} bg={cardBg} borderRadius="lg" shadow="sm">
            <Text fontSize="sm" color="gray.600">New</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.new}</Text>
          </Box>
          <Box p={4} bg={cardBg} borderRadius="lg" shadow="sm">
            <Text fontSize="sm" color="gray.600">Learning</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.learning}</Text>
          </Box>
          <Box p={4} bg={cardBg} borderRadius="lg" shadow="sm">
            <Text fontSize="sm" color="gray.600">Mastered</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.mastered}</Text>
          </Box>
        </SimpleGrid>
      </VStack>
    )
  }

  return (
    <VStack spacing={6} py={8} align="stretch" maxW="600px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold">Spaced Repetition</Text>
      
      <Progress
        value={(currentCard.level / (reviewIntervals.length - 1)) * 100}
        colorScheme="blue"
        borderRadius="full"
      />

      <Box
        p={6}
        bg={cardBg}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
        shadow="sm"
        minH="200px"
        onClick={() => setIsFlipped(!isFlipped)}
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
      >
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Badge colorScheme={currentCard.level === 0 ? 'blue' : 'green'}>
              Level {currentCard.level}
            </Badge>
            <Text fontSize="sm" color="gray.500">
              Click to {isFlipped ? 'hide' : 'show'} answer
            </Text>
          </HStack>
          <Text fontSize="lg" fontWeight="medium">
            {isFlipped ? currentCard.back : currentCard.front}
          </Text>
        </VStack>
      </Box>

      {isFlipped && (
        <HStack spacing={4}>
          <Button
            colorScheme="red"
            flex={1}
            onClick={() => handleResponse(false)}
          >
            Forgot
          </Button>
          <Button
            colorScheme="green"
            flex={1}
            onClick={() => handleResponse(true)}
          >
            Remembered
          </Button>
        </HStack>
      )}

      <SimpleGrid columns={3} spacing={4}>
        <Box p={4} bg={cardBg} borderRadius="lg" shadow="sm">
          <Text fontSize="sm" color="gray.600">New</Text>
          <Text fontSize="2xl" fontWeight="bold">{stats.new}</Text>
        </Box>
        <Box p={4} bg={cardBg} borderRadius="lg" shadow="sm">
          <Text fontSize="sm" color="gray.600">Learning</Text>
          <Text fontSize="2xl" fontWeight="bold">{stats.learning}</Text>
        </Box>
        <Box p={4} bg={cardBg} borderRadius="lg" shadow="sm">
          <Text fontSize="sm" color="gray.600">Mastered</Text>
          <Text fontSize="2xl" fontWeight="bold">{stats.mastered}</Text>
        </Box>
      </SimpleGrid>
    </VStack>
  )
}

export default SpacedRepetition