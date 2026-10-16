import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles, Skull, Sprout, Shield, PawPrint, Leaf, Sun, Trophy,
  Layers, RotateCcw, Play, CheckCircle2, AlertTriangle, Eye,
  HelpCircle, Bot, User, ArrowRight, ShoppingBag
} from 'lucide-react';

// ==========================================
// 1. CORE CARD DATABASE (Advancements & Vales)
// ==========================================

const BASE_CURSED_SLICES = {
  TOP: {
    id: 'base_cursed_top',
    name: 'Cursed Soil',
    tier: 0,
    slot: 'TOP',
    cost: 0,
    printedVP: 0,
    effects: { decay: 1, mana: 1 },
    artTheme: 'cursed',
  },
  MIDDLE: {
    id: 'base_cursed_mid',
    name: 'Blighted Thicket',
    tier: 0,
    slot: 'MIDDLE',
    cost: 0,
    printedVP: 0,
    effects: { decay: 1, mana: 1 },
    artTheme: 'cursed',
  },
  BOTTOM: {
    id: 'base_cursed_bot',
    name: 'Withered Roots',
    tier: 0,
    slot: 'BOTTOM',
    cost: 0,
    printedVP: 0,
    effects: { decay: 1, mana: 1 },
    artTheme: 'cursed',
  },
};

const BASE_FERTILE_SLICES = {
  TOP: {
    id: 'base_fertile_top',
    name: 'Fertile Canopy',
    tier: 0,
    slot: 'TOP',
    cost: 0,
    printedVP: 0,
    effects: { mana: 1 },
    artTheme: 'fertile',
  },
  MIDDLE: {
    id: 'base_fertile_mid',
    name: 'Fertile Meadow',
    tier: 0,
    slot: 'MIDDLE',
    cost: 0,
    printedVP: 0,
    effects: { mana: 1 },
    artTheme: 'fertile',
  },
  BOTTOM: {
    id: 'base_fertile_bot',
    name: 'Fertile Loam',
    tier: 0,
    slot: 'BOTTOM',
    cost: 0,
    printedVP: 0,
    effects: { mana: 1 },
    artTheme: 'fertile',
  },
};

const ADVANCEMENTS_DB = [
  // --- TIER 1 ---
  {
    id: 't1_seedling_top', name: 'Sprouting Canopy', tier: 1, slot: 'TOP', cost: 2, printedVP: 0,
    effects: { mana: 1, spirits: { FLORA: 1 } }, artTheme: 'forest'
  },
  {
    id: 't1_seedling_mid', name: 'Lush Undergrowth', tier: 1, slot: 'MIDDLE', cost: 2, printedVP: 0,
    effects: { mana: 2 }, artTheme: 'fertile'
  },
  {
    id: 't1_seedling_bot', name: 'Deep Taproot', tier: 1, slot: 'BOTTOM', cost: 2, printedVP: 0,
    effects: { growth: 1, mana: 1 }, artTheme: 'forest'
  },
  {
    id: 't1_wolf_top', name: 'Prowling Lynx', tier: 1, slot: 'TOP', cost: 2, printedVP: 0,
    effects: { spirits: { BEAST: 1 }, mana: 1 }, artTheme: 'beast'
  },
  {
    id: 't1_wolf_mid', name: 'Feral Pack', tier: 1, slot: 'MIDDLE', cost: 3, printedVP: 0,
    effects: { decay: 1, mana: 3, spirits: { BEAST: 1 } }, artTheme: 'beast'
  },
  {
    id: 't1_guard_bot', name: 'Warden Outpost', tier: 1, slot: 'BOTTOM', cost: 3, printedVP: 1,
    effects: { spirits: { GUARDIAN: 1 }, mana: 1 }, artTheme: 'guardian'
  },
  {
    id: 't1_sun_top', name: 'Morning Dew', tier: 1, slot: 'TOP', cost: 3, printedVP: 0,
    effects: { growth: 1, spirits: { CELESTIAL: 1 } }, artTheme: 'celestial'
  },
  {
    id: 't1_spring_mid', name: 'Cleansing Brook', tier: 1, slot: 'MIDDLE', cost: 3, printedVP: 1,
    effects: { growth: 1, spirits: { FLORA: 1 } }, artTheme: 'blessed'
  },

  // --- TIER 2 ---
  {
    id: 't2_stag_top', name: 'Golden Stag', tier: 2, slot: 'TOP', cost: 4, printedVP: 1,
    effects: { mana: 2, spirits: { BEAST: 1, FLORA: 1 } }, artTheme: 'beast'
  },
  {
    id: 't2_druid_mid', name: 'Keeper of the Grove', tier: 2, slot: 'MIDDLE', cost: 4, printedVP: 1,
    effects: { growth: 1, mana: 1, specialId: 'mana_per_flora', specialText: '+1 Mana if 3+ Flora' }, artTheme: 'forest'
  },
  {
    id: 't2_sentinel_bot', name: 'Ironbark Sentinel', tier: 2, slot: 'BOTTOM', cost: 5, printedVP: 1,
    effects: { spirits: { GUARDIAN: 2 }, vpToken: 1 }, artTheme: 'guardian'
  },
  {
    id: 't2_eclipse_top', name: 'Solar Alignment', tier: 2, slot: 'TOP', cost: 5, printedVP: 2,
    effects: { spirits: { CELESTIAL: 2 }, mana: 2 }, artTheme: 'celestial'
  },
  {
    id: 't2_berserk_mid', name: 'Raging Ursine', tier: 2, slot: 'MIDDLE', cost: 4, printedVP: 2,
    effects: { decay: 1, mana: 3, vpToken: 1, spirits: { BEAST: 1 } }, artTheme: 'beast'
  },
  {
    id: 't2_sanctuary_bot', name: 'Tranquil Sanctuary', tier: 2, slot: 'BOTTOM', cost: 5, printedVP: 2,
    effects: { growth: 2, spirits: { FLORA: 1 } }, artTheme: 'blessed'
  },
  {
    id: 't2_knight_top', name: 'Emerald Vanguard', tier: 2, slot: 'TOP', cost: 4, printedVP: 1,
    effects: { spirits: { GUARDIAN: 1 }, specialId: 'vp_if_3_guardians', specialText: '+1 VP if 3+ Guardians' }, artTheme: 'guardian'
  },
  {
    id: 't2_bloom_mid', name: 'Radiant Heartwood', tier: 2, slot: 'MIDDLE', cost: 5, printedVP: 1,
    effects: { mana: 3, spirits: { FLORA: 1 } }, artTheme: 'fertile'
  },

  // --- TIER 3 ---
  {
    id: 't3_worldtree_top', name: 'Worldtree Crown', tier: 3, slot: 'TOP', cost: 7, printedVP: 3,
    effects: { growth: 2, mana: 2, vpToken: 1, spirits: { FLORA: 2 } }, artTheme: 'blessed'
  },
  {
    id: 't3_behemoth_mid', name: 'Ancient Behemoth', tier: 3, slot: 'MIDDLE', cost: 6, printedVP: 4,
    effects: { decay: 1, mana: 4, vpToken: 2, spirits: { BEAST: 2 } }, artTheme: 'beast'
  },
  {
    id: 't3_citadel_bot', name: 'Sunstone Citadel', tier: 3, slot: 'BOTTOM', cost: 7, printedVP: 3,
    effects: { spirits: { GUARDIAN: 2, CELESTIAL: 1 }, specialId: 'vp_per_2_guardian', specialText: '+1 VP per 2 Guardians' }, artTheme: 'guardian'
  },
  {
    id: 't3_cosmos_top', name: 'Astral Convergence', tier: 3, slot: 'TOP', cost: 8, printedVP: 4,
    effects: { mana: 3, vpToken: 2, spirits: { CELESTIAL: 2 } }, artTheme: 'celestial'
  },
  {
    id: 't3_archdruid_mid', name: 'Avatar of Nature', tier: 3, slot: 'MIDDLE', cost: 8, printedVP: 3,
    effects: { growth: 1, vpToken: 1, specialId: 'vp_full_card', specialText: '+2 VP if 3 slices on card' }, artTheme: 'forest'
  },
  {
    id: 't3_wellspring_bot', name: 'Eternal Wellspring', tier: 3, slot: 'BOTTOM', cost: 6, printedVP: 2,
    effects: { mana: 4, growth: 1, spirits: { FLORA: 1 } }, artTheme: 'fertile'
  },
];

const VALES_DB = [
  {
    id: 'vale_whispering_glade', name: 'Whispering Glade', tier: 1,
    cost: { FLORA: 2, CELESTIAL: 1 }, printedVP: 2,
    harvestEffect: { mana: 1 }, description: '+1 Mana every Harvest'
  },
  {
    id: 'vale_watchtower', name: 'Border Watchtower', tier: 1,
    cost: { GUARDIAN: 2, BEAST: 1 }, printedVP: 2,
    harvestEffect: { growth: 1 }, description: '+1 Growth every turn'
  },
  {
    id: 'vale_hunting_grounds', name: 'Lush Hunting Grounds', tier: 1,
    cost: { BEAST: 2, FLORA: 1 }, printedVP: 3,
    harvestEffect: {}, description: 'Worth 3 End-Game VP'
  },
  {
    id: 'vale_starlit_pond', name: 'Starlit Pond', tier: 1,
    cost: { CELESTIAL: 2, GUARDIAN: 1 }, printedVP: 1,
    harvestEffect: { vpToken: 1 }, description: '+1 VP Token every Harvest'
  },
  {
    id: 'vale_fertility_shrine', name: 'Shrine of Plenty', tier: 1,
    cost: { FLORA: 3 }, printedVP: 2,
    harvestEffect: { mana: 1 }, description: '+1 Mana every Harvest'
  },
  {
    id: 'vale_sacred_summit', name: 'Sacred Summit', tier: 2,
    cost: { CELESTIAL: 3, GUARDIAN: 2 }, printedVP: 4,
    harvestEffect: { vpToken: 1, mana: 1 }, description: '+1 Mana & +1 VP Token each Harvest'
  },
  {
    id: 'vale_primal_heart', name: 'Primal Heartlands', tier: 2,
    cost: { BEAST: 3, FLORA: 2 }, printedVP: 4,
    harvestEffect: { vpToken: 1, growth: 1 }, description: '+1 Growth & +1 VP Token each Harvest'
  },
  {
    id: 'vale_bastion_of_light', name: 'Bastion of Light', tier: 2,
    cost: { GUARDIAN: 4, CELESTIAL: 1 }, printedVP: 5,
    harvestEffect: { vpToken: 1 }, description: '+1 VP Token each Harvest'
  },
  {
    id: 'vale_harmony_nexus', name: 'Nexus of Harmony', tier: 2,
    cost: { FLORA: 2, BEAST: 2, GUARDIAN: 1, CELESTIAL: 1 }, printedVP: 6,
    harvestEffect: { mana: 2 }, description: '+2 Mana every Harvest'
  },
];

