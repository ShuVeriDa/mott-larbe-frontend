"use client";

import { Extension } from "@tiptap/core";
import type { Node as PmNode } from "@tiptap/pm/model";
import type { EditorState, Transaction } from "@tiptap/pm/state";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { RuleCategory, RuleConfidence } from "./chechen-spelling-rules";
import { CHECHEN_SPELLING_RULES } from "./chechen-spelling-rules";

const pluginKey = new PluginKey<DecorationSet>("chechenSpellingDecoration");

/**
 * CSS class pattern: chechen-spell-{category}-{confidence}
 * e.g. chechen-spell-ya-yu-certain, chechen-spell-diphthong-likely
 */
const cssClass = (category: RuleCategory, confidence: RuleConfidence) =>
  `chechen-spell chechen-spell-${category}-${confidence}`;

const buildDecorations = (doc: PmNode): DecorationSet => {
  const decorations: Decoration[] = [];

  doc.descendants((node: PmNode, pos: number) => {
    if (!node.isText || !node.text) return;

    const text = node.text;

    for (const rule of CHECHEN_SPELLING_RULES) {
      rule.pattern.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = rule.pattern.exec(text)) !== null) {
        const from = pos + match.index;
        const to = from + match[0].length;
        decorations.push(
          Decoration.inline(from, to, {
            class: cssClass(rule.category, rule.confidence),
            "data-chechen-rule": rule.name,
          }),
        );
      }
    }
  });

  return DecorationSet.create(doc, decorations);
};

export const ChechenSpellingDecorationExtension = Extension.create({
  name: "chechenSpellingDecoration",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: pluginKey,
        state: {
          init(_, { doc }): DecorationSet {
            return buildDecorations(doc);
          },
          apply(
            tr: Transaction,
            oldDeco: DecorationSet,
            _oldState: EditorState,
            newState: EditorState,
          ): DecorationSet {
            if (tr.docChanged) return buildDecorations(newState.doc);
            return oldDeco.map(tr.mapping, newState.doc);
          },
        },
        props: {
          decorations(state: EditorState) {
            return pluginKey.getState(state) ?? DecorationSet.empty;
          },
        },
      }),
    ];
  },
});
