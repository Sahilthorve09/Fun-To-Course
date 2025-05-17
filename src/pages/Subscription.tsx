import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useColorModeValue,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface PricingTier {
  name: string
  price: number
  features: string[]
  buttonText: string
  period: string
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Basic',
    price: 799,
    period: 'month',
    features: [
      'Access to basic courses',
      'Limited quiz attempts',
      'Basic progress tracking',
      'Email support'
    ],
    buttonText: 'Start Basic'
  },
  {
    name: 'Pro',
    price: 1499,
    period: 'month',
    features: [
      'Access to all courses',
      'Unlimited quiz attempts',
      'Advanced progress tracking',
      'Priority email support',
      'Downloadable resources',
      'Certificate of completion'
    ],
    buttonText: 'Go Pro'
  },
  {
    name: 'Enterprise',
    price: 3999,
    period: 'month',
    features: [
      'Everything in Pro',
      'Custom learning paths',
      'Team progress tracking',
      '24/7 phone support',
      'API access',
      'Custom integrations',
      'Dedicated account manager'
    ],
    buttonText: 'Contact Sales'
  }
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price)
}

const Subscription = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const handleSubscribe = (tier: PricingTier) => {
    if (!currentUser) {
      navigate('/signin')
      return
    }
    navigate(`/payment?plan=${tier.name.toLowerCase()}&price=${tier.price}`)
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} mb={10}>
        <Heading size="2xl">Choose Your Plan</Heading>
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Get unlimited access to all our features with our premium plans
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        {pricingTiers.map((tier) => (
          <Box
            key={tier.name}
            bg="white"
            p={8}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            shadow="base"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
          >
            <VStack spacing={4} align="stretch">
              <Heading size="md">{tier.name}</Heading>
              <Box>
                <Text fontSize="4xl" fontWeight="bold">
                  {formatPrice(tier.price)}
                </Text>
                <Text color="gray.500">per {tier.period}</Text>
              </Box>
              <List spacing={3}>
                {tier.features.map((feature) => (
                  <ListItem key={feature}>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    {feature}
                  </ListItem>
                ))}
              </List>
              <Button
                mt={4}
                colorScheme="gray"
                size="lg"
                onClick={() => handleSubscribe(tier)}
              >
                {tier.buttonText}
              </Button>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  )
}

export default Subscription 