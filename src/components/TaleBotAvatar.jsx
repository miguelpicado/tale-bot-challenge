/**
 * El robot visto desde arriba, que es como se mira el tablero.
 * Carcasa blanca de esquinas muy redondeadas, ruedas de color a los lados,
 * los dos ojos asomando por el morro y la roseta de botones en la cubierta.
 */
export default function TaleBotAvatar({
  size = 80,
  angle = 0,
  ledColor = '#00BFC4',
  hasWings = false,
  hasArms = false,
  isDancing = false,
  idle = false,
  wheelColor = '#FF7A1B'
}) {
  return (
    <div className="bot" style={{ width: size, height: size, transform: `rotate(${angle}deg)` }}>
      <div className={`bot__body${isDancing ? ' bot__body--dance' : idle ? ' bot__body--idle' : ''}`}>
      <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tbShell" x1="34" y1="12" x2="86" y2="108" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#FAFAFA" />
          </linearGradient>
          <radialGradient id="tbEye" cx="0.38" cy="0.3" r="0.8">
            <stop stopColor="#3A3731" />
            <stop offset="1" stopColor="#17140F" />
          </radialGradient>
        </defs>

        {/* Sombra proyectada */}
        <rect x="16" y="20" width="88" height="88" rx="34" fill="rgba(26,20,16,.08)" />

        {/* Alas y brazos de clip, cuando el reto los pide */}
        {hasWings && (
          <g>
            <path d="M26 34 Q0 16 6 52 Z" fill="#7FE3E6" stroke="#00BFC4" strokeWidth="3" strokeLinejoin="round" />
            <path d="M94 34 Q120 16 114 52 Z" fill="#7FE3E6" stroke="#00BFC4" strokeWidth="3" strokeLinejoin="round" />
          </g>
        )}
        {hasArms && (
          <g>
            <rect x="0" y="80" width="22" height="12" rx="6" fill="#FF5C1B" />
            <rect x="98" y="80" width="22" height="12" rx="6" fill="#FF5C1B" />
          </g>
        )}

        {/* Ruedas: dos tapas naranjas que sobresalen por los costados */}
        <rect x="1" y="34" width="26" height="52" rx="13" fill={wheelColor} />
        <rect x="93" y="34" width="26" height="52" rx="13" fill={wheelColor} />

        {/* Carcasa blanca pura */}
        <rect x="19" y="15" width="82" height="90" rx="33" fill="#FFFFFF" />
        <rect x="20" y="16" width="80" height="88" rx="32" fill="none" stroke="#CBD2D9" strokeWidth="2.5" />

        {/* Ojos: van delante y son lo que marca hacia dónde mira */}
        <ellipse cx="45" cy="33" rx="12" ry="10.5" fill="#E4DED4" />
        <ellipse cx="75" cy="33" rx="12" ry="10.5" fill="#E4DED4" />
        <ellipse cx="45" cy="33" rx="9.6" ry="8.2" fill="url(#tbEye)" />
        <ellipse cx="75" cy="33" rx="9.6" ry="8.2" fill="url(#tbEye)" />
        <circle cx="41.6" cy="30.4" r="2.8" fill="#FFFFFF" />
        <circle cx="71.6" cy="30.4" r="2.8" fill="#FFFFFF" />

        {/* Roseta de la cubierta, en cruz alrededor del arranque */}
        <g>
          <rect x="53" y="53" width="14" height="14" rx="5" fill="#10B981" />
          <rect x="53" y="81" width="14" height="14" rx="5" fill="#EF4444" />
          <rect x="39" y="67" width="14" height="14" rx="5" fill="#FFC700" />
          <rect x="67" y="67" width="14" height="14" rx="5" fill="#00A3FF" />
          <rect x="51.5" y="65.5" width="17" height="17" rx="6" fill="#FF7A1B" />
          <path d="M57 69.5 L64.5 74 L57 78.5 Z" fill="#FFFFFF" />
        </g>

        {/* Testigos de la cubierta: se tiñen con el comando en curso */}
        <g>
          <circle cx="52" cy="99" r="2.6" fill={ledColor} opacity="0.5" />
          <circle cx="60" cy="99" r="2.6" fill={ledColor} opacity="0.75" />
          <circle cx="68" cy="99" r="2.6" fill={ledColor} />
        </g>
      </svg>
      </div>
    </div>
  );
}
