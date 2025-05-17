import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Image,
  Icon,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  List,
  ListItem,
  ListIcon,
  Divider
} from '@chakra-ui/react';
import { FiClock, FiUsers, FiStar, FiBook, FiAward, FiTarget, FiList, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types/course';

interface CourseDetailsProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (courseId: number) => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({
  course,
  isOpen,
  onClose,
  onEnroll,
}) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  const handleEnroll = () => {
    navigate(`/payment?courseId=${course.id}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg={bgColor} maxW={{ base: "95%", md: "90%", lg: "80%" }}>
        <ModalCloseButton />
        
        {/* Header Image */}
        <Box position="relative" height={{ base: "200px", md: "300px" }}>
          <Image
            src={course.imageUrl}
            alt={course.title}
            objectFit="cover"
            w="100%"
            h="100%"
          />
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            bg="rgba(0,0,0,0.7)"
            p={6}
            color="white"
          >
            <Heading size={{ base: "lg", md: "xl" }}>{course.title}</Heading>
            <HStack mt={2} spacing={4}>
              <Badge colorScheme="blue" px={2} py={1}>
                {course.level}
              </Badge>
              <Badge colorScheme="green" px={2} py={1}>
                {course.category}
              </Badge>
            </HStack>
          </Box>
        </Box>

        <ModalBody py={6}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            <VStack align="stretch" spacing={6}>
              {/* Course Stats */}
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
                  <Stat>
                    <StatLabel color={textColor}>
                      <HStack>
                        <Icon as={FiStar} />
                        <Text>Rating</Text>
                      </HStack>
                    </StatLabel>
                    <StatNumber>{course.rating}/5.0</StatNumber>
                  </Stat>
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

              {/* Course Description */}
              <Box>
                <Heading size="md" mb={4}>About This Course</Heading>
                <Text color={textColor}>{course.description}</Text>
              </Box>

              {/* Learning Outcomes */}
              {course.learningOutcomes && (
                <Box>
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
                <Box>
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

            <VStack align="stretch" spacing={6}>
              {/* Course Info Card */}
              <Box
                bg={cardBg}
                p={6}
                borderRadius="lg"
                position="sticky"
                top={4}
              >
                <VStack spacing={4} align="stretch">
                  <Heading size="lg" color="blue.500">
                    ₹{course.price}
                  </Heading>
                  
                  <Button
                    size="lg"
                    colorScheme="blue"
                    leftIcon={<Icon as={FiBook} />}
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </Button>

                  <Divider />

                  <VStack align="stretch" spacing={3}>
                    <HStack>
                      <Icon as={FiAward} color={textColor} />
                      <Text color={textColor}>Certificate of Completion</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiClock} color={textColor} />
                      <Text color={textColor}>Lifetime Access</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiUsers} color={textColor} />
                      <Text color={textColor}>Community Support</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>

              {/* Course Syllabus */}
              {course.syllabus && (
                <Box>
                  <Heading size="md" mb={4}>Course Syllabus</Heading>
                  <VStack align="stretch" spacing={4}>
                    {course.syllabus.map((section, index) => (
                      <Box
                        key={index}
                        p={4}
                        bg={cardBg}
                        borderRadius="md"
                      >
                        <HStack justify="space-between" mb={2}>
                          <Heading size="sm">{section.title}</Heading>
                          <Text fontSize="sm" color={textColor}>
                            {section.duration}
                          </Text>
                        </HStack>
                        <List spacing={2}>
                          {section.topics.map((topic, topicIndex) => (
                            <ListItem key={topicIndex}>
                              <HStack>
                                <ListIcon as={FiCheckCircle} color="green.500" />
                                <Text color={textColor}>{topic}</Text>
                              </HStack>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CourseDetails; 