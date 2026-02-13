import { useState } from 'react'

interface PaymentModalProps {
  amount: number
  projectTitle: string
  onClose: () => void
}

function PaymentModal({ amount, projectTitle, onClose }: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: integrate with Stripe API
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess(true)
    } catch (err) {
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">${amount} has been sent for "{projectTitle}"</p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Make Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <div className="bg-gray-50 p-3 rounded mb-4">
          <p className="text-sm text-gray-600">Project: {projectTitle}</p>
          <p className="text-lg font-bold">${amount}</p>
        </div>

        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="4242 4242 4242 4242"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-1 text-sm font-medium">Expiry</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="MM/YY"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">CVC</label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="123"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Processing...' : `Pay $${amount}`}
          </button>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Test mode - use card 4242 4242 4242 4242
          </p>
        </form>
      </div>
    </div>
  )
}

export default PaymentModal

