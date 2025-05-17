import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Progress,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  Icon,
  Badge,
  Button,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Image,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  List,
  ListItem,
  ListIcon,
  Divider,
  Spinner,
} from '@chakra-ui/react';
import { FiClock, FiFile, FiPlay, FiCheckCircle, FiUsers, FiStar, FiBook, FiAward, FiTarget, FiList } from 'react-icons/fi';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEnrollment } from '../contexts/EnrollmentContext';
import { getCourse } from '../services/database';
import { Course } from '../types/course';

const CourseContent: React.FC = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { enrolledCourses, updateCourseProgress } = useEnrollment();
  const [course, setCourse] = React.useState<Course | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  React.useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        // Try to get course from location state first
        const courseFromState = location.state?.courseDetails;
        if (courseFromState) {
          setCourse(courseFromState);
        } else {
          // If not in state, fetch from database
          const fetchedCourse = await getCourse(Number(courseId));
          if (!fetchedCourse) {
            setError('Course not found');
            return;
          }
          setCourse(fetchedCourse);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to load course details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, location.state]);

  if (isLoading) {
    return (
      <Container maxW="container.lg" py={10}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading course content...</Text>
        </VStack>
      </Container>
    );
  }

  if (error || !course) {
    return (
      <Container maxW="container.lg" py={10}>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="lg"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Course Not Found
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {error || 'The requested course could not be found.'}
          </AlertDescription>
          <Button
            mt={4}
            colorScheme="blue"
            onClick={() => navigate('/courses')}
          >
            Back to Courses
          </Button>
        </Alert>
      </Container>
    );
  }

  const enrolledCourse = enrolledCourses.find(c => c.id === course.id);
  const isEnrolled = Boolean(enrolledCourse);
  const progress = enrolledCourse?.progress || 0;

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} align="stretch">
        {/* Course Header */}
        <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="sm" border="1px" borderColor={borderColor}>
          <VStack spacing={6} align="stretch">
            <Box position="relative" height={{ base: "200px", md: "300px" }} mb={4}>
              <Image
                src={course.imageUrl}
                alt={course.title}
                objectFit="cover"
                w="100%"
                h="100%"
                borderRadius="lg"
                fallback={<Box bg="gray.100" h="100%" borderRadius="lg" />}
              />
            </Box>

            <VStack align="stretch" spacing={4}>
              <Heading size="xl">{course.title}</Heading>
              <Text color={textColor} fontSize="lg">
                {course.description}
              </Text>

              <HStack spacing={4}>
                <Badge colorScheme="blue" px={2} py={1}>
                  {course.level}
                </Badge>
                <Badge colorScheme="green" px={2} py={1}>
                  {course.category}
                </Badge>
              </HStack>

              {isEnrolled && (
                <>
                  <Progress value={progress} size="lg" colorScheme="blue" borderRadius="full" />
                  <HStack spacing={4}>
                    <Text color={textColor}>
                      Course Progress: {Math.round(progress)}%
                    </Text>
                  </HStack>
                </>
              )}
            </VStack>
          </VStack>
        </Box>

        {/* Course Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Box bg={cardBg} p={6} borderRadius="lg">
            <StatGroup>
              <Stat>
                <StatLabel color={textColor}>
                  <HStack>
                    <Icon as={FiUsers} />
                    <Text>Students</Text>
                  </HStack>
                </StatLabel>
                <StatNumber>{course.students}</StatNumber>
              </Stat>
            </StatGroup>
          </Box>

          <Box bg={cardBg} p={6} borderRadius="lg">
            <StatGroup>
              <Stat>
                <StatLabel color={textColor}>
                  <HStack>
                    <Icon as={FiClock} />
                    <Text>Duration</Text>
                  </HStack>
                </StatLabel>
                <StatNumber fontSize="lg">{course.duration}</StatNumber>
              </Stat>
            </StatGroup>
          </Box>

          <Box bg={cardBg} p={6} borderRadius="lg">
            <StatGroup>
              <Stat>
                <StatLabel color={textColor}>
                  <HStack>
                    <Icon as={FiStar} />
                    <Text>Rating</Text>
                  </HStack>
                </StatLabel>
                <StatNumber>{course.rating}/5.0</StatNumber>
              </Stat>
            </StatGroup>
          </Box>
        </SimpleGrid>

        {/* Course Content */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <VStack align="stretch" spacing={6}>
            {/* Learning Outcomes */}
            {course.learningOutcomes && (
              <Box bg={bgColor} p={6} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Heading size="md" mb={4}>
                  <HStack>
                    <Icon as={FiTarget} />
                    <Text>Learning Outcomes</Text>
                  </HStack>
                </Heading>
                <List spacing={3}>
                  {course.learningOutcomes.map((outcome, index) => (
                    <ListItem key={index}>
                      <HStack align="start">
                        <ListIcon as={FiCheckCircle} color="green.500" mt={1} />
                        <Text color={textColor}>{outcome}</Text>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Prerequisites */}
            {course.prerequisites && (
              <Box bg={bgColor} p={6} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Heading size="md" mb={4}>
                  <HStack>
                    <Icon as={FiList} />
                    <Text>Prerequisites</Text>
                  </HStack>
                </Heading>
                <List spacing={3}>
                  {course.prerequisites.map((prerequisite, index) => (
                    <ListItem key={index}>
                      <HStack align="start">
                        <ListIcon as={FiCheckCircle} color="blue.500" mt={1} />
                        <Text color={textColor}>{prerequisite}</Text>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </VStack>

          {/* Course Syllabus */}
          <Box bg={bgColor} p={6} borderRadius="lg" border="1px" borderColor={borderColor}>
            <Heading size="md" mb={6}>Course Syllabus</Heading>
            <Accordion allowMultiple>
              {course.syllabus?.map((section, index) => (
                <AccordionItem key={index} border="1px" borderColor={borderColor} borderRadius="md" mb={4}>
                  <AccordionButton py={4}>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold">{section.title}</Text>
                      <Text fontSize="sm" color={textColor}>
                        {section.duration}
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <List spacing={3}>
                      {section.topics.map((topic, topicIndex) => (
                        <ListItem key={topicIndex}>
                          <HStack>
                            <ListIcon as={FiPlay} color="blue.500" />
                            <Text color={textColor}>{topic}</Text>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        </SimpleGrid>

        {/* Enrollment CTA */}
        {!isEnrolled && (
          <Box
            position="sticky"
            bottom={4}
            bg={bgColor}
            p={4}
            borderRadius="lg"
            boxShadow="lg"
            border="1px"
            borderColor={borderColor}
          >
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  ₹{course.price}
                </Text>
                <Text fontSize="sm" color={textColor}>
                  Lifetime access
                </Text>
              </VStack>
              <Button
                colorScheme="blue"
                size="lg"
                leftIcon={<Icon as={FiBook} />}
                onClick={() => navigate('/payment', { state: { courseDetails: course } })}
              >
                Enroll Now
              </Button>
            </HStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default CourseContent; 