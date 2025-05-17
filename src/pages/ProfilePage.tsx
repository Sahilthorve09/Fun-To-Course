import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Avatar,
  HStack,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  GridItem,
  Progress,
  Badge,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useEnrollment } from '../contexts/EnrollmentContext';
import { getUserProfile, updateUserProfile } from '../services/database';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  displayName?: string;
  email: string;
  photoURL?: string;
}

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { enrolledCourses } = useEnrollment();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const loadProfile = async () => {
      if (currentUser) {
        try {
          const userProfile = await getUserProfile(currentUser.uid);
          if (userProfile) {
            setProfile({
              displayName: userProfile.displayName,
              email: userProfile.email,
              photoURL: userProfile.photoURL
            });
            setEditedName(userProfile.displayName || '');
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          toast({
            title: 'Error',
            description: 'Failed to load profile information',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
      setIsLoading(false);
    };

    loadProfile();
  }, [currentUser]);

  const handleUpdateProfile = async () => {
    if (!currentUser) return;

    try {
      await updateUserProfile(currentUser.uid, {
        displayName: editedName,
      });

      setProfile(prev => ({
        ...prev!,
        displayName: editedName
      }));

      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!currentUser) {
    navigate('/signin');
    return null;
  }

  if (isLoading) {
    return (
      <Container maxW="container.lg" py={10}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} align="stretch">
        {/* Profile Header */}
        <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="sm" border="1px" borderColor={borderColor}>
          <HStack spacing={8} align="flex-start">
            <Avatar
              size="2xl"
              name={profile?.displayName || profile?.email}
              src={profile?.photoURL}
            />
            <VStack align="flex-start" flex={1} spacing={4}>
              {isEditing ? (
                <FormControl>
                  <FormLabel>Display Name</FormLabel>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </FormControl>
              ) : (
                <Heading size="lg">{profile?.displayName || 'User'}</Heading>
              )}
              <Text color="gray.600">{profile?.email}</Text>
              <HStack>
                {isEditing ? (
                  <>
                    <Button colorScheme="blue" onClick={handleUpdateProfile}>
                      Save Changes
                    </Button>
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button colorScheme="blue" variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </HStack>
            </VStack>
          </HStack>
        </Box>

        {/* Tabs Section */}
        <Tabs variant="enclosed">
          <TabList>
            <Tab>My Courses</Tab>
            <Tab>Payment History</Tab>
          </TabList>

          <TabPanels>
            {/* Enrolled Courses Panel */}
            <TabPanel>
              <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
                {enrolledCourses.map((course) => (
                  <GridItem key={course.id}>
                    <Box
                      bg={bgColor}
                      p={6}
                      borderRadius="lg"
                      boxShadow="sm"
                      border="1px"
                      borderColor={borderColor}
                    >
                      <VStack align="stretch" spacing={4}>
                        <Heading size="md">{course.title}</Heading>
                        <Progress
                          value={course.progress}
                          size="sm"
                          colorScheme="blue"
                          borderRadius="full"
                        />
                        <Text color="gray.600">
                          Progress: {course.progress}%
                        </Text>
                        <HStack justify="space-between">
                          <Badge colorScheme="blue">{course.category}</Badge>
                          <Text fontSize="sm" color="gray.500">
                            Last accessed: {course.lastAccessed}
                          </Text>
                        </HStack>
                        <Button
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => navigate(`/course/${course.id}`)}
                        >
                          Continue Learning
                        </Button>
                      </VStack>
                    </Box>
                  </GridItem>
                ))}
              </Grid>
            </TabPanel>

            {/* Payment History Panel */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {/* Add payment history items here */}
                <Text color="gray.600">Your payment history will appear here.</Text>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default ProfilePage; 