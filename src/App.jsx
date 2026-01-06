import './App.css';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Analytics } from '@vercel/analytics/react';
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
  Newspaper,
  BookOpen,
  Zap,
  Radio,
  FileText,
  ExternalLink,
  Heart,
  School,
  Building,
  MessageCircle,
  Send,
  Eye,
  RefreshCw
} from 'lucide-react';

// --- CONFIGURATION API GEMINI ---
const apiKey = ""; // La clé est injectée par l'environnement d'exécution

// --- DONNÉES GÉOGRAPHIQUES ---
const REGION_COORDS = {
  'Hauts-de-France': [50.1, 2.9],
  'Normandie': [49.1, 0.0],
  'Ile-de-France': [48.7, 2.4],
  'Grand-Est': [48.8, 5.8],
  'Bretagne': [48.2, -2.9],
  'Pays de la Loire': [47.5, -0.6],
  'Centre-Val de Loire': [47.5, 1.7],
  'Bourgogne-Franche-Comté': [47.2, 4.8],
  'Nouvelle-Aquitaine': [45.5, 0.2],
  'Auvergne-Rhône-Alpes': [45.5, 5.5],
  'Occitanie': [43.8, 2.0],
  'Paca': [44.0, 6.0],
  'Corse': [42.0, 9.0]
};

// --- CONSTANTES MOCK DATA (Renommées pour éviter les erreurs de référence) ---
const MOCK_DEPARTMENTS_ORANGE = [
  "Nord (59)", "Pas-de-Calais (62)", "Somme (80)", "Aisne (02)", "Oise (60)",
  "Seine-Maritime (76)", "Eure (27)", "Calvados (14)", "Orne (61)", "Manche (50)",
  "Yvelines (78)", "Val-d'Oise (95)", "Essonne (91)", "Seine-et-Marne (77)", "Paris (75)",
  "Hauts-de-Seine (92)", "Seine-Saint-Denis (93)", "Val-de-Marne (94)",
  "Eure-et-Loir (28)", "Loir-et-Cher (41)", "Loiret (45)", "Sarthe (72)", "Mayenne (53)",
  "Ille-et-Vilaine (35)", "Côtes-d'Armor (22)", "Morbihan (56)"
];

const MOCK_CONSEILS_DATA = [
  { id: 1, title: 'Bilan Humain', Icon: Heart, colorClass: 'text-red-400', content: "4 morts signalés. Si vous voyez quelqu'un dehors, appelez le 115 immédiatement. Ne passez pas votre chemin." },
  { id: 2, title: 'Prudence Route', Icon: Car, colorClass: 'text-blue-400', content: "Évitez l'A13 et la N118. Privilégiez le télétravail demain également car le dégel n'est pas prévu avant vendredi." },
  { id: 3, title: 'Énergie', Icon: Zap, colorClass: 'text-yellow-400', content: "Réduisez le chauffage à 18°C pour soulager le réseau national. Évitez les machines à laver entre 18h et 20h." }
];

const MOCK_TRAFFIC_LINES = [
 { id: 'N118', name: 'N118 (Vélizy)', status: 'closed', path: [[48.79, 2.22], [48.70, 2.18]] },
  { id: 'A13', name: 'A13 (Normandie)', status: 'critical', path: [[48.85, 2.25], [49.0, 1.5], [49.18, -0.37]] },
  { id: 'A11', name: 'A11 (L\'Océane)', status: 'critical', path: [[48.5, 2.0], [48.0, 0.2], [47.2, -1.5]] },
  { id: 'A86', name: 'A86 (Super-Périphérique)', status: 'slow', path: [[48.93, 2.35], [48.88, 2.46], [48.76, 2.45], [48.75, 2.25]] },
  { id: 'RN12', name: 'RN12 (Bretagne)', status: 'critical', path: [[48.11, -1.67], [48.5, -2.7], [48.4, -4.5]] }

];

const MOCK_WEATHER_DATA = {
   'Bretagne': { status: 'orange', temp: '-2°C', phenomenon: 'Neige-Verglas', description: 'Re-gel massif cette nuit. Routes secondaires impraticables.' },
  'Normandie': { status: 'orange', temp: '-5°C', phenomenon: 'Grand Froid', description: 'Conditions critiques. Risque de coupures d\'eau (gel des canalisations).' },
  'Ile-de-France': { status: 'orange', temp: '-4°C', phenomenon: 'Neige-Verglas', description: 'Plan Neige Niveau 3 maintenu. Circulation très difficile.' },
  'Auvergne-Rhône-Alpes': { status: 'jaune', temp: '-6°C', phenomenon: 'Neige', description: '15cm de neige attendus dès demain matin.' },
  'Hauts-de-France': { status: 'jaune', temp: '-7°C', phenomenon: 'Grand Froid', description: 'Température ressentie -14°C à Lille.' },
  'Grand-Est': { status: 'jaune', temp: '-8°C', phenomenon: 'Grand Froid', description: 'Givre épais sur les routes.' },
  'Nouvelle-Aquitaine': { status: 'vert', temp: '4°C', phenomenon: 'Pluie', description: 'Pluie froide devenant neigeuse en soirée.' },
  'default': { status: 'vert', temp: '2°C', phenomenon: 'RAS', description: 'Situation normale.' }
};

