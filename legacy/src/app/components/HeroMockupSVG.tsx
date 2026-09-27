export function HeroMockupSVG() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto max-h-96">
      {/* Background gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        
        {/* Phone gradients */}
        <linearGradient id="phone1Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        
        <linearGradient id="phone2Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>

        {/* Tile gradients - CHAPFOODY colors */}
        <linearGradient id="redTile" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b70f23" />
          <stop offset="100%" stopColor="#70070e" />
        </linearGradient>
        
        <linearGradient id="yellowTile" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4b71b" />
          <stop offset="100%" stopColor="#e09900" />
        </linearGradient>
        
        <linearGradient id="darkRedTile" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#70070e" />
          <stop offset="100%" stopColor="#4a0509" />
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect width="800" height="500" fill="url(#bgGradient)" />
      
      {/* Left Phone - Dashboard Restaurateur */}
      <g transform="translate(180, 50)">
        {/* Phone Frame */}
        <rect x="0" y="0" width="160" height="280" rx="20" fill="url(#phone1Gradient)" stroke="#374151" strokeWidth="2" />
        <rect x="8" y="25" width="144" height="230" rx="8" fill="#000000" />
        
        {/* Screen Content */}
        <rect x="8" y="25" width="144" height="230" rx="8" fill="#1a1a1a" />
        
        {/* Header */}
        <rect x="15" y="35" width="130" height="25" fill="#2d2d2d" rx="4" />
        <text x="22" y="52" fill="#ffffff" fontSize="10" fontFamily="Arial">Dashboard Restaurateur</text>
        
        {/* Windows Phone Tiles */}
        {/* Large red tile */}
        <rect x="15" y="70" width="60" height="60" fill="url(#redTile)" rx="4" />
        <text x="25" y="90" fill="#ffffff" fontSize="8" fontFamily="Arial">Menu</text>
        <text x="25" y="102" fill="#ffffff" fontSize="8" fontFamily="Arial">Digital</text>
        <rect x="50" y="110" width="16" height="12" fill="rgba(255,255,255,0.3)" rx="2" />
        
        {/* Small yellow tiles */}
        <rect x="85" y="70" width="28" height="28" fill="url(#yellowTile)" rx="3" />
        <text x="90" y="86" fill="#000000" fontSize="6" fontFamily="Arial">Stock</text>
        
        <rect x="123" y="70" width="28" height="28" fill="url(#yellowTile)" rx="3" />
        <text x="128" y="86" fill="#000000" fontSize="6" fontFamily="Arial">€</text>
        
        {/* Medium dark red tile */}
        <rect x="85" y="108" width="66" height="28" fill="url(#darkRedTile)" rx="3" />
        <text x="90" y="124" fill="#ffffff" fontSize="7" fontFamily="Arial">Commandes • 24</text>
        
        {/* Bottom tiles */}
        <rect x="15" y="145" width="40" height="40" fill="url(#yellowTile)" rx="4" />
        <text x="20" y="162" fill="#000000" fontSize="7" fontFamily="Arial">Stats</text>
        <text x="20" y="172" fill="#000000" fontSize="7" fontFamily="Arial">Ventes</text>
        
        <rect x="65" y="145" width="40" height="40" fill="url(#redTile)" rx="4" />
        <text x="70" y="162" fill="#ffffff" fontSize="7" fontFamily="Arial">Clients</text>
        <text x="70" y="172" fill="#ffffff" fontSize="7" fontFamily="Arial">Fidèles</text>
        
        <rect x="115" y="145" width="36" height="40" fill="url(#darkRedTile)" rx="4" />
        <text x="120" y="162" fill="#ffffff" fontSize="6" fontFamily="Arial">Promo</text>
        <text x="120" y="172" fill="#ffffff" fontSize="6" fontFamily="Arial">Auto</text>
        
        {/* Live data indicators */}
        <circle cx="140" cy="40" r="3" fill="#10b981" />
        <text x="145" y="44" fill="#10b981" fontSize="6" fontFamily="Arial">LIVE</text>
      </g>
      
      {/* Right Phone - Site E-commerce */}
      <g transform="translate(460, 50)">
        {/* Phone Frame */}
        <rect x="0" y="0" width="160" height="280" rx="20" fill="url(#phone2Gradient)" stroke="#374151" strokeWidth="2" />
        <rect x="8" y="25" width="144" height="230" rx="8" fill="#000000" />
        
        {/* Screen Content */}
        <rect x="8" y="25" width="144" height="230" rx="8" fill="#ffffff" />
        
        {/* Header */}
        <rect x="15" y="35" width="130" height="25" fill="url(#redTile)" rx="4" />
        <text x="22" y="52" fill="#ffffff" fontSize="9" fontFamily="Arial">Restaurant Le Bon Goût</text>
        
        {/* Menu items with images */}
        <rect x="15" y="70" width="130" height="35" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" rx="4" />
        <rect x="20" y="75" width="25" height="25" fill="url(#yellowTile)" rx="3" />
        <text x="50" y="85" fill="#1f2937" fontSize="8" fontFamily="Arial">Pizza Margherita</text>
        <text x="50" y="95" fill="#6b7280" fontSize="7" fontFamily="Arial">12.90€</text>
        <rect x="115" y="78" width="20" height="15" fill="url(#redTile)" rx="8" />
        <text x="120" y="87" fill="#ffffff" fontSize="6" fontFamily="Arial">+</text>
        
        <rect x="15" y="115" width="130" height="35" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" rx="4" />
        <rect x="20" y="120" width="25" height="25" fill="url(#yellowTile)" rx="3" />
        <text x="50" y="130" fill="#1f2937" fontSize="8" fontFamily="Arial">Salade César</text>
        <text x="50" y="140" fill="#6b7280" fontSize="7" fontFamily="Arial">9.50€</text>
        <rect x="115" y="123" width="20" height="15" fill="url(#redTile)" rx="8" />
        <text x="120" y="132" fill="#ffffff" fontSize="6" fontFamily="Arial">+</text>
        
        <rect x="15" y="160" width="130" height="35" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" rx="4" />
        <rect x="20" y="165" width="25" height="25" fill="url(#yellowTile)" rx="3" />
        <text x="50" y="175" fill="#1f2937" fontSize="8" fontFamily="Arial">Burger Maison</text>
        <text x="50" y="185" fill="#6b7280" fontSize="7" fontFamily="Arial">14.90€</text>
        <rect x="115" y="168" width="20" height="15" fill="url(#redTile)" rx="8" />
        <text x="120" y="177" fill="#ffffff" fontSize="6" fontFamily="Arial">+</text>
        
        {/* Cart/Checkout button */}
        <rect x="15" y="210" width="130" height="30" fill="url(#redTile)" rx="6" />
        <text x="22" y="228" fill="#ffffff" fontSize="9" fontFamily="Arial">Panier • 3 articles • 37.30€</text>
        
        {/* Payment icons */}
        <rect x="120" y="245" width="8" height="5" fill="#1f2937" rx="1" />
        <rect x="130" y="245" width="8" height="5" fill="#1f2937" rx="1" />
        <rect x="140" y="245" width="6" height="5" fill="#f4b71b" rx="1" />
      </g>
      
      {/* Floating elements */}
      {/* Connection lines */}
      <path d="M 340 180 Q 400 150 460 180" stroke="#e5e7eb" strokeWidth="2" fill="none" strokeDasharray="5,5" />
      
      {/* Feature badges */}
      <g transform="translate(50, 200)">
        <rect x="0" y="0" width="120" height="30" fill="rgba(183, 15, 35, 0.9)" rx="15" />
        <text x="15" y="20" fill="#ffffff" fontSize="10" fontFamily="Arial">Interface Windows Phone</text>
      </g>
      
      <g transform="translate(630, 200)">
        <rect x="0" y="0" width="100" height="30" fill="rgba(244, 183, 27, 0.9)" rx="15" />
        <text x="15" y="20" fill="#000000" fontSize="10" fontFamily="Arial">E-commerce Intégré</text>
      </g>
      
      {/* Real-time indicators */}
      <g transform="translate(350, 100)">
        <circle cx="0" cy="0" r="8" fill="#10b981" opacity="0.8">
          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="0" r="4" fill="#10b981" />
        <text x="-20" y="-15" fill="#10b981" fontSize="8" fontFamily="Arial">Temps réel</text>
      </g>
      
      {/* Success metrics */}
      <g transform="translate(80, 350)">
        <rect x="0" y="0" width="80" height="45" fill="rgba(255,255,255,0.95)" stroke="#e5e7eb" strokeWidth="1" rx="8" />
        <text x="8" y="15" fill="#b70f23" fontSize="12" fontFamily="Arial">+140%</text>
        <text x="8" y="28" fill="#6b7280" fontSize="8" fontFamily="Arial">Revenus</text>
        <text x="8" y="38" fill="#6b7280" fontSize="8" fontFamily="Arial">Restaurant</text>
      </g>
      
      <g transform="translate(200, 370)">
        <rect x="0" y="0" width="80" height="45" fill="rgba(255,255,255,0.95)" stroke="#e5e7eb" strokeWidth="1" rx="8" />
        <text x="8" y="15" fill="#f4b71b" fontSize="12" fontFamily="Arial">+350</text>
        <text x="8" y="28" fill="#6b7280" fontSize="8" fontFamily="Arial">Commandes</text>
        <text x="8" y="38" fill="#6b7280" fontSize="8" fontFamily="Arial">par mois</text>
      </g>
      
      <g transform="translate(520, 370)">
        <rect x="0" y="0" width="80" height="45" fill="rgba(255,255,255,0.95)" stroke="#e5e7eb" strokeWidth="1" rx="8" />
        <text x="8" y="15" fill="#70070e" fontSize="12" fontFamily="Arial">4.8/5</text>
        <text x="8" y="28" fill="#6b7280" fontSize="8" fontFamily="Arial">Satisfaction</text>
        <text x="8" y="38" fill="#6b7280" fontSize="8" fontFamily="Arial">Clients</text>
      </g>
      
      <g transform="translate(640, 350)">
        <rect x="0" y="0" width="80" height="45" fill="rgba(255,255,255,0.95)" stroke="#e5e7eb" strokeWidth="1" rx="8" />
        <text x="8" y="15" fill="#b70f23" fontSize="12" fontFamily="Arial">24/7</text>
        <text x="8" y="28" fill="#6b7280" fontSize="8" fontFamily="Arial">Support</text>
        <text x="8" y="38" fill="#6b7280" fontSize="8" fontFamily="Arial">Actif</text>
      </g>
    </svg>
  );
}