// ==========================================
// 2. HELPER FUNCTIONS & DECK CREATION
// ==========================================

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Standard 20-card Mystic Vale starting deck:
// 9 Cursed Lands (3 Top, 3 Mid, 3 Bot), 3 Fertile Soils (1 Top, 1 Mid, 1 Bot), 8 Blank Cards
function createStartingDeck(playerPrefix) {
  const cards = [];
  let idx = 1;
  const positions = ['TOP', 'MIDDLE', 'BOTTOM'];

  // 9 Cursed Lands
  for (const pos of positions) {
    for (let i = 0; i < 3; i++) {
      cards.push({
        sleeveId: `${playerPrefix}_c_${idx++}`,
        baseSlot: pos,
        slots: {
          TOP: pos === 'TOP' ? BASE_CURSED_SLICES.TOP : null,
          MIDDLE: pos === 'MIDDLE' ? BASE_CURSED_SLICES.MIDDLE : null,
          BOTTOM: pos === 'BOTTOM' ? BASE_CURSED_SLICES.BOTTOM : null,
        }
      });
    }
  }

  // 3 Fertile Soils
  for (const pos of positions) {
    cards.push({
      sleeveId: `${playerPrefix}_c_${idx++}`,
      baseSlot: pos,
      slots: {
        TOP: pos === 'TOP' ? BASE_FERTILE_SLICES.TOP : null,
        MIDDLE: pos === 'MIDDLE' ? BASE_FERTILE_SLICES.MIDDLE : null,
        BOTTOM: pos === 'BOTTOM' ? BASE_FERTILE_SLICES.BOTTOM : null,
      }
    });
  }

  // 8 Completely Blank Cards
  for (let i = 0; i < 8; i++) {
    cards.push({
      sleeveId: `${playerPrefix}_c_${idx++}`,
      baseSlot: null,
      slots: { TOP: null, MIDDLE: null, BOTTOM: null }
    });
  }

  return shuffle(cards);
}

// ==========================================
// 3. FIELD & RESOURCE CALCULATION ENGINE
// ==========================================

function calculatePlayerTally(field, onDeck, vales, includeOnDeckForDecay = true) {
  let mana = 0;
  let decay = 0;
  let growth = 0;
  let vpTokensThisHarvest = 0;
  const spirits = {
    GUARDIAN: 0,
    BEAST: 0,
    FLORA: 0,
    CELESTIAL: 0,
  };

  const positions = ['TOP', 'MIDDLE', 'BOTTOM'];
  for (const card of field) {
    for (const pos of positions) {
      const slice = card.slots[pos];
      if (!slice) continue;
      mana += slice.effects.mana || 0;
      decay += slice.effects.decay || 0;
      growth += slice.effects.growth || 0;
      vpTokensThisHarvest += slice.effects.vpToken || 0;
      if (slice.effects.spirits) {
        for (const [sp, count] of Object.entries(slice.effects.spirits)) {
          spirits[sp] += count || 0;
        }
      }
    }
  }

  // On-Deck card contributes its Decay & Growth to the Spoil check
  if (includeOnDeckForDecay && onDeck) {
    for (const pos of positions) {
      const slice = onDeck.slots[pos];
      if (!slice) continue;
      decay += slice.effects.decay || 0;
      growth += slice.effects.growth || 0;
    }
  }

  // Apply Vale continuous/harvest bonuses
  for (const vale of vales) {
    mana += vale.harvestEffect.mana || 0;
    growth += vale.harvestEffect.growth || 0;
    vpTokensThisHarvest += vale.harvestEffect.vpToken || 0;
  }

  // Evaluate Special Synergies in Field
  for (const card of field) {
    for (const pos of positions) {
      const slice = card.slots[pos];
      if (!slice?.effects?.specialId) continue;

      if (slice.effects.specialId === 'mana_per_flora' && spirits.FLORA >= 3) {
        mana += 1;
      }
      if (slice.effects.specialId === 'vp_if_3_guardians' && spirits.GUARDIAN >= 3) {
        vpTokensThisHarvest += 1;
      }
      if (slice.effects.specialId === 'vp_per_2_guardian') {
        vpTokensThisHarvest += Math.floor(spirits.GUARDIAN / 2);
      }
      if (slice.effects.specialId === 'vp_full_card') {
        if (card.slots.TOP && card.slots.MIDDLE && card.slots.BOTTOM) {
          vpTokensThisHarvest += 2;
        }
      }
    }
  }

  const netDecay = Math.max(0, decay - growth);
  const isSpoiled = netDecay >= 4;

  return {
    mana,
    decay,
    growth,
    netDecay,
    vpTokensThisHarvest,
    spirits,
    isSpoiled,
  };
}

function calculateTotalEndGameVP(player) {
  let total = player.vpTokens;
  const allCards = [
    ...player.deck,
    ...player.field,
    ...player.discard,
    ...(player.onDeck ? [player.onDeck] : []),
  ];
  const positions = ['TOP', 'MIDDLE', 'BOTTOM'];
  for (const card of allCards) {
    for (const pos of positions) {
      total += card.slots[pos]?.printedVP || 0;
    }
  }
  for (const vale of player.vales) {
    total += vale.printedVP;
  }
  return total;
}

function drawSingleCard(player) {
  let deck = [...player.deck];
  let discard = [...player.discard];

  if (deck.length === 0 && discard.length > 0) {
    deck = shuffle(discard);
    discard = [];
  }

  const nextCard = deck.shift() || null;
  return {
    ...player,
    deck,
    discard,
    onDeck: nextCard,
  };
}

function setupInitialPlanting(player) {
  let p = {
    ...player,
    field: [],
    hasSpoiled: false,
    advancementsBoughtThisTurn: 0,
    valesBoughtThisTurn: 0,
    spentManaThisTurn: 0,
    spentSpiritsThisTurn: {},
  };

  if (!p.onDeck) {
    p = drawSingleCard(p);
  }

  let safetyCounter = 0;
  while (safetyCounter < 20) {
    safetyCounter++;
    const tally = calculatePlayerTally(p.field, p.onDeck, p.vales, true);
    if (tally.netDecay >= 3 || !p.onDeck) {
      break;
    }
    p.field = [...p.field, p.onDeck];
    p.onDeck = null;
    p = drawSingleCard(p);
  }

  return p;
}

// ==========================================
// 4. VISUAL SUB-COMPONENTS
// ==========================================

