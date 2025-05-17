import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  HStack,
  Image,
  useColorModeValue,
  Badge,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FiTrendingUp, FiStar, FiUsers, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.600, purple.700)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');

  const trendingCourses = [
    {
      id: 1,
      title: 'Advanced JavaScript Mastery',
      description: 'Master modern JavaScript with practical projects and real-world applications',
      students: 1234,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
      level: 'Intermediate',
      price: 4999,
    },
    {
      id: 2,
      title: 'Full Stack Web Development',
      description: 'Learn to build complete web applications from front-end to back-end',
      students: 2156,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg',
      level: 'Advanced',
      price: 7999,
    },
    {
      id: 3,
      title: 'Data Science Fundamentals',
      description: 'Get started with data analysis, visualization, and machine learning',
      students: 1876,
      rating: 4.7,
      image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg',
      level: 'Beginner',
      price: 5999,
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient={bgGradient}
        color="white"
        py={20}
        px={4}
      >
        <Container maxW="container.xl">
          <VStack spacing={6} align="flex-start">
            <Heading size="2xl">Welcome to Fun To Course</Heading>
            <Text fontSize="xl" maxW="2xl">
              Discover the joy of learning with our interactive courses. Start your journey today!
            </Text>
            <Button
              size="lg"
              colorScheme="whiteAlpha"
              rightIcon={<FiArrowRight />}
              onClick={() => navigate('/courses')}
            >
              Explore Courses
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Trending Courses Section */}
      <Container maxW="container.xl" py={16}>
        <VStack spacing={12} align="stretch">
          <HStack justify="space-between">
            <Heading size="xl">
              <Icon as={FiTrendingUp} mr={2} />
              Trending Courses
            </Heading>
            <Button
              variant="ghost"
              colorScheme="blue"
              rightIcon={<FiArrowRight />}
              onClick={() => navigate('/courses')}
            >
              View All Courses
            </Button>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {trendingCourses.map((course) => (
              <Box
                key={course.id}
                bg={cardBg}
                rounded="lg"
                shadow="md"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
                cursor="pointer"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <Image
                  src={course.image}
                  alt={course.title}
                  h={48}
                  w="full"
                  objectFit="cover"
                />
                <Box p={6}>
                  <VStack align="stretch" spacing={4}>
                    <Badge colorScheme="blue" alignSelf="flex-start">
                      {course.level}
                    </Badge>
                    <Heading size="md">{course.title}</Heading>
                    <Text noOfLines={2} color="gray.500">
                      {course.description}
                    </Text>
                    <HStack justify="space-between">
                      <HStack>
                        <Icon as={FiUsers} />
                        <Text>{course.students} students</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiStar} color="yellow.400" />
                        <Text>{course.rating}</Text>
                      </HStack>
                    </HStack>
                    <Text fontWeight="bold" fontSize="xl">
                      ₹{course.price}
                    </Text>
                  </VStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Features Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={16}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <VStack align="start" spacing={4}>
              <Icon as={FiStar} boxSize={8} color="yellow.400" />
              <Heading size="md">Quality Content</Heading>
              <Text color="gray.500">
                Learn from industry experts with our carefully curated courses
              </Text>
            </VStack>
            <VStack align="start" spacing={4}>
              <Icon as={FiUsers} boxSize={8} color="blue.400" />
              <Heading size="md">Community Learning</Heading>
              <Text color="gray.500">
                Join a community of learners and share your knowledge
              </Text>
            </VStack>
            <VStack align="start" spacing={4}>
              <Icon as={FiTrendingUp} boxSize={8} color="green.400" />
              <Heading size="md">Career Growth</Heading>
              <Text color="gray.500">
                Boost your career with in-demand skills and certifications
              </Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard; 