import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(accountSid, authToken);

const whatsappNumber = "whatsapp:+14155238886";

export async function sendWatsApp(to: string, message: string) {
  try {
    const formattedTo = to.startsWith("whatsapp:")
      ? to
      : `whatsapp:${to}`;

    await client.messages.create({
      from: whatsappNumber,
      to: formattedTo,
      body: message,
    });

    console.log(`WhatsApp sent to ${formattedTo}: ${message}`);
  } catch (err: any) {
    console.error("WhatsApp Error:", err.message);
    throw err;
  }
}
