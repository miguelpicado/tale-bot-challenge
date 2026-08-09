/**
 * Juego de iconos de obstáculos. Uno por tipo, dibujados en el mismo lienzo de
 * 24×24 y con la misma familia de formas: masas rellenas, contorno oscuro del
 * mismo tono y detalle en blanco. Sustituye a los emoji, que cambiaban de
 * dibujo en cada sistema y a 24 px no se distinguían entre sí.
 */

const P = {
  // Alas de clip: dos alas simétricas sobre el cuerpo
  ALAS: (
    <>
      <path d="M11.2 7.4C8.4 3.6 4.6 2.3 2.3 3.9c-1.2.8-1 2.4.3 3.5 2 1.8 5 3.2 8.6 4.2z" fill="#7FE3E6" stroke="#00909A" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M12.8 7.4c2.8-3.8 6.6-5.1 8.9-3.5 1.2.8 1 2.4-.3 3.5-2 1.8-5 3.2-8.6 4.2z" fill="#7FE3E6" stroke="#00909A" strokeWidth="1.3" strokeLinejoin="round" />
      <rect x="10.1" y="8" width="3.8" height="12.6" rx="1.9" fill="#00909A" />
    </>
  ),
  // Brazos de clip: dos pinzas que salen del cuerpo
  BRAZOS: (
    <>
      <rect x="9.7" y="7.8" width="4.6" height="8.4" rx="2.1" fill="#D8500A" />
      <path d="M9.7 12H6.4M6.4 8.6v6.8M3.6 10.2v3.6" stroke="#FF8A3D" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M14.3 12h3.3M17.6 8.6v6.8M20.4 10.2v3.6" stroke="#FF8A3D" strokeWidth="2.6" strokeLinecap="round" />
    </>
  ),
  ARBOL: (
    <>
      <path d="M12 2.6 4.4 12h3L3.2 18.4h17.6L16.6 12h3z" fill="#3FBF6B" stroke="#1E7F44" strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="10.4" y="17.4" width="3.2" height="4.4" rx="1.2" fill="#8A5A2B" />
    </>
  ),
  MURO: (
    <>
      <rect x="2.6" y="6" width="18.8" height="12.6" rx="2" fill="#E38A63" stroke="#A9542F" strokeWidth="1.4" />
      <path d="M2.6 10.2h18.8M2.6 14.4h18.8M8.4 6v4.2M15.6 6v4.2M5.4 10.2v4.2M12 10.2v4.2M18.6 10.2v4.2M8.4 14.4v4.2M15.6 14.4v4.2" stroke="#A9542F" strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  // Puentes: un tramo de calzada que solo se cruza en un sentido
  PUENTE_NS: (
    <>
      <rect x="6.8" y="2.4" width="10.4" height="19.2" rx="2.4" fill="#B08454" stroke="#7A5630" strokeWidth="1.3" />
      <path d="M12 8.2v7.6" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="2.4 2.4" />
      <path d="M12 3.6 14.7 6.8H9.3z" fill="#FFFFFF" />
      <path d="M12 20.4 9.3 17.2h5.4z" fill="#FFFFFF" />
    </>
  ),
  PUENTE_EO: (
    <>
      <rect x="2.4" y="6.8" width="19.2" height="10.4" rx="2.4" fill="#B08454" stroke="#7A5630" strokeWidth="1.3" />
      <path d="M8.2 12h7.6" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="2.4 2.4" />
      <path d="M3.6 12 6.8 9.3v5.4z" fill="#FFFFFF" />
      <path d="M20.4 12 17.2 14.7V9.3z" fill="#FFFFFF" />
    </>
  ),
  FUEGO: (
    <>
      <path d="M12 2.2c3.7 3.3 6.3 6.1 6.3 9.9a6.3 6.3 0 1 1-12.6 0c0-2.1.9-3.8 2.2-5.3.2 1.3.9 2.2 1.9 2.6.7-2.7.9-5 2.2-7.2z" fill="#FF7A1B" stroke="#C93C05" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M12 12.6c1.9 1.7 2.9 2.9 2.9 4.2a2.9 2.9 0 0 1-5.8 0c0-1.3 1-2.5 2.9-4.2z" fill="#FFD166" />
    </>
  ),
  LAGO: (
    <>
      <rect x="2.4" y="5" width="19.2" height="14" rx="4" fill="#BFE9F7" stroke="#2A8FBF" strokeWidth="1.4" />
      <path d="M4.4 10.6c1.6-1.6 3.2-1.6 4.8 0s3.2 1.6 4.8 0 3.2-1.6 4.8 0M4.4 14.8c1.6-1.6 3.2-1.6 4.8 0s3.2 1.6 4.8 0 3.2-1.6 4.8 0" fill="none" stroke="#2A8FBF" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  // Fiesta: matasuegras y confeti — hay que parar y bailar
  FIESTA: (
    <>
      <path d="M2.4 21.6 9 8.4l6.6 6.6z" fill="#A78BFA" stroke="#6B46D6" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M6.2 15.4 11 20" stroke="#6B46D6" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="14.6" cy="4" r="1.5" fill="#00BFC4" />
      <circle cx="18.8" cy="6.6" r="1.7" fill="#FF5C1B" />
      <circle cx="21" cy="11.4" r="1.4" fill="#FFB020" />
      <rect x="16.6" y="12.4" width="2.8" height="2.8" rx=".8" fill="#E5326B" />
    </>
  ),
  VOZ: (
    <>
      <rect x="9" y="2.4" width="6" height="11.2" rx="3" fill="#4DE8EC" stroke="#00909A" strokeWidth="1.4" />
      <path d="M5.6 11.4a6.4 6.4 0 0 0 12.8 0" fill="none" stroke="#00909A" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17.8v3.4M8.8 21.2h6.4" stroke="#00909A" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  // Rotonda: una vuelta completa sin salirse de la casilla
  ROTONDA: (
    <>
      <path d="M19.6 8.6A8.2 8.2 0 1 0 20.2 12" fill="none" stroke="#3B82F6" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M21.4 3.2v5.6h-5.6z" fill="#1D4ED8" />
      <circle cx="12" cy="12" r="2.8" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1.3" />
    </>
  ),
  // Medio muro: obliga a media vuelta y seguir marcha atrás
  MEDIO_MURO: (
    <>
      <path d="M7.4 11.6V8.8a4.6 4.6 0 0 1 9.2 0v2.8" fill="none" stroke="#1A1410" strokeWidth="2" strokeLinecap="round" />
      <path d="M16.6 12.8 13.8 9.2h5.6z" fill="#1A1410" />
      <rect x="2.6" y="13.6" width="18.8" height="6.8" rx="1.8" fill="#FFC94D" stroke="#B37700" strokeWidth="1.3" />
      <path d="M5 20.2l3.4-6M10 20.2l3.4-6M15 20.2l3.4-6" stroke="#B37700" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  TESORO: (
    <>
      <circle cx="12" cy="12" r="8.6" fill="#FFD166" stroke="#C98A00" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5.8" fill="none" stroke="#C98A00" strokeWidth="1.2" />
      <path d="M12 7.6v8.8M9.8 9.6h3.4a1.7 1.7 0 0 1 0 3.4h-2.6a1.7 1.7 0 0 0 0 3.4h3.4" fill="none" stroke="#8A5F00" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  ALTO: (
    <>
      <path d="M8.9 2.4h6.2l6.5 6.5v6.2l-6.5 6.5H8.9l-6.5-6.5V8.9z" fill="#EF4444" stroke="#A81919" strokeWidth="1.3" strokeLinejoin="miter" />
      <rect x="6.2" y="10.6" width="11.6" height="2.8" rx="1.4" fill="#FFFFFF" />
    </>
  )
};

export default function ObstacleIcon({ type, size = 24, title }) {
  const paths = P[type] || P.ALTO;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      style={{ display: 'block', flex: 'none' }}
    >
      {title && <title>{title}</title>}
      {paths}
    </svg>
  );
}
