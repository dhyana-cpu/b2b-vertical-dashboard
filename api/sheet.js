export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const url = 'https://script.google.com/macros/s/AKfycbwlZ0Ei--gRGtV3QiKLbZb_zvA23r7_potGuR5qnDSLerHIJYiSi3QJBx0yCoZO7d7jVA/exec';
  try {
    const r = await fetch(url, { redirect: 'follow' });
    const data = await r.json();
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: e.toString() });
  }
}
