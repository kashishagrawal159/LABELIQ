import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  Bot, 
  User, 
  HelpCircle, 
  Scale,
  Calendar,
  AlertOctagon
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export default function Chatbot() {
  const { t, language } = useTranslation();
  const { currentProduct } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Session-based message history
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste! I am your Legal Metrology AI Assistant. How can I help you with package compliance, manufacturing/expiry date verification, or platform navigation today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Contextual knowledge base + active product twin query
  const generateBotReply = (query) => {
    const q = query.toLowerCase().trim();
    const p = currentProduct;

    // Check queries about active scanned product
    if (p && (q.includes('this product') || q.includes('current product') || q.includes('scanned') || q.includes('is it expired') || q.includes('who made this'))) {
      if (q.includes('expired') || q.includes('expiry') || q.includes('best before')) {
        const isExp = p.date_validation?.isExpired;
        return `For the current scanned product "${p.product || p.name}": The declared expiry date is ${p.expiry_date}. ${isExp ? '⚠️ WARNING: This product has passed its statutory expiry date and is EXPIRED!' : `✓ It is within its valid shelf life (${p.date_validation?.daysRemaining || 'valid'} days remaining).`}`;
      }
      if (q.includes('mfg') || q.includes('manufactur') || q.includes('made')) {
        return `Product "${p.product || p.name}" was manufactured on ${p.manufacturing_date} by ${p.manufacturer || p.brand}. Country of Origin: ${p.country_of_origin}.`;
      }
      if (q.includes('price') || q.includes('mrp') || q.includes('cost')) {
        return `Product "${p.product || p.name}" has a stamped MRP of ${p.mrp} (inclusive of all taxes) for a net quantity of ${p.net_quantity}.`;
      }
    }

    if (q.includes('net quantity') || q.includes('quantity') || q.includes('volume')) {
      return "Net Quantity is the weight, measure, or count of the commodity contained in the package, excluding packaging materials. Under Legal Metrology Rule 6(1)(d) & Rule 7, it must use standard SI metric units (g, kg, ml, l, m) with minimum font height proportional to the Principal Display Panel area.";
    }

    if (q.includes('mrp') || q.includes('price') || q.includes('overcharge') || q.includes('dual pricing')) {
      return "Maximum Retail Price (MRP) must be clearly printed on the Principal Display Panel inclusive of all taxes ('incl. of all taxes'). Under Rule 18(2), it is illegal for any retailer or e-commerce marketplace to sell a packaged commodity at a price higher than the stamped package MRP.";
    }

    if (q.includes('usp') || q.includes('unit sale price')) {
      return "Unit Sale Price (USP) represents the price per gram, per kilogram, per millilitre, or per litre. Under the 2022 amendment to Rule 6(1)(f), declaring the Unit Sale Price is mandatory for packages containing more than 1 unit or weighing over 1 kg/litre, helping consumers accurately compare value.";
    }

    if (q.includes('country of origin') || q.includes('imported') || q.includes('origin')) {
      return "Under Legal Metrology Rule 6(8), every package containing an imported commodity must declare the Country of Origin, manufacture, or assembly prominently on the label or oversticker. Furthermore, all e-commerce listings must display the Country of Origin.";
    }

    if (q.includes('expiry') || q.includes('best before') || q.includes('use by')) {
      return "Expiry Date or Best Before indicates the date up to which the commodity remains safe and potent for consumption. For food, it is regulated under FSSAI regulations; for cosmetics, under Cosmetics Rules 2020; and for pharmaceuticals, under the Drugs & Cosmetics Act 1940.";
    }

    if (q.includes('mfg') || q.includes('manufacturing date') || q.includes('date of manufacture')) {
      return "Manufacturing Date indicates the month and year of manufacture or packing under Rule 6(1)(d). Under Indian regulations, the manufacturing date must be earlier than the expiry date, and cannot be a future date.";
    }

    if (q.includes('triangulation') || q.includes('cross source') || q.includes('cross-source')) {
      return "Cross-Source Triangulation is an Inspector-exclusive intelligence feature that compares three sources simultaneously: 1) Physical Packaging OCR, 2) Official Brand Specifications, and 3) Live E-Commerce Marketplace Listings. It automatically flags overcharging and missing online declarations.";
    }

    if (q.includes('inspector') || q.includes('officer')) {
      return "The Inspector Portal provides verified Legal Metrology enforcement officers with an evidence-backed Command Center, the 3-Way Triangulation Suite, regional risk maps, and the authority to confirm assessments or issue statutory notices under Section 36.";
    }

    if (q.includes('manufacturer') || q.includes('pre-publish') || q.includes('fix')) {
      return "The Manufacturer Portal allows brand managers to run pre-market label audits before print runs, identify non-compliances, utilize the 'Fix & Recheck Lab' to improve compliance scores, and generate digital Compliance Passports.";
    }

    if (q.includes('consumer') || q.includes('buyer')) {
      return "The Consumer Portal allows buyers to check package authenticity and verify whether prices, quantities, and origin declarations comply with legal standards in simple, plain language.";
    }

    if (q.includes('how labeliq works') || q.includes('how it works') || q.includes('about')) {
      return "LabelIQ transforms unstructured packaging photos, PDFs, and URLs into a structured Product Digital Twin. It applies deterministic legal rules from the Legal Metrology Rules 2011, verifies declarations, and provides complete traceability from evidence to statutory provisions.";
    }

    // Default contextual answer
    return "Under the Legal Metrology (Packaged Commodities) Rules, 2011, all retail packages must declare the 10 core fields: Product Name, Brand, Manufacturer, Importer, Net Quantity, MRP, Country of Origin, Manufacturing Date, Expiry Date, and Consumer Care details. You can check any package using the Scan feature or ask me about a specific rule!";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateBotReply(userText);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-slate-900 text-white shadow-xl hover:bg-brand-600 transition-all transform hover:scale-105 flex items-center gap-2 group border border-slate-700"
          title="Open AI Legal Metrology Assistant"
        >
          <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold tracking-wide pr-1 hidden sm:inline">Ask LabelIQ AI</span>
        </button>
      )}

      {/* Main Chatbot Window */}
      {isOpen && (
        <div className={`fixed z-50 transition-all duration-200 shadow-2xl rounded-2xl border border-slate-200 overflow-hidden bg-white flex flex-col ${
          isMinimized 
            ? 'bottom-6 right-6 w-72 h-14' 
            : 'bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[520px] max-h-[85vh]'
        }`}>
          
          {/* Header Bar */}
          <div className="bg-slate-900 px-4 py-3 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <div className="text-xs font-bold tracking-wide flex items-center gap-1.5">
                  <span>LabelIQ Legal Assistant</span>
                  <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1 rounded font-mono">LMPC AI</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:text-white transition rounded"
                title={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-white transition rounded"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Product Context Bar if scanned */}
          {!isMinimized && currentProduct && (
            <div className="px-3.5 py-1.5 bg-slate-100/90 border-b border-slate-200 text-[11px] flex items-center justify-between">
              <span className="text-slate-600 truncate max-w-[220px]">
                Target: <strong>{currentProduct.product || currentProduct.name}</strong>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Twin Loaded
              </span>
            </div>
          )}

          {/* Chat Messages Body */}
          {!isMinimized && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[80%] rounded-xl p-3 shadow-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white font-medium rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                    <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-brand-200' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 shadow-xs mt-0.5 font-bold text-[10px]">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-center text-slate-400 text-xs italic">
                  <Bot className="w-4 h-4 text-slate-500 animate-pulse" />
                  <span>Reviewing Legal Metrology Rules...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Quick Prompts */}
          {!isMinimized && (
            <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[10px]">
              <button
                onClick={() => setInput("Is this product expired?")}
                className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0"
              >
                Is this product expired?
              </button>
              <button
                onClick={() => setInput("Who is the manufacturer?")}
                className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0"
              >
                Manufacturer?
              </button>
              <button
                onClick={() => setInput("Explain Rule 18 MRP")}
                className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0"
              >
                Explain MRP
              </button>
            </div>
          )}

          {/* Input Box */}
          {!isMinimized && (
            <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                placeholder="Ask about label rules, dates, or scanned product..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-white transition shrink-0"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      )}
    </>
  );
}
