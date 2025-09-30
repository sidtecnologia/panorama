export default (req, res) => {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET');
res.setHeader('Content-Type', 'application/json');

if (req.method !== 'GET') {
res.status(405).send('Método no permitido');
return;
}


res.status(200).json({
url: process.env.SUPABASE_URL,
anonKey: process.env.SUPABASE_ANON_KEY,
});
};