import { createContext, useContext, useReducer, useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true, error: null }
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: null }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload }
    default:
      return state
  }
}

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Axios interceptor for authentication
  useEffect(() => {
    const token = Cookies.get('token')
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Verify token and get user data
      verifyToken()
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }

    // Response interceptor for handling 401 errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout()
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      dispatch({ type: 'SET_USER', payload: response.data.user })
    } catch (error) {
      console.error('Token verification failed:', error)
      logout()
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { token, user } = response.data

      // Set token in cookies and axios headers
      Cookies.set('token', token, { expires: 7 }) // 7 days
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      return { success: true, user }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: message })
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await axios.post('/api/auth/register', userData)
      const { token, user } = response.data

      // Set token in cookies and axios headers
      Cookies.set('token', token, { expires: 7 })
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      return { success: true, user }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: message })
      return { success: false, error: message }
    }
  }

  const logout = () => {
    Cookies.remove('token')
    delete axios.defaults.headers.common['Authorization']
    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = (userData) => {
    dispatch({ type: 'SET_USER', payload: { ...state.user, ...userData } })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}