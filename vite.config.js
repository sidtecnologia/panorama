import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

                            // Base '/' es vital para que los assets carguen bien en Vercel
                            base: '/',

                            server: {
                              // Proxy para probar las funciones de la API localmente si usas vercel dev
                              proxy: {
                                '/api': {
                                  target: 'http://localhost:3000',
                            changeOrigin: true,
                                },
                              },
                            },

                            build: {
                              // Optimización de salida
                              outDir: 'dist',
                            assetsDir: 'assets',
                            // Generar sourcemaps puede ayudarte a depurar en producción si hay errores
                            sourcemap: false,
                            // Limpiar la carpeta de salida antes de construir
                            emptyOutDir: true,
                            },

                            // Asegura que los archivos en la carpeta 'public' se copien tal cual
                            publicDir: 'public',
});
