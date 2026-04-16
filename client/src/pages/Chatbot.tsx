import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/api';

// ─── Farming Knowledge Base ───────────────────────────────────────────────────
const AGRI_RESPONSES: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ['paddy', 'rice', 'धान'],
    response: '🌾 **Paddy (Rice):** The crop duration is 120–150 days. Key tips:\n- Maintain 2–5 cm standing water during tillering\n- Apply Urea (top-dress) in 3 split doses\n- Watch for Stem Borer — spray Chlorpyrifos if infestation seen\n- MSP for 2025: ₹2,183/quintal (Common), ₹2,203/quintal (Grade A)'
  },
  {
    keywords: ['cotton', 'kapas', 'कपास'],
    response: '🧶 **Cotton:** Crop duration is 150–180 days.\n- Requires well-drained black soil\n- Irrigate every 10 days — avoid waterlogging\n- Apply DAP at sowing + Foliar boron + potassium at boll stage\n- Watch for Bollworm and Whitefly — use Yellow Sticky Traps as monitor\n- MSP 2025: ₹7,121/quintal (Long Staple)'
  },
  {
    keywords: ['chilli', 'mirchi', 'मिर्च'],
    response: '🌶️ **Chilli:** 150-day crop. Key guidance:\n- Transplant 30-day-old seedlings\n- Irrigate weekly — avoid wet leaves (reduces fungal risk)\n- Apply NPK 19:19:19 fortnightly\n- Spray neem oil every 14 days against Thrips\n- Latest market price: ₹12,800/quintal (Guntur mandi)'
  },
  {
    keywords: ['turmeric', 'haldi', 'हल्दी'],
    response: '🟡 **Turmeric:** Long-duration crop (270 days/9 months).\n- Irrigate every 10 days (dry season: every 7 days)\n- Apply farmyard manure at planting; top-dress Urea+Potash at 45 & 90 days\n- Watch for Leaf Blotch and Rhizome Rot — spray Mancozeb+Copper every 21 days\n- Current Nizamabad market price: ₹14,500/quintal 📈'
  },
  {
    keywords: ['maize', 'corn', 'makka', 'मक्का'],
    response: '🌽 **Maize:** Crop duration 100–120 days.\n- Critical irrigation at tasseling and grain fill stages\n- Top-dress Urea at knee-high (V6) stage\n- Apply Zinc sulphate if yellowing visible\n- Monitor for Fall Armyworm in the whorl — use Emamectin Benzoate\n- MSP 2025: ₹2,090/quintal'
  },
  {
    keywords: ['fertilizer', 'khad', 'urea', 'dap', 'npk', 'खाद'],
    response: '🧪 **Fertilizer Guide:**\n- **Urea (46% N):** Best for vegetative growth, split doses recommended\n- **DAP (18-46-0):** Use at sowing for root development\n- **NPK 19:19:19:** Balanced for flowering & fruiting stage\n- **Potash (MOP):** Improves fruit quality and size\n- Always do soil test before applying — check with KVK for free testing'
  },
  {
    keywords: ['irrigation', 'water', 'paani', 'drip', 'पानी', 'सिंचाई'],
    response: '💧 **Irrigation Tips:**\n- Use **Drip irrigation** to save 40–50% water vs flood irrigation\n- Best time to irrigate: **early morning** (5–8 AM)\n- Check soil moisture: insert finger 2 inches — if dry, irrigate\n- Avoid evening irrigation (promotes fungal diseases)\n- PM Krishi Sinchai Yojana provides 90% subsidy on drip systems'
  },
  {
    keywords: ['disease', 'blight', 'rust', 'fungus', 'rot', 'रोग'],
    response: '🌿 **Common Crop Diseases:**\n- **Early Blight:** Brown spots with concentric rings — spray Mancozeb\n- **Powdery Mildew:** White powder on leaves — spray Sulfur or Carbendazim\n- **Root Rot:** Yellowing from base — improve drainage, apply Trichoderma\n- **Leaf Curl (Virus):** Spray Imidacloprid to control vector (whitefly)\n- Use **Kisan Sahayak Diseases module** for crop-specific treatments!'
  },
  {
    keywords: ['scheme', 'subsidy', 'government', 'yojana', 'सरकार', 'योजना'],
    response: '🏛️ **Key Govt Schemes for Farmers:**\n- **PM-KISAN:** ₹6,000/year direct transfer (3 installments)\n- **PM Fasal Bima Yojana:** Crop insurance at 1.5–5% premium\n- **PM Krishi Sinchai Yojana:** 90% subsidy on drip/sprinkler\n- **eNAM:** Sell crops at best national mandi price online\n- **KCC (Kisan Credit Card):** Crop loans at 7% interest\n- Check Schemes module in this app for details!'
  },
  {
    keywords: ['market', 'price', 'mandi', 'मंडी', 'भाव'],
    response: '📊 **Current Market Prices (Telangana/AP):**\n- Paddy: ₹2,183/quintal (Warangal)\n- Cotton LS: ₹7,121/quintal (Adilabad) 📉\n- Maize: ₹2,090/quintal (Karimnagar) 📈\n- Turmeric: ₹14,500/quintal (Nizamabad) 📈\n- Chilli: ₹12,800/quintal (Guntur) 📈\n\nCheck the Market Prices module for all 20 crops!'
  },
  {
    keywords: ['weather', 'rain', 'mausam', 'baarish', 'मौसम'],
    response: '🌤️ **Weather & Farming:**\n- Check **Weather module** for real-time IMD forecast for your location\n- Avoid spraying pesticides/fungicides before expected rain (washing off wastes money)\n- Sowing recommendation: Kharif sowing begins with Monsoon onset (June 10–15 for Telangana)\n- For accurate mandi date, enable GPS access in the Weather section'
  },
];

