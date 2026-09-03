import type { ReactElement } from 'react'
import { textures, type TextureId } from '../../assets/textures'
import type { VisualType } from '../../types'

function TexPattern({ id, src, size = 240 }: { id: string; src: string; size?: number }) {
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width={size} height={size}>
      <image href={src} width={size} height={size} preserveAspectRatio="xMidYMid slice" />
    </pattern>
  )
}

function Wash({
  d,
  tex,
  opacity = 0.52,
}: {
  d: string
  tex: TextureId
  opacity?: number
}) {
  return <path d={d} fill={`url(#tex-${tex})`} opacity={opacity} style={{ mixBlendMode: 'multiply' }} />
}

function WashRect({
  x,
  y,
  w,
  h,
  tex,
  opacity = 0.48,
}: {
  x: number
  y: number
  w: number
  h: number
  tex: TextureId
  opacity?: number
}) {
  return (
    <rect x={x} y={y} width={w} height={h} fill={`url(#tex-${tex})`} opacity={opacity} style={{ mixBlendMode: 'multiply' }} />
  )
}

export function ChapterWorld({ type }: { type: VisualType }) {
  return (
    <svg className="chapter-canvas" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="cw-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a4a5c" />
          <stop offset="1" stopColor="#0a2438" />
        </linearGradient>
        <linearGradient id="cw-foam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(210,232,232,0.35)" />
          <stop offset="1" stopColor="rgba(210,232,232,0)" />
        </linearGradient>
        <linearGradient id="cw-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2748" />
          <stop offset="0.42" stopColor="#c46a4a" />
          <stop offset="0.62" stopColor="#e8a54b" />
          <stop offset="1" stopColor="#123848" />
        </linearGradient>
        <filter id="cw-soft">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <TexPattern id="tex-rock" src={textures.rock} />
        <TexPattern id="tex-face" src={textures.face} />
        <TexPattern id="tex-cliff" src={textures.cliff} size={280} />
        <TexPattern id="tex-wood" src={textures.wood} size={200} />
        <TexPattern id="tex-table" src={textures.table} size={180} />
        <TexPattern id="tex-stone" src={textures.stone} />
        <TexPattern id="tex-marble" src={textures.marble} size={200} />
        <TexPattern id="tex-mcliff" src={textures.mcliff} size={280} />
        <TexPattern id="tex-sand" src={textures.sand} size={260} />
        <TexPattern id="tex-terrain" src={textures.terrain} size={300} />
        <TexPattern id="tex-leather" src={textures.leather} size={220} />
        <TexPattern id="tex-paper" src={textures.paper} size={320} />
      </defs>
      {SCENE[type]}
    </svg>
  )
}

