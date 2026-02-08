"use client";

import React from "react";

interface MarkdownContentProps {
  content: string;
}

// Enhanced Markdown to HTML converter
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Code blocks first (to avoid processing content inside code blocks)
  const codeBlocks: string[] = [];
  html = html.replace(/```[\s\S]*?```/gim, (match) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(match);
    return placeholder;
  });

  // Inline code (but not inside code blocks)
  html = html.replace(/`([^`\n]+)`/gim, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800">$1</code>');

  // Headers
  html = html.replace(/^#### (.*$)/gim, "<h4 class='text-xl font-bold text-slate-900 mt-8 mb-4'>$1</h4>");
  html = html.replace(/^### (.*$)/gim, "<h3 class='text-2xl font-bold text-slate-900 mt-8 mb-4'>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2 class='text-3xl font-bold text-slate-900 mt-10 mb-6'>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1 class='text-4xl font-bold text-slate-900 mt-10 mb-6'>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong class='font-semibold text-slate-900'>$1</strong>");

  // Italic (but not bold)
  html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/gim, "<em>$1</em>");

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:text-blue-700 underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, "<blockquote class='border-l-4 border-blue-500 pl-4 italic text-slate-600 my-4'>$1</blockquote>");

  // Horizontal rules
  html = html.replace(/^---$/gim, "<hr class='my-8 border-slate-200' />");

  // Process lists - unordered lists
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inUnorderedList = false;
  let inOrderedList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const unorderedMatch = line.match(/^[\s]*[-*+] (.+)$/);
    const orderedMatch = line.match(/^[\s]*(\d+)\. (.+)$/);

    if (unorderedMatch) {
      if (!inUnorderedList) {
        if (inOrderedList) {
          processedLines.push('</ol>');
          inOrderedList = false;
        }
        processedLines.push('<ul class="list-disc pl-6 my-4 space-y-2">');
        inUnorderedList = true;
      }
      processedLines.push(`<li class="text-slate-700">${unorderedMatch[1]}</li>`);
    } else if (orderedMatch) {
      if (!inOrderedList) {
        if (inUnorderedList) {
          processedLines.push('</ul>');
          inUnorderedList = false;
        }
        processedLines.push('<ol class="list-decimal pl-6 my-4 space-y-2">');
        inOrderedList = true;
      }
      processedLines.push(`<li class="text-slate-700">${orderedMatch[2]}</li>`);
    } else {
      if (inUnorderedList) {
        processedLines.push('</ul>');
        inUnorderedList = false;
      }
      if (inOrderedList) {
        processedLines.push('</ol>');
        inOrderedList = false;
      }
      processedLines.push(line);
    }
  }

  // Close any open lists
  if (inUnorderedList) processedLines.push('</ul>');
  if (inOrderedList) processedLines.push('</ol>');

  html = processedLines.join('\n');

  // Restore code blocks
  codeBlocks.forEach((codeBlock, index) => {
    const code = codeBlock.replace(/```[\w]*\n?/g, '').trim();
    html = html.replace(
      `__CODE_BLOCK_${index}__`,
      `<pre class="bg-slate-100 border border-slate-200 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono text-slate-800">${code}</code></pre>`
    );
  });

  // Process paragraphs (split by double newlines, but preserve existing HTML)
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs.map((para) => {
    para = para.trim();
    if (!para) return '';
    
    // Skip if already wrapped in HTML tags
    if (para.match(/^<(h[1-6]|ul|ol|pre|blockquote|hr)/)) {
      return para;
    }
    
    // Skip if it's a list item (already processed)
    if (para.match(/^<li/)) {
      return para;
    }
    
    return `<p class="text-slate-700 leading-relaxed mb-4">${para}</p>`;
  }).join('\n');

  return html;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const htmlContent = markdownToHtml(content);

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
