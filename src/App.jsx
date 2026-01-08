import './App.css';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  CloudSnow, 
  Wind, 
  ThermometerSnowflake, 
  Plane, 
  Train, 
  Car, 
  MapPin, 
  Clock,
  ShieldAlert, 
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  X,
  Loader2,
  Layers, 
  Briefcase,
  GraduationCap,
  HardHat,
  Backpack,
  ArrowRight,
  ArrowDown,
  ShoppingBasket,
  HeartHandshake,
  CalendarDays,
  Radio,
  ExternalLink,
  Heart,
  MessageCircle,
  Send,
  RefreshCw,
  Zap,
  Activity,
  Baby,
  Truck,
  HeartPulse,
  Home,
  CheckCircle,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';

// ==========================================
// 1. DONNÉES RÉGIONALES ET ALERTES (MAJ JEUDI 08/01 - 09:45)
// ==========================================

const REGION_DATA = {
  'Ile-de-France': {
    coords: [48.7, 2.4],
    status: 'orange',
    temp: '-6°C',
    phenomenon: 'Grand Froid',
    directive: 'Télétravail maintenu. Sorties déconseillées avant 11h.',
    health: 'Urgences saturées. Plan Blanc maintenu sur toute l\'AP-HP.',
    transports: 'N118 rouverte partiellement (convois). RER : Trafic ralenti.',
    news: 'Température au sol à -10°C. Risque de chutes sur verglas critique.',
    description: 'Nuit glaciale. Le sel ne fait plus effet sur les plaques de glace vive.'
  },
  'Auvergne-Rhône-Alpes': {
    coords: [45.5, 5.5],
    status: 'rouge',
    temp: '-9°C',
    phenomenon: 'Neige/Blizzard',
    directive: 'Interdiction totale de circuler sur le réseau secondaire du Cantal.',
    health: 'Renforts de la Protection Civile arrivés à Clermont-Ferrand.',
    transports: 'A75 : Dégagement de la neige en cours. Cols fermés.',
    news: 'Coupures d\'électricité localisées suite au poids de la neige.',
    description: 'Le blizzard s\'essouffle mais laisse 60cm de neige instable.'
  },
  'Normandie': {
    coords: [49.1, 0.0],
    status: 'orange',
    temp: '-8°C',
    phenomenon: 'Grand Froid',
    directive: 'Ecoles fermées. Pas de ramassage scolaire ce jour.',
    health: 'Ruptures de canalisations signalées à Caen et Rouen.',
    transports: 'A13 : circulation sur une voie. Bus urbains au dépôt.',
    news: 'Bilan de la nuit : plusieurs incendies liés à des chauffages d\'appoint.',
    description: 'Froid polaire permanent. Risque de gel des compteurs d\'eau.'
  },
  'Bretagne': {
    coords: [48.2, -2.9],
    status: 'orange',
    temp: '-4°C',
    phenomenon: 'Verglas',
    directive: 'Prudence maximale sur les ponts et axes côtiers.',
    health: 'Vigilance seniors. 115 saturé sur Rennes et Brest.',
    transports: 'TER Bretagne : Reprise progressive. RN12 dégagée.',
    news: 'Accalmie sur les chutes de neige, mais regel massif.',
    description: 'Ciel clair favorisant un rayonnement thermique intense et un froid piquant.'
  },
  'Grand-Est': {
    coords: [48.8, 5.8],
    status: 'orange',
    temp: '-12°C',
    phenomenon: 'Grand Froid',
    directive: 'EcoWatt Rouge : Réduisez votre consommation électrique.',
    health: 'Mise en place de structures chauffantes d\'urgence à Strasbourg.',
    transports: 'TGV : Retards persistants (caténaires givrées).',
    news: 'Nouveau record à Reims : -19.4°C à l\'aube.',
    description: 'Conditions arctiques. Sorties extérieures interdites aux personnes fragiles.'
  },
  'Hauts-de-France': {
    coords: [50.1, 2.9],
    status: 'orange',
    temp: '-9°C',
    phenomenon: 'Grand Froid',
    directive: 'Arrêt total des chantiers en extérieur (BTP).',
    health: 'Plusieurs cas d\'engelures graves signalés aux urgences de Lille.',
    transports: 'Eurostar : Reprise avec retards. A1 glissante.',
    news: 'Vents de Nord-Est (50km/h) : ressenti à -18°C.',
    description: 'Bise glaciale insupportable. Vigilance maximale pour les travailleurs isolés.'
  },
  'Nouvelle-Aquitaine': {
    coords: [45.5, 0.2],
    status: 'jaune',
    temp: '-1°C',
    phenomenon: 'Givre',
    directive: 'Salage préventif des trottoirs en zones urbaines.',
    health: 'Attention aux chutes. Hausse des appels SOS Médecins.',
    transports: 'Bordeaux : Tramways ralentis (rails gelés).',
    news: 'Le front froid descend vers les Pyrénées.',
    description: 'Le regel nocturne a transformé l\'humidité de la veille en verglas.'
  },
  'Occitanie': {
    coords: [43.8, 2.0],
    status: 'jaune',
    temp: '1°C',
    phenomenon: 'Neige/Pluie',
    directive: 'Pneus neige obligatoires pour franchir les Pyrénées.',
    health: 'Normal.',
    transports: 'A75 : Trafic limité. Bus scolaires maintenus sauf reliefs.',
    news: 'Légères chutes de neige à Toulouse au lever du jour.',
    description: 'Lutte entre l\'air froid du Nord et l\'humidité Méditerranéenne.'
  },
  'Paca': {
    coords: [44.0, 6.0],
    status: 'vert',
    temp: '2°C',
    phenomenon: 'Mistral',
    directive: 'Vigilance incendie (vent fort/sécheresse).',
    health: 'Normal.',
    transports: 'Normal.',
    news: 'Rafales à 100km/h dans la vallée du Rhône.',
    description: 'Mistral violent accentuant le froid ressenti.'
  },
  'Corse': {
    coords: [42.0, 9.0],
    status: 'jaune',
    temp: '6°C',
    phenomenon: 'Tempête',
    directive: 'Accès aux caps et sentiers côtiers interdit.',
    health: 'Normal.',
    transports: 'Traversées maritimes perturbées.',
    news: 'Vagues de 5 mètres sur la côte Ouest.',
    description: 'Dépression active en Méditerranée.'
  },
  'default': {
    status: 'orange',
    temp: '--',
    phenomenon: 'Pic de Froid',
    description: 'Le pic d\'intensité de la vague de froid est atteint ce matin.'
  }
};