const DEFAULT_RESPONSE = `🤖 I'm Kisan Sahayak's AI farming assistant! I can help with:

🌾 Crop advice (Paddy, Cotton, Maize, Chilli, Turmeric...)
🧪 Fertilizer & irrigation guidance
🌿 Disease identification & treatment
🏛️ Government schemes & subsidies
📊 Market prices & MSP info
🌤️ Weather farming advice

Try asking: *"How to grow paddy?"* or *"What fertilizer for cotton?"*`;

// ─── Quick Questions ──────────────────────────────────────────────────────────
const QUICK_QUESTIONS = [
  'How to grow paddy?',
  'Cotton disease treatment',
  'Current market prices',
  'Government schemes for farmers',
  'Irrigation tips',
];

// ─── Component ────────────────────────────────────────────────────────────────
const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "🙏 Namaste! I'm Kisan Sahayak AI — your smart farming assistant.\n\nI can advise on crops, diseases, irrigation, market prices, and government schemes. What would you like to know today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getBotResponse = (question: string): string => {
    const q = question.toLowerCase();
    const match = AGRI_RESPONSES.find(r => r.keywords.some(k => q.includes(k)));
    return match ? match.response : DEFAULT_RESPONSE;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await apiService.bot.chat(text);
      const botMsg = { id: Date.now() + 1, text: res.data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      // Fallback to local logic if server fails
      const botMsg = { id: Date.now() + 1, text: getBotResponse(text), sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen flex flex-col pb-24 md:pb-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-3xl p-6 mb-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl shadow-inner">🤖</div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Kisan Sahayak AI</h1>
            <p className="text-green-100 text-sm font-bold flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
              Agricultural Knowledge Assistant
            </p>
          </div>
          <div className="ml-auto bg-amber-400 text-amber-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
            Beta
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden" style={{ minHeight: '60vh' }}>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-base mr-2 mt-1 flex-shrink-0">🤖</div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-green-600 text-white font-semibold rounded-br-none'
                    : 'bg-gray-50 border border-gray-100 text-gray-800 font-medium rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center text-base ml-2 mt-1 flex-shrink-0 text-white font-black text-xs">You</div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-base mr-2 flex-shrink-0">🤖</div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="px-4 py-3 border-t border-gray-50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Quick Questions</p>
          <div className="flex gap-2 flex-wrap">
            {QUICK_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crops, diseases, schemes..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-2xl flex items-center justify-center transition disabled:bg-gray-300 shadow-md shadow-green-200"
            >
              📤
            </button>
          </form>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
        <p className="text-xs font-bold text-amber-700">
          ⚠️ AI responses are knowledge-based guidance. Always verify with local KVK (Krishi Vigyan Kendra) for field-specific advice.
        </p>
      </div>
    </div>
  );
};

export default Chatbot;