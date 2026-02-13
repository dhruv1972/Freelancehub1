import { useState, useEffect } from 'react'

interface TimeTrackerProps {
  projectId: string
}

function TimeTracker({ projectId: _projectId }: TimeTrackerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [description, setDescription] = useState('')
  const [entries, setEntries] = useState([
    { _id: '1', description: 'Homepage layout', durationMinutes: 45, startTime: '2026-02-01T10:00:00' },
    { _id: '2', description: 'Login page styling', durationMinutes: 30, startTime: '2026-02-01T14:00:00' },
    { _id: '3', description: 'API integration', durationMinutes: 60, startTime: '2026-02-02T10:00:00' },
  ])

  // timer logic
  useEffect(() => {
    let interval: number | undefined
    if (isRunning) {
      interval = window.setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    if (!description.trim()) {
      alert('Please enter a description')
      return
    }
    setIsRunning(true)
    // TODO: call API to start timer
  }

  const handleStop = () => {
    setIsRunning(false)
    const minutes = Math.floor(seconds / 60)
    
    // add to entries
    setEntries([{
      _id: Date.now().toString(),
      description,
      durationMinutes: minutes || 1,
      startTime: new Date().toISOString()
    }, ...entries])

    setSeconds(0)
    setDescription('')
    // TODO: call API to stop timer
  }

  const totalMinutes = entries.reduce((sum, e) => sum + e.durationMinutes, 0)

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Time Tracker</h2>
      
      {/* Timer */}
      <div className="text-center mb-6">
        <p className="text-4xl font-mono font-bold mb-4">{formatTime(seconds)}</p>
        
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          placeholder="What are you working on?"
          disabled={isRunning}
        />

        {isRunning ? (
          <button
            onClick={handleStop}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Stop Timer
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Start Timer
          </button>
        )}
      </div>

      {/* Total time */}
      <div className="bg-blue-50 p-3 rounded mb-4 text-center">
        <p className="text-sm text-gray-600">Total Time Logged</p>
        <p className="font-bold text-lg">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</p>
      </div>

      {/* Time entries */}
      <h3 className="font-semibold mb-2">Recent Entries</h3>
      <div className="space-y-2">
        {entries.map(entry => (
          <div key={entry._id} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="text-sm font-medium">{entry.description}</p>
              <p className="text-xs text-gray-500">
                {new Date(entry.startTime).toLocaleDateString()}
              </p>
            </div>
            <span className="text-sm font-medium">
              {Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TimeTracker