const MOCK_NEWS_DATA = [
  { id: 401, source: 'AFP / FLASH', category: 'sante', title: '⚠️ Bilan Humain : 8 décès confirmés', content: 'Le froid a causé deux nouvelles victimes cette nuit dans le Grand-Est. Le plan Grand Froid est au niveau maximal.', time: '09:30' },
  { id: 402, source: 'RTE / ECOWATT', category: 'energie', title: '🔴 SIGNAL ROUGE : Tension ce matin', content: 'Le réseau électrique est en limite de rupture. Déstélages tournants évités de justesse. Réduisez tout chauffage.', time: '08:45' },
  { id: 403, source: 'INFO TRAFIC', category: 'transport', title: '🛣️ N118 : Réouverture sous escorte', content: 'Les premiers convois de véhicules légers circulent vers Vélizy. Camions toujours interdits.', time: '09:15' },
  { id: 404, source: 'MINISTÈRE INTÉRIEUR', category: 'securite', title: '📢 Consigne : Restez chez vous', content: 'Sur toute la moitié Nord, le télétravail reste la règle absolue ce jeudi.', time: '07:30' }
];

const MOCK_INCIDENTS_DATA = [
  { id: 1, source: 'Sytadin', region: 'Ile-de-France', time: '09:15', title: 'N118 - CONVOIS SÉCURISÉS', detail: 'Circulation en "accordéon" derrière les saleuses.', path: [[48.82, 2.23], [48.78, 2.22], [48.75, 2.19]], level: 'majeur' },
  { id: 2, source: 'SAPN', region: 'Normandie', time: '08:50', title: 'A13 - GLACE VIVE', detail: 'Trafic extrêmement lent. Plusieurs sorties fermées.', path: [[49.38, 1.15], [49.43, 1.09]], level: 'critique' },
  { id: 10, source: 'Bison Futé', region: 'Auvergne-Rhône-Alpes', time: '09:40', title: 'A75 - DÉNEIGEMENT MASSIF', detail: 'Accès au Cantal toujours bloqué par les congères.', path: [[45.14, 3.19], [45.05, 3.10]], level: 'critique' }
];

