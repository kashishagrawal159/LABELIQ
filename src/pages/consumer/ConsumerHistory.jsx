import React, { useState, useEffect } from 'react';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  AlertOctagon,
  ArrowRight, 
  Trash2, 
  Calendar, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Pill,
  Sparkle,
  Sparkles,
  Camera,
  Layers,
  Filter
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getScanHistory, deleteHistoryItem, clearScanHistory } from '../../services/historyService';
import { useApp } from '../../context/AppContext';

export default function ConsumerHistory() {
  const navigate = useNavigate();
  const { loadProductIntoViewer, triggerSampleScan, sampleProducts = [] } = useApp();
  
  const [historyList, setHistoryList] = useState([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all'); // all | food | medicine | cosmetics

  // Load history from localStorage
  const refreshHistory = () => {
    const list = getScanHistory();
    setHistoryList(list);
  };

  useEffect(() => {
    refreshHistory();

    // Listen to real-time update events
    const handleUpdate = () => refreshHistory();
    window.addEventListener('labeliq:history-updated', handleUpdate);
    return () => {
      window.removeEventListener('labeliq:history-updated', handleUpdate);
    };
  }, []);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteHistoryItem(id);
    refreshHistory();
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire scan history?")) {
      clearScanHistory();
      refreshHistory();
    }
  };

  const handleViewProduct = (item) => {
    if (item.fullProduct) {
      loadProductIntoViewer(item.fullProduct);
    }
    navigate('/consumer/check');
  };

  const filteredHistory = historyList.filter(item => {
    if (activeCategoryFilter === 'all') return true;
    return item.category?.toLowerCase() === activeCategoryFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-600" />
            <h1 className="text-xl font-bold text-slate-900">My Product Scan History</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Permanent record of packaged commodities scanned and validated via your device.
          </p>
        </div>

        {historyList.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
            <Link
              to="/consumer/check"
              className="px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-xs transition flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              New Scan
            </Link>
          </div>
        )}
      </div>

      {/* Filter Tabs if history exists */}
      {historyList.length > 0 && (
        <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-semibold px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {['all', 'food', 'medicine', 'cosmetics'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg font-semibold capitalize transition ${
                  activeCategoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? `All Scans (${historyList.length})` : cat}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Showing {filteredHistory.length} of {historyList.length} items
          </span>
        </div>
      )}

      {/* History Items List */}
      {filteredHistory.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          {filteredHistory.map((item) => {
            const isExpired = item.isExpired;
            const hasViolations = item.violations_count > 0;
            const formattedDate = new Date(item.timestamp).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div 
                key={item.id} 
                onClick={() => handleViewProduct(item)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition cursor-pointer group"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-2xs group-hover:border-brand-300 transition">
                    <img 
                      src={item.image || "/samples/facewash_front.jpg"} 
                      alt={item.name} 
                      className="w-full h-full object-contain" 
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-brand-600 transition">
                        {item.name}
                      </h4>
                      
                      {/* Category Badges */}
                      {item.category === 'food' && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          FSSAI
                        </span>
                      )}
                      {item.category === 'medicine' && (
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1">
                          <Pill className="w-3 h-3 text-teal-600" />
                          CDSCO Drug
                        </span>
                      )}
                      {item.category === 'cosmetics' && (
                        <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1">
                          <Sparkle className="w-3 h-3 text-indigo-600" />
                          Cosmetics
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-700">{item.brand}</span>
                      <span>•</span>
                      <span className="font-bold text-slate-800">{item.mrp}</span>
                      <span>•</span>
                      <span>{item.net_quantity}</span>
                      <span>•</span>
                      <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formattedDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Compliance Status & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {isExpired ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-300">
                      <AlertOctagon className="w-3.5 h-3.5" /> EXPIRED
                    </span>
                  ) : hasViolations ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> ISSUE ({item.violations_count})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> VERIFIED
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Remove from history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleViewProduct(item)}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 pl-2"
                    >
                      Inspect <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Scan History Recorded Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              When you scan a product using Camera, Image Upload, or URL, your verified results will automatically persist here.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/consumer/check"
              className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Scan a Product Now</span>
            </Link>

            {sampleProducts.length > 0 && (
              <button
                onClick={() => {
                  triggerSampleScan(sampleProducts[0]);
                  navigate('/consumer/check');
                }}
                className="px-5 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Test Reference Label (Amul Milk)</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
