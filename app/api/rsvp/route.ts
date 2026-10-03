import { NextResponse } from 'next/server';

type RSVPBody = {
  name?: string;
  email?: string;
  phone?: string;
  guests?: string;
  attending?: string;
  message?: string;
};

export async function POST(request: Request) {
  let body: RSVPBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email) || !['yes', 'no'].includes(body.attending ?? '')) {
    return NextResponse.json({ ok: false, error: 'Missing or invalid fields' }, { status: 422 });
  }

  const rsvp = {
    name: name.slice(0, 120),
    email: email.slice(0, 160),
    phone: body.phone?.trim().slice(0, 40) ?? '',
    guests: body.attending === 'yes' ? Number(body.guests) || 1 : 0,
    attending: body.attending === 'yes',
    message: body.message?.trim().slice(0, 2000) ?? '',
    receivedAt: new Date().toISOString(),
  };

  // Connect your store of choice here (Google Sheets, Airtable, a database, email…).
  console.info('[rsvp]', rsvp);

  return NextResponse.json({ ok: true });
}
