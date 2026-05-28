import { GoogleGenerativeAI } from '@google/generative-ai';

// Instanciamos el cliente usando la clave de las variables de entorno
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Verificamos que la clave exista
if (!apiKey || apiKey === 'tu_clave_api_aqui') {
  console.warn('⚠️ Falta la clave de API de Gemini. Añade VITE_GEMINI_API_KEY a tu archivo .env.local');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

export interface AIRecommendationResponse {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * Obtiene recomendaciones de platos basadas en los ingredientes dados.
 * @param ingredientes Lista de nombres de ingredientes disponibles en el inventario.
 * @returns Sugerencias en formato Markdown.
 */
export async function sugerirPlatosPorIngredientes(ingredientes: string[]): Promise<AIRecommendationResponse> {
  try {
    if (!apiKey || apiKey === 'tu_clave_api_aqui') {
      return { 
        success: false, 
        error: 'No se ha configurado la clave API de Gemini. Por favor, añádela en tu archivo .env.local.' 
      };
    }

    if (!ingredientes || ingredientes.length === 0) {
      return {
        success: false,
        error: 'No has proporcionado ningún ingrediente.'
      };
    }

    // Usamos el modelo gemini-3.5-flash (suele estar menos saturado que los alias latest)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Construimos el prompt (instrucción) para la IA
    const prompt = `
Eres un chef experto. Tengo los siguientes ingredientes (con su unidad de medida): ${ingredientes.join(', ')}. 

Sugiéreme 3 platos deliciosos y muy rápidos de hacer.
Escribe un objeto JSON válido con este formato exacto, sin bloques de código markdown (\`\`\`json) ni texto adicional:
{
  "platos": [
    {
      "nombre": "Nombre del plato",
      "descripcion": "Instrucción muy breve (1 línea) de cómo prepararlo.",
      "ingredientes_usados": [
        { "nombre": "nombre del ingrediente SIN la unidad de medida", "cantidad": 1.5 }
      ],
      "faltan": ["ingrediente faltante 1"]
    }
  ]
}
Nota para cantidades: Usa sentido común para la cantidad (ej. 0.2 para 200g si la unidad es kg, 2 para unidades sueltas, etc).
`;

    // Intentamos hasta 3 veces por si hay errores 503 de servidores saturados
    let intentos = 0;
    const maxIntentos = 3;
    let ultimoError: any = null;

    while (intentos < maxIntentos) {
      try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        return { success: true, data: responseText };
      } catch (error: any) {
        ultimoError = error;
        // Si el error es por sobrecarga (503), esperamos un poco y reintentamos
        if (error.message && error.message.includes('503')) {
          intentos++;
          if (intentos < maxIntentos) {
            console.warn(`Servidor de IA saturado (intento ${intentos}/${maxIntentos}). Reintentando en 2 segundos...`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
            continue;
          }
        } else {
          // Si es otro error, lo lanzamos para salir del bucle
          throw error;
        }
      }
    }

    // Si salimos del bucle es que agotamos los intentos
    throw ultimoError;

  } catch (error: any) {
    console.error('Error al contactar con la IA:', error);
    return { success: false, error: error.message || 'Error desconocido al generar la sugerencia.' };
  }
}
