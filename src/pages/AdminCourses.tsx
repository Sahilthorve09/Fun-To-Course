import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  Select,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { createCourse, getAllCourses } from '../services/database';
import { Course } from '../types/course';
import { Timestamp } from 'firebase/firestore';

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');

  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
    title: '',
    description: '',
    price: 0,
    duration: '',
    category: '',
    imageUrl: '',
    level: 'Beginner',
    rating: 0,
    students: 0,
  });

  const fetchCourses = async () => {
    try {
      const fetchedCourses = await getAllCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch courses',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberInputChange = (name: string, value: string) => {
    setNewCourse((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseData = {
        ...newCourse,
        id: Date.now(), // Generate a new ID based on the current timestamp
      };

      await createCourse(courseData);
      toast({
        title: 'Success',
        description: 'Course created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      await fetchCourses();
      setNewCourse({
        title: '',
        description: '',
        price: 0,
        duration: '',
        category: '',
        imageUrl: '',
        level: 'Beginner',
        rating: 0,
        students: 0,
      });
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: 'Error',
        description: 'Failed to create course',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="sm">
          <Heading size="lg" mb={6}>Add New Course</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={newCourse.title}
                  onChange={handleInputChange}
                  placeholder="Course Title"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  placeholder="Course Description"
                />
              </FormControl>

              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Price (₹)</FormLabel>
                  <NumberInput
                    min={0}
                    value={newCourse.price}
                    onChange={(value) => handleNumberInputChange('price', value)}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Duration</FormLabel>
                  <Input
                    name="duration"
                    value={newCourse.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 8 weeks"
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Input
                    name="category"
                    value={newCourse.category}
                    onChange={handleInputChange}
                    placeholder="Course Category"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Level</FormLabel>
                  <Select
                    name="level"
                    value={newCourse.level}
                    onChange={handleInputChange}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </Select>
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Image URL</FormLabel>
                <Input
                  name="imageUrl"
                  value={newCourse.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Course Image URL"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                loadingText="Creating Course"
              >
                Add Course
              </Button>
            </VStack>
          </form>
        </Box>

        <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="sm">
          <Heading size="lg" mb={6}>Existing Courses</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Category</Th>
                <Th>Level</Th>
                <Th isNumeric>Price</Th>
                <Th>Duration</Th>
              </Tr>
            </Thead>
            <Tbody>
              {courses.map((course) => (
                <Tr key={course.id}>
                  <Td>{course.title}</Td>
                  <Td>{course.category}</Td>
                  <Td>{course.level}</Td>
                  <Td isNumeric>₹{course.price}</Td>
                  <Td>{course.duration}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
};

export default AdminCourses; 