const SCENE: Record<VisualType, ReactElement> = {
  harbor: (
    <g className="scene-harbor">
      <rect width="1600" height="900" fill="url(#cw-dawn)" />
      <ellipse cx="210" cy="430" rx="70" ry="70" fill="#ffd29a" opacity="0.95" />
      <ellipse cx="210" cy="430" rx="160" ry="90" fill="#ffb44a" opacity="0.18" />
      <path d="M0 470 C 180 430 320 500 520 450 C 760 390 980 470 1600 420 L 1600 900 L 0 900 Z" fill="url(#cw-sea)" />
      <path d="M0 520 C 220 500 400 560 680 510 C 980 450 1280 540 1600 500" fill="none" stroke="rgba(232,213,176,0.18)" strokeWidth="8" />
      <path d="M0 610 C 80 540 180 500 280 560 C 360 620 300 700 180 720 C 60 740 0 680 0 610 Z" fill="#3d2a22" />
      <path d="M40 560 L 70 470 L 110 560 M90 540 L 130 430 L 170 560 M150 530 L 190 400 L 240 560" fill="#5a3a2c" />
      <rect x="70" y="500" width="28" height="70" fill="#7a4a32" />
      <rect x="108" y="470" width="36" height="100" fill="#8b5a3c" />
      <rect x="152" y="520" width="24" height="50" fill="#6a4028" />
      <path d="M108 470 L 126 444 L 144 470" fill="#d22030" />
      <circle cx="84" cy="518" r="3" fill="#e8a54b" />
      <circle cx="126" cy="490" r="3" fill="#e8a54b" />
      <path d="M40 620 C 180 600 320 640 420 610 L 420 720 L 0 720 Z" fill="#4a3224" />
      <path d="M60 640 H 380" stroke="#2a1810" strokeWidth="3" />
      <g className="cw-ship-docked">
        <ellipse cx="520" cy="680" rx="130" ry="16" fill="rgba(0,0,0,0.28)" />
        <path d="M400 650 C 460 620 560 616 640 646 C 600 690 500 700 400 650 Z" fill="#4a2e1a" />
        <path d="M520 540 L 520 650 L 610 646 L 528 548 Z" fill="#efe4c8" />
        <path d="M610 530 L 610 580 L 652 548 Z" fill="#d22030" />
      </g>
      <path d="M1100 430 C 1180 360 1280 380 1360 300 C 1440 230 1520 280 1600 240 L 1600 560 C 1460 520 1320 560 1100 500 Z" fill="#3a2a28" />
      <rect x="1180" y="400" width="22" height="70" fill="#c4b08c" />
      <rect x="1210" y="370" width="30" height="100" fill="#d8c4a0" />
      <rect x="1250" y="390" width="18" height="80" fill="#bca47c" />
      <rect x="1290" y="350" width="26" height="120" fill="#d8c4a0" />
      <circle cx="1192" cy="410" r="2" fill="#e8a54b" />
      <circle cx="1226" cy="384" r="2" fill="#e8a54b" />
      <circle cx="1304" cy="362" r="2" fill="#e8a54b" />
      <path d="M0 760 C 200 720 500 800 900 740 C 1200 700 1400 780 1600 740 L 1600 900 L 0 900 Z" fill="#2a1c16" opacity="0.55" />
      <Wash d="M0 610 C 80 540 180 500 280 560 C 360 620 300 700 180 720 C 60 740 0 680 0 610 Z" tex="sand" opacity={0.45} />
      <WashRect x={70} y={500} w={28} h={70} tex="wood" />
      <WashRect x={108} y={470} w={36} h={100} tex="wood" />
      <WashRect x={152} y={520} w={24} h={50} tex="wood" />
      <Wash d="M40 620 C 180 600 320 640 420 610 L 420 720 L 0 720 Z" tex="wood" opacity={0.5} />
      <Wash d="M400 650 C 460 620 560 616 640 646 C 600 690 500 700 400 650 Z" tex="wood" opacity={0.42} />
      <Wash d="M1100 430 C 1180 360 1280 380 1360 300 C 1440 230 1520 280 1600 240 L 1600 560 C 1460 520 1320 560 1100 500 Z" tex="stone" opacity={0.4} />
      <WashRect x={1180} y={400} w={22} h={70} tex="stone" />
      <WashRect x={1210} y={370} w={30} h={100} tex="stone" />
      <WashRect x={1250} y={390} w={18} h={80} tex="stone" />
      <WashRect x={1290} y={350} w={26} h={120} tex="stone" />
      <Wash d="M0 760 C 200 720 500 800 900 740 C 1200 700 1400 780 1600 740 L 1600 900 L 0 900 Z" tex="sand" opacity={0.35} />
    </g>
  ),
  fortress: (
    <g>
      <rect width="1600" height="900" fill="#1a2744" />
      <path d="M0 0 H 1600 V 420 H 0 Z" fill="#243656" />
      <path d="M200 180 C 360 80 520 160 700 90 C 880 20 1100 140 1600 40 V 420 H 0 Z" fill="#3d4a58" opacity="0.7" />
      <path d="M0 480 C 220 430 480 520 820 450 C 1160 380 1400 470 1600 430 V 900 H 0 Z" fill="url(#cw-sea)" />
      <path d="M620 720 C 700 520 780 430 860 300 C 900 240 980 220 1040 300 C 1120 430 1220 560 1320 720 Z" fill="#5c6460" />
      <path d="M860 300 L 900 80 L 940 300" fill="#8b8f84" />
      <rect x="888" y="40" width="24" height="50" fill="#a0a49a" />
      <circle cx="900" cy="36" r="14" fill="#e8a54b" />
      <path d="M900 36 L 1240 80" stroke="rgba(255,236,180,0.28)" strokeWidth="18" />
      <path d="M720 700 C 820 640 980 660 1100 700 L 1040 760 L 780 760 Z" fill="#6d7468" />
      <path d="M0 780 C 300 740 700 820 1600 760 V 900 H 0 Z" fill="#1a1410" opacity="0.45" />
      <Wash d="M200 180 C 360 80 520 160 700 90 C 880 20 1100 140 1600 40 V 420 H 0 Z" tex="cliff" opacity={0.32} />
      <Wash d="M620 720 C 700 520 780 430 860 300 C 900 240 980 220 1040 300 C 1120 430 1220 560 1320 720 Z" tex="face" opacity={0.55} />
      <Wash d="M720 700 C 820 640 980 660 1100 700 L 1040 760 L 780 760 Z" tex="stone" opacity={0.4} />
      <Wash d="M0 780 C 300 740 700 820 1600 760 V 900 H 0 Z" tex="rock" opacity={0.3} />
    </g>
  ),
  city: (
    <g>
      <rect width="1600" height="900" fill="#7eb0c8" />
      <path d="M0 0 H 1600 V 380 H 0 Z" fill="#f2e6c4" />
      <circle cx="1180" cy="140" r="54" fill="#fff4c8" />
      <path d="M0 500 C 240 430 500 510 860 440 C 1220 370 1460 460 1600 420 V 900 H 0 Z" fill="url(#cw-sea)" />
      <path d="M180 620 C 260 360 420 280 620 340 C 820 400 760 620 620 700 C 420 780 220 740 180 620 Z" fill="#6f8a5c" />
      <path d="M320 520 L 360 360 L 410 520 M390 500 L 440 300 L 500 520 M470 480 L 530 260 L 590 500" fill="#d8c4a0" />
      <rect x="350" y="430" width="40" height="110" fill="#c4b08c" />
      <rect x="420" y="390" width="54" height="150" fill="#e8d5b0" />
      <rect x="500" y="410" width="36" height="130" fill="#d8c4a0" />
      <path d="M420 390 L 447 340 L 474 390" fill="#efe4c8" />
      <rect x="436" y="450" width="8" height="20" fill="#1a2744" />
      <path d="M980 560 C 1080 300 1280 260 1480 360 L 1540 620 L 1000 640 Z" fill="#c4b08c" />
      <rect x="1120" y="380" width="28" height="90" fill="#e8d5b0" />
      <rect x="1180" y="340" width="40" height="130" fill="#d8c4a0" />
      <rect x="1260" y="360" width="24" height="110" fill="#bca47c" />
      <path d="M200 720 C 400 680 700 760 1100 700" fill="none" stroke="#8b5a32" strokeWidth="10" />
      <ellipse cx="240" cy="700" rx="18" ry="6" fill="#2a1810" />
      <ellipse cx="300" cy="690" rx="14" ry="5" fill="#2a1810" />
      <Wash d="M180 620 C 260 360 420 280 620 340 C 820 400 760 620 620 700 C 420 780 220 740 180 620 Z" tex="terrain" opacity={0.4} />
      <WashRect x={350} y={430} w={40} h={110} tex="stone" />
      <WashRect x={420} y={390} w={54} h={150} tex="stone" />
      <WashRect x={500} y={410} w={36} h={130} tex="stone" />
      <Wash d="M980 560 C 1080 300 1280 260 1480 360 L 1540 620 L 1000 640 Z" tex="stone" opacity={0.42} />
    </g>
  ),
  cove: (
    <g>
      <rect width="1600" height="900" fill="#243656" />
      <path d="M0 420 C 300 380 700 460 1600 400 V 900 H 0 Z" fill="url(#cw-sea)" />
      <path d="M180 640 C 280 500 420 520 500 640 C 420 720 240 730 180 640 Z" fill="#5a4030" />
      <rect x="280" y="520" width="90" height="70" fill="#6a4028" />
      <rect x="300" y="490" width="50" height="36" fill="#8b5a32" />
      <path d="M290 490 H 360 L 348 470 H 302 Z" fill="#d22030" />
      <text x="304" y="548" fill="#e8d48b" fontSize="11" fontFamily="Cinzel, serif">MATADOR</text>
      <circle cx="300" cy="540" r="3" fill="#e8a54b" />
      <circle cx="350" cy="540" r="3" fill="#e8a54b" />
      <path d="M520 680 C 600 650 720 670 800 650 L 760 720 L 540 720 Z" fill="#4a3224" />
      <path d="M900 620 C 1020 580 1200 600 1400 560 L 1400 720 L 900 720 Z" fill="#3d2a22" />
      <Wash d="M180 640 C 280 500 420 520 500 640 C 420 720 240 730 180 640 Z" tex="wood" opacity={0.45} />
      <WashRect x={280} y={520} w={90} h={70} tex="table" />
      <Wash d="M520 680 C 600 650 720 670 800 650 L 760 720 L 540 720 Z" tex="wood" />
      <Wash d="M900 620 C 1020 580 1200 600 1400 560 L 1400 720 L 900 720 Z" tex="leather" opacity={0.4} />
    </g>
  ),
  temple: (
    <g>
      <rect width="1600" height="900" fill="#4a7a9a" />
      <path d="M0 0 H 1600 V 360 H 0 Z" fill="#8ec4d4" />
      <circle cx="780" cy="120" r="48" fill="#fff6c4" />
      <path d="M0 360 C 200 300 400 380 700 280 C 1000 180 1300 300 1600 220 V 520 H 0 Z" fill="#6d8070" />
      <path d="M0 560 C 360 500 800 580 1600 520 V 900 H 0 Z" fill="url(#cw-sea)" />
      <path d="M480 700 L 620 280 L 980 240 L 1160 700 Z" fill="#8b8370" />
      <path d="M640 700 L 720 360 L 920 340 L 1000 700 Z" fill="#d8c4a0" />
      <rect x="700" y="400" width="18" height="220" fill="#efe4c8" />
      <rect x="740" y="390" width="18" height="230" fill="#e8d5b0" />
      <rect x="780" y="380" width="18" height="240" fill="#efe4c8" />
      <rect x="820" y="390" width="18" height="230" fill="#e8d5b0" />
      <rect x="860" y="400" width="18" height="220" fill="#efe4c8" />
      <path d="M680 390 L 790 300 L 900 390 Z" fill="#c9a84c" />
      <path d="M900 280 L 920 160 L 940 300" fill="url(#cw-foam)" />
      <path d="M1080 300 L 1100 150 L 1124 320" fill="url(#cw-foam)" />
      <ellipse cx="200" cy="760" rx="40" ry="8" fill="#4a2e1a" opacity="0.5" />
      <path d="M170 752 C 190 744 220 744 240 754 C 220 762 190 762 170 752 Z" fill="#6a4022" />
      <Wash d="M0 360 C 200 300 400 380 700 280 C 1000 180 1300 300 1600 220 V 520 H 0 Z" tex="mcliff" opacity={0.4} />
      <Wash d="M480 700 L 620 280 L 980 240 L 1160 700 Z" tex="mcliff" opacity={0.5} />
      <Wash d="M640 700 L 720 360 L 920 340 L 1000 700 Z" tex="marble" opacity={0.48} />
      <WashRect x={700} y={400} w={18} h={220} tex="marble" opacity={0.4} />
      <WashRect x={740} y={390} w={18} h={230} tex="marble" opacity={0.4} />
      <WashRect x={780} y={380} w={18} h={240} tex="marble" opacity={0.4} />
      <WashRect x={820} y={390} w={18} h={230} tex="marble" opacity={0.4} />
      <WashRect x={860} y={400} w={18} h={220} tex="marble" opacity={0.4} />
    </g>
  ),
  deck: (
    <g>
      <rect width="1600" height="900" fill="#2a2114" />
      <rect x="80" y="40" width="1440" height="820" fill="#4a3220" />
      <path d="M80 40 H 1520 V 120 H 80 Z" fill="#3a2416" />
      <ellipse cx="1280" cy="220" rx="70" ry="70" fill="#1a3a44" />
      <ellipse cx="1280" cy="220" rx="54" ry="54" fill="#2a6a78" />
      <path d="M1230 220 C 1250 200 1310 200 1330 220 C 1310 240 1250 240 1230 220 Z" fill="#7ec8b8" opacity="0.35" />
      <rect x="200" y="520" width="220" height="140" fill="#6a4022" />
      <rect x="460" y="540" width="180" height="120" fill="#5a3820" />
      <rect x="680" y="500" width="200" height="160" fill="#7a4a28" />
      <circle cx="240" cy="180" r="16" fill="#e8a54b" />
      <circle cx="240" cy="180" r="28" fill="#e8a54b" opacity="0.2" />
      <circle cx="900" cy="200" r="14" fill="#e8a54b" />
      <path d="M160 80 V 820 M 1440 80 V 820" stroke="#2a1810" strokeWidth="18" />
      <path d="M300 80 C 360 200 280 400 340 700" stroke="#5c4030" strokeWidth="6" fill="none" />
      <WashRect x={80} y={40} w={1440} h={820} tex="wood" opacity={0.42} />
      <WashRect x={80} y={40} w={1440} h={80} tex="table" opacity={0.5} />
      <WashRect x={200} y={520} w={220} h={140} tex="table" opacity={0.55} />
      <WashRect x={460} y={540} w={180} h={120} tex="table" opacity={0.55} />
      <WashRect x={680} y={500} w={200} h={160} tex="table" opacity={0.55} />
    </g>
  ),
  feast: (
    <g>
      <rect width="1600" height="900" fill="#4a90b8" />
      <circle cx="1200" cy="100" r="60" fill="#fff8d0" />
      <path d="M0 480 C 400 420 900 500 1600 440 V 900 H 0 Z" fill="url(#cw-sea)" />
      <path d="M200 700 L 1400 700 L 1360 780 L 240 780 Z" fill="#6a4022" />
      <ellipse cx="500" cy="690" rx="40" ry="12" fill="#d22030" />
      <ellipse cx="700" cy="688" rx="50" ry="14" fill="#e8d5b0" />
      <ellipse cx="920" cy="690" rx="36" ry="12" fill="#8b1e24" />
      <ellipse cx="1100" cy="688" rx="44" ry="12" fill="#c9a84c" />
      <path d="M260 620 C 500 540 900 540 1300 620" fill="none" stroke="#efe4c8" strokeWidth="10" />
      <rect x="300" y="560" width="8" height="80" fill="#5a3820" />
      <rect x="1240" y="560" width="8" height="80" fill="#5a3820" />
      <circle cx="360" cy="560" r="6" fill="#e8a54b" />
      <circle cx="700" cy="540" r="6" fill="#e8a54b" />
      <circle cx="1080" cy="550" r="6" fill="#e8a54b" />
      <ellipse cx="420" cy="760" rx="8" ry="16" fill="#1a140c" />
      <ellipse cx="520" cy="758" rx="8" ry="16" fill="#1a140c" />
      <ellipse cx="980" cy="760" rx="8" ry="16" fill="#1a140c" />
      <Wash d="M200 700 L 1400 700 L 1360 780 L 240 780 Z" tex="wood" opacity={0.5} />
    </g>
  ),
  trials: (
    <g>
      <rect width="1600" height="900" fill="#3d7ea0" />
      <path d="M0 0 H 1600 V 300 H 0 Z" fill="#7ab8cc" />
      <path d="M0 300 C 200 220 500 300 800 180 C 1100 70 1400 200 1600 120 V 500 H 0 Z" fill="#4f6a48" />
      <path d="M0 560 C 400 500 900 580 1600 520 V 900 H 0 Z" fill="url(#cw-sea)" />
      <path d="M80 800 L 260 120 L 420 800 Z" fill="#5c6e58" />
      <path d="M1180 800 L 1340 80 L 1520 800 Z" fill="#4a5c46" />
      <path d="M360 420 C 560 380 820 400 1080 360" fill="none" stroke="#8b5a32" strokeWidth="8" />
      <path d="M1080 360 C 1160 340 1240 300 1320 220" fill="none" stroke="#8b5a32" strokeWidth="6" strokeDasharray="14 10" />
      <path d="M900 200 L 920 40 L 944 220" fill="#7ec8b8" opacity="0.55" />
      <path d="M200 720 C 360 680 500 740 640 700" fill="#3d4a38" />
      <Wash d="M0 300 C 200 220 500 300 800 180 C 1100 70 1400 200 1600 120 V 500 H 0 Z" tex="terrain" opacity={0.38} />
      <Wash d="M80 800 L 260 120 L 420 800 Z" tex="rock" opacity={0.55} />
      <Wash d="M1180 800 L 1340 80 L 1520 800 Z" tex="cliff" opacity={0.55} />
    </g>
  ),
  cove2: (
    <g>
      <rect width="1600" height="900" fill="#102038" />
      <path d="M0 500 C 400 440 900 520 1600 460 V 900 H 0 Z" fill="#0a2438" />
      <ellipse cx="800" cy="520" rx="120" ry="120" fill="#7ec8b8" opacity="0.12" />
      <circle cx="800" cy="500" r="90" fill="none" stroke="#c9a84c" strokeWidth="6" />
      <circle cx="800" cy="500" r="54" fill="none" stroke="#7ec8b8" strokeWidth="3" />
      <path d="M800 410 L 812 492 L 800 500 L 788 492 Z" fill="#d22030" />
      <path d="M0 720 C 300 680 800 760 1600 700 V 900 H 0 Z" fill="#061018" />
      <Wash d="M0 720 C 300 680 800 760 1600 700 V 900 H 0 Z" tex="leather" opacity={0.28} />
    </g>
  ),
  oracle: (
    <g>
      <rect width="1600" height="900" fill="#061018" />
      <path d="M0 520 C 360 470 860 540 1600 480 V 900 H 0 Z" fill="#0a2438" />
      <path d="M300 800 L 420 220 L 520 800 Z" fill="#6b7380" />
      <path d="M1100 800 L 1200 180 L 1320 800 Z" fill="#5a6470" />
      <ellipse cx="800" cy="420" rx="160" ry="160" fill="none" stroke="#7ec8b8" strokeWidth="3" />
      <ellipse cx="800" cy="420" rx="100" ry="100" fill="none" stroke="#7ec8b8" strokeWidth="2" opacity="0.6" />
      <circle cx="800" cy="420" r="36" fill="#7ec8b8" opacity="0.35" />
      <path d="M640 420 L 960 420 M 800 260 L 800 580" stroke="#7ec8b8" strokeWidth="1" opacity="0.4" />
      <circle cx="680" cy="300" r="3" fill="#7ec8b8" />
      <circle cx="940" cy="280" r="3" fill="#7ec8b8" />
      <circle cx="900" cy="540" r="3" fill="#7ec8b8" />
      <path d="M680 300 L 800 420 L 940 280" fill="none" stroke="#7ec8b8" strokeWidth="1" opacity="0.45" />
      <rect x="250" y="300" width="40" height="160" fill="#8b8370" />
      <rect x="1310" y="280" width="40" height="180" fill="#8b8370" />
      <Wash d="M300 800 L 420 220 L 520 800 Z" tex="mcliff" opacity={0.45} />
      <Wash d="M1100 800 L 1200 180 L 1320 800 Z" tex="mcliff" opacity={0.45} />
      <WashRect x={250} y={300} w={40} h={160} tex="marble" />
      <WashRect x={1310} y={280} w={40} h={180} tex="marble" />
    </g>
  ),
  port: (
    <g>
      <rect width="1600" height="900" fill="#2a4868" />
      <path d="M0 0 H 1600 V 380 H 0 Z" fill="#6a7e9a" />
      <circle cx="1280" cy="160" r="70" fill="#f0b24a" />
      <ellipse cx="1280" cy="160" rx="180" ry="80" fill="#e8a54b" opacity="0.2" />
      <path d="M0 460 C 300 400 800 480 1600 400 V 900 H 0 Z" fill="url(#cw-sea)" />
      <path d="M900 500 C 1040 360 1240 340 1480 420 L 1540 620 L 920 640 Z" fill="#6f8a70" />
      <rect x="1100" y="380" width="24" height="90" fill="#d8c4a0" />
      <rect x="1180" y="340" width="36" height="130" fill="#e8d5b0" />
      <rect x="1260" y="360" width="22" height="110" fill="#c4b08c" />
      <path d="M200 640 C 280 600 360 630 420 610" fill="#6a4022" />
      <path d="M500 620 C 580 580 660 610 740 590" fill="#6a4022" />
      <path d="M280 600 L 280 640 L 340 630 Z" fill="#efe4c8" />
      <path d="M580 580 L 580 620 L 640 610 Z" fill="#efe4c8" />
      <path d="M360 580 L 360 610 L 400 596 Z" fill="#d22030" />
      <Wash d="M900 500 C 1040 360 1240 340 1480 420 L 1540 620 L 920 640 Z" tex="stone" opacity={0.4} />
      <Wash d="M200 640 C 280 600 360 630 420 610" tex="wood" />
      <Wash d="M500 620 C 580 580 660 610 740 590" tex="wood" />
    </g>
  ),
  ithaca: (
    <g>
      <rect width="1600" height="900" fill="#2a2114" />
      <path d="M0 0 H 1600 V 420 H 0 Z" fill="#6a4020" />
      <circle cx="1320" cy="300" r="80" fill="#ffb44a" />
      <ellipse cx="1320" cy="300" rx="220" ry="100" fill="#e8a54b" opacity="0.28" />
      <path d="M0 500 C 400 450 900 520 1600 460 V 900 H 0 Z" fill="#1a3a44" />
      <path d="M200 620 C 360 380 620 300 860 380 C 1100 460 980 680 720 720 C 420 770 220 700 200 620 Z" fill="#8b6914" />
      <rect x="420" y="480" width="22" height="70" fill="#e8d5b0" />
      <rect x="460" y="450" width="30" height="100" fill="#f0e2b8" />
      <rect x="510" y="470" width="20" height="80" fill="#d8c4a0" />
      <rect x="560" y="430" width="34" height="120" fill="#e8d5b0" />
      <path d="M560 430 L 577 390 L 594 430" fill="#c9a84c" />
      <circle cx="432" cy="488" r="2" fill="#e8a54b" />
      <circle cx="476" cy="458" r="2" fill="#e8a54b" />
      <circle cx="578" cy="438" r="2" fill="#e8a54b" />
      <path d="M980 560 C 1080 400 1240 380 1400 460 L 1440 640 L 1000 650 Z" fill="#7a5a28" />
      <ellipse cx="300" cy="700" rx="70" ry="10" fill="rgba(0,0,0,0.25)" />
      <path d="M240 690 C 290 670 360 670 400 692 C 350 708 280 708 240 690 Z" fill="#4a2e1a" />
      <path d="M320 620 L 320 690 L 370 686 Z" fill="#efe4c8" />
      <Wash d="M200 620 C 360 380 620 300 860 380 C 1100 460 980 680 720 720 C 420 770 220 700 200 620 Z" tex="sand" opacity={0.38} />
      <WashRect x={420} y={480} w={22} h={70} tex="stone" />
      <WashRect x={460} y={450} w={30} h={100} tex="stone" />
      <WashRect x={510} y={470} w={20} h={80} tex="stone" />
      <WashRect x={560} y={430} w={34} h={120} tex="stone" />
      <Wash d="M980 560 C 1080 400 1240 380 1400 460 L 1440 640 L 1000 650 Z" tex="terrain" opacity={0.4} />
    </g>
  ),
  forbidden: (
    <g>
      <rect width="1600" height="900" fill="#1a0c14" />
      <path d="M0 500 C 400 460 900 540 1600 480 V 900 H 0 Z" fill="#0a1620" />
      <path d="M200 800 L 360 160 L 520 800 Z" fill="#2a1818" />
      <path d="M900 800 L 1100 80 L 1360 800 Z" fill="#3d2a3a" />
      <ellipse cx="800" cy="620" rx="220" ry="40" fill="#2a8a8a" opacity="0.35" />
      <path d="M700 500 L 800 360 L 900 500 Z" fill="#5a3048" />
      <circle cx="800" cy="420" r="16" fill="#d22030" opacity="0.55" />
      <Wash d="M200 800 L 360 160 L 520 800 Z" tex="rock" opacity={0.5} />
      <Wash d="M900 800 L 1100 80 L 1360 800 Z" tex="cliff" opacity={0.5} />
    </g>
  ),
}
