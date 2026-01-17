import { useEffect } from 'react'
import { initSocket, getSocket } from '../services/socketService'

export const useSocket = () => {
  useEffect(() => { initSocket() }, [])
  return getSocket()
}
