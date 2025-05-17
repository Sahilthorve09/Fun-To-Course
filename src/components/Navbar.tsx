import React, { useEffect } from 'react'
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Container,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useAuth } from '../contexts/AuthContext'

interface NavItem {
  label: string
  href: string
  children?: Array<{
    label: string
    href: string
  }>
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Courses',
    href: '/courses',
  },
  {
    label: 'Learning Tools',
    href: '#',
    children: [
      {
        label: 'Flashcards',
        href: '/flashcards',
      },
      {
        label: 'Quiz',
        href: '/quiz',
      },
      {
        label: 'Notes',
        href: '/notes',
      },
      {
        label: 'Reading Log',
        href: '/reading-log',
      },
      {
        label: 'Habit Tracker',
        href: '/habits',
      },
    ],
  },
]

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure()
  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.200')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Close mobile menu when route changes
  useEffect(() => {
    if (isOpen) {
      onToggle()
    }
  }, [location.pathname])

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/signin', { replace: true })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg={bgColor}
      borderBottom={1}
      borderStyle="solid"
      borderColor={borderColor}
    >
      <Container maxW="container.xl">
        <Flex
          minH={'60px'}
          py={{ base: 2 }}
          align={'center'}
          justify={'space-between'}
        >
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>

          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Link
              as={RouterLink}
              to="/"
              fontFamily={'heading'}
              color={useColorModeValue('gray.800', 'white')}
              fontWeight="bold"
              fontSize="xl"
              _hover={{
                textDecoration: 'none',
                color: useColorModeValue('blue.500', 'blue.200'),
              }}
            >
              Learning Platform
            </Link>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
            align="center"
          >
            {currentUser ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar
                    size={'sm'}
                    src={currentUser.photoURL || undefined}
                    name={currentUser.displayName || currentUser.email || undefined}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/subscription">
                    Subscription
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button
                  as={RouterLink}
                  to="/signin"
                  fontSize={'sm'}
                  fontWeight={400}
                  variant={'link'}
                  color={textColor}
                >
                  Sign In
                </Button>
                <Button
                  as={RouterLink}
                  to="/signup"
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'blue.500'}
                  _hover={{
                    bg: 'blue.400',
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Container>
    </Box>
  )
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('gray.800', 'white')
  const popoverContentBgColor = useColorModeValue('white', 'gray.800')
  const { onClose } = useDisclosure()

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                as={RouterLink}
                p={2}
                to={navItem.href}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
                onClick={navItem.children ? undefined : onClose}
              >
                {navItem.label}
                {navItem.children && (
                  <Icon
                    as={ChevronDownIcon}
                    transition={'all .25s ease-in-out'}
                    transform={'rotate(0deg)'}
                    w={6}
                    h={6}
                    ml={1}
                  />
                )}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  )
}

const DesktopSubNav = ({ label, href }: NavItem) => {
  const { onClose } = useDisclosure()
  
  return (
    <Link
      as={RouterLink}
      to={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}
      onClick={onClose}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'blue.500' }}
            fontWeight={500}
          >
            {label}
          </Text>
        </Box>
      </Stack>
    </Link>
  )
}

const MobileNav = () => {
  return (
    <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link
                key={child.label}
                as={RouterLink}
                to={child.href}
                py={2}
                color={useColorModeValue('gray.600', 'gray.200')}
                _hover={{
                  color: useColorModeValue('gray.800', 'white'),
                }}
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}

export default Navbar