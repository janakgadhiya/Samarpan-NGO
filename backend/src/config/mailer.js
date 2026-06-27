import nodemailer from 'nodemailer'

let transporter

function getTransporter() {
  if (transporter) return transporter
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (host && user && pass) {
    const port = Number(process.env.SMTP_PORT)
    if (!Number.isFinite(port)) {
      throw new Error('SMTP_PORT must be set in backend/.env when SMTP_HOST is configured')
    }
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    })
  } else {
    transporter = nodemailer.createTransport({
      jsonTransport: true,
    })
  }
  return transporter
}

export async function sendMail({ to, subject, text, html }) {
  const from = process.env.EMAIL_FROM
  if (!from) {
    throw new Error('EMAIL_FROM must be set in backend/.env')
  }
  const t = getTransporter()
  const info = await t.sendMail({ from, to, subject, text, html })

  if (t.options.jsonTransport) {
    const parsed = JSON.parse(info.message)
    console.log('[email:dev]', { to, subject, text: parsed.text || text })
  }
  return info
}
