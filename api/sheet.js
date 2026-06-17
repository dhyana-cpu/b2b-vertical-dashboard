export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const url = 'https://script.google.com/macros/s/AKfycbxhky8biBFODIhsIFysXlqhygRPy8c6DgrYUyE-dZS9-9oKtrh5RfM_DysgOYJDyQEL/exec';
  try {
    const r = await fetch(url, { redirect: 'follow' });
    const text = await r.text();
    const data = JSON.parse(text);
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: e.toString() });
  }
}
