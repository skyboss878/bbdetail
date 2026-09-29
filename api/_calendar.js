const { google } = require('googleapis');
async function addToCalendar({ title, start, minutes = 120, description = '', location = '' }) {
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const auth = new google.auth.JWT(creds.client_email, null, creds.private_key, ['https://www.googleapis.com/auth/calendar']);
  const cal = google.calendar({ version: 'v3', auth });
  const s = new Date(start);
  const e = new Date(s.getTime() + minutes * 60000);
  const r = await cal.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    requestBody: {
      summary: title, description, location,
      start: { dateTime: s.toISOString(), timeZone: 'America/Los_Angeles' },
      end: { dateTime: e.toISOString(), timeZone: 'America/Los_Angeles' },
      reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 30 }] }
    }
  });
  return r.data.id;
}
module.exports = { addToCalendar };
