'use client';

import React from 'react';

export default function SpecificationsViewer() {
  const docs = [
    {
      id: "01",
      title: "Cahier des Charges & Backlog Exhaustif",
      filename: "01_BACKLOG_FONCTIONNEL_ET_INNOVATIONS.md",
      badge: "10 Domaines Métiers",
      desc: "Cartographie des 11 profils d'acteurs, DMP, e-Prescription, Télémédecine rurale, Triage IA Frugale, traçabilité des lots pharmaceutiques et priorisation MoSCoW.",
      icon: "📋"
    },
    {
      id: "02",
      title: "Spécifications Epics & User Stories",
      filename: "02_EPICS_ET_USER_STORIES.md",
      badge: "29 User Stories • 165 SP",
      desc: "Découpage agile complet : 10 Epics, 29 User Stories avec critères d'acceptation rigoureux au format Gherkin (Étant donné que / Quand / Alors) et Story Points Fibonacci.",
      icon: "🎯"
    },
    {
      id: "03",
      title: "Plan d'Implémentation Technique & DevOps",
      filename: "03_PLAN_IMPLEMENTATION_TECHNIQUE.md",
      badge: "Architecture C4 • CI/CD • APDP",
      desc: "Next.js 16, PostgreSQL PostGIS, Dockerfile multi-stage (< 95 Mo), docker-compose.yml, pipeline GitHub Actions complet, sécurité APDP Bénin et roadmap nationale.",
      icon: "⚙️"
    }
  ];

  return (
    <section id="specifications" className="py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-300 dark:border-slate-700">
            Dossier d&apos;Ingénierie Logicielle
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Un projet entièrement spécifié, prêt pour l&apos;échelle nationale
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Conçu non pas comme un prototype éphémère, mais comme une plateforme robuste et souveraine pour le Ministère de la Santé du Bénin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center text-2xl font-bold">
                    {doc.icon}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[11px] font-black uppercase">
                    {doc.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {doc.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {doc.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[180px]">
                  {doc.filename}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400">
                  Consulter dans /docs →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bannière de téléchargement / consultation */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-base">Consultez l&apos;ensemble du dossier de spécifications</h4>
            <p className="text-xs text-slate-300">Tous les fichiers markdown sont générés dans le dossier <code className="bg-white/10 px-1 py-0.5 rounded">docs/specifications/</code></p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-600 text-white">
              Conforme APDP & ASIN Bénin ✅
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
