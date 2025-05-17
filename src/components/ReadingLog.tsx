import React, { useState } from 'react'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  Badge
} from '@chakra-ui/react'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'

interface ReadingEntry {
  id: number
  title: string
  author: string
  date: string
  duration: number
  notes: string
  category: string
  pages: number
  status: 'Completed' | 'In Progress'
}

const initialEntries: ReadingEntry[] = [
  {
    id: 1,
    title: "Introduction to React Hooks",
    author: "React Team",
    date: "2024-03-15",
    duration: 30,
    notes: "Learned about useState and useEffect hooks",
    category: "React",
    pages: 20,
    status: 'Completed'
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    author: "TypeScript Community",
    date: "2024-03-14",
    duration: 45,
    notes: "Explored generic types and utility types",
    category: "TypeScript",
    pages: 15,
    status: 'In Progress'
  }
]

const ReadingLog = () => {
  const [entries, setEntries] = useState<ReadingEntry[]>(initialEntries)
  const [currentEntry, setCurrentEntry] = useState<ReadingEntry | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    date: '',
    duration: '',
    notes: '',
    category: '',
    pages: '',
    status: 'Completed'
  })
  const toast = useToast()

  const handleEdit = (entry: ReadingEntry) => {
    setCurrentEntry(entry)
    setFormData({
      title: entry.title,
      author: entry.author,
      date: entry.date,
      duration: entry.duration.toString(),
      notes: entry.notes,
      category: entry.category,
      pages: entry.pages.toString(),
      status: entry.status
    })
    onOpen()
  }

  const handleDelete = (id: number) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  const handleAdd = () => {
    setCurrentEntry(null)
    setFormData({
      title: '',
      author: '',
      date: '',
      duration: '',
      notes: '',
      category: '',
      pages: '',
      status: 'Completed'
    })
    onOpen()
  }

  const handleSubmit = () => {
    // Form validation
    if (!formData.title || !formData.author || !formData.date || !formData.duration || !formData.pages) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    const newEntry = {
      id: currentEntry?.id || entries.length + 1,
      title: formData.title,
      author: formData.author,
      date: formData.date,
      duration: parseInt(formData.duration),
      notes: formData.notes,
      category: formData.category,
      pages: parseInt(formData.pages),
      status: formData.status as 'Completed' | 'In Progress'
    }

    if (currentEntry) {
      setEntries(entries.map(entry => 
        entry.id === currentEntry.id ? newEntry : entry
      ))
    } else {
      setEntries([...entries, newEntry])
    }
    onClose()
    toast({
      title: currentEntry ? 'Entry Updated' : 'Entry Added',
      description: currentEntry ? 'Reading entry updated successfully' : 'New reading entry added successfully',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleMarkComplete = (id: number) => {
    setEntries(entries.map(entry =>
      entry.id === id
        ? { ...entry, status: 'Completed' }
        : entry
    ))
    toast({
      title: 'Entry Updated',
      description: 'Reading entry marked as completed',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>Reading Log</Heading>
          <Text color="gray.600">Track your learning progress</Text>
        </Box>

        <HStack justify="flex-end">
          <Button
            leftIcon={<FaPlus />}
            onClick={handleAdd}
            colorScheme="gray"
          >
            Add Entry
          </Button>
        </HStack>

        <Box
          bg="white"
          borderRadius="lg"
          overflow="hidden"
          border="1px"
          borderColor="gray.200"
          shadow="sm"
        >
          <Table variant="simple">
            <Thead>
              <Tr bg="gray.100">
                <Th color="gray.900">Title</Th>
                <Th color="gray.900">Author</Th>
                <Th color="gray.900">Date</Th>
                <Th color="gray.900">Duration (min)</Th>
                <Th color="gray.900">Pages</Th>
                <Th color="gray.900">Status</Th>
                <Th color="gray.900">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {entries.map((entry) => (
                <Tr 
                  key={entry.id}
                  _hover={{ bg: 'gray.50' }}
                >
                  <Td fontWeight="medium">{entry.title}</Td>
                  <Td>{entry.author}</Td>
                  <Td>{entry.date}</Td>
                  <Td>{entry.duration}</Td>
                  <Td>{entry.pages}</Td>
                  <Td>
                    <Badge
                      colorScheme={entry.status === 'Completed' ? 'green' : 'yellow'}
                    >
                      {entry.status}
                    </Badge>
                  </Td>
                  <Td>
                    {entry.status === 'In Progress' && (
                      <Button
                        size="sm"
                        colorScheme="gray"
                        onClick={() => handleMarkComplete(entry.id)}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit entry"
                        icon={<FaEdit />}
                        size="sm"
                        color="gray.600"
                        variant="ghost"
                        onClick={() => handleEdit(entry)}
                      />
                      <IconButton
                        aria-label="Delete entry"
                        icon={<FaTrash />}
                        size="sm"
                        color="gray.600"
                        variant="ghost"
                        onClick={() => handleDelete(entry.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentEntry ? 'Edit Reading Entry' : 'Add New Reading Entry'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter title"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Author</FormLabel>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Enter author"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </FormControl>

              <HStack width="100%">
                <FormControl isRequired>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Enter duration"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Pages</FormLabel>
                  <Input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    placeholder="Enter pages"
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Enter category"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter notes"
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Select>
              </FormControl>

              <Button colorScheme="blue" width="full" onClick={handleSubmit}>
                {currentEntry ? 'Update Entry' : 'Add Entry'}
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  )
}

export default ReadingLog