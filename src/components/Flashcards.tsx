import { useState } from 'react'
import { Box, Button, Center, HStack, Text, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'

interface Flashcard {
  id: number
  front: string
  back: string
}

const MotionBox = motion(Box)

const sampleCards: Flashcard[] = [
  { id: 1, front: "What is React?", back: "A JavaScript library for building user interfaces" },
  { id: 2, front: "What is JSX?", back: "A syntax extension for JavaScript that allows you to write HTML-like code in JavaScript" },
  { id: 3, front: "What is a Component?", back: "A reusable piece of UI that can contain its own logic and styling" },
]

const Flashcards = () => {
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState<number[]>([])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = (known: boolean) => {
    if (known) {
      setKnownCards([...knownCards, sampleCards[currentCard].id])
    }
    setIsFlipped(false)
    setCurrentCard((prev) => (prev + 1) % sampleCards.length)
  }

  return (
    <VStack spacing={8} py={8}>
      <Text fontSize="2xl" fontWeight="bold">
        Flashcards ({knownCards.length}/{sampleCards.length} Known)
      </Text>
      
      <Center h="300px" w="100%">
        <MotionBox
          w="400px"
          h="250px"
          bg="white"
          borderRadius="lg"
          shadow="lg"
          cursor="pointer"
          onClick={handleFlip}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ perspective: 1000 }}
        >
          <Center
            h="100%"
            p={6}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: isFlipped ? 'rotateY(180deg)' : 'none'
            }}
          >
            <Text fontSize="xl" textAlign="center">
              {isFlipped ? sampleCards[currentCard].back : sampleCards[currentCard].front}
            </Text>
          </Center>
        </MotionBox>
      </Center>

      <HStack spacing={4}>
        <Button
          colorScheme="red"
          onClick={() => handleNext(false)}
        >
          Don't Know
        </Button>
        <Button
          colorScheme="green"
          onClick={() => handleNext(true)}
        >
          Know
        </Button>
      </HStack>
    </VStack>
  )
}

export default Flashcards