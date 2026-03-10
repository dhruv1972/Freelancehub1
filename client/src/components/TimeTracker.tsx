import { useState, useEffect, useCallback } from 'react'
import { api, withUser } from '../services/api'

interface TimeEntryType {
  _id: string
  freelancerId: string
  projectId: string
  startTime: string
  endTime?: string
  description?: string
  durationMinutes?: number
  createdAt?: string
}

interface TimeTrackerProps {
  projectId: string
  userId: string
  userEmail: string
}

function TimeTracker({ projectId, userId, userEmail }: TimeTrackerProps) {
  const [entries, setEntries] = useState<TimeEntryType[]>([])
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null)
  const [activeStartTime, setActiveStartTime] = useState<Date | null>(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingEntries, setLoadingEntries] = useState(true)

  const loadEntries = useCallback(async () => {
    setLoadingEntries(true)
    try {
      const res = await api.get(`/time/project/${projectId}`)
      const list = Array.isArray(res.data) ? res.data : []
      setEntries(list)
      const myActive = list.find(
        (e: TimeEntryType) =>
          String(e.freelancerId) === String(userId) && !e.endTime
      )
      if (myActive) {
        setActiveEntryId(myActive._id)
        setActiveStartTime(new Date(myActive.startTime))
      } else {
        setActiveEntryId(null)
        setActiveStartTime(null)
      }
    } catch {
      setEntries([])
      setActiveEntryId(null)
      setActiveStartTime(null)
    } finally {
      setLoadingEntries(false)
    }
  }, [projectId, userId])

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (!activeStartTime) return
    const tick = () => {
      setSeconds(Math.floor((Date.now() - activeStartTime.getTime()) / 1000))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [activeStartTime])

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = async () => {
    if (!description.trim()) {
      alert('Please enter a description (e.g. what you\'re working on)')
      return
    }
    setLoading(true)
    try {
      const api = withUser(userEmail)
      const res = await api.post('/time/start', {
        freelancerId: userId,
        projectId,
        description: description.trim(),
      })
      const entry = res.data
      setActiveEntryId(entry._id)
      setActiveStartTime(new Date(entry.startTime))
      setDescription('')
      await loadEntries()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to start timer')
    } finally {
      setLoading(false)
    }
  }

  const handleStop = async () => {
    if (!activeEntryId) return
    setLoading(true)
    try {
      const api = withUser(userEmail)
      await api.post('/time/stop', { timeEntryId: activeEntryId })
      setActiveEntryId(null)
      setActiveStartTime(null)
      setSeconds(0)
      await loadEntries()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to stop timer')
    } finally {
      setLoading(false)
    }
  }

  const myEntries = entries.filter((e) => String(e.freelancerId) === String(userId))
  const totalMinutes = myEntries.reduce((sum, e) => sum + (e.durationMinutes || 0), 0)

  const cardStyle: React.CSSProperties = {
    padding: 24,
    borderRadius: 12,
    border: '1px solid #333',
    background: '#111827',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 44,
    padding: '0 14px',
    fontSize: 14,
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: 10,
    color: '#fff',
    outline: 'none',
  }

  if (loadingEntries) {
    return (
      <div className="card" style={cardStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Time tracker</h2>
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Loading time entries...</p>
      </div>
    )
  }

  return (
    <div className="card" style={cardStyle}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Track time</h2>
      <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 16 }}>
        Log time spent on this project. Start the timer when you begin work and stop when you pause or finish.
      </p>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 28, fontFamily: 'monospace', fontWeight: 600, color: '#5eead4', marginBottom: 12, textAlign: 'center' }}>
          {formatTime(seconds)}
        </p>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
          placeholder="What are you working on?"
          disabled={!!activeEntryId}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          {activeEntryId ? (
            <button
              type="button"
              onClick={handleStop}
              disabled={loading}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 10,
                border: 'none',
                background: 'rgba(248,113,113,0.2)',
                color: '#f87171',
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Stopping...' : 'Stop timer'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStart}
              disabled={loading || !description.trim()}
              className="btn-primary"
              style={{
                flex: 1,
                height: 44,
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                opacity: loading || !description.trim() ? 0.6 : 1,
              }}
            >
              {loading ? 'Starting...' : 'Start timer'}
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(94,234,212,0.08)', border: '1px solid rgba(94,234,212,0.2)', marginBottom: 20, textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 2 }}>Total time logged on this project</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#5eead4' }}>
          {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
        </p>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#e5e7eb', marginBottom: 10 }}>Your time entries</h3>
      {myEntries.length === 0 ? (
        <p style={{ fontSize: 13, color: '#777' }}>No time logged yet. Start the timer to add an entry.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {myEntries.map((entry) => (
            <div
              key={entry._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#0b0b0b',
              }}
            >
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#e5e7eb' }}>
                  {entry.description || 'No description'}
                </p>
                <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                  {new Date(entry.startTime).toLocaleString()}
                  {entry.endTime ? ` · ${entry.durationMinutes ?? 0} min` : ' · in progress'}
                </p>
              </div>
              {entry.durationMinutes != null && (
                <span style={{ fontSize: 13, fontWeight: 600, color: '#5eead4' }}>
                  {Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TimeTracker
