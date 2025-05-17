import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}

const theme = extendTheme({
  config,
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800'
      }
    })
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === 'dark' ? 'brand.200' : 'brand.500',
          color: props.colorMode === 'dark' ? 'gray.800' : 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.300' : 'brand.600',
          }
        }),
        ghost: (props: any) => ({
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
          }
        })
      }
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
          borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
          boxShadow: 'sm'
        }
      })
    },
    Link: {
      baseStyle: (props: any) => ({
        color: props.colorMode === 'dark' ? 'white' : 'gray.700',
        _hover: {
          textDecoration: 'none',
          color: props.colorMode === 'dark' ? 'brand.200' : 'brand.600'
        }
      })
    },
    Input: {
      variants: {
        outline: (props: any) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
            borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.300',
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'gray.500' : 'gray.400'
            },
            _focus: {
              borderColor: props.colorMode === 'dark' ? 'brand.300' : 'brand.500',
              boxShadow: `0 0 0 1px ${props.colorMode === 'dark' ? 'brand.300' : 'brand.500'}`
            }
          }
        })
      }
    },
    Select: {
      variants: {
        outline: (props: any) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
            borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.300',
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'gray.500' : 'gray.400'
            }
          }
        })
      }
    }
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  },
  colors: {
    brand: {
      50: '#E6F6FF',
      100: '#BAE3FF',
      200: '#7CC4FA',
      300: '#47A3F3',
      400: '#2186EB',
      500: '#0967D2',
      600: '#0552B5',
      700: '#03449E',
      800: '#01337D',
      900: '#002159',
    },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    }
  }
})

export default theme 