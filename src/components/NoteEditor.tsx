import { useState, ChangeEvent } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Textarea,
  Button,
  Input,
  FormControl,
  FormLabel,
  SimpleGrid,
  useToast
} from '@chakra-ui/react';

interface Note {
  id: number;
  title: string;
  content: string;
  lastModified: string;
}

const initialNotes: Note[] = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    content: 'Variables, data types, and control structures...',
    lastModified: '2024-03-20',
  },
  {
    id: 2,
    title: 'React Hooks',
    content: 'useState, useEffect, and custom hooks...',
    lastModified: '2024-03-21',
  },
];

const NoteEditor = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const toast = useToast();

  const handleCreateNote = () => {
    if (!newTitle || !newContent) {
      toast({
        title: 'Error',
        description: 'Please fill in both title and content',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const newNote: Note = {
      id: notes.length + 1,
      title: newTitle,
      content: newContent,
      lastModified: new Date().toISOString().split('T')[0],
    };

    setNotes([...notes, newNote]);
    setNewTitle('');
    setNewContent('');
    toast({
      title: 'Success',
      description: 'Note created successfully',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
  };

  const handleUpdateNote = () => {
    if (!currentNote || !newTitle || !newContent) return;

    const updatedNotes = notes.map((note) =>
      note.id === currentNote.id
        ? {
            ...note,
            title: newTitle,
            content: newContent,
            lastModified: new Date().toISOString().split('T')[0],
          }
        : note
    );

    setNotes(updatedNotes);
    setCurrentNote(null);
    setNewTitle('');
    setNewContent('');
    toast({
      title: 'Success',
      description: 'Note updated successfully',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl">Study Notes</Heading>
          <Text mt={4} color="gray.600">
            Create and manage your study notes
          </Text>
        </Box>

        <Box
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="sm"
          border="1px"
          borderColor="gray.200"
        >
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter note title"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Content</FormLabel>
              <Textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Enter your notes here"
                minH="200px"
              />
            </FormControl>

            <Button
              colorScheme="gray"
              width="full"
              onClick={currentNote ? handleUpdateNote : handleCreateNote}
            >
              {currentNote ? 'Update Note' : 'Create Note'}
            </Button>
          </VStack>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {notes.map((note) => (
            <Box
              key={note.id}
              p={6}
              bg="white"
              borderRadius="lg"
              boxShadow="sm"
              border="1px"
              borderColor="gray.200"
              onClick={() => handleEditNote(note)}
              cursor="pointer"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
            >
              <VStack align="stretch" spacing={3}>
                <Heading size="md">{note.title}</Heading>
                <Text color="gray.600" noOfLines={3}>
                  {note.content}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Last modified: {note.lastModified}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default NoteEditor;