const MOCK_TIMELINE_DATA = [
  { time: 'Matin', hour: '08h', temp: '-5°C', road: 'Verglas', ecowatt: 'vert' },
  { time: 'Midi', hour: '13h', temp: '-2°C', road: 'Givre', ecowatt: 'orange' },
  { time: 'Soir', hour: '18h', temp: '-4°C', road: 'CRITIQUE', ecowatt: 'rouge', isPeak: true },
  { time: 'Nuit', hour: '23h', temp: '-10°C', road: 'GEL', ecowatt: 'vert' }
];

const MOCK_INCIDENTS_DATA = [
 { id: 1, category: 'route', region: 'Ile-de-France', level: 'critique', title: 'N118 - FERMÉE TOUTE LA JOURNÉE', detail: 'Conditions de circulation impossibles. Plusieurs véhicules abandonnés sur la chaussée cette nuit.', time: '06:00', source: 'Sytadin' },
  { id: 2, category: 'route', region: 'Normandie', level: 'majeur', title: 'A13 - Embouteillage Verglas', detail: 'Trafic bloqué sur 15km entre Mantes et Rouen. Les saleuses ne peuvent plus passer.', time: '13:10', source: 'SAPN' },
  { id: 3, category: 'transport', region: 'Bretagne', level: 'critique', title: 'Bus Scolaires : Suspension Mercredi', detail: 'Les préfectures de Bretagne confirment qu\'aucun car scolaire ne circulera demain mercredi 7 janvier.', time: '14:00', source: 'Préfecture 35' },
  { id: 4, category: 'route', region: 'Occitanie', level: 'modere', title: 'A75 - Neige attendue', detail: 'Fermeture préventive du tunnel de Foix possible dès ce soir.', time: '14:25', source: 'Bison Futé' },

];

const MOCK_NEWS_DATA = [
 { id: 201, source: 'AFP / INFO CRISE', category: 'meteo', type: 'directive', title: '⚠️ Bilan Humain : 4 décès signalés', content: 'Le froid polaire a fait ses premières victimes. 2 sans-abris retrouvés en hypothermie à Paris et Lyon. Une personne âgée isolée décédée à son domicile en Normandie suite à une coupure de chauffage. Un accident sur l\'A13 lié au verglas a également coûté la vie à un conducteur ce matin.', time: '14:15' },
  { id: 202, source: 'Météo France', category: 'meteo', type: 'directive', title: '🔮 Prévisions Demain (Mercredi 7 Janvier)', content: 'ALERTE : Un nouveau front neigeux massif arrive par le Sud-Ouest. On attend 15 à 20cm de neige sur l\'Auvergne et le Limousin d\'ici demain midi. Le gel restera permanent sur la moitié Nord avec des pointes à -15°C ressentis. Vigilance Rouge envisagée pour le Massif Central.', time: '13:45' },
  { id: 203, source: 'Ministère Santé', category: 'meteo', type: 'directive', title: '🏥 Plan Blanc activé en IDF et Normandie', content: 'Les services d\'urgence sont saturés par les chutes sur le verglas et les pathologies liées au froid. Le SAMU demande de ne pas appeler le 15 pour des traumatismes légers mais de contacter les centres de soins de proximité.', time: '12:20' },
  { id: 204, source: 'RTE EcoWatt', category: 'meteo', type: 'media', title: '⚡ Risque de délestage Mercredi matin', content: 'La tension sur le réseau électrique atteint un seuil critique pour demain matin entre 08h et 10h. RTE appelle à réduire drastiquement la consommation dès ce soir pour éviter des coupures ciblées.', time: '11:00' },
  { id: 205, source: 'SNCF Info', category: 'transport', type: 'media', title: '🚄 Trafic TGV : Axes Ouest et Nord ralentis', content: 'Les caténaires givrées obligent les trains à circuler à vitesse réduite. Prévoir 1h30 de retard sur les liaisons Paris-Rennes et Paris-Lille. 20% des trains supprimés demain.', time: '10:15' },
  { id: 206, source: 'Education Nationale', category: 'meteo', type: 'directive', title: '🏫 Fermeture d\'écoles confirmée pour demain', content: 'Plus de 300 établissements scolaires resteront fermés demain mercredi dans les zones les plus touchées du Nord et de l\'Ouest. Les cours seront assurés en distanciel là où le réseau internet est stable.', time: '09:30' },
];

