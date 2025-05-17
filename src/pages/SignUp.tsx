import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Container,
  Heading,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseError } from 'firebase/app';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting to sign up with:', { email }); // Debug log
      await signUp(email, password);
      toast({
        title: 'Account created successfully',
        description: 'Welcome to our platform!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/subscription');
    } catch (error) {
      console.error('Sign up error:', error); // Debug log
      let errorMessage = 'Failed to create account';
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'Email already in use';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error - please check your connection';
            break;
          case 'auth/invalid-api-key':
            errorMessage = 'Authentication error - please contact support';
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl">Sign Up</Heading>
          <Text mt={2} color="gray.600">
            Create your account to get started
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              mt={4}
              isLoading={loading}
            >
              Sign Up
            </Button>
          </VStack>
        </Box>

        <Text textAlign="center">
          Already have an account?{' '}
          <ChakraLink as={Link} to="/signin" color="blue.500">
            Sign In
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  );
} 