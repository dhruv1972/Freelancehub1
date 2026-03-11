import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { api } from '../services/api'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

export interface PaymentModalProps {
  projectId: string
  amount: number
  projectTitle: string
  clientId: string
  onSuccess?: () => void
  onClose: () => void
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#e5e7eb',
      '::placeholder': { color: '#9ca3af' },
      iconColor: '#5eead4',
    },
    invalid: {
      color: '#f87171',
      iconColor: '#f87171',
    },
  },
}

function PaymentForm({ projectId, clientId, amount, projectTitle, onSuccess }: PaymentModalProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    try {
      const { data } = await api.post<{ client_secret: string; paymentIntentId: string }>('/payments/intent', {
        projectId,
        amount,
        clientId,
      })
      const { client_secret, paymentIntentId } = data

      const card = elements.getElement(CardElement)
      if (!card) {
        setError('Card form not ready')
        setLoading(false)
        return
      }

      const { error: confirmError } = await stripe.confirmCardPayment(client_secret, {
        payment_method: { card },
      })
      if (confirmError) {
        setError(confirmError.message || 'Payment failed')
        setLoading(false)
        return
      }

      await api.post('/payments/confirm', { paymentIntentId })
      onSuccess?.()
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} data-project-id={(window as any).__paymentModalProjectId} data-client-id={(window as any).__paymentModalClientId}>
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-1">Project: {projectTitle}</p>
        <p className="text-lg font-semibold text-white">${amount.toFixed(2)}</p>
      </div>
      <div className="mb-4 p-3 rounded-lg border border-[#333] bg-[#1a1a1a]">
        <CardElement options={cardElementOptions} />
      </div>
      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="w-full bg-[#5eead4] text-[#0f172a] py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing…' : `Pay $${amount.toFixed(2)}`}
      </button>
      <p className="text-xs text-gray-500 mt-3 text-center">Secure payment by Stripe. Use 4242 4242 4242 4242 for test.</p>
    </form>
  )
}

function PaymentModal({ projectId, amount, projectTitle, clientId, onSuccess, onClose }: PaymentModalProps) {
  const [success, setSuccess] = useState(false)

  const handleSuccess = () => {
    setSuccess(true)
    onSuccess?.()
  }

  const handleClose = () => {
    onSuccess?.()
    onClose()
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] border border-[#333] p-8 rounded-xl max-w-md w-full mx-4 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-white mb-2">Payment successful</h2>
          <p className="text-gray-400 mb-6">${amount.toFixed(2)} has been sent for &quot;{projectTitle}&quot;. The freelancer has been notified.</p>
          <button type="button" onClick={handleClose} className="bg-[#5eead4] text-[#0f172a] px-6 py-2.5 rounded-lg font-semibold hover:opacity-90">
            Close
          </button>
        </div>
      </div>
    )
  }

  const content = stripePromise ? (
    <Elements stripe={stripePromise}>
      <PaymentForm
        projectId={projectId}
        clientId={clientId}
        amount={amount}
        projectTitle={projectTitle}
        onSuccess={handleSuccess}
        onClose={onClose}
      />
    </Elements>
  ) : (
    <MockPaymentForm projectId={projectId} clientId={clientId} amount={amount} projectTitle={projectTitle} onSuccess={handleSuccess} onClose={onClose} />
  )

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#1a1a1a] border border-[#333] p-8 rounded-xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Pay freelancer</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        {content}
      </div>
    </div>
  )
}

function MockPaymentForm({ projectId, clientId, amount, projectTitle, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post<{ paymentIntentId: string }>('/payments/intent', { projectId, amount, clientId })
      await api.post('/payments/confirm', { paymentIntentId: data.paymentIntentId })
      onSuccess?.()
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-1">Project: {projectTitle}</p>
        <p className="text-lg font-semibold text-white">${amount.toFixed(2)}</p>
      </div>
      <p className="text-sm text-gray-500 mb-4">Stripe is not configured. This will simulate a successful payment (no charge).</p>
      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-[#5eead4] text-[#0f172a] py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Processing…' : `Simulate pay $${amount.toFixed(2)}`}
      </button>
    </>
  )
}

export default PaymentModal
