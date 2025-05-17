import React, { useState, useRef, Suspense, lazy } from 'react'
import {
  Box,
  Container,
  VStack,
  Text,
  useColorModeValue,
  HStack,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  IconButton,
  Textarea,
  useToast,
  Progress,
  Collapse,
  Heading,
  Spinner,
  Center
} from '@chakra-ui/react'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress } from 'react-icons/fa'

// @ts-ignore
const ReactPlayer = lazy(() => import('react-player/lazy'))

interface VideoNote {
  timestamp: number
  content: string
}

const formatTime = (seconds: number) => {
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = date.getUTCSeconds().toString().padStart(2, '0')
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`
  }
  return `${mm}:${ss}`
}

const VideoPlayer: React.FC = () => {
  const playerRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentNote, setCurrentNote] = useState('')
  const [notes, setNotes] = useState<VideoNote[]>([])
  const [showNotes, setShowNotes] = useState(true)
  const toast = useToast()

  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setProgress(state.playedSeconds)
  }

  const handleDuration = (duration: number) => {
    setDuration(duration)
  }

  const handleVolumeChange = (value: number) => {
    setVolume(value)
    setIsMuted(value === 0)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen)
    const player = document.querySelector('.player-wrapper')
    if (player) {
      if (!isFullscreen) {
        if (player.requestFullscreen) {
          player.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
    }
  }

  const handleAddNote = () => {
    if (!currentNote.trim()) return

    const newNote: VideoNote = {
      timestamp: progress,
      content: currentNote.trim()
    }

    setNotes([...notes, newNote])
    setCurrentNote('')
    toast({
      title: 'Note Added',
      description: 'Your note has been saved successfully',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleSeekToNote = (timestamp: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(timestamp)
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Video Lesson</Heading>
        
        <Box className="player-wrapper" position="relative">
          <Box
            bg={bgColor}
            borderRadius="lg"
            border="1px"
            borderColor={borderColor}
            shadow="md"
            overflow="hidden"
          >
            <Suspense fallback={
              <Center h="300px">
                <Spinner size="xl" />
              </Center>
            }>
              <ReactPlayer
                ref={playerRef}
                url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                width="100%"
                height="auto"
                playing={isPlaying}
                volume={volume}
                muted={isMuted}
                onProgress={handleProgress}
                onDuration={handleDuration}
                style={{ aspectRatio: '16/9' }}
                config={{
                  youtube: {
                    playerVars: { modestbranding: 1 }
                  }
                }}
              />
            </Suspense>

            <Box p={4}>
              <VStack spacing={4}>
                <Progress value={(progress / duration) * 100} size="sm" width="100%" />
                
                <HStack width="100%" spacing={4}>
                  <IconButton
                    aria-label="Play or pause"
                    icon={isPlaying ? <FaPause /> : <FaPlay />}
                    onClick={handlePlayPause}
                  />
                  
                  <Text fontSize="sm" width="100px">
                    {formatTime(progress)} / {formatTime(duration)}
                  </Text>

                  <HStack flex={1}>
                    <IconButton
                      aria-label="Toggle mute"
                      icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                      onClick={handleMuteToggle}
                    />
                    <Slider
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      min={0}
                      max={1}
                      step={0.1}
                      width="100px"
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </HStack>

                  <IconButton
                    aria-label="Toggle fullscreen"
                    icon={isFullscreen ? <FaCompress /> : <FaExpand />}
                    onClick={handleFullscreenToggle}
                  />
                </HStack>
              </VStack>
            </Box>
          </Box>
        </Box>

        <Box>
          <HStack justify="space-between" mb={4}>
            <Heading size="md">Notes</Heading>
            <Button
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes ? 'Hide Notes' : 'Show Notes'}
            </Button>
          </HStack>

          <Collapse in={showNotes}>
            <VStack spacing={4} align="stretch">
              <HStack>
                <Textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Add a note about this part of the video..."
                  resize="none"
                />
                <Button onClick={handleAddNote}>
                  Add Note
                </Button>
              </HStack>

              <Box maxH="300px" overflowY="auto">
                {notes.map((note, index) => (
                  <Box
                    key={index}
                    p={3}
                    bg={bgColor}
                    borderRadius="md"
                    border="1px"
                    borderColor={borderColor}
                    mb={2}
                  >
                    <HStack justify="space-between" mb={2}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSeekToNote(note.timestamp)}
                      >
                        {formatTime(note.timestamp)}
                      </Button>
                    </HStack>
                    <Text>{note.content}</Text>
                  </Box>
                ))}
              </Box>
            </VStack>
          </Collapse>
        </Box>
      </VStack>
    </Container>
  )
}

export default VideoPlayer
