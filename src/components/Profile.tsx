import { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  VStack,
  useColorModeValue,
  HStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const menuBg = useColorModeValue('white', 'gray.800');
  const menuBorder = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box>
      <Menu>
        <MenuButton>
          <HStack spacing={2} cursor="pointer">
            <Avatar
              size={isMobile ? "xs" : "sm"}
              name={currentUser?.email || 'User'}
              src={currentUser?.photoURL || undefined}
            />
            <Text 
              display={{ base: 'none', md: 'block' }}
              fontSize={{ base: 'sm', md: 'md' }}
            >
              {currentUser?.email?.split('@')[0]}
            </Text>
          </HStack>
        </MenuButton>
        <MenuList bg={menuBg} borderColor={menuBorder}>
          <Box px={4} py={2}>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                {currentUser?.displayName || currentUser?.email?.split('@')[0]}
              </Text>
              <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">
                {currentUser?.email}
              </Text>
            </VStack>
          </Box>
          <MenuItem 
            onClick={() => navigate('/profile')}
            fontSize={{ base: 'sm', md: 'md' }}
          >
            View Profile
          </MenuItem>
          <MenuItem 
            onClick={handleSignOut} 
            isDisabled={isLoading}
            fontSize={{ base: 'sm', md: 'md' }}
          >
            Sign Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Profile; 