// api/calendar-create-event.js
const { google } = require('googleapis');
const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: process.env.FIREBASE_PROJECT_ID,
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ error: 'Missing bookingId' });
    }

    const doc = await firestore.collection('bookings').doc(bookingId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const b = doc.data();

    const auth = new google.auth.JWT(
      process.env.GCAL_CLIENT_EMAIL,
      null,
      process.env.GCAL_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    const startDateTime = `${b.date}T${(b.time || '09:00')}:00`;
    const endDateTime = `${b.date}T${(b.time || '11:00')}:00`;

    await calendar.events.insert({
      calendarId: process.env.DUSTLESS_CALENDAR_ID,
      requestBody: {
        summary: `Cleaning - ${b.name} (${b.service})`,
        description: `Address: ${b.address}\nMess level: ${b.mess}\nBooking ID: ${bookingId}`,
        start: { dateTime: startDateTime, timeZone: 'America/Toronto' },
        end: { dateTime: endDateTime, timeZone: 'America/Toronto' },
      },
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Calendar error:', err);
    res.status(500).json({ error: 'Calendar insert failed' });
  }
};