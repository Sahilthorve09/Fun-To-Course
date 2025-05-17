import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Input,
  Select,
  VStack,
  Text,
  Image,
  Heading,
  Badge,
  Button,
  HStack,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Icon,
  Flex,
  Card,
  CardBody,
  Stack,
  useBreakpointValue,
  Wrap,
  WrapItem,
  Spinner,
  Alert,
  AlertIcon,
  Skeleton,
  useToast,
  AspectRatio,
} from '@chakra-ui/react';
import { FiSearch, FiClock, FiUsers, FiStar, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types/course';
import { getAllCourses, initializeSampleCourses, clearAndInitializeCourses } from '../services/database';
import CourseDetails from './CourseDetails';

const CourseCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState<{ [key: number]: boolean }>({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const columnCount = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  const spacing = useBreakpointValue({ base: 4, md: 6 });
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const fetchedCourses = await getAllCourses();
        if (fetchedCourses.length === 0) {
          // Initialize sample courses if none exist
          await initializeSampleCourses();
          const initializedCourses = await getAllCourses();
          setCourses(initializedCourses);
        } else {
          setCourses(fetchedCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleRefreshCourses = async () => {
    try {
      setIsLoading(true);
      await clearAndInitializeCourses();
      const refreshedCourses = await getAllCourses();
      setCourses(refreshedCourses);
      toast({
        title: 'Courses refreshed',
        description: 'Course catalog has been reinitialized with sample courses.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error refreshing courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh courses. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseClick = (courseId: number) => {
    navigate(`/course/${courseId}`, { state: { courseDetails: courses.find(c => c.id === courseId) } });
  };

  const handleImageError = (courseId: number) => {
    console.log(`Image load error for course ${courseId}`);
    setImageLoadError(prev => ({ ...prev, [courseId]: true }));
  };

  const getFallbackImage = (category: string) => {
    const fallbackImages = {
      'Web Development': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
      'Mobile Development': 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=800&q=80',
      'Data Science': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
      'UI/UX Design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
      'Cloud Computing': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      'Cybersecurity': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
    };
    return fallbackImages[category as keyof typeof fallbackImages] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || course.category === filterCategory;
    const matchesLevel = !filterLevel || course.level === filterLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (error) {
    return (
      <Container maxW="container.xl" py={{ base: 6, md: 12 }} px={containerPadding}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={{ base: 6, md: 12 }} px={containerPadding}>
      {/* Search and Filters */}
      <VStack spacing={6} mb={8}>
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg={bgColor}
            borderColor={borderColor}
          />
        </InputGroup>
        
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={4}
          w="100%"
          justify="space-between"
          align="center"
        >
          <HStack spacing={4} flex={{ md: 2 }}>
            <Select
              placeholder="Select Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              bg={bgColor}
              borderColor={borderColor}
            >
              {[
                'Web Development',
                'Mobile Development',
                'Data Science',
                'UI/UX Design',
                'Cloud Computing',
                'Cybersecurity'
              ].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            
            <Select
              placeholder="Select Level"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              bg={bgColor}
              borderColor={borderColor}
            >
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </HStack>

          <Button
            leftIcon={<Icon as={FiRefreshCw} />}
            colorScheme="blue"
            variant="outline"
            onClick={handleRefreshCourses}
            isLoading={isLoading}
            loadingText="Refreshing"
          >
            Refresh Courses
          </Button>
        </Flex>
      </VStack>

      {/* Loading State */}
      {isLoading ? (
        <VStack py={12}>
          <Spinner size="xl" color="blue.500" />
          <Text color={textColor}>Loading courses...</Text>
        </VStack>
      ) : filteredCourses.length > 0 ? (
        <SimpleGrid columns={columnCount} spacing={spacing}>
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              bg={cardBg}
              boxShadow="sm"
              borderRadius="lg"
              overflow="hidden"
              transition="transform 0.2s"
              _hover={{ transform: 'translateY(-4px)' }}
              onClick={() => handleCourseClick(course.id)}
              cursor="pointer"
            >
              <Box position="relative">
                <AspectRatio ratio={16/9}>
                  <Box>
                    <Skeleton isLoaded={!isLoading} height="100%">
                      <Image
                        src={imageLoadError[course.id] ? getFallbackImage(course.category) : course.imageUrl}
                        alt={course.title}
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        onError={() => handleImageError(course.id)}
                        fallbackSrc={getFallbackImage(course.category)}
                      />
                    </Skeleton>
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      colorScheme="blue"
                      px={2}
                      py={1}
                      borderRadius="full"
                      zIndex={1}
                    >
                      {course.level}
                    </Badge>
                  </Box>
                </AspectRatio>
              </Box>

              <CardBody>
                <VStack align="stretch" spacing={2}>
                  <Heading size="md" noOfLines={2}>
                    {course.title}
                  </Heading>
                  <Text color={textColor} noOfLines={2}>
                    {course.description}
                  </Text>
                  <HStack spacing={4}>
                    <HStack>
                      <Icon as={FiClock} color={textColor} />
                      <Text fontSize="sm" color={textColor}>
                        {course.duration}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiUsers} color={textColor} />
                      <Text fontSize="sm" color={textColor}>
                        {course.students} students
                      </Text>
                    </HStack>
                  </HStack>
                  <HStack justify="space-between" align="center">
                    <Text fontWeight="bold" fontSize="lg" color="blue.500">
                      ₹{course.price}
                    </Text>
                    <HStack>
                      <Icon as={FiStar} color="yellow.400" />
                      <Text fontSize="sm" fontWeight="bold">
                        {course.rating}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <VStack py={12} spacing={4}>
          <Text color={textColor} fontSize="lg">
            No courses found matching your criteria.
          </Text>
          <Button
            colorScheme="blue"
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('');
              setFilterLevel('');
            }}
          >
            Clear Filters
          </Button>
        </VStack>
      )}

      {selectedCourse && (
        <CourseDetails
          course={selectedCourse}
          isOpen={Boolean(selectedCourse)}
          onClose={() => setSelectedCourse(null)}
          onEnroll={(courseId) => {
            console.log('Enrolling in course:', courseId);
            setSelectedCourse(null);
          }}
        />
      )}
    </Container>
  );
};

export default CourseCatalog;