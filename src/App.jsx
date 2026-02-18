import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, Send, Settings, Play, Check, ChevronDown, ArrowLeft, Sparkles,
  BarChart2, List, MessageSquare, Bookmark, Trash2, Clock, X, Plus,
  Search, Maximize2, Trophy, FileText, Zap, Bike, Dumbbell,
  ToggleLeft, ToggleRight, Minus, TrendingUp, Download, Upload, LogOut, Cloud, CloudOff,
  RefreshCw
} from 'lucide-react';
import { firebaseConfigured, signInGoogle, logOut, onAuthChange, cloudSaveData, cloudLoadData } from './firebase';

// ─── EXERCISE DB ───
const EXERCISE_DB = [
  // ── Chest ──
  { category: "Chest", name: "Barbell Bench Press" },
  { category: "Chest", name: "Incline Barbell Bench Press" },
  { category: "Chest", name: "Decline Barbell Bench Press" },
  { category: "Chest", name: "Close-Grip Bench Press" },
  { category: "Chest", name: "Dumbbell Bench Press" },
  { category: "Chest", name: "Incline Dumbbell Press" },
  { category: "Chest", name: "Decline Dumbbell Press" },
  { category: "Chest", name: "Dumbbell Fly" },
  { category: "Chest", name: "Incline Dumbbell Fly" },
  { category: "Chest", name: "Cable Fly" },
  { category: "Chest", name: "Cable Crossover" },
  { category: "Chest", name: "Low Cable Fly" },
  { category: "Chest", name: "Cable Press" },
  { category: "Chest", name: "Incline Cable Press" },
  { category: "Chest", name: "Push-ups" },
  { category: "Chest", name: "Decline Push-ups" },
  { category: "Chest", name: "Diamond Push-ups" },
  { category: "Chest", name: "Dumbbell Pullover" },
  { category: "Chest", name: "Svend Press" },
  // ── Back ──
  { category: "Back", name: "Barbell Row" },
  { category: "Back", name: "Pendlay Row" },
  { category: "Back", name: "Dumbbell Row" },
  { category: "Back", name: "Single Arm Dumbbell Row" },
  { category: "Back", name: "Incline Dumbbell Row" },
  { category: "Back", name: "Cable Row" },
  { category: "Back", name: "Single Arm Cable Row" },
  { category: "Back", name: "Lat Pulldown" },
  { category: "Back", name: "Close-Grip Lat Pulldown" },
  { category: "Back", name: "Single Arm Lat Pulldown" },
  { category: "Back", name: "Straight Arm Pulldown" },
  { category: "Back", name: "Face Pull" },
  { category: "Back", name: "Pull-ups" },
  { category: "Back", name: "Chin-ups" },
  { category: "Back", name: "Neutral Grip Pull-ups" },
  { category: "Back", name: "Inverted Row" },
  { category: "Back", name: "Barbell Deadlift" },
  { category: "Back", name: "Rack Pull" },
  { category: "Back", name: "Barbell Shrug" },
  { category: "Back", name: "Dumbbell Shrug" },
  { category: "Back", name: "Cable Shrug" },
  { category: "Back", name: "Dumbbell Pullover" },
  { category: "Back", name: "Meadows Row" },
  { category: "Back", name: "Seal Row" },
  // ── Shoulders ──
  { category: "Shoulders", name: "Barbell Overhead Press" },
  { category: "Shoulders", name: "Seated Dumbbell Press" },
  { category: "Shoulders", name: "Arnold Press" },
  { category: "Shoulders", name: "Dumbbell Lateral Raise" },
  { category: "Shoulders", name: "Cable Lateral Raise" },
  { category: "Shoulders", name: "Dumbbell Front Raise" },
  { category: "Shoulders", name: "Cable Front Raise" },
  { category: "Shoulders", name: "Dumbbell Reverse Fly" },
  { category: "Shoulders", name: "Cable Reverse Fly" },
  { category: "Shoulders", name: "Cable Upright Row" },
  { category: "Shoulders", name: "Barbell Upright Row" },
  { category: "Shoulders", name: "Dumbbell Upright Row" },
  { category: "Shoulders", name: "Push Press" },
  { category: "Shoulders", name: "Z Press" },
  { category: "Shoulders", name: "Lu Raise" },
  { category: "Shoulders", name: "Bus Driver" },
  { category: "Shoulders", name: "Plate Front Raise" },
  { category: "Shoulders", name: "Cable Face Pull" },
  { category: "Shoulders", name: "Bradford Press" },
  { category: "Shoulders", name: "Landmine Press" },
  // ── Arms (Biceps) ──
  { category: "Arms", name: "Barbell Curl" },
  { category: "Arms", name: "EZ Bar Curl" },
  { category: "Arms", name: "Dumbbell Curl" },
  { category: "Arms", name: "Hammer Curl" },
  { category: "Arms", name: "Incline Dumbbell Curl" },
  { category: "Arms", name: "Concentration Curl" },
  { category: "Arms", name: "Cable Curl" },
  { category: "Arms", name: "Hammer Cable Curl" },
  { category: "Arms", name: "Cable Bayesian Curl" },
  { category: "Arms", name: "Preacher Curl (Bench)" },
  { category: "Arms", name: "Spider Curl" },
  { category: "Arms", name: "Cross Body Hammer Curl" },
  { category: "Arms", name: "Reverse Curl" },
  { category: "Arms", name: "Zottman Curl" },
  { category: "Arms", name: "Drag Curl" },
  { category: "Arms", name: "21s Curl" },
  // ── Arms (Triceps) ──
  { category: "Arms", name: "Cable Pushdown" },
  { category: "Arms", name: "Rope Pushdown" },
  { category: "Arms", name: "Overhead Cable Extension" },
  { category: "Arms", name: "Single Arm Cable Pushdown" },
  { category: "Arms", name: "Dumbbell Overhead Extension" },
  { category: "Arms", name: "Dumbbell Kickback" },
  { category: "Arms", name: "Skull Crusher" },
  { category: "Arms", name: "Close-Grip Bench Press" },
  { category: "Arms", name: "Dips" },
  { category: "Arms", name: "Bench Dips" },
  { category: "Arms", name: "Diamond Push-ups" },
  { category: "Arms", name: "JM Press" },
  // ── Arms (Forearms) ──
  { category: "Arms", name: "Wrist Curl" },
  { category: "Arms", name: "Reverse Wrist Curl" },
  { category: "Arms", name: "Farmer's Walk" },
  { category: "Arms", name: "Dead Hang" },
  { category: "Arms", name: "Plate Pinch Hold" },
  // ── Legs (Quads) ──
  { category: "Legs", name: "Barbell Back Squat" },
  { category: "Legs", name: "Barbell Front Squat" },
  { category: "Legs", name: "Goblet Squat" },
  { category: "Legs", name: "Dumbbell Squat" },
  { category: "Legs", name: "Cable Squat" },
  { category: "Legs", name: "Bulgarian Split Squat" },
  { category: "Legs", name: "Split Squat" },
  { category: "Legs", name: "Forward Lunges" },
  { category: "Legs", name: "Reverse Lunges" },
  { category: "Legs", name: "Walking Lunges" },
  { category: "Legs", name: "Step-ups" },
  { category: "Legs", name: "Sissy Squat" },
  { category: "Legs", name: "Leg Extension (Bench)" },
  { category: "Legs", name: "Hack Squat (Barbell)" },
  { category: "Legs", name: "Landmine Squat" },
  { category: "Legs", name: "Wall Sit" },
  { category: "Legs", name: "Pistol Squat" },
  // ── Legs (Hamstrings / Glutes) ──
  { category: "Legs", name: "Romanian Deadlift" },
  { category: "Legs", name: "Dumbbell Romanian Deadlift" },
  { category: "Legs", name: "Single Leg Romanian Deadlift" },
  { category: "Legs", name: "Stiff Leg Deadlift" },
  { category: "Legs", name: "Good Morning" },
  { category: "Legs", name: "Cable Pull Through" },
  { category: "Legs", name: "Cable Leg Curl" },
  { category: "Legs", name: "Nordic Curl" },
  { category: "Legs", name: "Glute Bridge" },
  { category: "Legs", name: "Barbell Hip Thrust" },
  { category: "Legs", name: "Dumbbell Hip Thrust" },
  { category: "Legs", name: "Cable Kickback" },
  { category: "Legs", name: "Dumbbell Sumo Squat" },
  { category: "Legs", name: "Sumo Deadlift" },
  { category: "Legs", name: "Cable Adduction" },
  { category: "Legs", name: "Cable Abduction" },
  { category: "Legs", name: "Frog Pump" },
  // ── Legs (Calves) ──
  { category: "Legs", name: "Standing Calf Raise" },
  { category: "Legs", name: "Seated Calf Raise" },
  { category: "Legs", name: "Single Leg Calf Raise" },
  { category: "Legs", name: "Barbell Calf Raise" },
  { category: "Legs", name: "Dumbbell Calf Raise" },
  { category: "Legs", name: "Tibialis Raise" },
  // ── Core ──
  { category: "Core", name: "Cable Woodchop" },
  { category: "Core", name: "Pallof Press" },
  { category: "Core", name: "Cable Crunch" },
  { category: "Core", name: "Plank" },
  { category: "Core", name: "Side Plank" },
  { category: "Core", name: "Ab Rollout" },
  { category: "Core", name: "Hanging Leg Raise" },
  { category: "Core", name: "Hanging Knee Raise" },
  { category: "Core", name: "Lying Leg Raise" },
  { category: "Core", name: "Bicycle Crunch" },
  { category: "Core", name: "Russian Twist" },
  { category: "Core", name: "Sit-ups" },
  { category: "Core", name: "Crunches" },
  { category: "Core", name: "V-ups" },
  { category: "Core", name: "Dead Bug" },
  { category: "Core", name: "Bird Dog" },
  { category: "Core", name: "Mountain Climbers" },
  { category: "Core", name: "Dragon Flag" },
  { category: "Core", name: "L-Sit Hold" },
  { category: "Core", name: "Weighted Decline Sit-up" },
  { category: "Core", name: "Landmine Rotation" },
  { category: "Core", name: "Suitcase Carry" },
  { category: "Core", name: "Farmer's Walk" },
  // ── Cardio ──
  { category: "Cardio", name: "Running (Outdoor)" },
  { category: "Cardio", name: "Treadmill" },
  { category: "Cardio", name: "Cycling" },
  { category: "Cardio", name: "Stationary Bike" },
  { category: "Cardio", name: "Rowing Machine" },
  { category: "Cardio", name: "Skipping" },
  { category: "Cardio", name: "Stair Climber" },
  { category: "Cardio", name: "Elliptical" },
  { category: "Cardio", name: "Swimming" },
  { category: "Cardio", name: "Walking" },
  { category: "Cardio", name: "Hiking" },
  { category: "Cardio", name: "Sprints" },
  { category: "Cardio", name: "Battle Ropes" },
  { category: "Cardio", name: "Box Jumps" },
  { category: "Cardio", name: "Burpees" },
  { category: "Cardio", name: "Kettlebell Swings" },
  { category: "Cardio", name: "Jumping Jacks" },
];