const DECISION_CONTENT = {
  'parent': {
    verdict: "ALERTE - ÉCOLES FERMÉES",
    checklist: ["Vérifier ENT/Direct", "Pas de sorties inutiles", "Vérifier stock lait/couches", "Anticiper Jeudi soir"],
    previsions: "Maintien des fermetures scolaires probable pour Vendredi."
  },
  'pro': {
    verdict: "OBLIGATION TÉLÉTRAVAIL",
    checklist: ["Pas de trajets routiers", "Points visio uniquement", "Économie énergie PC", "Signaler absence si panne courant"],
    previsions: "Dégel non prévu avant Samedi. Travail à distance requis."
  },
  'senior': {
    verdict: "CONFINEMENT THERMIQUE ABSOLU",
    checklist: ["Chauffage constant", "Appel de courtoisie famille", "Alimentation chaude", "Pas de marche sur trottoir"],
    previsions: "-15°C attendus localement cette nuit. Danger vital."
  },
  'truck': {
    verdict: "INTERDICTION MAINTENUE",
    checklist: ["Attente sur aires sécurisées", "Vérifier batteries/chauffage", "Stocks nourriture", "Écouter 107.7"],
    previsions: "Possibles fenêtres de circulation en convoi Vendredi."
  },
  'home': {
    verdict: "VIGILANCE CANALISATIONS",
    checklist: ["Purge robinets extérieurs", "Isolation compteur d'eau", "Réduction chauffage à 17°C", "Vérifier stock piles"],
    previsions: "Risque de rupture de canalisations urbaines élevé."
  }
};

// ==========================================
// 2. COMPOSANTS INTERNES
// ==========================================

