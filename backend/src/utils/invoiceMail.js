const PAYMENT_METHOD_LABELS = {
  card: 'Credit / debit card',
  upi: 'UPI',
  netbanking: 'Net banking',
  wallet: 'Wallet',
}

export function buildInvoiceEmailHtml({
  invoiceId,
  donorName,
  donorEmail,
  campaignTitle,
  amount,
  currency,
  frequency,
  paymentMethod,
  paidAt,
}) {
  const freqLabel = frequency === 'monthly' ? 'Monthly pledge' : 'One-time gift'
  const payLabel = PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod || '—'

  const rows = [
    ['Invoice', invoiceId],
    ['Date', paidAt],
    ['Donor', donorName || '—'],
    ['Email', donorEmail],
    ['Campaign', campaignTitle],
    ['Type', freqLabel],
    ['Payment method', payLabel],
    ['Amount', `${currency} ${Number(amount).toLocaleString('en-IN')}`],
  ]

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;width:160px;">${escapeHtml(k)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${escapeHtml(String(v))}</td></tr>`
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111827;">
  <p style="font-size:14px;color:#047857;">Thank you for supporting our mission.</p>
  <h1 style="font-size:20px;margin:0 0 16px;">Donation receipt</h1>
  <table style="border-collapse:collapse;font-size:14px;max-width:560px;">${tableRows}</table>
  <p style="margin-top:20px;font-size:12px;color:#6b7280;">This is an official acknowledgment for your contribution. For tax or corporate matching, retain this email.</p>
</body>
</html>`
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
