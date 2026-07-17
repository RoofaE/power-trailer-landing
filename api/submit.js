export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    // 1. Send the email via Web3Forms
    const web3formsRes = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_KEY,
        subject: data.subject || 'New Mobile Power Station Inquiry',
        name: data.name,
        company: data.company,
        phone: data.phone,
        email: data.email,
        location: data.location,
        primary_application: data.primary_application,
        message: data.message,
        request_type: data.request_type
      })
    });
    const web3formsResult = await web3formsRes.json();

    // 2. Save the same submission to Supabase
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/submissions`, {
      method: 'POST',
      headers: {
        apikey: process.env.SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        name: data.name,
        company: data.company,
        phone: data.phone,
        email: data.email,
        location: data.location,
        primary_application: data.primary_application,
        message: data.message,
        request_type: data.request_type
      })
    });

    return res.status(200).json({ success: web3formsResult.success });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}