const DecisionModal = ({ isOpen, onClose }) => {
  const [activeProfile, setActiveProfile] = useState(null);
  const PROFILES = [
    { id: 'parent', label: 'Parents / Écoles', icon: Baby, color: 'text-pink-400' },
    { id: 'pro', label: 'Salariés / Télétravail', icon: Briefcase, color: 'text-blue-400' },
    { id: 'senior', label: 'Séniors / Fragiles', icon: HeartPulse, color: 'text-red-400' },
    { id: 'truck', label: 'Logistique / Transport', icon: Truck, color: 'text-yellow-400' },
    { id: 'home', label: 'Propriétaires / Maison', icon: Home, color: 'text-emerald-400' }
  ];

  if (!isOpen) return null;
  const content = activeProfile ? DECISION_CONTENT[activeProfile.id] : null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-72 bg-slate-850 border-r border-slate-800 p-6 flex flex-col gap-4 shrink-0">
          <div className="mb-4"><h2 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-tighter"><ShieldAlert className="text-blue-500" /> Profils</h2><p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Directives (09:45)</p></div>
          <div className="flex flex-col gap-2 flex-1">{PROFILES.map(p => (<button key={p.id} onClick={() => setActiveProfile(p)} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left group ${activeProfile?.id === p.id ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}><p.icon className={`w-5 h-5 ${activeProfile?.id === p.id ? 'text-white' : p.color}`} /><span className="text-xs font-bold uppercase">{p.label}</span></button>))}</div>
          <button onClick={onClose} className="mt-4 w-full bg-red-600/10 hover:bg-red-600/20 text-red-400 py-4 rounded-xl text-xs font-black transition-all border border-red-500/30 flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-red-900/10"><ChevronLeft className="w-4 h-4" /> Revenir à l'Accueil</button>
        </div>
        <div className="flex-1 bg-slate-900 p-8 overflow-y-auto custom-scrollbar relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all z-20 shadow-lg border border-slate-700"><X className="w-6 h-6" /></button>
          {!activeProfile ? (<div className="h-full flex flex-col items-center justify-center text-center opacity-40"><Sparkles className="w-16 h-16 mb-4 text-slate-600" /><h3 className="text-2xl font-black text-white uppercase tracking-widest">Poste de Commandement</h3><p className="max-w-xs text-xs mt-2">Sélectionnez une catégorie pour afficher les fiches opérationnelles.</p></div>) : (
            <div className="animate-in slide-in-from-right-10 duration-500 space-y-8 pb-12">
               <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4 pr-12">
                 <div className="flex items-center gap-4"><button onClick={() => setActiveProfile(null)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors flex items-center gap-2 pr-3"><ArrowLeft className="w-5 h-5" /><span className="text-[10px] font-bold uppercase hidden md:inline">Profils</span></button><div><span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Préconisation Sécurité Civile</span><h2 className="text-3xl font-black text-white uppercase tracking-tight">{activeProfile.label}</h2></div></div>
                 <div className="p-3 bg-blue-500/10 rounded-full border border-blue-500/30">{React.createElement(activeProfile.icon, { className: `w-8 h-8 ${activeProfile.color}` })}</div>
               </div>
               <section><h3 className="text-blue-400 font-bold uppercase text-xs tracking-wider mb-2">### VERDICT OPÉRATIONNEL</h3><div className={`p-4 rounded-xl border-l-4 bg-slate-800/50 ${content.verdict.includes('ALERTE') ? 'border-red-600' : 'border-blue-500'}`}><p className="text-white font-bold text-sm tracking-tight">{content.verdict}</p></div></section>
               <section><h3 className="text-blue-400 font-bold uppercase text-xs tracking-wider mb-3">### ACTIONS IMMÉDIATES</h3><div className="space-y-3">{content.checklist.map((item, i) => (<div key={i} className="flex gap-4 items-center bg-slate-800/30 p-4 rounded-2xl border border-slate-800 group hover:border-slate-700 transition-colors"><div className="w-6 h-6 border-2 border-slate-600 rounded-lg flex items-center justify-center shrink-0 group-hover:border-blue-500"><CheckCircle className="w-4 h-4 text-transparent group-hover:text-blue-500 transition-colors" /></div><p className="text-slate-300 text-sm">{item}</p></div>))}</div></section>
               <section><h3 className="text-blue-400 font-bold uppercase text-xs tracking-wider mb-2">### ÉVOLUTION SOIRÉE</h3><div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20"><p className="text-slate-300 text-sm leading-relaxed">{content.previsions}</p></div></section>
               <div className="pt-8 border-t border-slate-800 flex justify-between"><button onClick={() => setActiveProfile(null)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"><ArrowLeft className="w-4 h-4" /> Retour aux profils</button><button onClick={onClose} className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest"><X className="w-4 h-4" /> Fermer et quitter</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LeafletMap = ({ onSelect, selected, showTraffic }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (document.getElementById('leaflet-css')) { setIsMapReady(true); return; }
    const link = document.createElement('link'); link.id = 'leaflet-css'; link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
    const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.async = true; script.onload = () => setIsMapReady(true); document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isMapReady || !mapContainerRef.current) return;
    const L = window.L;
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, { zoomControl: false, closePopupOnClick: false }).setView([46.60, 1.88], 5.5);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapRef.current);
    }
    const map = mapRef.current;
    map.eachLayer(l => { if (l instanceof L.CircleMarker || l instanceof L.Polyline) map.removeLayer(l); });

    if (showTraffic) {
      MOCK_INCIDENTS_DATA.forEach(r => {
        if (r.path) {
          const col = r.level === 'critique' ? '#ef4444' : '#f97316';
          const line = L.polyline(r.path, { color: col, weight: 6, opacity: 0.8 }).addTo(map);
          line.bindTooltip(`<div class="font-bold text-xs">${r.title}</div><div class="text-[9px] text-red-500 font-bold uppercase">${r.detail}</div>`, { sticky: true });
        }
      });
    }

    Object.entries(REGION_DATA).forEach(([reg, data]) => {
      if (reg === 'default') return;
      let col = data.status === 'rouge' ? '#dc2626' : data.status === 'orange' ? '#f97316' : data.status === 'jaune' ? '#eab308' : '#10b981';
      const circle = L.circleMarker(data.coords, { radius: selected === reg ? 18 : 10, fillColor: col, color: '#fff', weight: selected === reg ? 3 : 1, fillOpacity: 0.8 }).addTo(map);
      circle.bindTooltip(`<div class="font-black uppercase text-[10px]">${reg}</div><div class="text-[9px] font-bold text-slate-400">${data.temp}</div>`, { direction: 'top', offset: [0, -10] });
      const popupContent = `<div style="font-family: sans-serif; min-width: 240px; color: #1e293b; padding: 4px;"><div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 12px;"><div><h4 style="margin:0; font-weight: 900; color: #0f172a; text-transform: uppercase; font-size: 14px;">${reg}</h4></div><div style="background: ${col}; color: white; padding: 6px 10px; border-radius: 8px; font-size: 16px; font-weight: 900;">${data.temp}</div></div><div style="display: grid; gap: 10px;"><div style="background: #f8fafc; padding: 10px; border-radius: 10px; border-left: 4px solid #3b82f6;"><p style="margin:0; font-size:11px; font-weight:500;">${data.directive}</p></div><div style="background: #f8fafc; padding: 10px; border-radius: 10px; border-left: 4px solid #ef4444;"><p style="margin:0; font-size:11px; font-weight:500;">${data.health}</p></div><div style="background: #f8fafc; padding: 10px; border-radius: 10px; border-left: 4px solid #10b981;"><p style="margin:0; font-size:11px; font-weight:500;">${data.transports}</p></div></div></div>`;
      circle.bindPopup(popupContent, { maxWidth: 320, className: 'custom-region-popup', autoPan: true });
      circle.on('click', (e) => { L.DomEvent.stopPropagation(e); onSelect(reg); e.target.openPopup(); map.flyTo(data.coords, 7, { duration: 0.8 }); });
    });
  }, [isMapReady, showTraffic]);

  useEffect(() => {
    const handler = (e) => onSelect(e.detail);
    window.addEventListener('select-region', handler);
    return () => window.removeEventListener('select-region', handler);
  }, [onSelect]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-xl" />;
};

