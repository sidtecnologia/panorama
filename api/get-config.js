export default (req, res) => {
  // Las claves se leen automáticamente del entorno de Vercel (Production/Preview/Development)
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  // DIAGNÓSTICO: Imprimir si las variables se cargaron (visible en los logs de Vercel)
  console.log('--- Diagnóstico API Config ---');
  console.log('URL Cargada:', !!SUPABASE_URL); // Mostrará 'true' o 'false'
  console.log('ANON_KEY Cargada:', !!SUPABASE_ANON_KEY);
  console.log('------------------------------');

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Si falta alguna clave, retorna un error claro al cliente (app.js)
    return res.status(500).json({ 
      error: 'Variables de entorno de Supabase faltantes en la configuración de Vercel.',
      url: null,
      anonKey: null
    });
  }

  // Retorna las claves públicas al frontend
  res.status(200).json({
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
  });
};
