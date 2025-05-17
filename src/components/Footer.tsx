import { Box, Container, Stack, Text, Link, SimpleGrid, useColorModeValue, Icon, VStack, Heading } from '@chakra-ui/react'
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi'

const Footer = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.700', 'white');

  return (
    <Box
      bg={bgColor}
      color={textColor}
      borderTop="1px"
      borderColor={borderColor}
      mt="auto"
    >
      <Container maxW="container.xl" py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <VStack align="start" spacing={3}>
            <Heading size="md" color={headingColor}>
              Learning Platform
            </Heading>
            <Text fontSize="sm">
              Empowering learners worldwide with quality education and innovative learning tools.
            </Text>
          </VStack>

          <VStack align="start" spacing={3}>
            <Heading size="sm" color={headingColor}>
              Quick Links
            </Heading>
            <Link href="/courses">All Courses</Link>
            <Link href="/subscription">Subscription</Link>
            <Link href="/profile">My Profile</Link>
          </VStack>

          <VStack align="start" spacing={3}>
            <Heading size="sm" color={headingColor}>
              Resources
            </Heading>
            <Link href="/flashcards">Flashcards</Link>
            <Link href="/quiz">Quiz</Link>
            <Link href="/notes">Notes</Link>
            <Link href="/reading-log">Reading Log</Link>
          </VStack>

          <VStack align="start" spacing={3}>
            <Heading size="sm" color={headingColor}>
              Connect With Us
            </Heading>
            <Stack direction="row" spacing={4}>
              <Link href="#" isExternal>
                <Icon as={FiGithub} w={5} h={5} />
              </Link>
              <Link href="#" isExternal>
                <Icon as={FiTwitter} w={5} h={5} />
              </Link>
              <Link href="#" isExternal>
                <Icon as={FiLinkedin} w={5} h={5} />
              </Link>
              <Link href="mailto:contact@learningplatform.com">
                <Icon as={FiMail} w={5} h={5} />
              </Link>
            </Stack>
          </VStack>
        </SimpleGrid>

        <Box
          borderTopWidth={1}
          borderStyle={'solid'}
          borderColor={borderColor}
          pt={8}
          mt={8}
          textAlign="center"
        >
          <Text fontSize="sm">
            © {new Date().getFullYear()} Learning Platform. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer 