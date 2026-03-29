/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface RecipeResult {
  flour: number;
  water: number;
  salt: number;
  yeast: number;
  waterPct: number;
  saltPct: number;
  yeastPct: number;
  total: number;
}

export default function App() {
  const [flour, setFlour] = useState<string>("");
  const [waterPct, setWaterPct] = useState<string>("75");
  const [saltPct, setSaltPct] = useState<string>("2");
  const [yeastPct, setYeastPct] = useState<string>("1");
  
  const [result, setResult] = useState<RecipeResult | null>(null);
  const [error, setError] = useState("");

  // Load sticky settings
  useEffect(() => {
    const savedWater = localStorage.getItem("baking_water_pct");
    const savedSalt = localStorage.getItem("baking_salt_pct");
    const savedYeast = localStorage.getItem("baking_yeast_pct");
    
    if (savedWater) setWaterPct(savedWater);
    if (savedSalt) setSaltPct(savedSalt);
    if (savedYeast) setYeastPct(savedYeast);
  }, []);

  const calculate = () => {
    setError("");
    setResult(null);

    const f = parseFloat(flour);
    const w = parseFloat(waterPct);
    const s = parseFloat(saltPct);
    const y = parseFloat(yeastPct);

    if (isNaN(f) || f <= 0) {
      setError("請輸入正確的麵粉重量喔！");
      return;
    }
    if (isNaN(w) || isNaN(s) || isNaN(y)) {
      setError("比例數字要填好喔！");
      return;
    }

    // Save settings
    localStorage.setItem("baking_water_pct", waterPct);
    localStorage.setItem("baking_salt_pct", saltPct);
    localStorage.setItem("baking_yeast_pct", yeastPct);

    const waterWeight = (f * w) / 100;
    const saltWeight = (f * s) / 100;
    const yeastWeight = (f * y) / 100;
    const total = f + waterWeight + saltWeight + yeastWeight;

    setResult({
      flour: f,
      water: waterWeight,
      salt: saltWeight,
      yeast: yeastWeight,
      waterPct: w,
      saltPct: s,
      yeastPct: y,
      total
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 font-sans text-[#2D2D2D]">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-black text-[#D9534F] mb-2">
            🍞 麵包小助手
          </h1>
          <p className="text-2xl font-bold text-gray-500">專為麵包設計的計算機</p>
        </header>

        {/* Input Section */}
        <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-10 mb-8 border-4 border-[#EAE0D5]">
          <div className="space-y-8">
            {/* Flour */}
            <div>
              <label className="block text-3xl font-black mb-3 text-[#2D2D2D]">
                🌾 麵粉重 (克)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={flour}
                onChange={(e) => setFlour(e.target.value)}
                placeholder="例如：1000"
                className="w-full text-4xl p-6 border-4 border-[#D1D1D1] rounded-3xl focus:border-[#D9534F] focus:outline-none bg-[#F9F9F9]"
              />
            </div>

            {/* Water */}
            <div>
              <label className="block text-3xl font-black mb-3 text-[#2D2D2D]">
                💧 水 比例 (%)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={waterPct}
                onChange={(e) => setWaterPct(e.target.value)}
                className="w-full text-4xl p-6 border-4 border-[#D1D1D1] rounded-3xl focus:border-[#2E86C1] focus:outline-none bg-[#F9F9F9]"
              />
            </div>

            {/* Salt */}
            <div>
              <label className="block text-3xl font-black mb-3 text-[#2D2D2D]">
                🧂 鹽 比例 (%)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={saltPct}
                onChange={(e) => setSaltPct(e.target.value)}
                className="w-full text-4xl p-6 border-4 border-[#D1D1D1] rounded-3xl focus:border-[#7D3C98] focus:outline-none bg-[#F9F9F9]"
              />
            </div>

            {/* Yeast */}
            <div>
              <label className="block text-3xl font-black mb-3 text-[#2D2D2D]">
                🥖 酵母 比例 (%)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={yeastPct}
                onChange={(e) => setYeastPct(e.target.value)}
                className="w-full text-4xl p-6 border-4 border-[#D1D1D1] rounded-3xl focus:border-[#E67E22] focus:outline-none bg-[#F9F9F9]"
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-[#5CB85C] hover:bg-[#4CAE4C] active:bg-[#398439] text-white text-4xl font-black py-8 rounded-3xl shadow-xl transform active:scale-95 transition-all cursor-pointer mt-4"
            >
              👉 算出克數
            </button>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#F2DEDE] border-l-[12px] border-[#A94442] text-[#A94442] p-8 rounded-2xl mb-8 text-2xl font-bold"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] shadow-2xl p-8 md:p-10 border-8 border-[#5CB85C]"
            >
              <div className="text-center mb-8">
                <span className="text-4xl font-black text-[#5CB85C]">✅ 計算完成！</span>
              </div>
              
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b-4 border-[#F1F1F1] pb-6">
                  <span className="text-3xl font-bold text-[#2D2D2D]">🌾 麵粉：</span>
                  <span className="text-4xl font-black text-[#2D2D2D]">{result.flour.toFixed(1)} 克</span>
                </div>
                <div className="flex justify-between items-center border-b-4 border-[#F1F1F1] pb-6">
                  <span className="text-3xl font-bold text-[#2E86C1]">💧 水：</span>
                  <span className="text-4xl font-black text-[#2E86C1]">{result.water.toFixed(1)} 克</span>
                </div>
                <div className="flex justify-between items-center border-b-4 border-[#F1F1F1] pb-6">
                  <span className="text-3xl font-bold text-[#7D3C98]">🧂 鹽巴：</span>
                  <span className="text-4xl font-black text-[#7D3C98]">{result.salt.toFixed(1)} 克</span>
                </div>
                <div className="flex justify-between items-center border-b-4 border-[#F1F1F1] pb-6">
                  <span className="text-3xl font-bold text-[#E67E22]">🥖 酵母：</span>
                  <span className="text-4xl font-black text-[#E67E22]">{result.yeast.toFixed(1)} 克</span>
                </div>
                
                <div className="pt-6 flex justify-between items-center text-4xl md:text-5xl font-black text-[#2D2D2D] bg-[#F9F9F9] p-8 rounded-3xl border-4 border-[#EAE0D5]">
                  <span>⚖️ 總重量</span>
                  <span className="text-[#D9534F]">{result.total.toFixed(1)} 克</span>
                </div>
              </div>
              
              <p className="mt-10 text-center text-gray-400 text-xl font-bold italic">
                祝你烤出香噴噴的麵包 ❤️
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
