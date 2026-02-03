"use client";

import { useEffect, useState } from "react";
import { siteUrl } from "@/app/seo-metadata";

export default function BookmarkletPage() {
  const [bookmarkletCode, setBookmarkletCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const code = `javascript:(function(){var s=document.createElement('script');s.src='${siteUrl}/api/bookmarklet?t='+Date.now();document.head.appendChild(s);})();`;
    setBookmarkletCode(code);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookmarkletCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        Photo To URL Bookmarklet
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Upload images from any webpage directly to Photo To URL with a single click!
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          How It Works
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-slate-700">
          <li>Browse any webpage with images</li>
          <li>Click the bookmarklet in your bookmarks bar</li>
          <li>Select an image from the page</li>
          <li>Get the URL instantly and copy it!</li>
        </ol>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Installation
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Step 1: Copy the Bookmarklet Code
            </h3>
            <p className="text-slate-600 mb-3">
              Click the button below to copy the bookmarklet code to your clipboard.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-2">
              <code className="text-sm text-slate-800 break-all">
                {bookmarkletCode}
              </code>
            </div>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-2">
              Step 2: Add to Your Browser
            </h3>
            <p className="text-slate-600 mb-3">
              Follow these steps based on your browser:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded p-4">
              <ol className="list-decimal list-inside space-y-2 text-slate-700 text-sm">
                <li>
                  <strong>Chrome/Edge:</strong> Press Ctrl+Shift+B (Cmd+Shift+B on Mac) to show the bookmarks bar, then right-click it and select "Add page". Paste the code as the URL.
                </li>
                <li>
                  <strong>Firefox:</strong> Right-click the bookmarks bar and select "New Bookmark". Paste the code as the Location.
                </li>
                <li>
                  <strong>Safari:</strong> Enable the bookmarks bar (View → Show Bookmarks Bar), then drag the code to the bookmarks bar.
                </li>
                <li>
                  <strong>Alternative:</strong> Create a new bookmark, edit it, and replace the URL with the copied code.
                </li>
              </ol>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-2">
              Step 3: Start Using It!
            </h3>
            <p className="text-slate-600">
              Visit any webpage with images and click your bookmarklet to start uploading!
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Features
        </h2>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li>Select any image from the current webpage</li>
          <li>Automatic upload to Photo To URL</li>
          <li>Get a shareable URL instantly</li>
          <li>One-click copy to clipboard</li>
        </ul>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> The bookmarklet works on most websites. Some sites with strict security policies (CORS) may prevent image uploads.
        </p>
      </div>
    </div>
  );
}
