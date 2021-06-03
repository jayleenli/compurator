import React, { useEffect, useState, useCallback, useMemo, useContext } from "react"
import LoadingBar from "react-top-loading-bar"

type LoadingContextValue = {
  startLoader: () => void
  completeLoader: () => void
}

const LoadingContext = React.createContext<LoadingContextValue>(undefined as any)

export function useLoading() {
  return useContext(LoadingContext)
}

export const LoadingProvider: React.FC = props => {
  const { children } = props

  const [progress, setProgress] = useState(0)
  const [increasing, setIncreasing] = useState(false)

  useEffect(() => {
    let interval: number

    const PERFORMANCE_FACTOR = 5

    if (increasing) {
      interval = setInterval(() => {
        setProgress(progress => Math.min(progress + (Math.random() * PERFORMANCE_FACTOR), 85))
      }, 250)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [increasing])

  const onComplete = useCallback(() => {
    setIncreasing(false)
    setProgress(0)
  }, [])

  const value = useMemo(() => ({
    startLoader() {
      setIncreasing(true)
      setProgress(0)
    },
    completeLoader() {
      setProgress(100)
    }
  }), [])

  return (
    <LoadingContext.Provider value={value}>
      <LoadingBar progress={progress} onComplete={onComplete}/>
      {children}
    </LoadingContext.Provider>
  )
}



