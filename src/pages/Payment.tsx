import React, { useState } from 'react';
import {  Box,  Container,  VStack,  Heading,  Text,  Button,  HStack,  useColorModeValue,  Input,  useToast,  Modal,  ModalOverlay,  ModalContent,  ModalHeader,  ModalBody,  ModalCloseButton,  Select,  Radio,  RadioGroup,  Stack,  Divider} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useEnrollment } from '../contexts/EnrollmentContext';
import { useAuth } from '../contexts/AuthContext';
import { createPaymentRecord, updatePaymentStatus } from '../services/database';

interface PaymentProps {
  courseId?: string;
  amount?: number;
}

interface CourseDetails {
  id: number;
  title: string;
  price: number;
  duration: string;
  category: string;
  imageUrl: string;
  description: string;
  level: string;
  rating: number;
  students: number;
}

const Payment: React.FC<PaymentProps> = () => {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { addEnrolledCourse } = useEnrollment();
  const { currentUser } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const defaultCourseDetails: CourseDetails = {
    id: 0,
    title: 'Course Title',
    price: 499,
    duration: '8 weeks',
    category: 'General',
    imageUrl: '',
    description: '',
    level: 'Beginner',
    rating: 4.5,
    students: 0
  };

  const courseDetails = (location.state?.courseDetails || defaultCourseDetails) as CourseDetails;

  const handlePayment = async () => {
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to continue with the payment',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/signin');
      return;
    }

    setIsProcessing(true);
    try {
      // Create initial payment record
      const payment = await createPaymentRecord(currentUser.uid, {
        courseId: courseDetails.id,
        amount: courseDetails.price,
        status: 'pending',
        paymentMethod: paymentMethod
      });

      // Simulate payment processing
      setTimeout(async () => {
        try {
          // Update payment status to completed
          await updatePaymentStatus(currentUser.uid, payment.id, 'completed', 'TRANS_' + Date.now());
          
          // Add course to enrolled courses
          await addEnrolledCourse({
            ...courseDetails,
            progress: 0,
            lastAccessed: new Date().toLocaleDateString()
          });
          
          toast({
            title: 'Payment Successful',
            description: 'You have been enrolled in the course!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          navigate('/profile');
        } catch (error) {
          console.error('Error completing payment:', error);
          await updatePaymentStatus(currentUser.uid, payment.id, 'failed');
          toast({
            title: 'Payment Failed',
            description: 'There was an error processing your payment. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an error initiating your payment. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsProcessing(false);
    }
  };

  const openUPIApp = () => {
    // Create UPI deep link
    const upiURL = `upi://pay?pa=${upiId}&pn=Course%20Payment&am=${courseDetails.price}&cu=INR&tn=Course%20Payment%20for%20${encodeURIComponent(courseDetails.title)}`;
    window.location.href = upiURL;
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="sm" border="1px" borderColor={borderColor}>
          <VStack spacing={6} align="stretch">
            <Heading size="lg">Payment Details</Heading>
            
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="blue.500">
                ₹{courseDetails.price}
              </Text>
              <Text fontSize="md" color="gray.600">
                for {courseDetails.title} ({courseDetails.duration})
              </Text>
            </Box>

            <Divider />

            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Select Payment Method
              </Text>
              <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                <Stack spacing={4}>
                  <Radio value="upi">UPI Payment</Radio>
                  <Radio value="card">Credit/Debit Card</Radio>
                  <Radio value="netbanking">Net Banking</Radio>
                </Stack>
              </RadioGroup>
            </Box>

            {paymentMethod === 'upi' && (
              <VStack spacing={4} align="stretch">
                <Text fontWeight="medium">Pay using UPI</Text>
                <HStack>
                  <Input
                    placeholder="Enter UPI ID (e.g., name@upi)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <Button 
                    colorScheme="blue" 
                    onClick={openUPIApp}
                    isDisabled={isProcessing}
                  >
                    Pay Now
                  </Button>
                </HStack>
                <Button 
                  variant="outline" 
                  onClick={() => setShowQR(true)}
                  isDisabled={isProcessing}
                >
                  Show QR Code
                </Button>
              </VStack>
            )}

            {paymentMethod === 'card' && (
              <VStack spacing={4} align="stretch">
                <Input placeholder="Card Number" />
                <HStack>
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVV" type="password" maxLength={3} />
                </HStack>
                <Input placeholder="Card Holder Name" />
                <Button 
                  colorScheme="blue" 
                  onClick={handlePayment}
                  isLoading={isProcessing}
                  loadingText="Processing Payment"
                >
                  Pay ₹{courseDetails.price}
                </Button>
              </VStack>
            )}

            {paymentMethod === 'netbanking' && (
              <VStack spacing={4} align="stretch">
                <Select placeholder="Select Bank">
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                </Select>
                <Button 
                  colorScheme="blue" 
                  onClick={handlePayment}
                  isLoading={isProcessing}
                  loadingText="Processing Payment"
                >
                  Pay ₹{courseDetails.price}
                </Button>
              </VStack>
            )}
          </VStack>
        </Box>
      </VStack>

      <Modal isOpen={showQR} onClose={() => setShowQR(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Scan QR Code to Pay</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={8}>
            <VStack spacing={4}>
              <QRCodeSVG
                value={`upi://pay?pa=${upiId}&pn=Course%20Payment&am=${courseDetails.price}&cu=INR`}
                size={256}
                level="H"
              />
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Scan this QR code with any UPI app to make the payment
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Payment; 