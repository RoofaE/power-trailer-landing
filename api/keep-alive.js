module.exports = async (req, res) => {
  // Only allow Vercel's own cron trigger (or manual testing with the same secret)
  const authHeader = req.headers['authorization'];
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    // A trivial read counts as database activity and resets Supabase's inactivity timer
    const supabaseRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/submissions?select=id&limit=1`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_KEY
        }
      }
    );

    if (!supabaseRes.ok) {
      const errText = await supabaseRes.text();
      return res.status(500).json({ success: false, error: errText.slice(0, 300) });
    }

    return res.status(200).json({ success: true, pinged_at: new Date().toISOString() });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};