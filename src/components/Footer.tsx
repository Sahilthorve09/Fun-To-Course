import { Box, Container, Stack, Text, Link, useColorModeValue } from '@chakra-ui/react'

const Footer = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      borderTop={1}
      borderStyle={'solid'}
      borderColor={borderColor}
      py={4}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2024 Fun-To-Course. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          <Link href={'/courses'}>Courses</Link>
          <Link href={'/subscription'}>Pricing</Link>
          <Link href={'/about'}>About</Link>
          <Link href={'/contact'}>Contact</Link>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer 