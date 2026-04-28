// Fish silhouettes — body-only side profiles, all fit a 200x80 viewBox.
// Informed by the Native Fish / Pest Fish boards photographed at Hinze Pond.
// FLAG: hand-drawn SVG. Swap for real centred fish photos when available.

export function FishSilhouette({ species, size = 72, color = '#002C4D' }) {
  const paths = {
    // -------- NATIVE FISH --------
    'eel-tailed-catfish': (
      <g>
        <path d="M10,40 C20,20 60,14 110,18 C150,22 175,28 190,40 C175,52 150,58 110,62 C60,66 20,60 10,40 Z" fill={color}/>
        <path d="M188,40 C192,30 196,24 198,22 L196,40 L198,58 C196,56 192,50 188,40 Z" fill={color}/>
        <path d="M6,40 L2,34 M6,40 L2,40 M6,40 L2,46" stroke={color} strokeWidth="1.5" fill="none"/>
        <circle cx="20" cy="36" r="1.6" fill="#fff"/>
        <path d="M60,20 L70,12 L80,18 Z" fill={color}/>
      </g>
    ),
    'boney-bream': (
      <g>
        <path d="M20,40 C30,18 80,12 125,16 C150,18 170,28 180,40 C170,52 150,62 125,64 C80,68 30,62 20,40 Z" fill={color}/>
        <path d="M178,40 C184,30 192,22 198,20 L192,40 L198,60 C192,58 184,50 178,40 Z" fill={color}/>
        <circle cx="35" cy="34" r="2" fill="#fff"/>
        <path d="M90,16 L98,6 L108,14 Z" fill={color}/>
        <path d="M60,62 L66,72 L72,64 Z" fill={color}/>
      </g>
    ),
    'freshwater-mullet': (
      <g>
        <path d="M15,40 C25,24 80,18 140,20 C165,22 180,30 188,40 C180,50 165,58 140,60 C80,62 25,56 15,40 Z" fill={color}/>
        <path d="M186,40 C192,32 198,26 200,24 L196,40 L200,56 C198,54 192,48 186,40 Z" fill={color}/>
        <circle cx="30" cy="36" r="1.8" fill="#fff"/>
        <path d="M80,20 L86,10 L94,18 Z" fill={color}/>
        <path d="M110,20 L116,12 L124,18 Z" fill={color}/>
      </g>
    ),
    'golden-perch': (
      <g>
        <path d="M20,40 C30,16 70,10 110,14 C140,16 170,26 182,40 C170,54 140,64 110,66 C70,70 30,64 20,40 Z" fill={color}/>
        <path d="M180,40 C188,34 196,30 200,28 L195,40 L200,52 C196,50 188,46 180,40 Z" fill={color}/>
        <circle cx="36" cy="34" r="2" fill="#fff"/>
        <path d="M80,14 L90,4 L105,12 Z" fill={color}/>
        <path d="M70,62 L80,72 L90,64 Z" fill={color}/>
      </g>
    ),
    'jew-mullet': (
      <g>
        <path d="M12,40 C22,28 80,22 140,22 C165,24 182,30 190,40 C182,50 165,56 140,58 C80,58 22,52 12,40 Z" fill={color}/>
        <path d="M188,40 C194,34 200,28 202,26 L198,40 L202,54 C200,52 194,46 188,40 Z" fill={color}/>
        <circle cx="26" cy="38" r="1.8" fill="#fff"/>
        <path d="M90,22 L96,14 L104,22 Z" fill={color}/>
      </g>
    ),
    'spangled-perch': (
      <g>
        <path d="M25,40 C35,22 65,16 100,18 C130,20 155,28 170,40 C155,52 130,60 100,62 C65,64 35,58 25,40 Z" fill={color}/>
        <path d="M168,40 C176,34 184,30 188,28 L184,40 L188,52 C184,50 176,46 168,40 Z" fill={color}/>
        <circle cx="40" cy="36" r="2" fill="#fff"/>
        <path d="M75,18 L82,10 L92,16 Z" fill={color}/>
      </g>
    ),
    'bullrout': (
      <g>
        <path d="M18,42 C28,22 60,16 100,18 C135,20 160,28 175,40 C160,52 135,60 100,62 C60,64 28,58 18,42 Z" fill={color}/>
        <path d="M173,40 C180,36 188,32 192,30 L188,40 L192,50 C188,48 180,44 173,40 Z" fill={color}/>
        <circle cx="35" cy="34" r="2" fill="#fff"/>
        <path d="M60,18 L64,6 L66,18 L72,4 L74,18 L80,8 L82,18 L90,6 L92,18 Z" fill={color}/>
      </g>
    ),
    'australian-bass': (
      <g>
        <path d="M18,40 C28,20 70,14 115,16 C145,18 170,26 185,40 C170,54 145,62 115,64 C70,66 28,60 18,40 Z" fill={color}/>
        <path d="M183,40 C190,32 198,26 202,24 L197,40 L202,56 C198,54 190,48 183,40 Z" fill={color}/>
        <circle cx="32" cy="34" r="2" fill="#fff"/>
        <path d="M85,16 L92,6 L102,14 Z" fill={color}/>
      </g>
    ),
    // -------- PEST FISH --------
    'mozambique-tilapia-m': (
      <g>
        <path d="M22,42 C32,18 70,10 110,14 C140,16 168,26 180,40 C168,54 140,64 110,66 C70,70 32,62 22,42 Z" fill={color}/>
        <path d="M178,40 C186,34 194,30 198,28 L193,40 L198,52 C194,50 186,46 178,40 Z" fill={color}/>
        <path d="M50,14 L54,4 L58,14 L62,4 L66,14 L70,4 L74,14 L78,4 L82,14 L86,4 L90,14 L94,4 L98,14 L102,6 L106,14 L110,6 L114,14 L118,8 L122,14 L126,10 L130,14 Z" fill={color}/>
        <circle cx="38" cy="34" r="2" fill="#fff"/>
      </g>
    ),
    'mozambique-tilapia-f': (
      <g>
        <path d="M22,44 C32,20 70,12 110,14 C140,16 168,26 180,40 C168,54 140,64 110,66 C70,70 32,64 22,44 Z" fill={color}/>
        <path d="M178,40 C186,34 194,30 198,28 L193,40 L198,52 C194,50 186,46 178,40 Z" fill={color}/>
        <path d="M52,18 L56,10 L60,18 L64,10 L68,18 L72,10 L76,18 L80,10 L84,18 L88,10 L92,18 Z" fill={color}/>
        <path d="M22,44 C28,54 40,58 52,54 L40,46 Z" fill={color}/>
        <circle cx="38" cy="36" r="2" fill="#fff"/>
      </g>
    ),
    'spotted-tilapia': (
      <g>
        <path d="M22,42 C32,18 70,12 110,14 C140,16 168,26 180,40 C168,54 140,64 110,66 C70,70 32,62 22,42 Z" fill={color}/>
        <path d="M178,40 C186,34 194,30 198,28 L193,40 L198,52 C194,50 186,46 178,40 Z" fill={color}/>
        <path d="M50,16 L54,6 L58,16 L62,6 L66,16 L70,6 L74,16 L78,6 L82,16 L86,6 L90,16 L94,6 L98,16 L102,8 L106,16 L110,8 L114,16 Z" fill={color}/>
        <circle cx="38" cy="34" r="2" fill="#fff"/>
        <circle cx="70" cy="36" r="2.5" fill="#fff" opacity="0.7"/>
        <circle cx="95" cy="42" r="2.5" fill="#fff" opacity="0.7"/>
        <circle cx="120" cy="38" r="2.5" fill="#fff" opacity="0.7"/>
        <circle cx="145" cy="44" r="2.5" fill="#fff" opacity="0.7"/>
      </g>
    ),
    'pearl-cichlid': (
      <g>
        <path d="M24,42 C34,22 70,14 110,16 C140,18 166,28 178,40 C166,52 140,62 110,64 C70,66 34,62 24,42 Z" fill={color}/>
        <path d="M176,40 C184,34 192,30 196,28 L191,40 L196,52 C192,50 184,46 176,40 Z" fill={color}/>
        <path d="M56,16 L60,8 L64,16 L68,8 L72,16 L76,8 L80,16 L84,8 L88,16 L92,8 L96,16 Z" fill={color}/>
        <circle cx="40" cy="34" r="2" fill="#fff"/>
        <circle cx="85" cy="40" r="3" fill="#fff" opacity="0.8"/>
        <circle cx="120" cy="44" r="3" fill="#fff" opacity="0.8"/>
      </g>
    ),
    'carp': (
      <g>
        <path d="M18,40 C28,18 60,12 105,14 C140,16 168,26 182,40 C168,54 140,64 105,66 C60,68 28,62 18,40 Z" fill={color}/>
        <path d="M180,40 C188,30 196,22 200,20 L195,40 L200,60 C196,58 188,50 180,40 Z" fill={color}/>
        <circle cx="30" cy="34" r="2" fill="#fff"/>
        <path d="M14,38 L6,32 M14,40 L6,40 M14,42 L6,48" stroke={color} strokeWidth="1.5" fill="none"/>
        <path d="M75,14 L84,4 L94,12 Z" fill={color}/>
      </g>
    ),
    'goldfish': (
      <g>
        <path d="M30,40 C40,22 70,16 100,18 C125,20 150,28 162,40 C150,52 125,60 100,62 C70,64 40,58 30,40 Z" fill={color}/>
        <path d="M160,40 C170,32 180,26 186,22 L178,40 L186,58 C180,54 170,48 160,40 Z" fill={color}/>
        <circle cx="45" cy="34" r="2" fill="#fff"/>
        <path d="M80,18 L86,10 L94,16 Z" fill={color}/>
        <path d="M60,60 L66,70 L74,62 Z" fill={color}/>
      </g>
    ),
    'banded-grunter': (
      <g>
        <path d="M22,40 C32,20 70,14 110,16 C138,18 162,26 175,40 C162,54 138,62 110,64 C70,66 32,60 22,40 Z" fill={color}/>
        <path d="M173,40 C180,34 188,30 192,28 L187,40 L192,52 C188,50 180,46 173,40 Z" fill={color}/>
        <circle cx="36" cy="34" r="2" fill="#fff"/>
        <rect x="55" y="22" width="4" height="36" fill="#fff" opacity="0.35"/>
        <rect x="75" y="20" width="4" height="40" fill="#fff" opacity="0.35"/>
        <rect x="95" y="20" width="4" height="42" fill="#fff" opacity="0.35"/>
        <rect x="115" y="22" width="4" height="40" fill="#fff" opacity="0.35"/>
        <rect x="135" y="24" width="4" height="36" fill="#fff" opacity="0.35"/>
      </g>
    ),
    'mirror-carp': (
      <g>
        <path d="M18,40 C28,18 60,12 105,14 C140,16 168,26 182,40 C168,54 140,64 105,66 C60,68 28,62 18,40 Z" fill={color}/>
        <path d="M180,40 C188,30 196,22 200,20 L195,40 L200,60 C196,58 188,50 180,40 Z" fill={color}/>
        <circle cx="30" cy="34" r="2" fill="#fff"/>
        <path d="M14,38 L6,32 M14,42 L6,48" stroke={color} strokeWidth="1.5" fill="none"/>
        <circle cx="70" cy="32" r="4" fill="#fff" opacity="0.4"/>
        <circle cx="95" cy="48" r="4" fill="#fff" opacity="0.4"/>
        <circle cx="120" cy="34" r="4" fill="#fff" opacity="0.4"/>
        <circle cx="145" cy="46" r="4" fill="#fff" opacity="0.4"/>
      </g>
    ),
  };

  return (
    <svg width={size} height={size * 0.4} viewBox="0 0 210 80" style={{ display: 'block' }}>
      {paths[species] || paths['boney-bream']}
    </svg>
  );
}