const DEFAULT_EQUIPMENT = [
  "Bodycraft XFT Functional Trainer",
  "Iron Craft Adjustable Bench with Leg Developer",
  "Rugged Rack with Lat Pulldown Attachment",
  "Powerblock Adjustable Dumbbell",
  "Weight plates up to 150kg",
  "Barbell"
];

// ─── STORAGE (localStorage) ───
const SK = { routines: "gym-routines", history: "gym-history", settings: "gym-settings", draft: "gym-draft", chat: "gym-chat" };
const sGet = async (k) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch { return null; } };
const sSet = async (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.error(e); } };
const sDel = async (k) => { try { localStorage.removeItem(k); } catch {} };

// ─── HELPERS ───
const sessionColor = (c) => ({ blue: '#3b82f6', indigo: '#6366f1', emerald: '#10b981', violet: '#8b5cf6', rose: '#f43f5e', amber: '#f59e0b' }[c] || '#6366f1');
const isCardio = (n) => { if (!n) return false; const ex = EXERCISE_DB.find(e => e.name === n); return ex ? ex.category === "Cardio" : false; };
const parseRest = (s) => { if (!s) return 60; const n = parseInt(s); return isNaN(n) ? 60 : (s.includes('m') && !s.includes('s')) ? n * 60 : n; };
const calc1RM = (w, r) => { const wn = parseFloat(w), rn = parseFloat(r); return (!wn || !rn) ? 0 : Math.round(wn * (1 + rn / 30)); };
const fmt = (s) => { const m = Math.floor(Math.abs(s) / 60), sec = Math.abs(s) % 60; return `${m}:${sec.toString().padStart(2, '0')}`; };
const parseReps = (v) => { if (!v) return 0; const n = parseFloat(v); return isNaN(n) ? 0 : n; };

const getExStats = (name, hist) => {
  if (!hist?.length) return null;
  let maxW = 0, max1RM = 0, lastDate = null, lastSets = [];
  for (const s of hist) {
    const ed = s.exercises?.find(e => e.name === name);
    if (ed) {
      if (!lastDate) { lastDate = s.date; lastSets = ed.setsData || []; }
      for (const set of (ed.setsData || [])) {
        if (set.completed && set.weight) {
          const w = parseFloat(set.weight);
          if (w > maxW) maxW = w;
          const e1rm = calc1RM(set.weight, set.reps);
          if (e1rm > max1RM) max1RM = e1rm;
        }
      }
    }
  }
  return (maxW === 0 && !lastDate) ? null : { maxW, max1RM, lastDate, lastSets };
};

// ─── AI ───
const SYSTEM = `You are GymAI, an expert physique coach. You help design training routines and give coaching advice.

CONTEXT:
- Available exercises: ${EXERCISE_DB.map(e => e.name).join(', ')}

BEHAVIOUR:
1. Chat naturally about goals, schedule, experience, injuries.
2. When you have enough info OR user asks for a routine, include a routine in your response.
3. For normal conversation, just reply text.

WHEN INCLUDING A ROUTINE, embed exactly one JSON block wrapped in <routine> tags:
<routine>
{"name":"Name","type":"Split Type","description":"Brief desc","sessions":[{"id":"s1","title":"Push A","color":"indigo","exercises":[{"name":"Cable Fly","category":"Chest","sets":3,"reps":"10-12","rest":"60s","supersetId":null}]}]}
</routine>

Keep the JSON compact. Only use <routine> tags when actually proposing a saveable routine. Otherwise just chat. Be concise and practical.`;

const callAI = async (messages, settings) => {
  const equipCtx = settings.equipment?.length
    ? `Equipment available: ${settings.equipment.join(', ')}.`
    : "Equipment: Not specified.";
  const settingsCtx = `${equipCtx} Supersets: ${settings.enableSupersets ? 'Yes' : 'No'}. Rest: ${settings.restCompound}s compound, ${settings.restIsolation}s isolation.`;

  const apiMsgs = [];
  for (const m of messages) {
    const role = m.sender === 'user' ? 'user' : 'assistant';
    const content = m.sender === 'user' ? m.text : (m.rawText || m.text);
    if (apiMsgs.length > 0 && apiMsgs[apiMsgs.length - 1].role === role) {
      apiMsgs[apiMsgs.length - 1].content += '\n' + content;
    } else {
      apiMsgs.push({ role, content });
    }
  }
  if (apiMsgs.length > 0 && apiMsgs[0].role !== 'user') {
    apiMsgs.shift();
  }

  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 60000);
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: SYSTEM + "\n\nUser settings: " + settingsCtx,
        messages: apiMsgs
      }),
      signal: ctrl.signal
    });
    clearTimeout(to);
    if (!res.ok) throw new Error(`API ${res.status}`);
    const d = await res.json();
    const raw = d.content?.map(i => i.text || "").join("") || "";
    return raw;
  } catch (e) {
    console.error("AI Error:", e);
    return null;
  }
};

