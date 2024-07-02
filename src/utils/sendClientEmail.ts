import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendClientEmail(params: {subject:string,emailContent:string,identifier:string[],sender:string }) {
  const { emailContent,subject,identifier, sender} = params
  identifier.push("anaselmouden99@gmail.com")
  try {
    const data = await resend.emails.send({
      from: `${sender} <onboarding@resend.dev>`,
      to: ["anaselmouden99@gmail.com"],
      subject: subject,
      html:emailContent
    })
    return { success: false, data }
  } catch (error) {
    throw new Error('Failed to send email.')
  }
}
