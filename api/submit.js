module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    // Save the submission to Supabase
    const supabaseRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/submissions`, {
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

    if (!supabaseRes.ok) {
      const errText = await supabaseRes.text();
      return res.status(500).json({
        success: false,
        error: 'Supabase failed (' + supabaseRes.status + '): ' + errText.slice(0, 300)
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}