// --- UTILS ---
const CleanMarkdown = ({ content }) => {
  if (!content) return null;
  return (
    <div className="space-y-3 font-sans text-slate-300">
      {content.split('\n').map((line, index) => {
        let cleanLine = line.trim();
        if (cleanLine.match(/^\||:---|---/)) return null; 
        if (!cleanLine) return <div key={index} className="h-2" />; 
        if (cleanLine.startsWith('###')) {
          return (
            <h3 key={index} className="text-lg font-bold text-blue-100 mt-6 mb-3 border-l-4 border-blue-500 pl-4 bg-gradient-to-r from-blue-900/20 to-transparent py-1 rounded-r-lg">
              {cleanLine.replace(/^#+\s*/, '').replace(/\*\*/g, '')}
            </h3>
          );
        }
        if (cleanLine.includes('🛑') || cleanLine.includes('⚠️') || cleanLine.includes('✅')) {
           return (
             <div key={index} className={`p-4 rounded-xl border-l-4 my-5 shadow-lg flex items-start gap-4 ${cleanLine.includes('🛑') || cleanLine.includes('⚠️') ? 'bg-red-500/10 border-red-500 text-red-100' : 'bg-emerald-500/10 border-emerald-500 text-emerald-100'}`}>
                <div className="text-2xl mt-0.5">{cleanLine.substring(0, 2)}</div>
                <p className="font-bold text-lg leading-snug">{cleanLine.substring(2).replace(/\*\*/g, '').trim()}</p>
             </div>
           )
        }
        if (cleanLine.match(/^[-*]\s/)) {
          return (
            <div key={index} className="flex items-start gap-3 pl-4 mb-2 group">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0 group-hover:bg-blue-300 transition-colors shadow-sm shadow-blue-500/50" />
              <div className="text-sm leading-relaxed text-slate-200">
                {cleanLine.replace(/^[-*]\s/, '').replace(/\*\*/g, '')}
              </div>
            </div>
          );
        }
        return <p key={index} className="text-sm leading-relaxed text-slate-300 mb-2">{cleanLine.replace(/\*\*/g, '')}</p>;
      })}
    </div>
  );
};

// --- COMPOSANTS UI ---

const Badge = ({ level }) => {
  const styles = {
    'critique': 'bg-red-600 text-white animate-pulse',
    'majeur': 'bg-orange-500 text-white',
    'modere': 'bg-yellow-500 text-black',
    'vert': 'bg-emerald-500 text-white',
  };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${styles[level] || 'bg-gray-500'}`}>{level}</span>;
};

const IconCategory = ({ category }) => {
  if (category === 'route') return <Car className="w-5 h-5 text-indigo-400" />;
  if (category === 'air') return <Plane className="w-5 h-5 text-sky-400" />;
  if (category === 'transport') return <Train className="w-5 h-5 text-emerald-400" />;
  return <Info className="w-5 h-5 text-slate-400" />;
};

// --- CHATBOT ---
const CrisisChat = ({weatherContext, incidentsContext}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour. Je suis l\'assistant IA de crise. Je connais l\'état des routes et la météo en temps réel. Une question ?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    const context = `
      CONTEXTE CRISE HEXAGONE (5 Janvier 2026):
      - MÉTÉO: ${JSON.stringify(weatherContext)}
      - INCIDENTS: ${JSON.stringify(incidentsContext)}
      
      INSTRUCTION: Tu es un assistant de sécurité civile. Réponds de manière brève et utile. 
      Reste factuel.
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: context }] },
              ...messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
              { role: "user", parts: [{ text: userMsg }] }
            ]
          })
        }
      );
      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je ne peux pas répondre pour le moment.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Erreur de connexion." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Analytics />
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-4 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${isOpen ? 'bg-slate-700 text-slate-300' : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-110'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-40 right-4 z-50 w-80 md:w-96 h-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in">
          <div className="bg-slate-800 p-3 border-b border-slate-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-white text-sm">Assistant 24/7</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-300 rounded-bl-none border border-slate-700'
                }`}>
                  <CleanMarkdown content={msg.content} />
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-2 rounded-xl rounded-bl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Posez une question..." 
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <button type="submit" disabled={!input.trim() || isTyping} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

// --- MODAL DEPARTEMENTS ---
const DeptModal = ({ isOpen, onClose, departments }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-slate-900 border border-orange-500 w-full max-w-sm rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-orange-600 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Vigilance Orange</h3>
          <button onClick={onClose}><X className="w-5 h-5"/></button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <p className="text-xs text-orange-200 mb-3 uppercase font-bold">{departments.length} Départements concernés :</p>
          <ul className="space-y-2">
            {departments.map((dept, i) => (
              <li key={i} className="text-slate-200 text-sm flex items-center gap-2 border-b border-slate-800 pb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> {dept}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- MODAL INFO ---
const InfoModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-800 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${data.type === 'directive' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'}`}>
                {data.source}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {data.time}</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight">{data.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6 text-slate-300 text-sm leading-relaxed">{data.content}</div>
        <div className="p-4 border-t border-slate-800 bg-slate-850 rounded-b-2xl flex justify-end">
          <button className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">Lire la suite sur le site officiel <ExternalLink className="w-3 h-3"/></button>
        </div>
      </div>
    </div>
  );
};