// ==========================================
// 3. APPLICATION PRINCIPALE (APP)
// ==========================================

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [activeTab, setActiveTab] = useState('meteo');
  const [showTraffic, setShowTraffic] = useState(true);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  const orangeRegions = useMemo(() => Object.entries(REGION_DATA).filter(([k, v]) => v.status === 'orange').map(([k]) => k), []);
  const rougeRegions = useMemo(() => Object.entries(REGION_DATA).filter(([k, v]) => v.status === 'rouge').map(([k]) => k), []);

  const currentWeather = useMemo(() => {
    if (selectedRegion === 'all') return REGION_DATA['default'];
    return REGION_DATA[selectedRegion] || REGION_DATA['default'];
  }, [selectedRegion]);

  const regionalIncidents = useMemo(() => {
    if (selectedRegion === 'all') return MOCK_INCIDENTS_DATA;
    return MOCK_INCIDENTS_DATA.filter(i => i.region === selectedRegion);
  }, [selectedRegion]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <DecisionModal isOpen={isDecisionModalOpen} onClose={() => setIsDecisionModalOpen(false)} />

      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg animate-pulse"><ShieldAlert className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="font-bold text-lg leading-tight uppercase tracking-tighter">HEXAGON COLD ALERT 2026</h1>
              <div className="flex items-center gap-2 text-[10px] text-red-400 font-bold uppercase tracking-widest">Urgence Niveau 3 • 09:45 LIVE</div>
            </div>
          </div>
          <button onClick={() => setIsDecisionModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-blue-900/20 transition-all active:scale-95"><Layers className="w-4 h-4" /> Aide à la Décision</button>
        </div>
      </header>

      {/* FLASH BAND */}
      <div className="w-full bg-red-600/10 border-b border-red-500/20 py-2.5">
          <div className="flex items-center justify-center gap-8 animate-pulse text-[11px] font-black text-red-200 uppercase tracking-widest">
            <Radio className="w-4 h-4 text-red-500" /> JEUDI 09:45 : N118 rouverte sous escorte • Bilan humain porté à 8 décès • Vigilance Grand Froid maintenue
          </div>
      </div>

      {/* BANDEAU VIGILANCE DES RÉGIONS */}
      <div className="w-full bg-slate-850 border-b border-slate-700 overflow-x-auto custom-scrollbar shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center gap-6 whitespace-nowrap">
          <div className="flex items-center gap-2 shrink-0"><AlertTriangle className="w-4 h-4 text-orange-500" /><span className="text-[10px] font-black uppercase text-slate-400">Vigilance Territoriale :</span></div>
          {selectedRegion === 'all' ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 px-3 py-1 rounded-full animate-pulse"><span className="w-2 h-2 rounded-full bg-red-600"></span><span className="text-[10px] font-black text-red-100 uppercase">{rougeRegions.length} ROUGE ({rougeRegions.join(', ')})</span></div>
              <div className="flex items-center gap-2 bg-orange-600/20 border border-orange-500/30 px-3 py-1 rounded-full"><span className="w-2 h-2 rounded-full bg-orange-600"></span><span className="text-[10px] font-black text-orange-100 uppercase">{orangeRegions.length} ORANGE ({orangeRegions.join(', ')})</span></div>
            </div>
          ) : (
            <div className="flex items-center gap-3"><span className="text-[10px] font-bold text-white uppercase">{selectedRegion} :</span><div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${currentWeather.status === 'rouge' ? 'bg-red-600/20 border-red-500/30 text-red-100 animate-pulse' : currentWeather.status === 'orange' ? 'bg-orange-600/20 border-orange-500/30 text-orange-100' : 'bg-emerald-600/20 border-emerald-500/30 text-emerald-100'}`}><span className={`w-2 h-2 rounded-full ${currentWeather.status === 'rouge' ? 'bg-red-600' : currentWeather.status === 'orange' ? 'bg-orange-600' : 'bg-emerald-600'}`}></span><span className="text-[10px] font-black uppercase tracking-widest">{currentWeather.status} • {currentWeather.phenomenon}</span></div><button onClick={() => setSelectedRegion('all')} className="text-[9px] font-black text-slate-500 hover:text-white uppercase transition-colors ml-4 border-l border-slate-700 pl-4 underline decoration-dotted">Vue Nationale</button></div>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-y-auto">
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* ECOWATT */}
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
             <div className="flex justify-between items-center mb-8"><h3 className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /> Écowatt • Projection Énergie</h3><span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg">TENSION ÉLEVÉE 18H</span></div>
            <div className="flex justify-between relative px-2">
               <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-900 -translate-y-1/2 rounded-full"></div>
               {[{h:'09h', t:'-6°', s:'rouge'}, {h:'13h', t:'-2°', s:'orange'}, {h:'18h', t:'-5°', s:'orange'}, {h:'23h', t:'-11°', s:'jaune'}].map((slot, i) => (
                 <div key={i} className="relative z-10 flex flex-col items-center">
                   <div className={`w-4 h-4 rounded-full mb-3 border-4 border-slate-900 ${slot.s === 'rouge' ? 'bg-red-500 scale-125 shadow-lg shadow-red-500/50' : slot.s === 'orange' ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                   <div className="bg-slate-900 p-3 rounded-2xl text-center min-w-[70px] border border-slate-700 font-mono"><p className="text-[9px] text-slate-500">{slot.h}</p><p className="text-sm font-black text-white">{slot.t}</p></div>
                 </div>
               ))}
            </div>
          </div>

          {/* ALERTES / NEWS */}
          <div className="bg-slate-800 rounded-3xl border border-slate-700 flex flex-col h-[400px] overflow-hidden shadow-2xl">
            <div className="flex border-b border-slate-700 bg-slate-850">
              <button onClick={() => setActiveTab('meteo')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'meteo' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}>Alertes & Flashs</button>
              <button onClick={() => setActiveTab('incidents')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'incidents' ? 'bg-slate-800 text-red-400 border-b-2 border-red-500' : 'text-slate-500'}`}>Trafic {selectedRegion !== 'all' ? `(${selectedRegion})` : ''}</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {(activeTab === 'meteo' ? MOCK_NEWS_DATA : regionalIncidents).map(item => (
                <div key={item.id} className={`p-4 bg-slate-900/50 rounded-2xl border ${activeTab === 'incidents' ? 'border-l-4 border-l-red-600' : 'border-slate-700'}`}>
                  <div className="flex justify-between text-[10px] mb-2 font-mono"><span className="font-black text-slate-500 uppercase">{item.source}</span><span className="font-bold">{item.time}</span></div>
                  <h4 className="text-xs font-black text-white uppercase leading-tight">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">{item.content || item.detail}</p>
                </div>
              ))}
              {activeTab === 'incidents' && regionalIncidents.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-40 py-10">
                  <CheckCircle2 className="w-10 h-10 mb-2 text-emerald-500" />
                  <p className="text-[10px] font-bold uppercase">Axe dégagé ou normalisé</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COL DROITE: MAP */}
        <div className="lg:col-span-7 bg-slate-800 rounded-3xl border border-slate-700 p-1 relative flex flex-col h-[600px] lg:h-auto shadow-2xl overflow-hidden">
          <div className="absolute top-6 left-6 z-[400] flex flex-col gap-2">
            <div className="bg-slate-900/95 backdrop-blur-xl px-4 py-2 rounded-2xl border border-slate-700 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl">France • Vigilance Territoriale</div>
            <div className="flex gap-2">
                <button onClick={() => setShowTraffic(!showTraffic)} className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase transition-all shadow-xl ${showTraffic ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-900/90 border-slate-700 text-slate-400'}`}>Trafic {showTraffic ? 'ACTIF' : 'INACTIF'}</button>
                {selectedRegion !== 'all' && <button onClick={() => setSelectedRegion('all')} className="bg-slate-700 px-4 py-2 rounded-xl border border-slate-600 text-[10px] font-bold uppercase tracking-widest shadow-xl">Vue Nationale</button>}
            </div>
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden bg-slate-950 relative">
             <LeafletMap onSelect={setSelectedRegion} selected={selectedRegion} showTraffic={showTraffic} />
             <div className="absolute bottom-8 right-8 z-[400] bg-slate-900/90 backdrop-blur px-5 py-4 rounded-3xl border border-slate-700 space-y-3 shadow-2xl pointer-events-none">
                <div className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-lg shadow-red-600/50"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zone Rouge</span></div>
                <div className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-orange-600"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zone Orange</span></div>
                <div className="flex items-center gap-4"><div className="w-6 h-1.5 bg-red-600 rounded-full"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Axe Bloqué</span></div>
             </div>
          </div>
        </div>
      </main>

      {/* FOOTER OPTIMISÉ */}
      <footer className="bg-slate-950 border-t border-slate-800 py-4 px-6 shrink-0 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HeartHandshake className="w-4 h-4 text-pink-500 animate-pulse shrink-0" />
            <div className="flex flex-col">
              <p className="text-[10px] text-slate-300 font-medium leading-tight">Développé avec fraternité et résilience par <strong>Warda Bailiche Berrached</strong>, le 5 janvier 2026.</p>
              <p className="text-[9px] text-slate-500 leading-tight">Pour toute fin utile à ceux impactés. Amélioration de l'app : vous êtes les bienvenus.</p>
            </div>
          </div>
          <a href="https://wa.me/33619641396" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 transition-all shrink-0"><MessageCircle className="w-4 h-4" /> Me contacter sur WhatsApp</a>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .leaflet-popup-content-wrapper { background: #ffffff !important; color: #1e293b !important; border-radius: 20px !important; padding: 0 !important; overflow: hidden; box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5) !important; border: 1px solid #e2e8f0 !important; }
        .leaflet-popup-content { margin: 0 !important; padding: 16px !important; }
        .leaflet-container { background: #0f172a !important; }
        .custom-region-popup .leaflet-popup-close-button { top: 12px !important; right: 12px !important; color: #64748b !important; font-size: 16px !important; }
      `}</style>
    </div>
  );
}
