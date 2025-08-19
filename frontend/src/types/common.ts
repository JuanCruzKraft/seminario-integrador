export interface ResultadoOperacion {
  status: number;
  mensaje: string;
}

// Base para todas las respuestas
export interface BaseResponse {
  resultado: ResultadoOperacion;
}