// --- MODAL AIDE DÉCISION ---
const DecisionModal = ({ isOpen, onClose, weatherData, incidents }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState(null);

  useEffect(() => {
    if(isOpen) {
      setSelectedProfile(null);
      setAdvice(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const PROFILES = [
    { id: 'scolaire', label: 'Parents / Scolaire', Icon: Backpack, colorClass: 'text-pink-400', desc: 'Ramassage scolaire, ouverture écoles' },
    { id: 'etudiant', label: 'Étudiants', Icon: GraduationCap, colorClass: 'text-purple-400', desc: 'Accès campus, examens, transports' },
    { id: 'pro', label: 'Cadres / Salariés', Icon: Briefcase, colorClass: 'text-blue-400', desc: 'Télétravail vs Bureau, Temps de trajet' },
    { id: 'btp', label: 'Dirigeants BTP', Icon: HardHat, colorClass: 'text-yellow-400', desc: 'Conditions chantier, froid, sécurité' },
    { id: 'service', label: 'Services & Commerce', Icon: ShoppingBasket, colorClass: 'text-green-400', desc: 'Caissiers, Nettoyage, Aide à domicile' }
  ];

  const getProfileAdvice = async (profileId) => {
    setIsLoading(true);
    setAdvice(null);
    let contextPrompt = "";
    if (profileId === 'scolaire') contextPrompt = "Concentre-toi sur les bus scolaires, la sécurité des enfants et les arrêtés préfectoraux.";
    if (profileId === 'etudiant') contextPrompt = "Concentre-toi sur les transports en commun (RER, Train), l'accès aux universités et les risques de blocage.";
    if (profileId === 'pro') contextPrompt = "Concentre-toi sur l'état des routes principales (N118, A13), le temps de trajet et la recommandation de Télétravail.";
    if (profileId === 'btp') contextPrompt = "Concentre-toi sur les conditions de travail en extérieur (Température ressentie, Neige), la sécurité des chantiers et la réglementation 'Intempéries'.";
    if (profileId === 'service') contextPrompt = "Concentre-toi sur les trajets tôt le matin ou tard le soir, l'accessibilité des zones commerciales et la sécurité des travailleurs isolés.";

    const prompt = `
      Agis comme un assistant de PRÉCONISATION en temps de crise.
      CONTEXTE: ${JSON.stringify(weatherData['Ile-de-France'])}
      PROFIL: ${profileId.toUpperCase()}
      OBJECTIF: ${contextPrompt}
      RÉPONSE: 1. PRÉCONISATION CLAIRE EN TITRE. 2. Analyse 3 points. 3. Conclusion.
      Format Markdown simple. Pas de tableaux.
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
      );
      const data = await response.json();
      setAdvice(data.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error) {
      console.error(error);
      setAdvice("Erreur de connexion. Référez-vous aux consignes officielles.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[85vh]">
        <div className="md:w-1/3 bg-slate-850 border-r border-slate-800 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-blue-500" /> Mon Profil</h2>
          <p className="text-xs text-slate-400 mb-6">Sélectionnez votre situation.</p>
          <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
            {PROFILES.map((profile) => (
              <button key={profile.id} onClick={() => { setSelectedProfile(profile); getProfileAdvice(profile.id); }} className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden ${selectedProfile?.id === profile.id ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'}`}>
                <div className="flex items-center gap-3 relative z-10">
                  <div className={`p-2 rounded-lg ${selectedProfile?.id === profile.id ? 'bg-blue-500 text-white' : 'bg-slate-900 text-slate-400'}`}>
                    <profile.Icon className={`w-6 h-6 ${selectedProfile?.id === profile.id ? 'text-white' : profile.colorClass}`} />
                  </div>
                  <div><div className="font-bold text-sm">{profile.label}</div><div className="text-[10px] opacity-70 leading-tight">{profile.desc}</div></div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="md:w-2/3 bg-slate-900 p-6 flex flex-col relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
          {!selectedProfile ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 p-10"><Sparkles className="w-16 h-16 mb-4 text-slate-600" /><h3 className="text-xl font-bold text-slate-300">Aide à la Décision</h3></div>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="mb-4 border-b border-slate-800 pb-4"><div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Préconisation pour :</div><h2 className="text-2xl font-bold text-white flex items-center gap-2">{selectedProfile.label}{isLoading && <Loader2 className="w-5 h-5 animate-spin text-blue-500 ml-2" />}</h2></div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">{isLoading ? <div className="space-y-4 animate-pulse"><div className="h-4 bg-slate-800 rounded w-3/4"></div><div className="h-4 bg-slate-800 rounded w-1/2"></div></div> : advice ? <CleanMarkdown content={advice} /> : <p className="text-red-400">Erreur.</p>}</div>
              {!isLoading && <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-500"><div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 mb-2"><p className="font-bold text-slate-400 flex items-center gap-2 mb-1"><AlertTriangle className="w-4 h-4 text-yellow-500" /> AVIS DE NON-RESPONSABILITÉ</p><p className="opacity-80 leading-relaxed">Préconisations informatives générées par IA.</p></div></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT LEAFLET MAP ---
const LeafletMap = ({ onSelect, selected, weather, showTraffic, trafficLines }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const trafficLayerRef = useRef(null);

  useEffect(() => {
    if (document.getElementById('leaflet-css')) { setIsMapReady(true); return; }
    const link = document.createElement('link'); link.id = 'leaflet-css'; link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
    const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.async = true; script.onload = () => setIsMapReady(true); document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isMapReady || !mapContainerRef.current) return;
    const L = window.L;
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([46.603354, 1.888334], 6);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(mapRef.current);
      trafficLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }
  }, [isMapReady]);

  useEffect(() => {
    if (!mapRef.current) return;
    const L = window.L;
    const map = mapRef.current;
    
    map.eachLayer((layer) => { if (layer instanceof L.CircleMarker) map.removeLayer(layer); });
    trafficLayerRef.current.clearLayers();
    
    if (showTraffic && trafficLines) {
      trafficLines.forEach(road => {
        let color = '#3b82f6'; if (road.status === 'slow') color = '#f97316'; if (road.status === 'critical') color = '#dc2626'; if (road.status === 'closed') color = '#555';
        if (road.path && road.path.length > 0) {
           const polyline = L.polyline(road.path, { color: color, weight: 4, opacity: 0.8 }).addTo(trafficLayerRef.current);
           if (road.status === 'closed') { L.polyline(road.path, { color: '#ef4444', weight: 2, dashArray: '4, 8' }).addTo(trafficLayerRef.current); }
           polyline.bindTooltip(`<b>${road.name}</b><br/>Status: ${road.status.toUpperCase()}`, { sticky: true });
        }
      });
    }
    
    Object.entries(REGION_COORDS).forEach(([regionName, coords]) => {
      const status = (weather && weather[regionName]?.status) || 'vert'; 
      const isSelected = selected === regionName;
      let color = '#10b981'; if (status === 'jaune') color = '#eab308'; if (status === 'orange') color = '#f97316'; if (status === 'rouge') color = '#dc2626';
      
      if (Array.isArray(coords) && coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        const circle = L.circleMarker(coords, { radius: isSelected ? 18 : 10, fillColor: color, color: '#fff', weight: isSelected ? 3 : 1, opacity: 1, fillOpacity: 0.8 }).addTo(map);
        circle.bindTooltip(`<b>${regionName}</b><br/>${status.toUpperCase()}`, { direction: 'top', offset: [0, -10] });
        circle.on('click', () => { 
          onSelect(regionName); 
          map.flyTo(coords, 8, { duration: 1.0 });
        });
      }
    });
    
    if (selected === 'all') {
       map.flyTo([46.603354, 1.888334], 5.5, { duration: 1.0 });
    }
  }, [isMapReady, selected, weather, showTraffic, trafficLines]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      {!isMapReady && <div className="absolute inset-0 bg-slate-800 flex items-center justify-center z-10"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute bottom-1 right-1 bg-slate-900/80 px-2 py-1 text-[9px] text-slate-500 z-[400] rounded">Cartographie OpenStreetMap</div>
    </div>
  );
};

// --- TIMELINE WIDGET COMPONENT ---
const TimelineWidget = ({ data }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-xl h-full flex flex-col justify-center">
      <h3 className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-4 flex items-center gap-2">
        <Clock className="w-3 h-3" /> Projection des températures au niveau national
      </h3>
      <div className="relative flex justify-between items-start">
        {/* Ligne connectrice */}
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-slate-700 -z-0"></div>
        
        {data.map((slot, index) => (
          <div key={index} className="flex flex-col items-center relative z-10 group cursor-pointer">
            <div className={`w-2 h-2 rounded-full mb-1 ${slot.time === 'Soir' ? 'bg-orange-500 ring-4 ring-orange-500/20' : 'bg-slate-500'}`}></div>
            <div className="text-[10px] text-slate-400 font-mono mb-1">{slot.hour}</div>
            
            <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-2 flex flex-col items-center min-w-[60px] transition-all group-hover:border-slate-500 group-hover:-translate-y-1 relative">
              
              {/* PIC FROID BADGE */}
              {slot.isPeak && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-lg border border-slate-900 animate-pulse">
                  PIC
                </span>
              )}

              <div className="text-xs font-bold text-white mb-1">{slot.temp}</div>
              <div className={`text-[8px] font-bold px-1.5 py-0.5 rounded mb-1 ${
                slot.road === 'Critique' ? 'bg-red-500/20 text-red-400' :
                slot.road === 'Neige' ? 'bg-white/10 text-white' :
                slot.road === 'Verglas' ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {slot.road}
              </div>
              <div className="flex items-center gap-1" title="Tension Réseau Électrique (EcoWatt)">
                <Zap className={`w-3 h-3 ${
                  slot.ecowatt === 'rouge' ? 'text-red-500 animate-pulse' :
                  slot.ecowatt === 'orange' ? 'text-orange-500' : 'text-emerald-500'
                }`} />
              </div>
            </div>
            <div className="text-[9px] text-slate-500 mt-1 font-bold">{slot.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- WIDGET METEO ACTUELLE ---
const CurrentWeatherWidget = ({ weather }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between shadow-lg h-full">
      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
        <span className="text-xs text-slate-400 uppercase font-bold flex items-center gap-2">
            <ThermometerSnowflake className="w-4 h-4 text-blue-400" /> Météo Actuelle
        </span>
        <span className="text-xs text-slate-500">Live</span>
      </div>
      <div className="flex justify-between items-center mt-2">
          <div>
            <div className="text-4xl font-bold text-white">{weather.temp || '--'}</div>
            <div className="text-xs text-slate-400 mt-1">Ressenti -5°C</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-200 text-sm">{weather.phenomenon || 'N/A'}</div>
            <div className="text-xs text-slate-500 mb-1">Vent N/E 20km/h</div>
            <div className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-500/30">
              <ArrowDown className="w-3 h-3" /> Min -20°C
            </div>
          </div>
      </div>
      <div className="bg-slate-900/50 p-2 mt-3 rounded text-[10px] text-slate-300 italic border-l-2 border-orange-500">
        {weather.description || 'Chargement des données...'}
      </div>
    </div>
  );
}

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [activeRightTab, setActiveRightTab] = useState('meteo'); // Default to Meteo
  const [showTraffic, setShowTraffic] = useState(true);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null); 
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false); 
  
  // -- ETATS DYNAMIQUES --
  const [weatherData, setWeatherData] = useState({});
  const [incidentsData, setIncidentsData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [departmentsOrange, setDepartmentsOrange] = useState([]);
  const [trafficLines, setTrafficLines] = useState([]);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  // -- CHARGEMENT SIMULÉ DES DONNÉES --
  useEffect(() => {
    const fetchData = async () => {
      setIsGlobalLoading(true);
      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Dans une vraie app, remplacez ceci par des fetch() vers vos API
      // Ex: const res = await fetch('/api/weather'); const data = await res.json();
      
      setWeatherData(MOCK_WEATHER_DATA);
      setIncidentsData(MOCK_INCIDENTS_DATA);
      setNewsData(MOCK_NEWS_DATA);
      setTimelineData(MOCK_TIMELINE_DATA);
      setDepartmentsOrange(MOCK_DEPARTMENTS_ORANGE);
      setTrafficLines(MOCK_TRAFFIC_LINES);
      
      setIsGlobalLoading(false);
    };
    
    fetchData();
  }, []);

  // -- FILTRAGE --
  const filteredIncidents = useMemo(() => {
    return incidentsData.filter(inc => {
      const regionMatch = selectedRegion === 'all' || inc.region === selectedRegion;
      return regionMatch;
    });
  }, [incidentsData, selectedRegion]);

  const currentWeather = useMemo(() => {
    return selectedRegion === 'all' 
      ? { status: 'orange', temp: '-1°C (Moy)', phenomenon: 'Vigilance Nationale', description: 'Épisode hivernal majeur sur le Nord-Ouest.' }
      : (weatherData[selectedRegion] || weatherData['Ile-de-France'] || {});
  }, [weatherData, selectedRegion]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      
      <DecisionModal isOpen={isDecisionModalOpen} onClose={() => setIsDecisionModalOpen(false)} weatherData={weatherData} incidents={incidentsData} />
      <InfoModal isOpen={!!selectedNews} onClose={() => setSelectedNews(null)} data={selectedNews} />
      <DeptModal isOpen={isDeptModalOpen} onClose={() => setIsDeptModalOpen(false)} departments={departmentsOrange} />
      
      {/* NOUVEAU : Chatbot Assistant */}
      <CrisisChat weatherContext={weatherData} incidentsContext={incidentsData} />

      {/* --- HEADER --- */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shrink-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/50">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-blue-100">HEXAGON COLD ALERT 2026</h1>
              <p className="text-xs text-blue-300">Plan d'Urgence Hivernal • Activé</p>
              <div className="text-xs text-blue-200 font-mono mt-1">Mardi 6 Janvier 2026 • 20:42</div>
            </div>
          </div>

          <div className="hidden md:flex items-center bg-blue-900/30 border border-blue-500/30 px-4 py-2 rounded-full animate-pulse-slow">
            <CalendarDays className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-sm font-bold text-blue-200">
               Prévision : Encore 4 jours de froid intense
            </span>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={() => {
                   setIsGlobalLoading(true);
                   setTimeout(() => setIsGlobalLoading(false), 800); // Simulate refresh
                }}
                className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                title="Actualiser les données"
             >
               <RefreshCw className={`w-4 h-4 ${isGlobalLoading ? 'animate-spin' : ''}`} />
             </button>

             <button 
                onClick={() => setIsDecisionModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-emerald-500/25 border border-white/10 animate-pulse-slow"
             >
               <Layers className="w-4 h-4 text-white" />
               <span className="hidden md:inline">Aide Décision</span>
             </button>
             <div className="hidden xl:flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700">
               <Clock className="w-4 h-4 text-slate-400" />
               <span className="font-mono text-sm">14:45 LIVE</span>
             </div>
          </div>
        </div>
      </header>

      {/* --- BANDEAU ALERTE (CLIQUABLE) --- */}
      {!isGlobalLoading && currentWeather.status !== 'vert' && (
        <div 
          onClick={() => selectedRegion === 'all' && setIsDeptModalOpen(true)}
          className={`shrink-0 w-full px-4 py-2 flex justify-center items-center gap-2 text-sm font-bold shadow-lg transition-colors ${
          currentWeather.status === 'orange' ? 'bg-orange-600 text-white cursor-pointer hover:bg-orange-500' : 'bg-yellow-500 text-black'
        }`}>
          <AlertTriangle className="w-5 h-5" />
          {selectedRegion === 'all' 
            ? `ALERTE NEIGE-VERGLAS : ${departmentsOrange.length} Départements en Orange (Voir liste)` 
            : `VIGILANCE ${currentWeather.status.toUpperCase()} : ${currentWeather.phenomenon}`
          }
        </div>
      )}

      {/* --- MAIN CONTENT (SCROLLABLE) --- */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        
        {/* ROW 1: WIDGETS (Grid 50/50) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[200px]">
           <CurrentWeatherWidget weather={currentWeather} />
           <TimelineWidget data={timelineData} />
        </div>

        {/* ROW 2: INFO & MAP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* GAUCHE : INFO PANELS (5/12) */}
            <div className="lg:col-span-5 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col h-[600px] shadow-2xl overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-700 shrink-0">
                  <button 
                    onClick={() => setActiveRightTab('meteo')}
                    className={`flex-1 py-3 text-[10px] lg:text-xs font-bold uppercase tracking-wider flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-2 transition-colors ${activeRightTab === 'meteo' ? 'bg-slate-700 text-white border-b-2 border-blue-400' : 'text-slate-400 hover:bg-slate-750'}`}
                  >
                    <CloudSnow className="w-4 h-4" /> Météo & Infos
                  </button>
                  <button 
                    onClick={() => setActiveRightTab('transports')}
                    className={`flex-1 py-3 text-[10px] lg:text-xs font-bold uppercase tracking-wider flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-2 transition-colors ${activeRightTab === 'transports' ? 'bg-slate-700 text-white border-b-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-750'}`}
                  >
                    <Train className="w-4 h-4" /> Transports
                  </button>
                  <button 
                    onClick={() => setActiveRightTab('conseils')}
                    className={`flex-1 py-3 text-[10px] lg:text-xs font-bold uppercase tracking-wider flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-2 transition-colors ${activeRightTab === 'conseils' ? 'bg-slate-700 text-white border-b-2 border-pink-500' : 'text-slate-400 hover:bg-slate-750'}`}
                  >
                    <Heart className="w-4 h-4" /> Conseils
                  </button>
                </div>

                {/* Content List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
                  {isGlobalLoading && (
                     <div className="absolute inset-0 bg-slate-800/80 z-20 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                     </div>
                  )}
                  
                  {/* TAB 1: METEO DETAILED */}
                  {activeRightTab === 'meteo' && (
                    <div className="space-y-3">
                      <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg text-xs text-blue-200 mb-2 flex gap-2">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>Consultez ici les bulletins de vigilance officiels et les analyses détaillées.</p>
                      </div>
                      {newsData.filter(n => n.category === 'meteo' || !n.category).map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => setSelectedNews(item)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all hover:translate-x-1 ${
                            item.type === 'directive' 
                              ? 'bg-orange-950/20 border-orange-500/30 hover:border-orange-500' 
                              : 'bg-slate-750 border-slate-700 hover:border-blue-500 hover:bg-slate-700'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              item.source === 'Météo France' ? 'bg-orange-600 text-white' : 'bg-blue-900 text-blue-200'
                            }`}>
                              {item.source}
                            </span>
                            <span className="text-[10px] text-slate-500">{item.time}</span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-200 leading-snug mb-1">{item.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 2: TRANSPORTS */}
                  {activeRightTab === 'transports' && (
                    <div className="space-y-4">
                      {/* Section Flash Info Transports */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1 flex items-center gap-1"><Radio className="w-3 h-3"/> Flash Info Trafic</h4>
                        <div className="space-y-2">
                          {newsData.filter(n => n.category === 'transport').map((item) => (
                            <div 
                              key={item.id} 
                              onClick={() => setSelectedNews(item)}
                              className="p-3 rounded-xl border cursor-pointer transition-all hover:translate-x-1 bg-slate-750 border-slate-700 hover:border-emerald-500 hover:bg-slate-700"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-900 text-blue-200">
                                  {item.source}
                                </span>
                                <span className="text-[10px] text-slate-500">{item.time}</span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-200 leading-snug mb-1">{item.title}</h4>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section Incidents Terrain */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1 mt-4 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Incidents Signalés</h4>
                        <div className="space-y-2">
                          {filteredIncidents.map((incident) => (
                            <div key={incident.id} className="bg-slate-900 border border-slate-700 rounded-xl p-3 hover:border-slate-500 transition-colors group">
                              <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                  <div className="bg-slate-800 p-1.5 rounded-lg text-slate-400"><IconCategory category={incident.category} /></div>
                                  <span className="font-bold text-xs text-slate-200">{incident.title}</span>
                                </div>
                                <Badge level={incident.level} />
                              </div>
                              <p className="text-xs text-slate-400 pl-8 mb-2 border-l-2 border-slate-700 pl-2">{incident.detail}</p>
                              <div className="flex justify-between items-center pl-8 text-[10px] text-slate-500 font-mono">
                                <span>{incident.region}</span>
                                <span>{incident.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CONSEILS */}
                  {activeRightTab === 'conseils' && (
                    <div className="space-y-3">
                      {CONSEILS_DATA.map((item) => (
                        <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-sm hover:border-slate-500 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">
                              <item.Icon className={`w-5 h-5 ${item.colorClass}`} />
                            </div>
                            <h4 className="font-bold text-sm text-white">{item.title}</h4>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed pl-11">
                            {item.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
            </div>

            {/* DROITE : MAP (7/12) */}
            <div className="lg:col-span-7 bg-slate-800 rounded-2xl border border-slate-700 p-1 relative overflow-hidden shadow-2xl h-[600px] flex flex-col">
                 <div className="absolute top-4 left-14 z-[400] flex gap-3 pointer-events-auto">
                    <div className="bg-slate-900/80 px-2 py-1 rounded text-slate-300 text-xs font-bold uppercase tracking-wider backdrop-blur border border-slate-700 shadow-md">Carte Temps Réel</div>
                    <button onClick={() => setShowTraffic(!showTraffic)} className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider backdrop-blur border shadow-md transition-all ${showTraffic ? 'bg-blue-600/90 text-white border-blue-500' : 'bg-slate-900/80 text-slate-400 border-slate-700'}`}><Layers className="w-3 h-3" /> Trafic {showTraffic ? 'ON' : 'OFF'}</button>
                 </div>
                 <div className="flex-grow relative z-0 rounded-xl overflow-hidden">
                    <LeafletMap onSelect={setSelectedRegion} selected={selectedRegion} weather={weatherData} showTraffic={showTraffic} trafficLines={trafficLines} />
                 </div>
                 <div className="flex flex-wrap justify-center gap-3 text-[10px] text-slate-400 py-1 border-t border-slate-700 bg-slate-850 shrink-0">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Alerte</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-600"></div> Critique</div>
                    <span className="text-slate-600">|</span>
                    <div className="flex items-center gap-1"><div className="w-3 h-1 bg-zinc-600 border border-white border-dashed"></div> Fermé</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-1 bg-red-600"></div> Saturé</div>
                 </div>
            </div>

        </div>

      </main>

      {/* --- FOOTER CRÉDITS --- */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-900 py-6 text-center shrink-0">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-3">
            
            {/* Developer Credit */}
            <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-pink-500 animate-pulse" />
                <p className="text-xs text-slate-400">
                Développé avec fraternité et résilience par <strong>Warda Bailiche Berrached</strong>, le 5 janvier 2026.
                </p>
            </div>

            {/* Purpose & Contribution */}
            <p className="text-[10px] text-slate-500 max-w-lg mx-auto leading-relaxed">
              Pour toute fin utile à ceux impactés par cette vague de froid sur l'Hexagone. <br/>
              Pour ceux qui souhaitent contribuer à l'amélioration de cette app, vous êtes les bienvenus.
            </p>

            {/* Contact */}
            <a 
              href="https://wa.me/33619641396" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border border-emerald-500/20"
            >
              <MessageCircle className="w-3 h-3" />
              Me contacter sur WhatsApp : +33 6 19 64 13 96
            </a>

        </div>
      </footer>

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }`}</style>
    </div>
  );
}
