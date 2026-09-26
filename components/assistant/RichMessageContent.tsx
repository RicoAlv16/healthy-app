"use client";

import React from "react";

// Parser pour le formatage inline (**gras**, *italique*, `code`, [liens])
function renderInlineFormatted(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  // Regex pour capturer: **gras**, *italique*, `code`
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/;

  while (remaining.length > 0) {
    const match = remaining.match(regex);
    if (!match || match.index === undefined) {
      parts.push(<span key={keyIndex++}>{remaining}</span>);
      break;
    }

    if (match.index > 0) {
      parts.push(<span key={keyIndex++}>{remaining.slice(0, match.index)}</span>);
    }

    const fullMatch = match[0];
    if (fullMatch.startsWith("**") && fullMatch.endsWith("**")) {
      parts.push(
        <strong key={keyIndex++} className="font-bold text-slate-900 dark:text-white">
          {match[2]}
        </strong>
      );
    } else if (fullMatch.startsWith("*") && fullMatch.endsWith("*")) {
      parts.push(
        <em key={keyIndex++} className="italic text-slate-600 dark:text-slate-300">
          {match[3]}
        </em>
      );
    } else if (fullMatch.startsWith("`") && fullMatch.endsWith("`")) {
      parts.push(
        <code
          key={keyIndex++}
          className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700/80 font-mono text-[10px] text-teal-800 dark:text-teal-300"
        >
          {match[4]}
        </code>
      );
    }

    remaining = remaining.slice(match.index + fullMatch.length);
  }

  return <>{parts}</>;
}

// Détection d'un titre de section ou en-tête d'alerte
function isHeading(line: string): boolean {
  if (line.startsWith("### ")) return true;
  if (/^(🚨|🌡️|📅|🆔|💊|👶|👋|🇧🇯|⚠️)\s+\*\*[^*]+\*\*/.test(line)) return true;
  if (/^\*\*[^*]+:\*\*$/.test(line)) return true;
  if (/^\*\*[^*]+\*\*$/.test(line)) return true;
  return false;
}

function cleanHeadingText(line: string): string {
  if (line.startsWith("### ")) return line.replace(/^###\s+/, "");
  return line;
}

interface Block {
  type: "heading" | "paragraph" | "bullet" | "ordered";
  items?: { num?: string; text: string }[];
  text?: string;
}

export default function RichMessageContent({ content }: { content: string }) {
  if (!content) return null;

  // Découpage en blocs logiques
  const lines = content.trim().split("\n");
  const blocks: Block[] = [];
  let currentList: { num?: string; text: string }[] = [];
  let currentListType: "bullet" | "ordered" | null = null;

  const flushList = () => {
    if (currentList.length > 0 && currentListType) {
      blocks.push({
        type: currentListType,
        items: [...currentList],
      });
      currentList = [];
      currentListType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Puces à puces (• ou -)
    if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
      if (currentListType && currentListType !== "bullet") {
        flushList();
      }
      currentListType = "bullet";
      currentList.push({ text: trimmed.slice(2).trim() });
      continue;
    }

    // Listes numérotées (1. ou 2.)
    const orderedMatch = trimmed.match(/^(\d+)[\.\)]\s+(.+)$/);
    if (orderedMatch) {
      if (currentListType && currentListType !== "ordered") {
        flushList();
      }
      currentListType = "ordered";
      currentList.push({ num: orderedMatch[1], text: orderedMatch[2].trim() });
      continue;
    }

    // Autres lignes
    flushList();

    if (isHeading(trimmed)) {
      blocks.push({
        type: "heading",
        text: cleanHeadingText(trimmed),
      });
    } else {
      blocks.push({
        type: "paragraph",
        text: trimmed,
      });
    }
  }

  flushList();

  return (
    <div className="space-y-2 text-xs leading-relaxed">
      {blocks.map((block, idx) => {
        if (block.type === "heading" && block.text) {
          const isEmergency = block.text.includes("URGENCE") || block.text.includes("Vɔvɔ");
          const isWarning = block.text.includes("Paludisme") || block.text.includes("Fièvre");

          return (
            <div
              key={idx}
              className={`p-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 mt-1 mb-1 ${
                isEmergency
                  ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800"
                  : isWarning
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800"
                  : "bg-teal-50 dark:bg-teal-950/50 text-teal-950 dark:text-teal-200 border border-teal-200 dark:border-teal-800"
              }`}
            >
              <div>{renderInlineFormatted(block.text)}</div>
            </div>
          );
        }

        if (block.type === "bullet" && block.items) {
          return (
            <ul key={idx} className="space-y-1.5 my-2 pl-0.5">
              {block.items.map((item, iIdx) => (
                <li
                  key={iIdx}
                  className="flex items-start gap-2 text-slate-700 dark:text-slate-200 text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 mt-1.5 shrink-0" />
                  <span className="flex-1 leading-normal">{renderInlineFormatted(item.text)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "ordered" && block.items) {
          return (
            <ol key={idx} className="space-y-2 my-2 pl-0.5">
              {block.items.map((item, iIdx) => (
                <li
                  key={iIdx}
                  className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200 text-xs"
                >
                  <span className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-teal-200 dark:border-teal-700">
                    {item.num || iIdx + 1}
                  </span>
                  <span className="flex-1 leading-normal">{renderInlineFormatted(item.text)}</span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={idx} className="text-slate-700 dark:text-slate-200 leading-relaxed">
            {renderInlineFormatted(block.text || "")}
          </p>
        );
      })}
    </div>
  );
}
