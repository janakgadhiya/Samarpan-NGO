import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../api/client.js'

export default function DonatePayment() {
  const { campaignId } = useParams()
  const { user, loading: authLoading } = useAuth()
  const [campaign, setCampaign] = useState(null)
  const [loadErr, setLoadErr] = useState('')
  const [amount, setAmount] = useState('500')
  const [frequency, setFrequency] = useState('once')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [submitErr, setSubmitErr] = useState('')
  const [success, setSuccess] = useState(null)
  const [busy, setBusy] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    const loadRazorpay = () => {
      if (document.getElementById('razorpay-sdk')) {
        setRazorpayLoaded(true)
        return
      }
      const script = document.createElement('script')
      script.id = 'razorpay-sdk'
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => setRazorpayLoaded(true)
      script.onerror = () => setSubmitErr('Failed to load Razorpay payment gateway')
      document.body.appendChild(script)
    }
    loadRazorpay()
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api(`/api/campaigns/${campaignId}`)
        if (!cancelled) setCampaign(data.campaign)
      } catch (e) {
        if (!cancelled) setLoadErr(e.message || 'Campaign not found')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [campaignId])

  if (!authLoading && !user) {
    const redirect = `/donate/${campaignId}/pay`
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />
  }

  async function onPay(e) {
    e.preventDefault()
    setSubmitErr('')
    setSuccess(null)
    const n = Number(amount)
    if (!Number.isFinite(n) || n < 1) {
      setSubmitErr('Enter a valid amount')
      return
    }

    if (!razorpayLoaded) {
      setSubmitErr('Razorpay SDK is still loading. Please wait or refresh.')
      return
    }

    setBusy(true)
    try {
      // 1. Create order on backend (which also creates the initial donation record)
      const data = await api('/api/donations', {
        method: 'POST',
        body: JSON.stringify({
          campaignId,
          amount: n,
          frequency,
          paymentMethod,
        }),
      })

      if (!data.orderId) {
        throw new Error('No Razorpay order ID returned from backend')
      }

      // 2. Open Razorpay Checkout Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: data.amount,
        currency: data.currency,
        name: 'Samarpan NGO',
        description: `Donation for ${data.donation.campaignTitle}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // 3. Verify payment on backend
            const verifyData = await api('/api/donations/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                donationId: data.donation.id
              }),
            })
            setSuccess(verifyData.donation)
          } catch (err) {
            setSubmitErr(err.message || 'Payment verification failed')
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#059669', // Emerald 600
        },
        modal: {
          ondismiss: function () {
            setSubmitErr('Payment cancelled')
            setBusy(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        setSubmitErr(response.error.description || 'Payment failed')
      })
      rzp.open()

    } catch (ex) {
      setSubmitErr(ex.message || 'Payment initiation failed')
    } finally {
      // Don't set busy to false here because Razorpay modal handles the async user flow
      setBusy(false) 
    }
  }

  if (authLoading || (!campaign && !loadErr)) {
    return (
      <div className="min-h-[55svh] bg-emerald-50 px-5 py-10 pb-16">
        <p className="text-center text-slate-500">Loading…</p>
      </div>
    )
  }

  if (loadErr) {
    return (
      <div className="min-h-[55svh] bg-emerald-50 px-5 py-10 pb-16">
        <p className="mb-4 text-center text-red-700">{loadErr}</p>
        <div className="text-center">
          <Link to="/donate" className="font-semibold text-teal-600">
            ← Back to campaigns
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-[55svh] bg-slate-50 px-5 py-10 pb-16 flex flex-col items-center">
        
        {/* Printable Receipt Card */}
        <div id="receipt-card" className="w-full max-w-[480px] bg-white rounded-t-xl rounded-b-sm shadow-xl overflow-hidden print:shadow-none print:max-w-full">
          
          {/* Receipt Header */}
          <div className="bg-emerald-900 px-8 py-6 text-center print:bg-white print:text-black print:border-b-2 print:border-black">
             <h1 className="text-2xl font-black text-white tracking-widest uppercase font-heading print:text-black">Samarpan</h1>
             <p className="text-emerald-300 text-sm tracking-wider uppercase mt-1 print:text-slate-600">Official Donation Receipt</p>
          </div>

          <div className="p-8">
             <div className="flex justify-between items-end border-b border-slate-200 pb-6 mb-6">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Receipt No.</p>
                   <p className="text-lg font-mono font-bold text-slate-800">{success.invoiceId}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                   <p className="text-sm font-semibold text-slate-700">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
             </div>

             <div className="mb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Donor Details</p>
                <p className="text-base font-bold text-slate-800">{user?.name}</p>
                <p className="text-sm font-medium text-slate-600">{user?.email}</p>
             </div>

             <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100 print:border-black print:bg-transparent">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Supported Cause</p>
                <p className="text-base font-bold text-slate-800">{success.campaignTitle}</p>
             </div>

             <div className="flex justify-between items-center border-t-2 border-dashed border-slate-300 pt-6 mt-2">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
                   <p className="text-sm font-bold text-slate-700 capitalize">{success.paymentMethod}</p>
                   <p className="text-xs font-bold text-slate-500 mt-1 capitalize">({success.frequency})</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                   <p className="text-3xl font-black text-emerald-600 print:text-black">₹{Number(success.amount).toLocaleString('en-IN')}</p>
                </div>
             </div>
          </div>
          
          {/* Jagged bottom edge using CSS masking (Optional visual flair) */}
          <div className="h-4 w-full bg-slate-100 print:hidden" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)', backgroundColor: '#f8fafc' }}></div>
        </div>

        {/* Action Buttons (Hidden when printing via tailwind class 'print:hidden') */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 print:hidden">
          <button 
            onClick={() => window.print()}
            className="rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white hover:bg-emerald-500 hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            Download / Print Receipt
          </button>
          
          <Link
            to="/donate"
            className="rounded-full border-2 border-slate-300 bg-transparent px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-slate-600 hover:border-slate-800 hover:text-slate-800 hover:-translate-y-1 transition-all text-center"
          >
            Done
          </Link>
        </div>

        {/* Hidden Print Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            @page { size: auto; margin: 0; }
            body { margin: 0; padding: 0; }
            body * { visibility: hidden; }
            #receipt-card, #receipt-card * { visibility: visible; }
            #receipt-card { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; }
          }
        `}} />
      </div>
    )
  }
  
  // If the campaign has a limit and has been fully funded
  if (campaign && campaign.goalAmount > 0 && campaign.raisedAmount >= campaign.goalAmount) {
     return (
       <div className="min-h-[55svh] bg-emerald-50 px-5 py-10 pb-16 flex items-center justify-center">
         <div className="mx-auto max-w-[480px] w-full rounded-3xl border border-emerald-200 bg-white p-10 shadow-xl text-center">
           <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✨</div>
           <h1 className="mb-3 text-2xl font-black text-emerald-900 tracking-tight">Campaign Fully Funded!</h1>
           <p className="text-slate-600 mb-8 leading-relaxed">
             Thanks to our incredible community, <strong className="text-emerald-700">{campaign.title}</strong> has reached 100% of its target goal and is no longer accepting donations.
           </p>
           <Link to="/donate" className="inline-block w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition-all hover:bg-emerald-700">
             Explore other active campaigns
           </Link>
         </div>
       </div>
     )
  }

  return (
    <div className="min-h-[55svh] bg-emerald-50 px-5 py-10 pb-16">
      <div className="mx-auto max-w-[480px] rounded-2xl border border-emerald-200 bg-white p-8 pb-9 shadow-[0_12px_36px_rgba(4,120,87,0.12)]">
        <h1 className="mb-1 text-[1.45rem] font-semibold text-emerald-900">
          Complete your donation
        </h1>
        <p className="mb-5 text-[0.95rem] font-semibold text-teal-600">{campaign.title}</p>

        <form onSubmit={onPay}>
          {submitErr ? (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-800">
              {submitErr}
            </p>
          ) : null}

          <label className="mb-4 block text-sm font-semibold text-slate-700">
            Amount (₹)
            <input
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-base"
            />
          </label>

          <fieldset className="mb-4 rounded-[10px] border border-gray-300 px-4 pb-4 pt-3">
            <legend className="px-1.5 text-xs font-semibold text-slate-600">Frequency</legend>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <input
                  type="radio"
                  name="freq"
                  checked={frequency === 'once'}
                  onChange={() => setFrequency('once')}
                />
                One-time
              </label>
              <label className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <input
                  type="radio"
                  name="freq"
                  checked={frequency === 'monthly'}
                  onChange={() => setFrequency('monthly')}
                />
                Monthly
              </label>
            </div>
          </fieldset>

          <label className="mb-4 block text-sm font-semibold text-slate-700">
            Payment method
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-base"
            >
              <option value="card">Credit / debit card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net banking</option>
            </select>
          </label>

          <p className="mb-4 text-xs leading-normal text-slate-500">
            Secure payments processed by Razorpay.
          </p>

          <button
            type="submit"
            disabled={busy}
            className="w-full cursor-pointer rounded-[10px] border-none bg-emerald-700 py-2.5 text-[0.95rem] font-bold text-white disabled:cursor-not-allowed disabled:opacity-65"
          >
            {busy ? 'Processing…' : 'Pay now'}
          </button>
        </form>

        <Link to="/donate" className="mt-5 inline-block text-sm font-medium text-teal-600">
          ← Choose a different campaign
        </Link>
      </div>
    </div>
  )
}
