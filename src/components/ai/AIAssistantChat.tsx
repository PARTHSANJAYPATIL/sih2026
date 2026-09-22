import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  TrendingUp, 
  Truck, 
  HelpCircle, 
  DollarSign, 
  AlertCircle 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  badge?: string;
}

export const AIAssistantChat: React.FC = () => {
  const { currentUser, orders, produceListings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Namaste ${currentUser.name}! I am your Farm2Market AI Assistant. How can I help you coordinate supply, track orders, or evaluate market pricing today?`,
      timestamp: 'Just now'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickQuestions = [
    { label: 'Tomato demand next week?', q: 'How much tomato demand is expected next week?' },
    { label: 'Why was price range recommended?', q: 'Why was this price range recommended?' },
    { label: 'Where is my order?', q: 'Where is my order?' },
    { label: 'When is my next pickup?', q: 'When is my next pickup?' },
    { label: 'Which products have high demand?', q: 'Which products have high demand?' }
  ];

  const handleSend = (questionText?: string) => {
    const query = (questionText || inputMessage).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInputMessage('');
    setIsTyping(true);

    // AI answer generator grounded in platform state
    setTimeout(() => {
      let reply = '';
      const qLower = query.toLowerCase();

      if (qLower.includes('tomato demand') || (qLower.includes('tomato') && qLower.includes('next week'))) {
        reply = `🍅 **Tomato Demand Forecast:**\nFor the upcoming 7-day window, projected tomato demand across Pune and Kolhapur hubs is **12,500 kg**, against an estimated local supply of **10,000 kg**.\n\n⚠️ *Deficit Signal:* Expect a **~2,500 kg supply deficit** due to festival purchases and bulk hotel demand. Price trend is rising slightly from ₹23/kg toward ₹26/kg.`;
      } else if (qLower.includes('price range') || qLower.includes('why was') || qLower.includes('recommended')) {
        reply = `💡 **Price Recommendation Engine Rationale:**\nOur recommendation (e.g. ₹22 – ₹26/kg for Tomato) is dynamically calibrated using:\n1. **APMC Benchmark:** Mandi modal rate at ₹23/kg\n2. **Supply-Demand Ratio:** High buyer inquiry vs moderate harvest influx (+₹1.50/kg pressure)\n3. **Quality Premium:** Grade A produce with verified firmness\n4. **Logistics Deduction:** ₹3/kg for scheduled farm-gate collection.\n\n*Note: AI provides a reference suggestion; farmers always set their final selling price.*`;
      } else if (qLower.includes('where is my order') || qLower.includes('track') || qLower.includes('order status')) {
        const userOrders = orders.filter(o => o.buyerId === currentUser.id || o.buyerName.includes(currentUser.name));
        const activeOrder = userOrders[0] || orders[0];
        if (activeOrder) {
          reply = `📦 **Order Status for #${activeOrder.id}:**\nCurrent Status: **${activeOrder.status}**\nDriver: ${activeOrder.assignedDriverId ? 'Rahul Patil (MH-10-AB-1234)' : 'Scheduled'}\nItems: ${activeOrder.items.map(i => `${i.cropName} (${i.quantity} kg)`).join(', ')}\nDelivery Slot: ${activeOrder.deliverySlot}. Produce has cleared collection center grading and is on the delivery route.`;
        } else {
          reply = `You have no active orders in transit right now. Visit the Marketplace to explore freshly harvested produce!`;
        }
      } else if (qLower.includes('next pickup') || qLower.includes('pickup')) {
        reply = `🚛 **Farm-Gate Pickup Schedule:**\nDriver Rahul Patil (Vehicle: **MH-10-AB-1234**) is assigned to Route Corridor #3.\n• Expected Arrival: Tomorrow **8:30 AM – 9:00 AM**\n• Produce: 300 kg Tomato (Shivam Hybrid)\n• Collection Hub: Sangli Central Agro Hub.\nPlease ensure produce crates are weighed and QR tags are affixed.`;
      } else if (qLower.includes('high demand') || qLower.includes('which products')) {
        reply = `📈 **High Demand Commodities (Western Maharashtra):**\n1. **Tomato:** High demand (+25% weekly spike) - ₹24–₹26/kg\n2. **Onion (Nashik Red):** Moderate-High demand - ₹18–₹21/kg\n3. **Indrayani Rice:** Consistent premium bulk hotel orders - ₹50–₹54/kg\n4. **Tas-A-Ganesh Grapes:** Export & retail surge - ₹65–₹72/kg.`;
      } else {
        reply = `I have analyzed your query regarding "${query}". Based on platform data, our logistics and matching algorithms are coordinating harvest schedules with buyer demand. If you have questions about specific crops (${produceListings.slice(0, 3).map(p => p.cropName).join(', ')}), pricing insights, or logistics tracking, feel free to ask!`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-5 right-5 z-40 p-3.5 bg-gradient-to-r from-emerald-600 to-forest hover:from-emerald-700 hover:to-forest-dark text-white rounded-full shadow-elevated transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
          isOpen ? 'hidden' : 'flex'
        }`}
        title="Open AI Agri-Assistant"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
        </div>
        <span className="text-xs font-bold pr-1 hidden sm:inline">AI Assistant</span>
      </button>

      {/* Slide-out / Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-2xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-forest to-forest-dark p-4 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-700/60 rounded-lg border border-emerald-500/30">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  Farm2Market AI
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded font-normal border border-emerald-400/20">
                    Copilot
                  </span>
                </h4>
                <p className="text-[11px] text-emerald-200">Agri Supply & Intelligence Engine</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages scroll area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  <div className={`text-[9px] mt-1.5 text-right ${m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-500 text-xs pl-2">
                <Bot className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span className="italic">Analyzing supply models & market signals...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2 bg-white border-t border-slate-100 shrink-0">
            <div className="text-[10px] text-slate-400 font-medium mb-1.5 px-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-amber-500" />
              Suggested Inquiries:
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q.q)}
                  className="whitespace-nowrap text-[11px] px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium rounded-full border border-emerald-200 transition-colors shrink-0"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input field */}
          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about crops, demand, or orders..."
              className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputMessage.trim()}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Requirement 33 Disclaimer */}
          <div className="bg-slate-100 px-3 py-1 text-[9px] text-slate-500 text-center border-t border-slate-200">
            AI recommendations are based on simulated models and may differ from volatile spot market conditions.
          </div>
        </div>
      )}
    </>
  );
};
