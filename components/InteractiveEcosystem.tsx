'use client';

import React, { useState } from 'react';
import { translations, SupportedLang } from '@/lib/translations';

interface InteractiveEcosystemProps {
  currentLang: SupportedLang;
}

export default function InteractiveEcosystem({ currentLang }: InteractiveEcosystemProps) {
  const [activeTab, setActiveTab] = useState<'dmp' | 'pharmacies' | 'teleexpertise' | 'epidemies'>('dmp');
  const [selectedCommune, setSelectedCommune] = useState('cotonou');
  const [selectedMolecule, setSelectedMolecule] = useState('all');
  const [scanResult, setScanResult] = useState<string | null>(null);

  const t = translations[currentLang]?.ecosystem || translations.fr.ecosystem;

  // Données fictives réalistes ancrées au Bénin
  const pharmacies = [
    {
      name: "Pharmacie Camp Guézo",
      commune: "cotonou",
      quartier: "Camp Guézo, Cotonou",
      garde: true,
      telephone: "+229 21 31 55 20",
      stocks: { act: true, venin: true, insuline: true },
      distance: "800 m"
    },
    {
      name: "Pharmacie Concorde",
      commune: "cotonou",
      quartier: "Akpakpa Dodomè",
      garde: true,
      telephone: "+229 21 33 14 02",
      stocks: { act: true, venin: false, insuline: true },
      distance: "2.1 km"
    },
    {
      name: "Pharmacie du Carrefour",
      commune: "calavi",
      quartier: "Carrefour IITA, Abomey-Calavi",
      garde: true,
      telephone: "+229 21 36 08 40",
      stocks: { act: true, venin: true, insuline: false },
      distance: "1.4 km"
    },
    {
      name: "Pharmacie La Madone",
      commune: "portonovo",
      quartier: "Ouando, Porto-Novo",
      garde: true,
      telephone: "+229 20 22 41 12",
      stocks: { act: true, venin: true, insuline: true },
      distance: "1.1 km"
    },
    {
      name: "Pharmacie Albarika",
      commune: "parakou",
      quartier: "Quartier Albarika, Parakou",
      garde: true,
      telephone: "+229 23 61 03 89",
      stocks: { act: true, venin: true, insuline: true },
      distance: "600 m"
    }
  ];

  const filteredPharmacies = pharmacies.filter((p) => {
    const matchCommune = selectedCommune === 'all' || p.commune === selectedCommune;
    let matchMolecule = true;
    if (selectedMolecule === 'act') matchMolecule = p.stocks.act;
    if (selectedMolecule === 'venin') matchMolecule = p.stocks.venin;
    if (selectedMolecule === 'insuline') matchMolecule = p.stocks.insuline;
    return matchCommune && matchMolecule;
  });

  return (
    <section id="services" className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Titre de section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-200 dark:border-teal-800">
            {t.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* Barre d'onglets ergonomique */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-2xl max-w-3xl mx-auto mb-10">
          <button
            onClick={() => setActiveTab('dmp')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'dmp'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🪪</span>
            <span>{t.tabDmp}</span>
          </button>

          <button
            onClick={() => setActiveTab('pharmacies')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'pharmacies'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>💊</span>
            <span>{t.tabPharmacies}</span>
          </button>

          <button
            onClick={() => setActiveTab('teleexpertise')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'teleexpertise'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🩺</span>
            <span>{t.tabTeleexpertise}</span>
          </button>

          <button
            onClick={() => setActiveTab('epidemies')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'epidemies'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>📊</span>
            <span>{t.tabEpidemies}</span>
          </button>
        </div>

        {/* Contenu de l'onglet actif */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl transition-all">
          
          {/* ONGLET 1 : DOSSIER MÉDICAL & CARTE QR OFFLINE */}
          {activeTab === 'dmp' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold">
                  {t.dmpBadge}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {t.dmpTitle}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                  {t.dmpDesc}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500">{t.bloodGroup}</span>
                    <p className="text-lg font-black text-rose-600 dark:text-rose-400">O+ (Rh+)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500">{t.allergy}</span>
                    <p className="text-lg font-black text-amber-600 dark:text-amber-400">Pénicilline</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500">{t.archCoverage}</span>
                    <p className="text-lg font-black text-teal-600 dark:text-teal-400">80% Couvert</p>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap gap-3">
                  <button 
                    onClick={() => setScanResult("Scan validé ! Identité ANIP certifiée : BIO KORA Bio (Né le 14/05/1992 à Parakou). Aucun contact d'urgence bloquant.")}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  >
                    {t.simulateScanBtn}
                  </button>
                  <button 
                    onClick={() => alert("Génération du passeport vaccinal chiffré au format PDF certifié...")}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all"
                  >
                    {t.downloadPassBtn}
                  </button>
                </div>

                {scanResult && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
                    {scanResult}
                  </div>
                )}
              </div>

              {/* Fausse Carte d'identité médicale physique avec QR Code SVG */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 shadow-2xl border border-teal-500/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
                  
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <p className="text-[10px] tracking-wider uppercase text-teal-300 font-bold">RÉPUBLIQUE DU BÉNIN</p>
                      <p className="text-xs font-bold text-slate-200">CARTE DE SANTÉ NUMÉRIQUE</p>
                    </div>
                    <span className="text-xl">🇧🇯</span>
                  </div>

                  <div className="flex items-center gap-4 my-5">
                    <div className="w-16 h-16 rounded-xl bg-teal-800/40 border border-teal-400/40 flex items-center justify-center text-2xl font-bold">
                      👤
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white">BIO KORA Bio</h4>
                      <p className="text-xs text-slate-300 font-mono">NPI: 1092-8472-9104</p>
                      <p className="text-[11px] text-teal-300 font-semibold mt-0.5">Assuré ARCH Bénin #88392</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="text-[11px] space-y-1">
                      <p className="text-slate-400">Sang: <span className="font-bold text-white">O+</span></p>
                      <p className="text-slate-400">Allergies: <span className="font-bold text-amber-300">Pénicilline</span></p>
                      <p className="text-slate-400">Urgence: <span className="font-bold text-white">+229 97 00 00 00</span></p>
                    </div>

                    {/* QR Code Stylisé SVG */}
                    <div className="w-20 h-20 bg-white p-1.5 rounded-lg flex items-center justify-center shadow-inner">
                      <svg viewBox="0 0 24 24" className="w-full h-full text-slate-900 fill-current">
                        <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 3h2v2h-2v-2zm-4-5h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm0 4h2v2h-2v-2zm-4 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-6-6h2v2h-2v-2zm2 2h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 2 : PHARMACIES DE GARDE & STOCKS VITAUX */}
          {activeTab === 'pharmacies' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {t.pharmacieTitle}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    {t.pharmacieDesc}
                  </p>
                </div>

                {/* Filtres Commune et Médicament */}
                <div className="flex flex-wrap gap-2">
                  <select
                    value={selectedCommune}
                    onChange={(e) => setSelectedCommune(e.target.value)}
                    className="text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 border border-slate-300 dark:border-slate-700"
                  >
                    <option value="all">{t.allCommunes}</option>
                    <option value="cotonou">Cotonou</option>
                    <option value="calavi">Abomey-Calavi</option>
                    <option value="portonovo">Porto-Novo</option>
                    <option value="parakou">Parakou</option>
                  </select>

                  <select
                    value={selectedMolecule}
                    onChange={(e) => setSelectedMolecule(e.target.value)}
                    className="text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 border border-slate-300 dark:border-slate-700"
                  >
                    <option value="all">{t.allMolecules}</option>
                    <option value="act">Paludisme (ACT / Coartem)</option>
                    <option value="venin">Sérum Antivenimeux</option>
                    <option value="insuline">Insuline</option>
                  </select>
                </div>
              </div>

              {/* Liste interactive des pharmacies */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {filteredPharmacies.map((pharmacie, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-teal-500 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">
                          {pharmacie.name}
                        </h4>
                        <p className="text-xs text-slate-500">{pharmacie.quartier}</p>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {t.onDutyBadge}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center justify-between">
                        <span>{t.actStock}</span>
                        <span className={`font-bold ${pharmacie.stocks.act ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {pharmacie.stocks.act ? t.inStock : t.outOfStock}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{t.veninStock}</span>
                        <span className={`font-bold ${pharmacie.stocks.venin ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {pharmacie.stocks.venin ? t.inStock : t.outOfStock}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{t.insulineStock}</span>
                        <span className={`font-bold ${pharmacie.stocks.insuline ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {pharmacie.stocks.insuline ? t.inStock : t.outOfStock}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500">📍 {pharmacie.distance}</span>
                      <a
                        href={`tel:${pharmacie.telephone}`}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors"
                      >
                        Appeler
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ONGLET 3 : TÉLÉEXPERTISE RURALE */}
          {activeTab === 'teleexpertise' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  {t.teleexpertiseBadge}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {t.teleexpertiseTitle}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t.teleexpertiseDesc}
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-2xl">📸</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Compression Frugale Image (WebP/AVIF)</p>
                      <p className="text-[11px] text-slate-500">Passage de 4 Mo à 180 Ko pour transfert instantané en 2G/3G.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-2xl">🎙️</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Observation Vocale en Langue Locale</p>
                      <p className="text-[11px] text-slate-500">L&apos;infirmier dicte ses constatations sans perdre de temps au clavier.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation de formulaire de téléexpertise */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500">Dossier #TE-BEN-2026-089</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    En attente d&apos;avis CNHU
                  </span>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Centre Émetteur :</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Centre de Santé d&apos;Arrondissement de Tori-Bossito</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                    <p className="text-slate-500">Tension</p>
                    <p className="font-bold text-slate-900 dark:text-white">14 / 9 cmHg</p>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                    <p className="text-slate-500">Température</p>
                    <p className="font-bold text-rose-600">39.2 °C</p>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                    <p className="text-slate-500">TDR Palu</p>
                    <p className="font-bold text-rose-600">Positif (+)</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert("Simulation : Fiche transmise avec succès au Dr. AGBO (Pédiatre référent au CNHU Cotonou).")}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
                >
                  Valider et synchroniser la téléexpertise
                </button>
              </div>
            </div>
          )}

          {/* ONGLET 4 : VEILLE ÉPIDÉMIOLOGIQUE & MINISTÈRE */}
          {activeTab === 'epidemies' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {t.epidemieTitle}
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  {t.epidemieDesc}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                  <span className="text-xs font-semibold text-teal-800 dark:text-teal-300">Taux de Guérison Palu</span>
                  <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">94.8%</p>
                  <p className="text-[11px] text-teal-700/80 mt-1">+2.1% (TDR rapides)</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Couverture Vaccinale PEV</span>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">88.2%</p>
                  <p className="text-[11px] text-amber-700/80 mt-1">Objectif 95% 2026</p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                  <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">Alertes MDO Actives</span>
                  <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">02</p>
                  <p className="text-[11px] text-rose-700/80 mt-1">Sous contrôle sanitaire</p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-200/40 border border-blue-200 dark:border-blue-800">
                  <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">Lits Réanimation Libres</span>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">18 / 42</p>
                  <p className="text-[11px] text-blue-700/80 mt-1">CNHU, CHU-MEL, CHD</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