const SpiritBadge = ({ type, count = 1, size = 'sm' }) => {
  const config = {
    GUARDIAN: { icon: <Shield className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />, bg: 'bg-slate-600 border-slate-400 text-slate-100', label: 'Guardian' },
    BEAST: { icon: <PawPrint className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />, bg: 'bg-amber-700 border-amber-500 text-amber-100', label: 'Beast' },
    FLORA: { icon: <Leaf className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />, bg: 'bg-emerald-700 border-emerald-400 text-emerald-100', label: 'Flora' },
    CELESTIAL: { icon: <Sun className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />, bg: 'bg-indigo-700 border-indigo-400 text-amber-200', label: 'Celestial' },
  };
  const c = config[type];
  return (
    <span title={`${c.label} Spirit`} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border text-[10px] font-bold shadow-sm ${c.bg}`}>
      {c.icon}
      {count > 1 && <span>{count}</span>}
    </span>
  );
};

const SliceRenderer = ({ slice, pos, isBase, isPreviewHighlight, previewSlice }) => {
  const activeSlice = previewSlice || slice;

  const themeClasses = {
    cursed: 'from-rose-950/90 via-stone-900/90 to-red-950/90 border-red-800/60',
    fertile: 'from-amber-900/80 via-yellow-900/75 to-emerald-950/85 border-amber-500/50',
    forest: 'from-emerald-900/90 via-teal-950/85 to-green-950/90 border-emerald-500/60',
    beast: 'from-orange-950/90 via-amber-950/85 to-stone-900/90 border-amber-600/60',
    guardian: 'from-slate-800/90 via-slate-900/90 to-zinc-900/90 border-slate-400/60',
    celestial: 'from-indigo-950/90 via-purple-950/85 to-slate-950/90 border-indigo-400/60',
    blessed: 'from-teal-900/90 via-emerald-900/85 to-cyan-950/90 border-teal-300/70',
  };

  const themeImages = {
    cursed: `${import.meta.env.BASE_URL}art/cursed.jpg`,
    fertile: `${import.meta.env.BASE_URL}art/fertile.jpg`,
    forest: `${import.meta.env.BASE_URL}art/forest.jpg`,
    beast: `${import.meta.env.BASE_URL}art/beast.jpg`,
    guardian: `${import.meta.env.BASE_URL}art/guardian.jpg`,
    celestial: `${import.meta.env.BASE_URL}art/celestial.jpg`,
    blessed: `${import.meta.env.BASE_URL}art/fertile.jpg`,
  };

  const posLabel = pos === 'TOP' ? 'T' : pos === 'MIDDLE' ? 'M' : 'B';

  if (!activeSlice) {
    return (
      <div
        className={`h-full w-full flex items-center justify-between px-2 border-b last:border-b-0 transition-all ${
          isPreviewHighlight
            ? 'bg-emerald-500/30 border-2 border-dashed border-emerald-300 animate-pulse'
            : 'bg-stone-950/35 border-stone-800/60'
        }`}
      >
        <span className="text-[9px] font-mono text-stone-600 uppercase">{pos} SLOT</span>
        {isPreviewHighlight && (
          <span className="text-[10px] font-bold text-emerald-300">Tap to Sleeve</span>
        )}
      </div>
    );
  }

  const eff = activeSlice.effects;

  return (
    <div
      className={`relative h-full w-full px-2 py-1.5 flex flex-col justify-between border-b last:border-b-0 bg-gradient-to-r transition-all select-none overflow-hidden ${
        themeClasses[activeSlice.artTheme] || themeClasses.forest
      } ${previewSlice ? 'ring-2 ring-emerald-400 brightness-125' : ''}`}
    >
      {/* THEMATIC CARD ARTWORK WATERMARK */}
      {themeImages[activeSlice.artTheme] && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src={themeImages[activeSlice.artTheme]}
            alt=""
            className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-stone-950/75 pointer-events-none" />
        </div>
      )}

      <div className="flex items-center justify-between gap-1 z-10 relative">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[8px] font-mono px-1 rounded bg-black/40 text-stone-300">
            {posLabel}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-stone-100 truncate">
            {activeSlice.name}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isBase && (
            <span className="text-[8px] px-1 py-0.2 rounded bg-stone-800/90 border border-stone-600 text-stone-300 font-semibold">
              BASE
            </span>
          )}
          {activeSlice.printedVP > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-amber-300 bg-black/50 px-1.5 rounded-full border border-amber-500/40">
              <Trophy className="w-2.5 h-2.5" />
              {activeSlice.printedVP}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-1 z-10 mt-auto">
        <div className="flex items-center flex-wrap gap-1">
          {eff.mana > 0 && (
            <span title={`${eff.mana} Mana`} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-sky-600/90 border border-sky-300 text-white text-[10px] font-bold shadow">
              <Sparkles className="w-2.5 h-2.5" />
              {eff.mana}
            </span>
          )}
          {eff.decay > 0 && (
            <span title={`${eff.decay} Decay (Spoil Risk)`} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-700/90 border border-red-400 text-white text-[10px] font-bold shadow">
              <Skull className="w-2.5 h-2.5" />
              {eff.decay}
            </span>
          )}
          {eff.growth > 0 && (
            <span title={`+${eff.growth} Growth (Cancels Decay)`} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-600/90 border border-emerald-300 text-white text-[10px] font-bold shadow">
              <Sprout className="w-2.5 h-2.5" />
              {eff.growth}
            </span>
          )}
          {eff.vpToken > 0 && (
            <span title={`Gain ${eff.vpToken} VP Token on Harvest`} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-700/90 border border-purple-300 text-amber-200 text-[10px] font-bold shadow">
              <Trophy className="w-2.5 h-2.5" />+{eff.vpToken}
            </span>
          )}
          {eff.spirits &&
            Object.entries(eff.spirits).map(([sp, cnt]) =>
              cnt ? <SpiritBadge key={sp} type={sp} count={cnt} /> : null
            )}
        </div>

        {eff.specialText && (
          <span
            className="text-[9px] leading-tight text-amber-200/95 bg-black/60 px-1.5 py-0.5 rounded border border-amber-500/30 truncate max-w-full"
            title={eff.specialText}
          >
            {eff.specialText}
          </span>
        )}
      </div>
    </div>
  );
};

const CardSleeveView = ({
  sleeve,
  selectedAdvancement,
  onSleeveClick,
  badgeText,
  compact = false,
  animationClass = '',
  animationDelayMs = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isSleevingMode = Boolean(selectedAdvancement);
  const canAcceptSelected =
    isSleevingMode &&
    sleeve.slots[selectedAdvancement.slot] === null &&
    sleeve.baseSlot !== selectedAdvancement.slot;

  const cardStateStyle = isSleevingMode
    ? canAcceptSelected
      ? 'glow-outline-affordable cursor-pointer hover:scale-105 bg-emerald-950/40'
      : 'opacity-35 grayscale filter border-stone-800 bg-stone-950/60 cursor-not-allowed'
    : 'border-stone-700/80 hover:border-stone-600';

  return (
    <div
      style={animationDelayMs ? { animationDelay: `${animationDelayMs}ms`, animationFillMode: 'both' } : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (canAcceptSelected && onSleeveClick) {
          onSleeveClick(sleeve.sleeveId);
        }
      }}
      className={`relative rounded-xl border-2 overflow-hidden flex flex-col bg-stone-900/95 shadow-lg transition-all ${
        compact
          ? 'w-[140px] h-[190px] sm:w-[155px] sm:h-[210px]'
          : 'w-full max-w-[185px] h-[215px] sm:h-[240px]'
      } ${cardStateStyle} ${animationClass}`}
    >
      {badgeText && (
        <div className="absolute top-1 right-1 z-20 px-1.5 py-0.5 rounded bg-black/75 border border-stone-600 text-[9px] font-bold text-amber-300">
          {badgeText}
        </div>
      )}

      {['TOP', 'MIDDLE', 'BOTTOM'].map((pos) => {
        const isTargetSlot = Boolean(canAcceptSelected && selectedAdvancement?.slot === pos);
        return (
          <div key={pos} className="h-1/3 w-full">
            <SliceRenderer
              pos={pos}
              slice={sleeve.slots[pos]}
              isBase={sleeve.baseSlot === pos}
              isPreviewHighlight={isTargetSlot}
              previewSlice={isTargetSlot && isHovered ? selectedAdvancement : null}
            />
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// 5. MAIN APPLICATION COMPONENT
// ==========================================

export default function App() {
  const [aiDifficulty, setAiDifficulty] = useState('ADEPT');
  const [mobileViewMode, setMobileViewMode] = useState('FIELD');
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const [lastPushedCardId, setLastPushedCardId] = useState(null);
  const [onDeckAnimKey, setOnDeckAnimKey] = useState(0);
  const [dealBatchId, setDealBatchId] = useState(1);
  const [deckShuffledBanner, setDeckShuffledBanner] = useState(false);

  const [vpPool, setVpPool] = useState(25);
  const [tier1Deck, setTier1Deck] = useState([]);
  const [tier2Deck, setTier2Deck] = useState([]);
  const [tier3Deck, setTier3Deck] = useState([]);
  const [marketAdvancements, setMarketAdvancements] = useState({
    tier1: [],
    tier2: [],
    tier3: [],
  });

  const [valeDeck, setValeDeck] = useState([]);
  const [marketVales, setMarketVales] = useState([]);

  const [players, setPlayers] = useState([]);
  const [activePlayerIdx, setActivePlayerIdx] = useState(0);
  const [phase, setPhase] = useState('PLANTING');
  const [turnNumber, setTurnNumber] = useState(1);
  const [selectedAdvancement, setSelectedAdvancement] = useState(null);
  const [gameLogs, setGameLogs] = useState([]);

  const addLog = (msg) => {
    setGameLogs((prev) => [msg, ...prev.slice(0, 24)]);
  };

  const startNewGame = (chosenDifficulty = aiDifficulty) => {
    const t1 = shuffle(
      ADVANCEMENTS_DB.filter((a) => a.tier === 1).flatMap((a, i) => [
        { ...a, id: `${a.id}_a_${i}` },
        { ...a, id: `${a.id}_b_${i}` },
      ])
    );
    const t2 = shuffle(
      ADVANCEMENTS_DB.filter((a) => a.tier === 2).flatMap((a, i) => [
        { ...a, id: `${a.id}_a_${i}` },
        { ...a, id: `${a.id}_b_${i}` },
      ])
    );
    const t3 = shuffle(
      ADVANCEMENTS_DB.filter((a) => a.tier === 3).flatMap((a, i) => [
        { ...a, id: `${a.id}_a_${i}` },
        { ...a, id: `${a.id}_b_${i}` },
      ])
    );

    const vDeck = shuffle([...VALES_DB]);

    const humanRaw = {
      id: 'human',
      name: 'You (Druid)',
      isAI: false,
      deck: createStartingDeck('p1'),
      field: [],
      onDeck: null,
      discard: [],
      vales: [],
      vpTokens: 0,
      manaTokenAvailable: true,
      hasSpoiled: false,
      advancementsBoughtThisTurn: 0,
      valesBoughtThisTurn: 0,
      spentManaThisTurn: 0,
      spentSpiritsThisTurn: {},
    };

    const aiNames = {
      NOVICE: 'Bramble Bot (Novice)',
      ADEPT: 'Sylvan Keeper (Adept)',
      ARCHDRUID: 'Elder Oak (Archdruid)',
    };

    const aiRaw = {
      id: 'ai_1',
      name: aiNames[chosenDifficulty],
      isAI: true,
      aiLevel: chosenDifficulty,
      deck: createStartingDeck('ai1'),
      field: [],
      onDeck: null,
      discard: [],
      vales: [],
      vpTokens: 0,
      manaTokenAvailable: true,
      hasSpoiled: false,
      advancementsBoughtThisTurn: 0,
      valesBoughtThisTurn: 0,
      spentManaThisTurn: 0,
      spentSpiritsThisTurn: {},
    };

    const humanPrepared = setupInitialPlanting(humanRaw);
    const aiPrepared = setupInitialPlanting(aiRaw);

    setMarketAdvancements({
      tier1: t1.slice(0, 3),
      tier2: t2.slice(0, 3),
      tier3: t3.slice(0, 3),
    });
    setTier1Deck(t1.slice(3));
    setTier2Deck(t2.slice(3));
    setTier3Deck(t3.slice(3));

    setMarketVales(vDeck.slice(0, 4));
    setValeDeck(vDeck.slice(4));

    setVpPool(25);
    setPlayers([humanPrepared, aiPrepared]);
    setActivePlayerIdx(0);
    setPhase('PLANTING');
    setTurnNumber(1);
    setSelectedAdvancement(null);
    setLastPushedCardId(null);
    setDealBatchId((b) => b + 1);
    setOnDeckAnimKey((k) => k + 1);
    setGameLogs([
      `Welcome to Mystic Valley! Facing ${aiNames[chosenDifficulty]}.`,
      `Turn 1: Cards planted into your Field until Decay reached threshold. Push your luck or Harvest!`,
    ]);
  };

  // Restore game state from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mystic_valley_game_save_v1');
      if (saved) {
        const data = JSON.parse(saved);
        if (data && data.players && data.players.length === 2 && data.marketAdvancements) {
          setPlayers(data.players);
          setActivePlayerIdx(data.activePlayerIdx ?? 0);
          setPhase(data.phase ?? 'PLANTING');
          setTurnNumber(data.turnNumber ?? 1);
          setVpPool(data.vpPool ?? 25);
          setTier1Deck(data.tier1Deck ?? []);
          setTier2Deck(data.tier2Deck ?? []);
          setTier3Deck(data.tier3Deck ?? []);
          setMarketAdvancements(data.marketAdvancements);
          setValeDeck(data.valeDeck ?? []);
          setMarketVales(data.marketVales ?? []);
          setAiDifficulty(data.aiDifficulty ?? 'ADEPT');
          setDealBatchId((b) => b + 1);
          setOnDeckAnimKey((k) => k + 1);
          setGameLogs([
            `Resumed in-progress match (Turn ${data.turnNumber ?? 1})! State restored.`,
            ...(data.gameLogs ?? []).slice(0, 15),
          ]);
          setIsLoaded(true);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not restore game save:', e);
    }
    startNewGame('ADEPT');
    setIsLoaded(true);
  }, []);

  // Auto-save game state to localStorage after each action
  useEffect(() => {
    if (!isLoaded || !players || players.length === 0) return;
    try {
      const stateToSave = {
        players,
        activePlayerIdx,
        phase,
        turnNumber,
        vpPool,
        tier1Deck,
        tier2Deck,
        tier3Deck,
        marketAdvancements,
        valeDeck,
        marketVales,
        aiDifficulty,
        gameLogs: gameLogs.slice(0, 20),
      };
      localStorage.setItem('mystic_valley_game_save_v1', JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to auto-save game:', e);
    }
  }, [
    isLoaded,
    players,
    activePlayerIdx,
    phase,
    turnNumber,
    vpPool,
    tier1Deck,
    tier2Deck,
    tier3Deck,
    marketAdvancements,
    valeDeck,
    marketVales,
    aiDifficulty,
    gameLogs,
  ]);

  const humanPlayer = players[0];
  const aiPlayer = players[1];

  const humanTally = useMemo(() => {
    if (!humanPlayer) return null;
    return calculatePlayerTally(
      humanPlayer.field,
      humanPlayer.onDeck,
      humanPlayer.vales,
      phase === 'PLANTING'
    );
  }, [humanPlayer, phase]);

  const availableMana = useMemo(() => {
    if (!humanPlayer || !humanTally) return 0;
    return Math.max(0, humanTally.mana - humanPlayer.spentManaThisTurn);
  }, [humanPlayer, humanTally]);

  const availableSpirits = useMemo(() => {
    const res = { GUARDIAN: 0, BEAST: 0, FLORA: 0, CELESTIAL: 0 };
    if (!humanPlayer || !humanTally) return res;
    for (const sp of ['GUARDIAN', 'BEAST', 'FLORA', 'CELESTIAL']) {
      res[sp] = Math.max(0, humanTally.spirits[sp] - (humanPlayer.spentSpiritsThisTurn[sp] || 0));
    }
    return res;
  }, [humanPlayer, humanTally]);

  // Count how many Cursed Land base cards are currently in the human player's discard pile
  const cursedInDiscardCount = useMemo(() => {
    if (!humanPlayer) return 0;
    return humanPlayer.discard.filter((card) =>
      ['TOP', 'MIDDLE', 'BOTTOM'].some((pos) =>
        card.slots[pos]?.id?.startsWith('base_cursed_')
      )
    ).length;
  }, [humanPlayer]);

  const handlePushCard = () => {
    if (phase !== 'PLANTING' || activePlayerIdx !== 0 || !humanPlayer) return;
    if (!humanPlayer.onDeck) {
      addLog('No more cards left in your deck or discard to push!');
      return;
    }

    const pushedId = humanPlayer.onDeck.sleeveId;
    const willReshuffle = humanPlayer.deck.length === 0 && humanPlayer.discard.length > 0;

    let updated = {
      ...humanPlayer,
      field: [...humanPlayer.field, humanPlayer.onDeck],
      onDeck: null,
    };
    updated = drawSingleCard(updated);

    setLastPushedCardId(pushedId);
    setOnDeckAnimKey((k) => k + 1);

    if (willReshuffle) {
      setDeckShuffledBanner(true);
      setTimeout(() => setDeckShuffledBanner(false), 1800);
      addLog('Your Draw Deck was empty — reshuffled your Discard Pile into a new Deck!');
    }

    const tally = calculatePlayerTally(updated.field, updated.onDeck, updated.vales, true);

    if (tally.isSpoiled) {
      updated.hasSpoiled = true;
      updated.manaTokenAvailable = true;
      addLog(`SPOILED! Your Decay reached ${tally.netDecay} (4+ limit). Your Mana Token flipped face-up (+1 Mana for a future turn).`);
    } else {
      addLog(`Pushed! Field + On-Deck Net Decay is now ${tally.netDecay}/3.`);
    }

    setPlayers([updated, aiPlayer]);
  };

  const handleEnterHarvest = () => {
    if (phase !== 'PLANTING' || activePlayerIdx !== 0 || !humanPlayer) return;

    const harvestTally = calculatePlayerTally(humanPlayer.field, humanPlayer.onDeck, humanPlayer.vales, false);
    const vpEarned = harvestTally.vpTokensThisHarvest;

    const updatedHuman = {
      ...humanPlayer,
      vpTokens: humanPlayer.vpTokens + vpEarned,
    };
    const newPool = Math.max(0, vpPool - vpEarned);

    setVpPool(newPool);
    setPlayers([updatedHuman, aiPlayer]);
    setPhase('HARVEST');

    if (vpEarned > 0) {
      addLog(`Entered Harvest Phase! Gained +${vpEarned} VP Token(s) from your Field abilities.`);
    } else {
      addLog(`Entered Harvest Phase with ${harvestTally.mana} Mana to spend.`);
    }
  };

  const handleUseManaToken = () => {
    if (phase !== 'HARVEST' || !humanPlayer?.manaTokenAvailable) return;
    const updatedHuman = {
      ...humanPlayer,
      manaTokenAvailable: false,
      spentManaThisTurn: humanPlayer.spentManaThisTurn - 1,
    };
    setPlayers([updatedHuman, aiPlayer]);
    addLog('Used your Bonus Mana Token for +1 Mana this turn!');
  };

  const handleSelectMarketAdvancement = (slice, tierKey) => {
    if (phase !== 'HARVEST' || activePlayerIdx !== 0) {
      addLog('Switch to Harvest phase first to purchase Advancements!');
      return;
    }
    if (humanPlayer.advancementsBoughtThisTurn >= 2) {
      addLog('You have already purchased the maximum of 2 Advancements this turn.');
      return;
    }
    if (availableMana < slice.cost) {
      addLog(`Not enough Mana! Need ${slice.cost} Mana, have ${availableMana}.`);
      return;
    }

    const hasValidSlot = humanPlayer.field.some(
      (c) => c.slots[slice.slot] === null && c.baseSlot !== slice.slot
    );
    if (!hasValidSlot) {
      addLog(`No card in your current Field has an empty ${slice.slot} slot!`);
      return;
    }

    if (selectedAdvancement?.slice.id === slice.id) {
      setSelectedAdvancement(null);
    } else {
      setSelectedAdvancement({ slice, tierKey });
      if (mobileViewMode === 'MARKET') {
        setMobileViewMode('FIELD');
      }
    }
  };

  const handleSleeveCardInField = (sleeveId) => {
    if (!selectedAdvancement || phase !== 'HARVEST') return;
    const { slice, tierKey } = selectedAdvancement;

    const updatedField = humanPlayer.field.map((card) => {
      if (card.sleeveId !== sleeveId) return card;
      return {
        ...card,
        slots: {
          ...card.slots,
          [slice.slot]: slice,
        },
      };
    });

    const newlyAddedMana = slice.effects.mana || 0;
    const newlyAddedSpirits = {};
    if (slice.effects.spirits) {
      for (const [k, v] of Object.entries(slice.effects.spirits)) {
        newlyAddedSpirits[k] = (humanPlayer.spentSpiritsThisTurn[k] || 0) + (v || 0);
      }
    }

    const updatedHuman = {
      ...humanPlayer,
      field: updatedField,
      advancementsBoughtThisTurn: humanPlayer.advancementsBoughtThisTurn + 1,
      spentManaThisTurn: humanPlayer.spentManaThisTurn + slice.cost + newlyAddedMana,
      spentSpiritsThisTurn: {
        ...humanPlayer.spentSpiritsThisTurn,
        ...newlyAddedSpirits,
      },
    };

    const currentRow = marketAdvancements[tierKey].filter((a) => a.id !== slice.id);
    if (tierKey === 'tier1' && tier1Deck.length > 0) {
      currentRow.push(tier1Deck[0]);
      setTier1Deck(tier1Deck.slice(1));
    } else if (tierKey === 'tier2' && tier2Deck.length > 0) {
      currentRow.push(tier2Deck[0]);
      setTier2Deck(tier2Deck.slice(1));
    } else if (tierKey === 'tier3' && tier3Deck.length > 0) {
      currentRow.push(tier3Deck[0]);
      setTier3Deck(tier3Deck.slice(1));
    }

    setMarketAdvancements({
      ...marketAdvancements,
      [tierKey]: currentRow,
    });

    setPlayers([updatedHuman, aiPlayer]);
    setSelectedAdvancement(null);
    addLog(`Crafted "${slice.name}" (${slice.slot}) into your card!`);
  };

  const handleClaimVale = (vale) => {
    if (phase !== 'HARVEST' || activePlayerIdx !== 0) return;
    if (humanPlayer.valesBoughtThisTurn >= 2) {
      addLog('Maximum 2 Vale cards per turn.');
      return;
    }

    for (const [sp, req] of Object.entries(vale.cost)) {
      if ((availableSpirits[sp] || 0) < (req || 0)) {
        addLog(`Not enough ${sp} Spirits to claim ${vale.name}!`);
        return;
      }
    }

    const newSpentSpirits = { ...humanPlayer.spentSpiritsThisTurn };
    for (const [sp, req] of Object.entries(vale.cost)) {
      newSpentSpirits[sp] = (newSpentSpirits[sp] || 0) + (req || 0);
    }

    const valeManaOffset = vale.harvestEffect.mana || 0;

    const updatedHuman = {
      ...humanPlayer,
      vales: [...humanPlayer.vales, vale],
      valesBoughtThisTurn: humanPlayer.valesBoughtThisTurn + 1,
      spentManaThisTurn: humanPlayer.spentManaThisTurn + valeManaOffset,
      spentSpiritsThisTurn: newSpentSpirits,
    };

    const nextMarketVales = marketVales.filter((v) => v.id !== vale.id);
    if (valeDeck.length > 0) {
      nextMarketVales.push(valeDeck[0]);
      setValeDeck(valeDeck.slice(1));
    }

    setMarketVales(nextMarketVales);
    setPlayers([updatedHuman, aiPlayer]);
    addLog(`Claimed Vale "${vale.name}" (+${vale.printedVP} VP)!`);
  };

  const handleEndHumanTurn = () => {
    if (!humanPlayer) return;
    setSelectedAdvancement(null);
    setLastPushedCardId(null);

    const prevDeckCount = humanPlayer.deck.length;
    const cleanedHuman = {
      ...humanPlayer,
      discard: [...humanPlayer.discard, ...humanPlayer.field],
      field: [],
      hasSpoiled: false,
    };

    const nextHuman = setupInitialPlanting(cleanedHuman);
    if (nextHuman.deck.length > prevDeckCount) {
      setDeckShuffledBanner(true);
      setTimeout(() => setDeckShuffledBanner(false), 2000);
    }

    setDealBatchId((b) => b + 1);
    setOnDeckAnimKey((k) => k + 1);
    setPlayers([nextHuman, aiPlayer]);
    setActivePlayerIdx(1);
    setPhase('AI_THINKING');
  };

  useEffect(() => {
    if (phase !== 'AI_THINKING' || !aiPlayer) return;

    const timer = setTimeout(() => {
      let bot = setupInitialPlanting(aiPlayer);
      let currentMarket = { ...marketAdvancements };
      let t1D = [...tier1Deck];
      let t2D = [...tier2Deck];
      let t3D = [...tier3Deck];
      let mVales = [...marketVales];
      let vD = [...valeDeck];
      let currentVpPool = vpPool;

      let tally = calculatePlayerTally(bot.field, bot.onDeck, bot.vales, true);
      if (bot.aiLevel === 'NOVICE') {
        if (tally.netDecay === 3 && Math.random() < 0.45 && bot.onDeck) {
          bot.field = [...bot.field, bot.onDeck];
          bot.onDeck = null;
          bot = drawSingleCard(bot);
          tally = calculatePlayerTally(bot.field, bot.onDeck, bot.vales, true);
        }
      } else if (bot.aiLevel === 'ARCHDRUID') {
        const remainingCards = [...bot.deck, ...bot.discard];
        const decayCount = remainingCards.filter(
          (c) =>
            (c.slots.TOP?.effects.decay || 0) +
              (c.slots.MIDDLE?.effects.decay || 0) +
              (c.slots.BOTTOM?.effects.decay || 0) -
              ((c.slots.TOP?.effects.growth || 0) +
                (c.slots.MIDDLE?.effects.growth || 0) +
                (c.slots.BOTTOM?.effects.growth || 0)) >
            0
        ).length;
        const riskRatio = remainingCards.length > 0 ? decayCount / remainingCards.length : 1;
        if (tally.netDecay === 3 && riskRatio < 0.25 && bot.onDeck) {
          bot.field = [...bot.field, bot.onDeck];
          bot.onDeck = null;
          bot = drawSingleCard(bot);
          tally = calculatePlayerTally(bot.field, bot.onDeck, bot.vales, true);
        }
      }

      if (tally.isSpoiled) {
        bot.hasSpoiled = true;
        bot.manaTokenAvailable = true;
        addLog(`${bot.name} pushed too far and SPOILED!`);
      } else {
        const harvestTally = calculatePlayerTally(bot.field, bot.onDeck, bot.vales, false);
        let botMana = harvestTally.mana + (bot.manaTokenAvailable ? 1 : 0);
        if (bot.manaTokenAvailable && botMana >= 4) {
          bot.manaTokenAvailable = false;
        }

        if (harvestTally.vpTokensThisHarvest > 0) {
          bot.vpTokens += harvestTally.vpTokensThisHarvest;
          currentVpPool = Math.max(0, currentVpPool - harvestTally.vpTokensThisHarvest);
        }

        const allAvailable = [
          ...currentMarket.tier3.map((s) => ({ slice: s, tierKey: 'tier3' })),
          ...currentMarket.tier2.map((s) => ({ slice: s, tierKey: 'tier2' })),
          ...currentMarket.tier1.map((s) => ({ slice: s, tierKey: 'tier1' })),
        ];

        const scoreAdvancement = (s) => {
          if (bot.aiLevel === 'NOVICE') return s.cost + Math.random() * 3;
          let score = s.cost * 1.5 + s.printedVP * 2.5 + (s.effects.vpToken || 0) * 3;
          if (bot.aiLevel === 'ARCHDRUID') {
            score += (s.effects.growth || 0) * 2.5 + (s.effects.mana || 0) * 2;
          }
          return score;
        };

        allAvailable.sort((a, b) => scoreAdvancement(b.slice) - scoreAdvancement(a.slice));

        let boughtCount = 0;
        for (const item of allAvailable) {
          if (boughtCount >= 2) break;
          if (item.slice.cost <= botMana) {
            const targetCardIdx = bot.field.findIndex(
              (c) => c.slots[item.slice.slot] === null && c.baseSlot !== item.slice.slot
            );
            if (targetCardIdx !== -1) {
              botMana -= item.slice.cost;
              boughtCount++;
              bot.field[targetCardIdx] = {
                ...bot.field[targetCardIdx],
                slots: {
                  ...bot.field[targetCardIdx].slots,
                  [item.slice.slot]: item.slice,
                },
              };

              currentMarket[item.tierKey] = currentMarket[item.tierKey].filter(
                (x) => x.id !== item.slice.id
              );
              if (item.tierKey === 'tier1' && t1D.length > 0) {
                currentMarket.tier1.push(t1D.shift());
              } else if (item.tierKey === 'tier2' && t2D.length > 0) {
                currentMarket.tier2.push(t2D.shift());
              } else if (item.tierKey === 'tier3' && t3D.length > 0) {
                currentMarket.tier3.push(t3D.shift());
              }

              addLog(`${bot.name} crafted "${item.slice.name}".`);
            }
          }
        }

        const botSpirits = { ...harvestTally.spirits };
        for (const v of [...mVales]) {
          const canAfford = Object.entries(v.cost).every(
            ([sp, req]) => (botSpirits[sp] || 0) >= (req || 0)
          );
          if (canAfford) {
            for (const [sp, req] of Object.entries(v.cost)) {
              botSpirits[sp] -= req || 0;
            }
            bot.vales = [...bot.vales, v];
            mVales = mVales.filter((mv) => mv.id !== v.id);
            if (vD.length > 0) mVales.push(vD.shift());
            addLog(`${bot.name} claimed Vale "${v.name}"!`);
            break;
          }
        }
      }

      const cleanedBot = {
        ...bot,
        discard: [...bot.discard, ...bot.field],
        field: [],
        hasSpoiled: false,
      };
      const nextBot = setupInitialPlanting(cleanedBot);

      setMarketAdvancements(currentMarket);
      setTier1Deck(t1D);
      setTier2Deck(t2D);
      setTier3Deck(t3D);
      setMarketVales(mVales);
      setValeDeck(vD);
      setVpPool(currentVpPool);
      setPlayers([humanPlayer, nextBot]);

      if (currentVpPool <= 0) {
        setPhase('GAME_OVER');
        addLog('The Victory Point Pool is empty! The Restoration of Mystic Valley is complete!');
      } else {
        setActivePlayerIdx(0);
        setPhase('PLANTING');
        setTurnNumber((t) => t + 1);
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [phase]);

  if (!humanPlayer || !aiPlayer || !humanTally) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-200 flex items-center justify-center">
        Loading Mystic Valley...
      </div>
    );
  }

  const humanTotalVP = calculateTotalEndGameVP(humanPlayer);
  const aiTotalVP = calculateTotalEndGameVP(aiPlayer);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans select-none">
      {}
      <style>{`
        @keyframes mvDealCard {
          0% {
            opacity: 0;
            transform: translateY(-28px) translateX(-24px) scale(0.82) rotate(-4deg);
          }
          65% {
            opacity: 1;
            transform: translateY(3px) translateX(2px) scale(1.03) rotate(0.5deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateX(0) scale(1) rotate(0deg);
          }
        }
        @keyframes mvPushFromOnDeck {
          0% {
            opacity: 0.4;
            transform: translateX(-75px) scale(0.92);
            box-shadow: 0 0 28px rgba(251, 191, 36, 0.75);
          }
          60% {
            opacity: 1;
            transform: translateX(6px) scale(1.05);
            box-shadow: 0 0 22px rgba(52, 211, 153, 0.65);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
            box-shadow: 0 0 0px rgba(0, 0, 0, 0);
          }
        }
        @keyframes mvFlipOnDeck {
          0% {
            opacity: 0;
            transform: perspective(700px) rotateY(80deg) scale(0.88);
          }
          65% {
            opacity: 1;
            transform: perspective(700px) rotateY(-8deg) scale(1.03);
          }
          100% {
            opacity: 1;
            transform: perspective(700px) rotateY(0deg) scale(1);
          }
        }
        @keyframes mvSpoilShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px) rotate(-1.5deg); }
          40% { transform: translateX(8px) rotate(1.5deg); }
          60% { transform: translateX(-6px) rotate(-1deg); }
          80% { transform: translateX(6px) rotate(1deg); }
        }
        .animate-mv-deal {
          animation: mvDealCard 0.48s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-mv-push {
          animation: mvPushFromOnDeck 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-mv-flip {
          animation: mvFlipOnDeck 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-mv-spoil {
          animation: mvSpoilShake 0.5s ease-in-out;
        }
      `}</style>

      {/* TOP HEADER BAR */}
      <header className="bg-stone-900 border-b border-stone-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow">
            <Sprout className="w-4 h-4 text-stone-950" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-wider text-emerald-300 leading-none">
              MYSTIC VALLEY
            </h1>
            <span className="text-[10px] text-stone-400">
              Turn {turnNumber} • VP Pool: <strong className="text-amber-300">{vpPool}</strong> left
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-stone-950/90 border border-stone-800 px-2.5 py-1 rounded-lg text-xs">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">You:</span>
            <span className="text-amber-300 font-bold flex items-center gap-0.5">
              <Trophy className="w-3 h-3" /> {humanTotalVP}
            </span>
            <span className="text-stone-600">|</span>
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold hidden md:inline">{aiPlayer.name}:</span>
            <span className="text-amber-300 font-bold flex items-center gap-0.5">
              <Trophy className="w-3 h-3" /> {aiTotalVP}
            </span>
          </div>

          <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-[11px] text-stone-400" title="Game state is automatically saved locally">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Auto-Saved
          </span>

          <select
            value={aiDifficulty}
            onChange={(e) => {
              const lvl = e.target.value;
              if (window.confirm(`Switch difficulty to ${lvl}? Current game progress will be reset.`)) {
                setAiDifficulty(lvl);
                startNewGame(lvl);
              }
            }}
            className="bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500"
            title="Select AI Bot Level"
          >
            <option value="NOVICE">AI: Novice</option>
            <option value="ADEPT">AI: Adept</option>
            <option value="ARCHDRUID">AI: Archdruid</option>
          </select>

          <button
            onClick={() => setShowDeckModal(true)}
            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs flex items-center gap-1"
            title="Inspect Your 20-Card Deck"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">My Deck (20)</span>
          </button>

          <button
            onClick={() => setShowRulesModal(true)}
            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => {
              if (window.confirm('Restart game from scratch? Current progress will be lost.')) {
                startNewGame(aiDifficulty);
              }
            }}
            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300"
            title="Restart / New Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* RESOURCE & TURN ACTION HUD BAR */}
      <div className="bg-stone-900/95 border-b border-stone-800 px-3 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${
              humanPlayer.hasSpoiled || humanTally.netDecay >= 4
                ? 'bg-red-950/90 border-red-500 text-red-200 animate-pulse'
                : humanTally.netDecay === 3
                ? 'bg-amber-950/90 border-amber-500 text-amber-200'
                : 'bg-stone-800 border-stone-700 text-stone-200'
            }`}
          >
            <Skull className="w-4 h-4 text-red-400" />
            <span>Decay: {humanTally.netDecay} / 3</span>
            <span className="text-[10px] font-normal text-stone-400">
              ({humanTally.decay}🔴 - {humanTally.growth}🟢)
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-950/80 border border-sky-600/60 text-sky-100 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Mana: {phase === 'HARVEST' ? availableMana : humanTally.mana}</span>
            {humanPlayer.manaTokenAvailable && (
              <button
                onClick={handleUseManaToken}
                disabled={phase !== 'HARVEST'}
                className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold transition ${
                  phase === 'HARVEST'
                    ? 'bg-amber-400 text-stone-950 hover:bg-amber-300 cursor-pointer'
                    : 'bg-stone-700 text-stone-400 cursor-not-allowed'
                }`}
                title="Flip your Mana Token during Harvest for +1 Bonus Mana"
              >
                +1 Token Ready
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-stone-950/70 px-2 py-1 rounded-lg border border-stone-800">
            {['FLORA', 'BEAST', 'GUARDIAN', 'CELESTIAL'].map((sp) => {
              const val = phase === 'HARVEST' ? availableSpirits[sp] : humanTally.spirits[sp];
              return (
                <div key={sp} className="flex items-center gap-0.5 text-xs">
                  <SpiritBadge type={sp} count={val} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {phase === 'PLANTING' && !humanPlayer.hasSpoiled && (
            <>
              <button
                onClick={handlePushCard}
                disabled={!humanPlayer.onDeck}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Push Luck (Plant On-Deck)
              </button>
              <button
                onClick={handleEnterHarvest}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Stop & Harvest
              </button>
            </>
          )}

          {phase === 'PLANTING' && humanPlayer.hasSpoiled && (
            <button
              onClick={handleEndHumanTurn}
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md animate-bounce"
            >
              <AlertTriangle className="w-4 h-4" />
              Spoiled! End Turn (+1 Mana Token)
            </button>
          )}

          {phase === 'HARVEST' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300 hidden sm:inline">
                Buys left: {2 - humanPlayer.advancementsBoughtThisTurn} Adv / {2 - humanPlayer.valesBoughtThisTurn} Vale
              </span>
              <button
                onClick={handleEndHumanTurn}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                Finish Harvest & End Turn
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {phase === 'AI_THINKING' && (
            <div className="px-3 py-1.5 rounded-lg bg-sky-950 border border-sky-500 text-sky-200 text-xs font-bold flex items-center gap-2">
              <Bot className="w-4 h-4 animate-spin" />
              {aiPlayer.name} is taking their turn...
            </div>
          )}
        </div>
      </div>

      {/* Selected Advancement Sleeving Banner */}
      {selectedAdvancement && (
        <div className="bg-emerald-900/90 border-b border-emerald-400 px-4 py-2 flex items-center justify-between text-xs text-emerald-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />
            <span>
              <strong>Crafting Mode:</strong> Click any glowing card in your <strong>Field</strong> with an empty{' '}
              <strong className="underline">{selectedAdvancement.slice.slot}</strong> slot to sleeve{' '}
              <strong>{selectedAdvancement.slice.name}</strong>!
            </span>
          </div>
          <button
            onClick={() => setSelectedAdvancement(null)}
            className="px-2 py-0.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700"
          >
            Cancel
          </button>
        </div>
      )}

      {/* MOBILE PORTRAIT TABS */}
      <div className="flex lg:hidden bg-stone-900 border-b border-stone-800">
        <button
          onClick={() => setMobileViewMode('FIELD')}
          className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 ${
            mobileViewMode === 'FIELD'
              ? 'border-emerald-400 text-emerald-300 bg-stone-800/60'
              : 'border-transparent text-stone-400'
          }`}
        >
          <Sprout className="w-3.5 h-3.5" />
          Your Field ({humanPlayer.field.length})
        </button>
        <button
          onClick={() => setMobileViewMode('MARKET')}
          className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 ${
            mobileViewMode === 'MARKET'
              ? 'border-emerald-400 text-emerald-300 bg-stone-800/60'
              : 'border-transparent text-stone-400'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Market (Advancements & Vales)
          {phase === 'HARVEST' && (
            <span className="px-1.5 py-0.2 bg-emerald-500 text-stone-950 rounded-full text-[10px]">
              Shop!
            </span>
          )}
        </button>
      </div>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-3 sm:p-4 max-w-[1850px] w-full mx-auto">
        {/* LEFT SECTION: YOUR FIELD & ON-DECK ZONE */}
        <section
          className={`lg:col-span-7 xl:col-span-8 flex flex-col gap-4 ${
            mobileViewMode === 'MARKET' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="bg-stone-900/60 border border-stone-800/90 rounded-2xl p-3 sm:p-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                  Your Sanctuary Field ({humanPlayer.field.length} Cards)
                </h2>
                {phase === 'HARVEST' && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-200">
                    Harvesting Active
                  </span>
                )}
                {deckShuffledBanner && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400 text-amber-200 font-bold flex items-center gap-1 animate-bounce">
                    <RotateCcw className="w-3 h-3 animate-spin" />
                    Deck Reshuffled!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs text-stone-400">
                <span className={`px-2 py-0.5 rounded transition-all ${deckShuffledBanner ? 'bg-amber-500/30 text-amber-200 ring-1 ring-amber-400' : ''}`}>
                  Deck: <strong className="text-stone-200">{humanPlayer.deck.length}</strong>
                </span>
                <button
                  onClick={() => setShowDiscardModal(true)}
                  className="px-2 py-1 rounded-lg bg-stone-800/90 hover:bg-stone-700 border border-stone-700 text-stone-200 flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                  title="Click to inspect cards in your Discard Pile"
                >
                  <span>Discard: <strong>{humanPlayer.discard.length}</strong></span>
                  <span
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-red-950/90 border border-red-700/70 text-red-200 text-[10px] font-extrabold"
                    title="Cursed Lands currently in your Discard pile"
                  >
                    <Skull className="w-2.5 h-2.5 text-red-400" />
                    x{cursedInDiscardCount}
                  </span>
                </button>
                <span>Vales: <strong className="text-emerald-300">{humanPlayer.vales.length}</strong></span>
              </div>
            </div>

            {}
            <div className={`flex flex-col gap-4 ${humanPlayer.hasSpoiled ? 'animate-mv-spoil' : ''}`}>
              {/* ON-DECK PREVIEW PANEL */}
              <div className="bg-stone-950/60 border border-amber-500/30 rounded-xl p-3 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-amber-300" /> On-Deck Preview
                  </span>
                  {humanPlayer.onDeck ? (
                    <div key={`ondeck_${humanPlayer.onDeck.sleeveId}_${onDeckAnimKey}`} className="relative">
                      <CardSleeveView
                        sleeve={humanPlayer.onDeck}
                        badgeText="ON-DECK"
                        compact
                        animationClass="animate-mv-flip"
                      />
                      {phase === 'HARVEST' && (
                        <div className="absolute inset-0 bg-stone-950/65 backdrop-blur-[1px] rounded-xl flex items-center justify-center p-3 text-center">
                          <span className="text-[11px] text-stone-300 font-medium">
                            Stays on top of deck for next turn
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-[140px] h-[190px] rounded-xl border-2 border-dashed border-stone-800 flex items-center justify-center text-xs text-stone-500 text-center p-3">
                      Deck Empty
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-center text-center sm:text-left space-y-1.5 py-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Next Card Waiting on Deck
                    </span>
                    {humanPlayer.onDeck && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 font-semibold">
                        Ready to Plant
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    This card's Mana, Decay, and Growth symbols already count toward your current turn tally.
                  </p>
                  {phase === 'PLANTING' && !humanPlayer.hasSpoiled && (
                    <p className="text-xs text-emerald-400 font-semibold">
                      Click <strong className="text-amber-300">"Push Luck (Plant On-Deck)"</strong> at top right to plant it into your Sanctuary and flip the next card!
                    </p>
                  )}
                  {phase === 'HARVEST' && (
                    <p className="text-xs text-stone-400">
                      Harvesting Phase: Spend your Mana and Spirit symbols in the Market. This On-Deck card will remain on top of your deck for next turn.
                    </p>
                  )}
                  {humanPlayer.hasSpoiled && (
                    <p className="text-xs text-red-400 font-semibold">
                      Turn Spoiled (4+ Net Decay)! End your turn to claim your consolation Mana token.
                    </p>
                  )}
                </div>
              </div>

              {/* PLANTED FIELD CARDS */}
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                    Planted Sanctuary Field ({humanPlayer.field.length} Cards)
                  </div>
                  <span className="text-[11px] text-stone-400">
                    Active in your field this turn
                  </span>
                </div>

                {humanPlayer.field.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500 border border-dashed border-stone-800 rounded-xl">
                    No cards currently planted in field.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 justify-items-center">
                    {humanPlayer.field.map((card, i) => {
                      const isNewlyPushed = card.sleeveId === lastPushedCardId;
                      return (
                        <div
                          key={`${card.sleeveId}_${isNewlyPushed ? 'pushed' : dealBatchId}`}
                          className="flex flex-col items-center w-full max-w-[185px]"
                        >
                          <span className="text-[10px] font-mono text-stone-400 mb-1 flex items-center gap-1">
                            <span>Field #{i + 1}</span>
                            {isNewlyPushed && (
                              <span className="px-1 rounded bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[9px] font-bold">
                                PUSHED
                              </span>
                            )}
                          </span>
                          <CardSleeveView
                            sleeve={card}
                            selectedAdvancement={selectedAdvancement?.slice || null}
                            onSleeveClick={handleSleeveCardInField}
                            animationClass={isNewlyPushed ? 'animate-mv-push' : 'animate-mv-deal'}
                            animationDelayMs={isNewlyPushed ? 0 : i * 110}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Claimed Vales Row */}
            {humanPlayer.vales.length > 0 && (
              <div className="mt-2 pt-2 border-t border-stone-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                  Your Claimed Vales
                </span>
                <div className="flex flex-wrap gap-2">
                  {humanPlayer.vales.map((v) => (
                    <div
                      key={v.id}
                      className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-950 to-stone-900 border border-emerald-600/50 text-xs flex items-center gap-2"
                    >
                      <span className="font-bold text-emerald-200">{v.name}</span>
                      <span className="text-stone-300 text-[11px]">{v.description}</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] flex items-center gap-0.5">
                        <Trophy className="w-2.5 h-2.5" /> {v.printedVP}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Opponent Summary & Game Log */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-stone-800 pb-1.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-stone-200">{aiPlayer.name}</span>
                </div>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> {aiTotalVP} Total VP
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-stone-950/60 p-1.5 rounded border border-stone-800">
                  <div className="text-[10px] text-stone-400">Field Cards</div>
                  <div className="font-bold text-stone-200">{aiPlayer.field.length}</div>
                </div>
                <div className="bg-stone-950/60 p-1.5 rounded border border-stone-800">
                  <div className="text-[10px] text-stone-400">VP Tokens</div>
                  <div className="font-bold text-amber-300">{aiPlayer.vpTokens}</div>
                </div>
                <div className="bg-stone-950/60 p-1.5 rounded border border-stone-800">
                  <div className="text-[10px] text-stone-400">Vales Claimed</div>
                  <div className="font-bold text-emerald-300">{aiPlayer.vales.length}</div>
                </div>
              </div>
            </div>

            <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-3 flex flex-col h-32">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                Chronicle Log
              </span>
              <div className="flex-1 overflow-y-auto space-y-1 pr-1 text-[11px] text-stone-300">
                {gameLogs.map((log, i) => (
                  <div key={i} className={i === 0 ? 'text-emerald-300 font-medium' : 'text-stone-400'}>
                    • {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SECTION: ADVANCEMENT & VALE MARKET */}
        <section
          className={`lg:col-span-5 xl:col-span-4 flex flex-col gap-3 ${
            mobileViewMode === 'FIELD' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="bg-stone-900/70 border border-stone-800 rounded-2xl p-3 sm:p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div>
                <h2 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <span>Advancement Market</span>
                  {phase === 'HARVEST' ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/70 text-emerald-300 text-[10px] font-bold animate-pulse">
                      HARVEST ACTIVE: Buy Cards Below
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 text-[10px]">
                      Opens in Harvest
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-stone-400">
                  {phase === 'HARVEST'
                    ? 'Click any glowing affordable card to buy and sleeve it into your field cards.'
                    : 'During Harvest, spend your Field Mana to purchase and sleeve Advancements.'}
                </p>
              </div>
              <span className="px-2 py-1 rounded bg-sky-950 border border-sky-700 text-sky-200 text-xs font-bold">
                {availableMana} Mana
              </span>
            </div>

            {['tier3', 'tier2', 'tier1'].map((tierKey) => {
              const tierNum = tierKey === 'tier3' ? 3 : tierKey === 'tier2' ? 2 : 1;
              const slices = marketAdvancements[tierKey];
              return (
                <div key={tierKey} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-400">
                    <span>LEVEL {tierNum} ADVANCEMENTS</span>
                    <span>
                      Deck:{' '}
                      {tierKey === 'tier3'
                        ? tier3Deck.length
                        : tierKey === 'tier2'
                        ? tier2Deck.length
                        : tier1Deck.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {slices.map((slice) => {
                      const isHarvest = phase === 'HARVEST';
                      const hasBuysLeft = humanPlayer.advancementsBoughtThisTurn < 2;
                      const hasMana = availableMana >= slice.cost;
                      const hasValidSlot = humanPlayer.field.some(
                        (c) => c.slots[slice.slot] === null && c.baseSlot !== slice.slot
                      );
                      const canAfford = isHarvest && hasBuysLeft && hasMana && hasValidSlot;
                      const isSelected = selectedAdvancement?.slice.id === slice.id;

                      let cardStyle = 'border-stone-800/80 bg-stone-950/60 opacity-80';
                      if (isSelected) {
                        cardStyle = 'glow-outline-selected bg-amber-950/80 scale-[1.03] cursor-pointer';
                      } else if (isHarvest) {
                        if (canAfford) {
                          cardStyle = 'glow-outline-affordable bg-stone-900/95 hover:scale-[1.03] cursor-pointer';
                        } else {
                          cardStyle = 'border-stone-800/80 bg-stone-950/80 opacity-30 grayscale filter brightness-50 cursor-not-allowed';
                        }
                      }

                      return (
                        <div
                          key={slice.id}
                          onClick={() => handleSelectMarketAdvancement(slice, tierKey)}
                          className={`rounded-xl border p-1.5 flex flex-col justify-between transition ${cardStyle}`}
                        >
                          <div className="flex items-center justify-between px-1 mb-1">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-stone-800 text-amber-300">
                                {slice.slot}
                              </span>
                              {isHarvest && canAfford && !isSelected && (
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 animate-pulse">
                                  Afford
                                </span>
                              )}
                              {isSelected && (
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400 font-extrabold animate-pulse">
                                  Selected
                                </span>
                              )}
                              {isHarvest && !canAfford && (
                                <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-black/60 text-stone-400">
                                  {!hasBuysLeft
                                    ? 'Max 2'
                                    : !hasMana
                                    ? `+${slice.cost - availableMana} 💧`
                                    : `No ${slice.slot}`}
                                </span>
                              )}
                            </div>
                            <span className={`inline-flex items-center gap-0.5 text-xs font-extrabold ${
                              isHarvest && !hasMana ? 'text-stone-500' : 'text-sky-300'
                            }`}>
                              <Sparkles className="w-3 h-3" /> {slice.cost} Mana
                            </span>
                          </div>
                          <div className="h-32 sm:h-36 rounded-lg overflow-hidden border border-stone-700/60 flex flex-col bg-stone-950/80 shadow-inner">
                            {['TOP', 'MIDDLE', 'BOTTOM'].map((pos) => {
                              if (slice.slot === pos) {
                                return (
                                  <div key={pos} className="flex-1 w-full min-h-[56px]">
                                    <SliceRenderer
                                      slice={slice}
                                      pos={pos}
                                      isBase={false}
                                    />
                                  </div>
                                );
                              }
                              return (
                                <div
                                  key={pos}
                                  className="h-6 sm:h-7 shrink-0 w-full border-b last:border-b-0 border-stone-800/40 bg-stone-950/40 flex items-center justify-center select-none"
                                >
                                  <span className="text-[8px] font-mono text-stone-600/80 tracking-widest uppercase">
                                    · {pos} ·
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="mt-2 pt-2 border-t border-stone-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Available Vale Cards (Buy with Spirit Symbols)
                </span>
                <span className="text-[11px] text-stone-400">Deck: {valeDeck.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {marketVales.map((vale) => {
                  const isHarvest = phase === 'HARVEST';
                  const hasValeBuysLeft = humanPlayer.valesBoughtThisTurn < 2;
                  const hasSpirits = Object.entries(vale.cost).every(
                    ([sp, req]) => (availableSpirits[sp] || 0) >= (req || 0)
                  );
                  const canClaim = isHarvest && hasValeBuysLeft && hasSpirits;

                  const valeImg = vale.cost?.GUARDIAN
                    ? `${import.meta.env.BASE_URL}art/guardian.jpg`
                    : vale.cost?.CELESTIAL
                    ? `${import.meta.env.BASE_URL}art/celestial.jpg`
                    : vale.cost?.BEAST
                    ? `${import.meta.env.BASE_URL}art/beast.jpg`
                    : `${import.meta.env.BASE_URL}art/fertile.jpg`;

                  let valeStyle = 'bg-stone-950/60 border-stone-800 opacity-80';
                  if (isHarvest) {
                    if (canClaim) {
                      valeStyle = 'glow-outline-affordable bg-emerald-950/80 cursor-pointer hover:scale-[1.03]';
                    } else {
                      valeStyle = 'bg-stone-950/80 border-stone-800/80 opacity-30 grayscale filter brightness-50 cursor-not-allowed';
                    }
                  }

                  return (
                    <div
                      key={vale.id}
                      onClick={() => handleClaimVale(vale)}
                      className={`relative p-2.5 rounded-xl border flex flex-col justify-between gap-1.5 transition overflow-hidden ${valeStyle}`}
                    >
                      {/* VALE CARD BACKGROUND ARTWORK */}
                      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                        <img
                          src={valeImg}
                          alt=""
                          className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-stone-950/75 pointer-events-none" />
                      </div>

                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-xs font-bold text-stone-100">{vale.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-bold flex items-center gap-0.5">
                          <Trophy className="w-2.5 h-2.5" /> {vale.printedVP} VP
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-300 relative z-10">{vale.description}</p>
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-stone-800/80 relative z-10">
                        <div className="flex items-center gap-1">
                          {Object.entries(vale.cost).map(([sp, req]) =>
                            req ? <SpiritBadge key={sp} type={sp} count={req} /> : null
                          )}
                        </div>
                        {canClaim && (
                          <span className="text-[10px] font-extrabold text-emerald-300 uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/60 animate-pulse">
                            Claim Vale →
                          </span>
                        )}
                        {isHarvest && !canClaim && (
                          <span className="text-[9px] font-semibold text-stone-400">
                            {!hasValeBuysLeft ? 'Max 2 Vales' : 'Need Spirits'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MODALS */}
      {showDeckModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-5xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-emerald-300">
                  Your Complete 20-Card Druid Deck
                </h3>
                <p className="text-xs text-stone-400">
                  Base Cursed & Fertile slots are marked "BASE" and cannot be overwritten.
                </p>
              </div>
              <button
                onClick={() => setShowDeckModal(false)}
                className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-bold"
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 justify-items-center">
              {[
                ...humanPlayer.field.map((c) => ({ c, zone: 'IN FIELD' })),
                ...(humanPlayer.onDeck ? [{ c: humanPlayer.onDeck, zone: 'ON-DECK' }] : []),
                ...humanPlayer.deck.map((c) => ({ c, zone: 'DRAW DECK' })),
                ...humanPlayer.discard.map((c) => ({ c, zone: 'DISCARD' })),
              ].map(({ c, zone }) => (
                <CardSleeveView key={c.sleeveId} sleeve={c} badgeText={zone} compact />
              ))}
            </div>
          </div>
        </div>
      )}

      {showDiscardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                  <span>Your Discard Pile ({humanPlayer.discard.length} Cards)</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950 border border-red-700 text-red-200 text-xs font-extrabold">
                    <Skull className="w-3.5 h-3.5 text-red-400" />
                    Cursed Soils: x{cursedInDiscardCount}
                  </span>
                </h3>
                <p className="text-xs text-stone-400">
                  These cards have already been played this cycle and won't be drawn until your Deck reshuffles.
                </p>
              </div>
              <button
                onClick={() => setShowDiscardModal(false)}
                className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-bold"
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {humanPlayer.discard.length === 0 ? (
                <div className="py-12 text-center text-sm text-stone-500">
                  Your Discard Pile is currently empty.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 justify-items-center">
                  {humanPlayer.discard.map((c, idx) => (
                    <CardSleeveView
                      key={c.sleeveId}
                      sleeve={c}
                      badgeText={`DISCARD #${idx + 1}`}
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-xl w-full p-5 space-y-3 text-xs text-stone-300">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h3 className="text-base font-bold text-emerald-300">How to Play Mystic Valley</h3>
              <button
                onClick={() => setShowRulesModal(false)}
                className="px-2.5 py-1 rounded bg-stone-800 text-stone-200 font-bold"
              >
                Got It
              </button>
            </div>
            <p>
              <strong>1. The Card Crafting System:</strong> Both players start with an identical 20-card deck (9 Cursed Lands with Decay, 3 Fertile Soils with Mana, and 8 Blank sleeves). Starting base effects cannot be overwritten!
            </p>
            <p>
              <strong>2. Planting Phase (Push Your Luck):</strong> Cards are automatically flipped into your Field until 3 Red Decay symbols are visible across your Field + On-Deck preview card. You can choose to <strong>Push Luck</strong> to bring more cards into your Field, or <strong>Stop & Harvest</strong>.
            </p>
            <p>
              <strong>3. Spoiling & Growth:</strong> Green Growth symbols cancel out Red Decay symbols! If your Net Decay ever reaches <strong>4 or more</strong>, you <strong>Spoil</strong>—ending your turn immediately, though your consolation Mana Token flips face-up (+1 Mana on a future Harvest).
            </p>
            <p>
              <strong>4. Harvest Phase:</strong> Spend your Field's Mana to buy up to 2 Advancements (Top, Middle, or Bottom slices) and slot them directly into cards currently in your Field! Spend Spirit symbols to claim up to 2 Vale cards.
            </p>
            <p>
              <strong>5. Winning:</strong> When the central Victory Point token pool runs out, the player with the highest total VP (VP Tokens + printed VP on crafted Advancements & Vales) wins!
            </p>
          </div>
        </div>
      )}

      {phase === 'GAME_OVER' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border-2 border-amber-500 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-2xl font-extrabold text-amber-300">
              {humanTotalVP >= aiTotalVP ? 'Victory in Mystic Valley!' : `${aiPlayer.name} Triumphs!`}
            </h2>
            <p className="text-xs text-stone-300">
              The Valley has been restored! Final Victory Point Standings:
            </p>
            <div className="bg-stone-950 rounded-xl p-4 space-y-2 border border-stone-800 text-sm">
              <div className="flex justify-between font-bold text-emerald-300">
                <span>You (Druid)</span>
                <span>{humanTotalVP} VP</span>
              </div>
              <div className="flex justify-between font-bold text-sky-300">
                <span>{aiPlayer.name}</span>
                <span>{aiTotalVP} VP</span>
              </div>
            </div>
            <button
              onClick={() => startNewGame(aiDifficulty)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-sm transition"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}