const parseAIResponse = (raw) => {
  if (!raw) return { text: "Connection error. Please try again.", routine: null };
  const routineMatch = raw.match(/<routine>([\s\S]*?)<\/routine>/);
  let routine = null;
  let text = raw;
  if (routineMatch) {
    try {
      routine = JSON.parse(routineMatch[1].trim());
    } catch (e) {
      console.error("Routine parse error:", e);
    }
    text = raw.replace(/<routine>[\s\S]*?<\/routine>/, '').trim();
  }
  return { text: text || "Here's your routine:", routine, rawText: raw };
};

// ─── MODALS ───
const SettingsModal = ({ settings, onSave, onClose, user, onLogin, onLogout, onExport, onImport, loginError }) => {
  const [s, setS] = useState({ ...settings, equipment: settings.equipment || DEFAULT_EQUIPMENT });
  const [newEquip, setNewEquip] = useState('');
  const fileRef = useRef(null);
  const addEquip = () => {
    if (newEquip.trim()) {
      setS({ ...s, equipment: [...(s.equipment || []), newEquip.trim()] });
      setNewEquip('');
    }
  };
  return (
    <div className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-slate-900 text-xl">Settings</h3>
          <button onClick={onClose} className="bg-slate-50 p-2 rounded-full hover:bg-slate-100"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="space-y-5">
          {/* Account */}
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block">Account</label>
            {user ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3 min-w-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} className="w-8 h-8 rounded-full shrink-0" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0"><span className="text-indigo-600 font-bold text-sm">{(user.displayName || user.email || '?')[0]}</span></div>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-700 truncate">{user.displayName || 'User'}</div>
                    <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><Cloud size={10} />Synced</div>
                  </div>
                </div>
                <button onClick={onLogout} className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 shrink-0 ml-2"><LogOut size={14} />Sign Out</button>
              </div>
            ) : (
              <button onClick={onLogin}
                className="w-full flex items-center justify-center gap-2 p-3.5 bg-white border-2 border-slate-200 rounded-2xl hover:border-indigo-300 hover:bg-indigo-50 text-sm font-bold text-slate-700 transition-all">
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign in with Google
              </button>
            )}
            {loginError && <p className="text-[10px] text-red-500 font-medium mt-2 px-1">{loginError}</p>}
            {!firebaseConfigured && !user && !loginError && (
              <p className="text-[10px] text-amber-500 font-medium mt-2 px-1">Cloud sync not configured. Data saved locally only.</p>
            )}
          </div>

          {/* Data Backup */}
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block">Data Backup</label>
            <div className="flex gap-3">
              <button onClick={onExport} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
                <Download size={16} />Export
              </button>
              <button onClick={() => fileRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
                <Upload size={16} />Import
              </button>
              <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={onImport} />
            </div>
          </div>

          {/* Equipment */}
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block">My Equipment</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(s.equipment || []).map((item, idx) => (
                <span key={idx} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-[11px] font-bold border border-indigo-100">
                  {item}
                  <button onClick={() => setS({ ...s, equipment: s.equipment.filter((_, i) => i !== idx) })} className="text-indigo-300 hover:text-red-500 ml-0.5"><X size={11} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Add equipment..." value={newEquip} onChange={e => setNewEquip(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addEquip(); }} />
              <button onClick={addEquip} className="bg-indigo-100 text-indigo-600 px-3 rounded-xl font-bold text-sm hover:bg-indigo-200"><Plus size={16} /></button>
            </div>
          </div>

          <div>
            <button onClick={() => setS({ ...s, enableSupersets: !s.enableSupersets })}
              className="flex justify-between items-center w-full p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-200">
              <span className="text-sm font-bold text-slate-700">Enable Supersets</span>
              {s.enableSupersets ? <ToggleRight size={28} className="text-indigo-600" /> : <ToggleLeft size={28} className="text-slate-300" />}
            </button>
          </div>
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block">Default Rest (s)</label>
            <div className="flex gap-3">
              {[['Compound', 'restCompound'], ['Isolation', 'restIsolation']].map(([label, key]) => (
                <div key={key} className="flex-1">
                  <label className="text-[10px] text-slate-400 font-bold mb-1 block ml-1">{label}</label>
                  <input type="number" value={s[key]} onChange={e => setS({ ...s, [key]: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <button onClick={() => { onSave(s); onClose(); }}
          className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg active:scale-95 transition-transform">
          Save Changes
        </button>
      </div>
    </div>
  );
};

const RestEditModal = ({ currentRest, onSave, onClose }) => {
  const [val, setVal] = useState(parseRest(currentRest));
  return (
    <div className="fixed inset-0 z-[75] bg-black/30 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="font-bold text-slate-900 text-lg text-center mb-6">Rest Timer</h3>
        <div className="flex items-center justify-center gap-4 mb-6">
          <button onClick={() => setVal(Math.max(0, val - 10))} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200"><Minus size={20} className="text-slate-600" /></button>
          <div className="text-3xl font-black text-indigo-600 w-24 text-center tabular-nums">{val}s</div>
          <button onClick={() => setVal(val + 10)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200"><Plus size={20} className="text-slate-600" /></button>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[60, 90, 120, 180, 240, 300].map(s => (
            <button key={s} onClick={() => setVal(s)}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${val === s ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500'}`}>{s}s</button>
          ))}
        </div>
        <button onClick={() => { onSave(val + 's'); onClose(); }} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl text-sm active:scale-95">Set Timer</button>
      </div>
    </div>
  );
};

const NotesModal = ({ initialNote, onSave, onClose }) => {
  const [note, setNote] = useState(initialNote || '');
  return (
    <div className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900 text-lg">Notes</h3>
          <button onClick={onClose}><X size={24} className="text-slate-400" /></button>
        </div>
        <textarea className="w-full h-40 bg-slate-50 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 resize-none font-medium text-slate-700 border border-slate-200"
          placeholder="Seat height, cues, settings..." value={note} onChange={e => setNote(e.target.value)} autoFocus />
        <button onClick={() => { onSave(note); onClose(); }} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-2xl text-sm">Save Note</button>
      </div>
    </div>
  );
};

const ExercisePicker = ({ onClose, onAdd }) => {
  const [search, setSearch] = useState('');
  const filtered = EXERCISE_DB.filter(ex => ex.name.toLowerCase().includes(search.toLowerCase()) || ex.category.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col">
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800"><ChevronDown size={24} /></button>
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full bg-slate-100 rounded-xl h-10 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            placeholder="Search exercises..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.map((ex, i) => (
          <div key={i} className="flex items-center justify-between p-3.5 mb-2 bg-white border border-gray-100 rounded-xl cursor-pointer hover:border-indigo-200 transition-colors"
            onClick={() => onAdd(ex.name, ex.category)}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${ex.category === 'Cardio' ? 'bg-orange-50 text-orange-500' : 'bg-indigo-50 text-indigo-500'}`}>
                {ex.category === 'Cardio' ? <Bike size={18} /> : <Dumbbell size={18} />}
              </div>
              <div><div className="text-sm font-bold text-slate-800">{ex.name}</div><div className="text-xs text-slate-400">{ex.category}</div></div>
            </div>
            <Plus size={16} className="text-slate-400" />
          </div>
        ))}
        <div className="h-8" />
      </div>
    </div>
  );
};

// ─── SWAP MODAL ───
const SwapModal = ({ exercise, onSwap, onClose }) => {
  const [alternatives] = useState(() => {
    const same = EXERCISE_DB.filter(e => e.category === exercise.category && e.name !== exercise.name);
    return [...same].sort(() => Math.random() - 0.5).slice(0, 3);
  });
  return (
    <div className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900 text-lg">Swap Exercise</h3>
          <button onClick={onClose}><X size={22} className="text-slate-400" /></button>
        </div>
        <p className="text-xs text-slate-500 mb-4">Replace <span className="font-bold text-slate-700">{exercise.name}</span> with:</p>
        <div className="space-y-2">
          {alternatives.map((alt, i) => (
            <button key={i} onClick={() => onSwap(alt)}
              className="w-full flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500"><Dumbbell size={16} /></div>
              <div>
                <div className="text-sm font-bold text-slate-800">{alt.name}</div>
                <div className="text-[10px] text-slate-400">{alt.category}</div>
              </div>
            </button>
          ))}
          {alternatives.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No alternatives available</p>}
        </div>
      </div>
    </div>
  );
};

// ─── 1RM HELPER ───
const get1RMHistory = (name, hist) => {
  if (!hist?.length) return [];
  const points = [];
  for (const session of [...hist].reverse()) {
    const ex = session.exercises?.find(e => e.name === name);
    if (ex) {
      let best = 0;
      for (const set of (ex.setsData || [])) {
        if (set.completed && set.weight && set.reps) {
          const e1rm = calc1RM(set.weight, set.reps);
          if (e1rm > best) best = e1rm;
        }
      }
      if (best > 0) points.push({ date: session.date, value: best });
    }
  }
  return points;
};

// ─── PROGRESSION CHART ───
const ProgressionChart = ({ exerciseName, history, onClose }) => {
  const points = get1RMHistory(exerciseName, history);
  if (points.length === 0) return (
    <div className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900 text-lg">{exerciseName}</h3>
          <button onClick={onClose}><X size={22} className="text-slate-400" /></button>
        </div>
        <p className="text-sm text-slate-400 text-center py-8">No data yet. Complete some sets to see progression.</p>
      </div>
    </div>
  );

  const values = points.map(p => p.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const W = 300, H = 160, padX = 10, padY = 20;
  const chartW = W - padX * 2, chartH = H - padY * 2;

  const pts = points.map((p, i) => ({
    x: padX + (points.length === 1 ? chartW / 2 : (i / (points.length - 1)) * chartW),
    y: padY + chartH - ((p.value - minVal) / range) * chartH,
    ...p
  }));

  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = line + ` L${pts[pts.length - 1].x},${H - padY} L${pts[0].x},${H - padY} Z`;

  const latest = values[values.length - 1];
  const first = values[0];
  const change = latest - first;
  const pct = first > 0 ? ((change / first) * 100).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-slate-900 text-lg">{exerciseName}</h3>
          <button onClick={onClose}><X size={22} className="text-slate-400" /></button>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Estimated 1RM Progression</p>

        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-violet-50 rounded-xl p-3 text-center border border-violet-100">
            <div className="text-lg font-black text-violet-600">{latest}kg</div>
            <div className="text-[9px] font-bold text-violet-400 uppercase">Current</div>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
            <div className="text-lg font-black text-slate-700">{maxVal}kg</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase">Peak</div>
          </div>
          <div className={`flex-1 rounded-xl p-3 text-center border ${change >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
            <div className={`text-lg font-black ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{change >= 0 ? '+' : ''}{pct}%</div>
            <div className={`text-[9px] font-bold uppercase ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>Change</div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
              const y = padY + chartH * (1 - f);
              const val = Math.round(minVal + range * f);
              return (
                <g key={i}>
                  <line x1={padX} y1={y} x2={W - padX} y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
                  <text x={W - padX + 2} y={y + 3} fontSize="8" fill="#94a3b8" fontWeight="bold">{val}</text>
                </g>
              );
            })}
            {pts.length > 1 && <path d={area} fill="url(#areaGrad)" />}
            {pts.length > 1 && <path d={line} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
            {pts.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="4" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
              </g>
            ))}
          </svg>
          <div className="flex justify-between mt-1 px-1">
            <span className="text-[8px] font-bold text-slate-400">{new Date(points[0].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            {points.length > 1 && <span className="text-[8px] font-bold text-slate-400">{new Date(points[points.length - 1].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>}
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center mt-3">{points.length} session{points.length !== 1 ? 's' : ''} recorded</p>
      </div>
    </div>
  );
};

const HistoryDetail = ({ workout, onClose, onContinue, onUpdateWorkout }) => {
  const ic = (n) => isCardio(n);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const startEdit = () => {
    setEditData(JSON.parse(JSON.stringify(workout)));
    setEditing(true);
  };
  const updateSet = (ei, si, field, value) => {
    const ne = { ...editData };
    ne.exercises = ne.exercises.map((ex, i) => i !== ei ? ex : {
      ...ex, setsData: ex.setsData.map((s, j) => j !== si ? s : { ...s, [field]: value })
    });
    setEditData(ne);
  };
  const saveEdit = () => {
    let vol = 0;
    editData.exercises.forEach(ex => {
      if (!isCardio(ex.name)) {
        (ex.setsData || []).forEach(set => {
          if (set.completed && set.type !== 'W') {
            vol += (parseFloat(set.weight) || 0) * parseReps(set.reps);
          }
        });
      }
    });
    onUpdateWorkout({ ...editData, volume: vol });
    setEditing(false);
    setEditData(null);
  };

  const data = editing ? editData : workout;

  return (
    <div className="fixed inset-0 bg-slate-50 z-[60] flex flex-col">
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => { if (editing) { setEditing(false); setEditData(null); } else onClose(); }} className="p-2 text-slate-400 hover:text-slate-800"><ArrowLeft size={22} /></button>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{data.title}{editing && <span className="text-indigo-500 ml-1">(Editing)</span>}</h3>
            <p className="text-xs text-slate-500">{new Date(data.date).toLocaleDateString()} • {fmt(data.duration)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <button onClick={saveEdit} className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl active:scale-95">Save</button>
          ) : (
            <>
              <button onClick={startEdit} className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-2 rounded-xl hover:bg-slate-200"><FileText size={14} className="inline mr-1" />Edit</button>
              <button onClick={() => onContinue(data)} className="bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-xl active:scale-95"><Play size={14} className="inline mr-1" fill="currentColor" />Continue</button>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between text-center">
          <div className="flex-1 border-r border-gray-50"><div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Volume</div><div className="text-lg font-black text-indigo-600 mt-1">{(data.volume / 1000).toFixed(1)}k kg</div></div>
          <div className="flex-1 border-r border-gray-50"><div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Duration</div><div className="text-lg font-black text-slate-800 mt-1">{Math.floor(data.duration / 60)} min</div></div>
          <div className="flex-1"><div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sets</div><div className="text-lg font-black text-slate-800 mt-1">{data.exercises.reduce((a, ex) => a + (ex.setsData?.filter(s => s.completed).length || 0), 0)}</div></div>
        </div>
        {data.exercises.map((ex, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h4 className="text-sm font-bold text-slate-900 mb-3">{ex.name}</h4>
            <div className="flex justify-between text-[10px] font-extrabold text-slate-300 px-2 mb-2 tracking-widest">
              <span>SET</span><span>{ic(ex.name) ? "DIST" : "KG"}</span><span>{ic(ex.name) ? "TIME" : "REPS"}</span>
            </div>
            {(ex.setsData || []).filter(s => editing || s.completed).map((set, si) => (
              <div key={si} className="flex justify-between items-center text-xs py-2.5 px-2 bg-slate-50 rounded-lg mb-1">
                <span className="text-slate-400 font-bold w-6 text-center">{si + 1}</span>
                {editing ? (
                  <>
                    <input type="number" className="w-16 h-7 rounded-lg text-center text-xs font-bold bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={set.weight} onChange={e => updateSet(i, si, 'weight', e.target.value)} />
                    <input type="number" className="w-16 h-7 rounded-lg text-center text-xs font-bold bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={set.reps} onChange={e => updateSet(i, si, 'reps', e.target.value)} />
                  </>
                ) : (
                  <>
                    <span className="font-bold text-slate-800">{set.weight} {ic(ex.name) ? 'km' : 'kg'}</span>
                    <span className="text-slate-600 font-bold">{set.reps}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
        <div className="h-8" />
      </div>
    </div>
  );
};

// ─── WORKOUT CARD ───
const WorkoutCard = ({ session, onStart, history, onShowChart }) => (
  <div className="bg-white rounded-2xl mb-3 overflow-hidden shadow-sm border border-gray-100">
    <div className="flex flex-row">
      <div className="w-1.5 shrink-0" style={{ backgroundColor: sessionColor(session.color) }} />
      <div className="p-4 flex-1 min-w-0">
        <div className="flex justify-between items-start mb-3">
          <div className="min-w-0 flex-1 mr-3">
            <h3 className="text-base font-bold text-slate-800 truncate">{session.title}</h3>
            <p className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wide">{session.exercises.length} exercises</p>
          </div>
          <button className="flex items-center bg-slate-900 px-3.5 py-2 rounded-xl shrink-0 hover:bg-slate-800 transition-colors" onClick={() => onStart(session)}>
            <Play size={12} color="#fff" fill="#fff" /><span className="text-white text-xs font-bold ml-1.5">Start</span>
          </button>
        </div>
        <div className="space-y-2">
          {session.exercises.map((ex, i) => {
            const stats = getExStats(ex.name, history);
            const ss = ex.supersetId;
            const next = session.exercises[i + 1];
            const linked = ss && next?.supersetId === ss;
            return (
              <div key={i} className="relative">
                {linked && <div className="absolute left-[-8px] top-3 bottom-[-12px] w-0.5 bg-indigo-100 rounded-full" />}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2">
                    {ss && <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 px-1 py-0.5 rounded shrink-0">SS</span>}
                    <span className="text-sm text-slate-700 truncate">{ex.name}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded shrink-0">{ex.sets}×{ex.reps}</span>
                </div>
                {stats && !isCardio(ex.name) && (stats.maxW > 0 || stats.max1RM > 0) && (
                  <div className="flex items-center mt-1 gap-2">
                    {stats.maxW > 0 && <span className="flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                      <Trophy size={9} className="mr-0.5" />{stats.maxW}kg
                    </span>}
                    {stats.max1RM > 0 && <span onClick={(e) => { e.stopPropagation(); onShowChart?.(ex.name); }} className="text-[10px] text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-100 cursor-pointer hover:bg-violet-100 flex items-center gap-0.5"><TrendingUp size={9} />1RM: {stats.max1RM}kg</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

// ─── ACTIVE SESSION ───
const ActiveSession = ({ data, onUpdate, onMinimize, onFinish, onDiscard, history, onShowChart }) => {
  const { exercises, title, startTime } = data;
  const [timer, setTimer] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [noteModal, setNoteModal] = useState(null);
  const [restEdit, setRestEdit] = useState(null);
  const [restEndTime, setRestEndTime] = useState(null);
  const [restDisplay, setRestDisplay] = useState(0);
  const [swapIdx, setSwapIdx] = useState(null);

  // Workout timer - survives background/screen-off via Date.now() diff
  useEffect(() => {
    const tick = () => setTimer(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
    tick();
    const iv = setInterval(tick, 1000);
    const handleVis = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', handleVis);
    return () => { clearInterval(iv); document.removeEventListener('visibilitychange', handleVis); };
  }, [startTime]);

  // Rest timer - end-time based so it survives background
  useEffect(() => {
    if (!restEndTime) { setRestDisplay(0); return; }
    const tick = () => {
      const rem = Math.max(0, Math.ceil((restEndTime - Date.now()) / 1000));
      setRestDisplay(rem);
      if (rem <= 0) setRestEndTime(null);
    };
    tick();
    const iv = setInterval(tick, 1000);
    const handleVis = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', handleVis);
    return () => { clearInterval(iv); document.removeEventListener('visibilitychange', handleVis); };
  }, [restEndTime]);

  const upEx = (ne) => onUpdate({ ...data, exercises: ne });
  const toggleSet = (ei, si) => {
    const ne = exercises.map((ex, i) => i !== ei ? ex : { ...ex, setsData: ex.setsData.map((s, j) => j !== si ? s : { ...s, completed: !s.completed }) });
    const set = ne[ei].setsData[si];
    if (set.completed) {
      // Auto-fill next set weight
      const nextSet = ne[ei].setsData[si + 1];
      if (nextSet && !nextSet.weight && set.weight) {
        ne[ei] = { ...ne[ei], setsData: ne[ei].setsData.map((s, j) => j !== si + 1 ? s : { ...s, weight: set.weight }) };
      }
      if (!isCardio(ne[ei].name)) {
        let d = parseRest(ne[ei].rest);
        if (set.type === 'F' || (set.rir !== '' && parseInt(set.rir) <= 1)) d += 30;
        setRestEndTime(Date.now() + d * 1000);
      }
    }
    upEx(ne);
  };
  const updateInput = (ei, si, f, v) => { const ne = [...exercises]; ne[ei] = { ...ne[ei], setsData: ne[ei].setsData.map((s, j) => j !== si ? s : { ...s, [f]: v }) }; upEx(ne); };
  const cycleType = (ei, si) => {
    const types = ['N', 'W', 'D', 'F'];
    const ne = [...exercises];
    const cur = ne[ei].setsData[si].type || 'N';
    ne[ei] = { ...ne[ei], setsData: ne[ei].setsData.map((s, j) => j !== si ? s : { ...s, type: types[(types.indexOf(cur) + 1) % types.length] }) };
    upEx(ne);
  };
  const addSet = (ei) => {
    const ne = [...exercises];
    const lastSet = ne[ei].setsData[ne[ei].setsData.length - 1];
    ne[ei] = { ...ne[ei], setsData: [...ne[ei].setsData, { weight: lastSet?.weight || '', reps: '', completed: false, type: 'N', rir: '' }] };
    upEx(ne);
  };
  const removeSet = (ei, si) => {
    const ne = [...exercises];
    if (ne[ei].setsData.length > 1) { ne[ei] = { ...ne[ei], setsData: ne[ei].setsData.filter((_, j) => j !== si) }; upEx(ne); }
  };
  const addWarmups = (ei) => {
    const ne = [...exercises];
    const wsets = [{ weight: '', reps: '12', completed: false, type: 'W', rir: '' }, { weight: '', reps: '8', completed: false, type: 'W', rir: '' }, { weight: '', reps: '4', completed: false, type: 'W', rir: '' }];
    ne[ei] = { ...ne[ei], setsData: [...wsets, ...ne[ei].setsData] };
    upEx(ne);
  };
  const addExercise = (name, category) => {
    const ic = category === "Cardio";
    upEx([...exercises, { name, category, sets: ic ? 1 : 3, reps: ic ? "30" : "10", rest: "60s", note: "", setsData: Array.from({ length: ic ? 1 : 3 }, () => ({ weight: '', reps: '', completed: false, type: 'N', rir: '' })) }]);
    setShowPicker(false);
  };
  const deleteExercise = (idx) => { upEx(exercises.filter((_, i) => i !== idx)); };
  const saveNote = (text) => { if (noteModal !== null) { const ne = [...exercises]; ne[noteModal] = { ...ne[noteModal], note: text }; upEx(ne); } };
  const saveRest = (nr) => { if (restEdit !== null) { const ne = [...exercises]; ne[restEdit] = { ...ne[restEdit], rest: nr }; upEx(ne); } };
  const swapExercise = (alt) => {
    const ne = [...exercises];
    ne[swapIdx] = { ...ne[swapIdx], name: alt.name, category: alt.category };
    upEx(ne);
    setSwapIdx(null);
  };

  const handleFinish = () => {
    let vol = 0;
    exercises.forEach(ex => {
      if (!isCardio(ex.name)) {
        (ex.setsData || []).forEach(set => {
          if (set.completed && set.type !== 'W') {
            vol += (parseFloat(set.weight) || 0) * parseReps(set.reps);
          }
        });
      }
    });
    onFinish({ title, duration: timer, date: new Date().toISOString(), volume: vol, exercises });
  };

  const typeStyle = (t) => {
    if (t === 'W') return 'bg-amber-100 text-amber-600 border border-amber-200';
    if (t === 'D') return 'bg-blue-100 text-blue-600 border border-blue-200';
    if (t === 'F') return 'bg-red-100 text-red-600 border border-red-200';
    return 'bg-slate-100 text-slate-500 font-bold';
  };

  const isResting = restEndTime !== null && restDisplay > 0;

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col overflow-x-hidden">
      {showPicker && <ExercisePicker onClose={() => setShowPicker(false)} onAdd={addExercise} />}
      {noteModal !== null && <NotesModal initialNote={exercises[noteModal]?.note} onSave={saveNote} onClose={() => setNoteModal(null)} />}
      {restEdit !== null && <RestEditModal currentRest={exercises[restEdit]?.rest} onSave={saveRest} onClose={() => setRestEdit(null)} />}
      {swapIdx !== null && exercises[swapIdx] && <SwapModal exercise={exercises[swapIdx]} onSwap={swapExercise} onClose={() => setSwapIdx(null)} />}

      <div className="px-3 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button onClick={onMinimize} className="p-1.5 text-slate-400 hover:text-slate-800"><ChevronDown size={22} /></button>
          <div><h3 className="text-sm font-bold text-slate-900 truncate">{title}</h3><span className="text-xs font-bold text-indigo-500 font-mono tabular-nums">{fmt(timer)}</span></div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onDiscard} className="p-1.5 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
          <button onClick={handleFinish} className="bg-indigo-600 px-3.5 py-2 rounded-full shadow-lg active:scale-95 transition-transform">
            <span className="text-white text-xs font-bold">FINISH</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 pb-32">
        <div className="flex items-center gap-1.5 px-1 flex-wrap">
          <span className="text-[8px] font-bold text-slate-400 mr-0.5">SET TYPE:</span>
          {[['N', 'Normal', 'bg-slate-100 text-slate-500'], ['W', 'Warmup', 'bg-amber-100 text-amber-600'], ['D', 'Drop', 'bg-blue-100 text-blue-600'], ['F', 'Failure', 'bg-red-100 text-red-600']].map(([k, l, c]) => (
            <span key={k} className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${c}`}>{k}={l}</span>
          ))}
        </div>

        {exercises.map((ex, i) => {
          const stats = getExStats(ex.name, history);
          const ic = isCardio(ex.name);
          return (
            <div key={i} className={`bg-white rounded-2xl p-3 shadow-sm border ${ic ? 'border-orange-100' : 'border-gray-100'} relative overflow-hidden`}>
              <div className="flex justify-between mb-2">
                <div className="min-w-0 flex-1 mr-2">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{ex.name}</h4>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {!ic && <button onClick={() => setRestEdit(i)} className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-500 hover:bg-slate-200">{ex.rest}</button>}
                    {ic && <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-bold">Cardio</span>}
                    {stats?.maxW > 0 && !ic && <span className="flex items-center text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100"><Trophy size={8} className="mr-0.5" />PB: {stats.maxW}kg</span>}
                    {stats?.max1RM > 0 && !ic && <span onClick={() => onShowChart?.(ex.name)} className="text-[9px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-100 cursor-pointer flex items-center gap-0.5"><TrendingUp size={8} />1RM: {stats.max1RM}kg</span>}
                  </div>
                </div>
                <div className="flex gap-0.5 shrink-0">
                  <button onClick={() => setSwapIdx(i)} className="p-1 text-slate-300 hover:text-indigo-500 rounded-lg" title="Swap"><RefreshCw size={15} /></button>
                  <button onClick={() => addWarmups(i)} className="p-1 text-slate-300 hover:text-amber-500 rounded-lg" title="Warmups"><Zap size={15} /></button>
                  <button onClick={() => setNoteModal(i)} className={`p-1 rounded-lg ${ex.note ? 'text-indigo-500 bg-indigo-50' : 'text-slate-300 hover:text-indigo-500'}`}><FileText size={15} /></button>
                  <button onClick={() => deleteExercise(i)} className="p-1 text-slate-300 hover:text-red-500 rounded-lg"><X size={15} /></button>
                </div>
              </div>

              <div className="flex items-center mb-1.5 px-0.5 gap-1">
                <span className="w-8 text-[8px] font-extrabold text-slate-300 text-center">SET</span>
                <span className="flex-1 text-[8px] font-extrabold text-slate-300 text-center">{ic ? "KM" : "KG"}</span>
                <span className="flex-1 text-[8px] font-extrabold text-slate-300 text-center">{ic ? "MIN" : "REPS"}</span>
                {!ic && <span className="w-9 text-[8px] font-extrabold text-slate-300 text-center">RIR</span>}
                <span className="w-9"></span>
              </div>

              {ex.setsData.map((set, si) => {
                return (
                  <div key={si} className="mb-1.5">
                    <div className={`flex items-center gap-1 transition-opacity ${set.completed ? 'opacity-40' : ''}`}>
                      <button onClick={() => cycleType(i, si)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${typeStyle(set.type)}`}>
                        {set.type === 'N' ? si + 1 : set.type}
                      </button>
                      <input type="number" inputMode="decimal" className={`flex-1 h-8 rounded-lg text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${set.completed ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'} border min-w-0`}
                        placeholder={ic ? "km" : "kg"} value={set.weight} onChange={e => updateInput(i, si, 'weight', e.target.value)} />
                      <input type="number" inputMode="decimal" className={`flex-1 h-8 rounded-lg text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${set.completed ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'} border min-w-0`}
                        placeholder={ic ? "min" : "reps"} value={set.reps} onChange={e => updateInput(i, si, 'reps', e.target.value)} />
                      {!ic && <input type="number" inputMode="numeric" className={`w-9 h-8 rounded-lg text-center text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${set.completed ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'} border`}
                        placeholder="rir" value={set.rir || ''} onChange={e => updateInput(i, si, 'rir', e.target.value)} />}
                      <button onClick={() => toggleSet(i, si)}
                        className={`w-9 h-8 rounded-lg flex items-center justify-center shrink-0 ${set.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300 hover:bg-emerald-100 hover:text-emerald-500'}`}>
                        <Check size={15} strokeWidth={3} />
                      </button>
                    </div>
                    {!ic && set.weight && set.reps && !set.completed && (
                      <div className="text-[8px] text-center text-slate-400 font-bold mt-0.5">e1RM: {calc1RM(set.weight, set.reps)}kg</div>
                    )}
                  </div>
                );
              })}

              <button onClick={() => addSet(i)} className="w-full mt-1.5 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center border border-dashed border-slate-200">
                <Plus size={12} className="mr-1" /> Add Set
              </button>
            </div>
          );
        })}

        <button onClick={() => setShowPicker(true)} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-sm hover:border-indigo-400 hover:text-indigo-500 bg-white">
          <Plus size={16} className="mr-2" /> Add Exercise
        </button>
      </div>

      {isResting && (
        <div className="absolute bottom-4 left-3 right-3 bg-indigo-900 p-3.5 z-50 flex items-center justify-between shadow-2xl rounded-2xl border border-indigo-700">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-indigo-300" />
            <div>
              <div className="text-white font-black text-xl leading-none tabular-nums">{fmt(restDisplay)}</div>
              <div className="text-[9px] text-indigo-300 uppercase font-bold tracking-widest mt-0.5">Rest</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setRestEndTime(t => t + 30000)} className="bg-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/10">+30s</button>
            <button onClick={() => setRestEndTime(null)} className="bg-white text-indigo-900 text-xs font-bold px-3.5 py-2 rounded-xl">Skip</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── CHAT BUBBLE ───
const ChatBubble = ({ msg, onAction }) => {
  const isAi = msg.sender === 'ai';
  return (
    <div className={`flex w-full mb-4 ${isAi ? 'justify-start' : 'justify-end'}`}>
      {isAi && <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mr-2 shrink-0"><Bot size={14} color="#fff" /></div>}
      <div className="max-w-[85%]">
        <div className={`px-3.5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
          isAi ? 'bg-white text-slate-700 border border-gray-100 rounded-tl-none' : 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-none'
        }`}>{msg.text}</div>
        {msg.routine && (
          <div className="mt-2 bg-white border border-gray-100 p-3.5 rounded-xl cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all shadow-sm"
            onClick={() => onAction(msg.routine)}>
            <div className="flex items-center mb-1"><Sparkles size={13} className="text-violet-500 mr-1.5" /><span className="font-bold text-slate-800 text-sm">{msg.routine.name}</span></div>
            <p className="text-xs text-slate-500 mb-2.5">{msg.routine.description || msg.routine.type}</p>
            <div className="flex h-1 rounded-full overflow-hidden gap-0.5 bg-gray-100">
              {msg.routine.sessions.map((s, i) => <div key={i} className="flex-1" style={{ backgroundColor: sessionColor(s.color) }} />)}
            </div>
            <div className="text-[10px] text-indigo-500 font-bold mt-2">Tap to view & start →</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MAIN APP ───
export default function App() {
  const [view, setView] = useState('chat');
  const [messages, setMessages] = useState([{ id: 1, sender: 'ai', text: "Hey! I'm your AI training coach. Tell me about your goals, schedule, and experience \u2014 I'll build you a routine.\n\nOr just say \"build me a 5-day PPL\" to jump straight in." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [savedRoutines, setSavedRoutines] = useState([]);
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({ equipment: DEFAULT_EQUIPMENT, enableSupersets: true, restCompound: '180', restIsolation: '60' });
  const [ready, setReady] = useState(false);
  const [chartExercise, setChartExercise] = useState(null);
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState('');
  const scrollRef = useRef(null);
  const cloudSaveTimer = useRef({});

  useEffect(() => {
    (async () => {
      const [r, h, s, d, c] = await Promise.all([
        sGet(SK.routines), sGet(SK.history), sGet(SK.settings), sGet(SK.draft), sGet(SK.chat)
      ]);
      if (r) setSavedRoutines(r);
      if (h) setHistory(h);
      if (s) setSettings(prev => ({ ...prev, ...s, equipment: s.equipment || DEFAULT_EQUIPMENT }));
      if (d) { setActiveWorkout(d); setMinimized(true); }
      if (c?.length) setMessages(c);
      setReady(true);
    })();
  }, []);

  // Cloud sync helper (debounced)
  const cloudSync = (key, data) => {
    if (!user) return;
    clearTimeout(cloudSaveTimer.current[key]);
    cloudSaveTimer.current[key] = setTimeout(() => cloudSaveData(user.uid, key, data), 1500);
  };

  // Auth listener - load cloud data on login
  useEffect(() => {
    if (!ready) return;
    const unsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const [cr, ch, cs] = await Promise.all([
          cloudLoadData(firebaseUser.uid, 'routines'),
          cloudLoadData(firebaseUser.uid, 'history'),
          cloudLoadData(firebaseUser.uid, 'settings'),
        ]);
        if (ch?.length) {
          setHistory(prev => {
            const cloudDates = new Set(ch.map(h => h.date));
            const localOnly = prev.filter(h => !cloudDates.has(h.date));
            const merged = [...ch, ...localOnly];
            sSet(SK.history, merged);
            return merged;
          });
        }
        if (cr?.length) {
          setSavedRoutines(prev => {
            const cloudNames = new Set(cr.map(r => r.name));
            const localOnly = prev.filter(r => !cloudNames.has(r.name));
            const merged = [...cr, ...localOnly];
            sSet(SK.routines, merged);
            return merged;
          });
        }
        if (cs) {
          setSettings(prev => ({ ...prev, ...cs, equipment: cs.equipment || DEFAULT_EQUIPMENT }));
          sSet(SK.settings, cs);
        }
        // Push any local-only data to cloud
        setTimeout(async () => {
          const latestH = await sGet(SK.history);
          const latestR = await sGet(SK.routines);
          const latestS = await sGet(SK.settings);
          if (latestH) cloudSaveData(firebaseUser.uid, 'history', latestH);
          if (latestR) cloudSaveData(firebaseUser.uid, 'routines', latestR);
          if (latestS) cloudSaveData(firebaseUser.uid, 'settings', latestS);
        }, 2000);
      }
    });
    return unsub;
  }, [ready]);

  useEffect(() => { if (ready) { sSet(SK.routines, savedRoutines); cloudSync('routines', savedRoutines); } }, [savedRoutines, ready]);
  useEffect(() => { if (ready) { sSet(SK.history, history); cloudSync('history', history); } }, [history, ready]);
  useEffect(() => { if (ready) { sSet(SK.settings, settings); cloudSync('settings', settings); } }, [settings, ready]);
  useEffect(() => { if (ready) sSet(SK.chat, messages); }, [messages, ready]);
  useEffect(() => { if (ready) { if (activeWorkout) sSet(SK.draft, activeWorkout); else sDel(SK.draft); } }, [activeWorkout, ready]);

  useEffect(() => { setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 50); }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    setInput('');
    const userMsg = { id: Date.now(), sender: 'user', text: txt };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setLoading(true);

    const raw = await callAI(newMsgs, settings);
    const { text, routine, rawText } = parseAIResponse(raw);

    const aiMsg = { id: Date.now() + 1, sender: 'ai', text, routine, rawText };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const startSession = (st) => {
    setActiveWorkout({
      title: st.title, startTime: Date.now(),
      exercises: st.exercises.map(ex => {
        const stats = getExStats(ex.name, history);
        const lastSets = stats?.lastSets || [];
        return {
          ...ex, note: '',
          setsData: Array.from({ length: ex.sets }, (_, idx) => ({
            weight: lastSets[idx]?.weight || lastSets[0]?.weight || '',
            reps: '',
            completed: false,
            type: 'N',
            rir: ''
          }))
        };
      })
    });
    setMinimized(false);
  };

  const startQuick = () => { setActiveWorkout({ title: "Quick Workout", startTime: Date.now(), exercises: [] }); setMinimized(false); };
  const saveRoutine = (r) => { if (!savedRoutines.find(x => x.name === r.name)) setSavedRoutines(p => [...p, r]); };
  const deleteRoutine = (idx) => { setSavedRoutines(p => p.filter((_, i) => i !== idx)); };
  const finishSession = (d) => { setHistory(p => [d, ...p]); setActiveWorkout(null); setMinimized(false); setView('stats'); };
  const discardSession = () => { setActiveWorkout(null); setMinimized(false); };
  const continueWorkout = (w) => {
    setActiveWorkout({ title: w.title, startTime: Date.now(), exercises: w.exercises });
    setMinimized(false);
    setSelectedHistory(null);
  };
  const updateHistoryWorkout = (updated) => {
    setHistory(p => p.map(h => h.date === updated.date ? updated : h));
    setSelectedHistory(updated);
  };

  const handleLogin = async () => {
    try {
      setLoginError('');
      await signInGoogle();
    } catch (e) {
      console.error('Login error:', e);
      const msg = e.code === 'auth/popup-blocked' ? 'Popup blocked. Allow popups for this site.'
        : e.code === 'auth/unauthorized-domain' ? 'Domain not authorized. Add it in Firebase Console > Authentication > Settings > Authorized domains.'
        : e.message || 'Login failed. Ensure Google Auth is enabled in Firebase Console.';
      setLoginError(msg);
    }
  };
  const handleLogout = async () => {
    try { await logOut(); setUser(null); } catch (e) { console.error('Logout error:', e); }
  };

  const exportData = () => {
    const data = { routines: savedRoutines, history, settings, messages, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gymai-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.routines) setSavedRoutines(data.routines);
        if (data.history) setHistory(data.history);
        if (data.settings) setSettings(data.settings);
        if (data.messages) setMessages(data.messages);
      } catch { alert('Invalid backup file'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getCalDays = () => {
    const now = new Date(), y = now.getFullYear(), m = now.getMonth();
    const first = new Date(y, m, 1), last = new Date(y, m + 1, 0);
    const days = [];
    let sd = first.getDay() - 1; if (sd < 0) sd = 6;
    for (let i = 0; i < sd; i++) days.push(null);
    for (let i = 1; i <= last.getDate(); i++) days.push(new Date(y, m, i));
    return days;
  };
  const calDays = getCalDays();
  const dayHasWorkout = (d) => d && history.some(h => h.date && new Date(h.date).toDateString() === d.toDateString());
  const isRoutineSaved = currentRoutine && savedRoutines.some(x => x.name === currentRoutine.name);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-slate-50 border-x border-gray-200 shadow-2xl overflow-hidden relative" style={{ height: '100dvh', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {showSettings && <SettingsModal settings={settings} onSave={setSettings} onClose={() => setShowSettings(false)}
        user={user} onLogin={handleLogin} onLogout={handleLogout} onExport={exportData} onImport={importData} loginError={loginError} />}
      {chartExercise && <ProgressionChart exerciseName={chartExercise} history={history} onClose={() => setChartExercise(null)} />}
      {selectedHistory && <HistoryDetail workout={selectedHistory} onClose={() => setSelectedHistory(null)} onContinue={continueWorkout} onUpdateWorkout={updateHistoryWorkout} />}
      {activeWorkout && !minimized && (
        <ActiveSession data={activeWorkout} onUpdate={setActiveWorkout} onMinimize={() => setMinimized(true)}
          onFinish={finishSession} onDiscard={discardSession} history={history} onShowChart={setChartExercise} />
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-xl rounded-full h-14 px-5 flex items-center justify-between shadow-sm pointer-events-auto border border-gray-100">
          {view === 'routine' ? (
            <button onClick={() => setView('chat')} className="p-1 text-slate-400 hover:text-slate-800"><ArrowLeft size={22} /></button>
          ) : (
            <div className="flex items-center">
              <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center mr-2.5 shadow-md shadow-indigo-200"><Bot size={18} color="#fff" /></div>
              <div><h1 className="text-base font-black text-slate-800 leading-tight">GymAI</h1><p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">Coach</p></div>
            </div>
          )}
          {view === 'routine' && currentRoutine && (
            <button onClick={() => saveRoutine(currentRoutine)} className="p-1">
              <Bookmark size={20} className={isRoutineSaved ? "text-indigo-600" : "text-slate-400"} fill={isRoutineSaved ? "currentColor" : "none"} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative pt-20">
        {/* CHAT */}
        {view === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="px-4 pb-1.5 flex justify-end gap-2">
              {user && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                  <Cloud size={10} />Synced
                </span>
              )}
              <button onClick={() => setShowSettings(true)} className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white border border-slate-100 px-2.5 py-1 rounded-full shadow-sm">
                <Settings size={10} /> Settings
              </button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
              {messages.map((m, i) => (
                <ChatBubble key={m.id || i} msg={m} onAction={(r) => { setCurrentRoutine(r); setView('routine'); }} />
              ))}
              {loading && (
                <div className="flex gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0"><Bot size={14} color="#fff" /></div>
                  <div className="px-4 py-3 bg-white border border-gray-100 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1"><div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} /><div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 pb-20">
              <div className="bg-white p-1.5 rounded-full border border-slate-100 shadow-lg flex items-center gap-1.5">
                <input className="flex-1 bg-transparent h-10 px-3.5 text-sm focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
                  placeholder="Describe your goal..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                <button onClick={handleSend} disabled={loading || !input.trim()}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md disabled:opacity-50 active:scale-95 transition-transform shrink-0">
                  <Send size={16} color="#fff" className="ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ROUTINE */}
        {view === 'routine' && currentRoutine && (
          <div className="h-full overflow-y-auto p-4 pb-28">
            <div className="mb-5 px-1">
              <h2 className="text-xl font-black text-slate-800 mb-1">{currentRoutine.name}</h2>
              <p className="text-sm text-slate-500">{currentRoutine.description}</p>
              {currentRoutine.type && <span className="inline-block text-[10px] font-bold bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-md mt-2">{currentRoutine.type}</span>}
            </div>
            {currentRoutine.sessions?.map((s, i) => <WorkoutCard key={i} session={s} onStart={startSession} history={history} onShowChart={setChartExercise} />)}
          </div>
        )}

        {/* LIBRARY */}
        {view === 'library' && (
          <div className="h-full overflow-y-auto p-4 pb-28">
            <div className="flex justify-between items-center mb-5 px-1">
              <h2 className="text-xl font-black text-slate-800">Library</h2>
              <button onClick={startQuick} className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-indigo-100">
                <Zap size={12} fill="currentColor" /> Quick Start
              </button>
            </div>
            {savedRoutines.length === 0 ? (
              <div className="text-center py-16 opacity-50">
                <Bookmark size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="font-bold text-slate-400 text-sm">No saved routines</p>
                <p className="text-xs text-slate-400 mt-1">Ask the Coach to build one.</p>
              </div>
            ) : savedRoutines.map((r, i) => (
              <div key={i} className="bg-white border border-gray-100 p-4 rounded-2xl mb-3 shadow-sm hover:shadow-md transition-all cursor-pointer relative group"
                onClick={() => { setCurrentRoutine(r); setView('routine'); }}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-800">{r.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{r.sessions?.length || 0} days</span>
                      {r.type && <span className="text-[10px] font-bold bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded">{r.type}</span>}
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deleteRoutine(i); }} className="p-1.5 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STATS */}
        {view === 'stats' && (
          <div className="h-full overflow-y-auto p-4 pb-28">
            <div className="mb-6">
              <h3 className="text-[10px] font-extrabold text-slate-400 mb-3 uppercase tracking-widest px-1">Activity</h3>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="grid grid-cols-7 mb-3">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i} className="text-center text-[10px] font-black text-slate-300">{d}</div>)}</div>
                <div className="grid grid-cols-7 gap-y-3">
                  {calDays.map((d, i) => {
                    if (!d) return <div key={i} />;
                    const active = dayHasWorkout(d);
                    const today = new Date().toDateString() === d.toDateString();
                    return (
                      <div key={i} className="flex justify-center relative">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold
                          ${active ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200' : ''}
                          ${today && !active ? 'bg-slate-100 text-slate-900 ring-1 ring-slate-300' : ''}
                          ${!active && !today ? 'text-slate-400' : ''}`}>
                          {d.getDate()}
                        </div>
                        {active && <div className="absolute -bottom-0.5 w-1 h-1 bg-emerald-400 rounded-full" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <h3 className="text-[10px] font-extrabold text-slate-400 mb-3 uppercase tracking-widest px-1">Recent Workouts</h3>
            {history.length === 0 ? (
              <div className="text-center py-10 opacity-50"><p className="font-bold text-slate-400 text-sm">No workouts yet</p></div>
            ) : history.slice(0, 20).map((h, i) => (
              <div key={i} className="bg-white border border-gray-100 p-4 rounded-2xl mb-2.5 shadow-sm flex justify-between items-center cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedHistory(h)}>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">{h.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(h.date).toLocaleDateString()} • {Math.floor(h.duration / 60)}m</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-indigo-600">{(h.volume / 1000).toFixed(1)}k</span>
                  <span className="block text-[8px] font-bold text-slate-300 uppercase tracking-wider">vol (kg)</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Minimized workout bar */}
      {activeWorkout && minimized && (
        <div className="absolute bottom-20 left-4 right-4 bg-slate-900 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between z-40 cursor-pointer border border-slate-700"
          onClick={() => setMinimized(false)}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
            <div><p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">In Progress</p><p className="text-sm font-bold text-white">{activeWorkout.title}</p></div>
          </div>
          <Maximize2 size={16} className="text-slate-400" />
        </div>
      )}

      {/* Nav */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-safe">
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 flex justify-around py-2 px-4">
          {[
            { id: 'chat', icon: MessageSquare, label: 'Coach' },
            { id: 'library', icon: List, label: 'Library' },
            { id: 'stats', icon: BarChart2, label: 'Stats' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)}
              className={`flex flex-col items-center py-1.5 px-4 rounded-xl transition-all ${view === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
              <tab.icon size={20} strokeWidth={view === tab.id ? 2.5 : 1.5} />
              <span className={`text-[10px] mt-0.5 ${view === tab.id ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
