import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Copy, Check, Terminal } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface CodeSnippetViewerProps {
  apiKey?: string;
  imageUrl?: string;
  format?: string;
}

type SupportedLanguage = 'curl' | 'node' | 'python' | 'php' | 'go';

export const CodeSnippetViewer: React.FC<CodeSnippetViewerProps> = ({
  apiKey = 'sc_live_your_api_key_here',
  imageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  format = 'png',
}) => {
  const [activeLang, setActiveLang] = useState<SupportedLanguage>('curl');
  const [copied, setCopied] = useState(false);
  const { addToast } = useAppStore();

  const snippets: Record<SupportedLanguage, string> = {
    curl: `curl -X POST https://api.clearcut.ai/v1/remove-background \\
  -H "x-api-key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image_url": "${imageUrl}",
    "format": "${format}"
  }'`,

    node: `// Install: npm install axios
const axios = require('axios');

async function removeBackground() {
  try {
    const response = await axios.post(
      'https://api.clearcut.ai/v1/remove-background',
      {
        image_url: '${imageUrl}',
        format: '${format}'
      },
      {
        headers: {
          'x-api-key': '${apiKey}',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Processed Cutout URL:', response.data.processed_image_url);
    console.log('Processing Time:', response.data.duration_ms + 'ms');
  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error.message);
  }
}

removeBackground();`,

    python: `# Install: pip install requests
import requests

url = "https://api.clearcut.ai/v1/remove-background"

headers = {
    "x-api-key": "${apiKey}",
    "Content-Type": "application/json"
}

payload = {
    "image_url": "${imageUrl}",
    "format": "${format}"
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()

if response.status_code == 200 and data.get("success"):
    print("Processed Image URL:", data["processed_image_url"])
else:
    print("Error:", data.get("error"))`,

    php: `<?php
// PHP cURL Integration
$curl = curl_init();

$payload = json_encode([
    'image_url' => '${imageUrl}',
    'format' => '${format}'
]);

curl_setopt_array($curl, [
    CURLOPT_URL => 'https://api.clearcut.ai/v1/remove-background',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'x-api-key: ${apiKey}',
        'Content-Type: application/json'
    ],
]);

$response = curl_exec($curl);
curl_close($curl);

$data = json_decode($response, true);
echo "Cutout URL: " . $data['processed_image_url'];
?>`,

    go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"io"
)

func main() {
	url := "https://api.clearcut.ai/v1/remove-background"
	payload := map[string]string{
		"image_url": "${imageUrl}",
		"format":    "${format}",
	}
	jsonPayload, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))
	req.Header.Set("x-api-key", "${apiKey}")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println("Response:", string(body))
}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      title: 'Code Copied',
      description: `${activeLang.toUpperCase()} snippet copied to clipboard.`,
      type: 'info',
    });
  };

  const languages: { id: SupportedLanguage; label: string }[] = [
    { id: 'curl', label: 'cURL' },
    { id: 'node', label: 'Node.js' },
    { id: 'python', label: 'Python' },
    { id: 'php', label: 'PHP' },
    { id: 'go', label: 'Go' },
  ];

  return (
    <Card variant="default" className="p-0 overflow-hidden border-border-subtle shadow-xl w-full">
      {/* Tab Switcher Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 sm:px-4 sm:py-2.5 bg-card-elevated border-b border-border-subtle">
        {/* Horizontal scrollable language tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="hidden sm:flex items-center text-text-muted mr-1.5 pl-1">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveLang(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                activeLang === lang.id
                  ? 'bg-card text-brand-cyan shadow border border-border-subtle font-bold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-card/50'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          leftIcon={copied ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
          onClick={handleCopy}
          className="text-xs shrink-0 self-end sm:self-auto py-1 px-2.5 h-8"
        >
          {copied ? 'Copied' : 'Copy Snippet'}
        </Button>
      </div>

      {/* Code Viewer Body */}
      <div className="relative bg-[#0a0f1d] overflow-x-auto">
        <pre className="p-4 sm:p-5 font-mono text-[11px] sm:text-xs text-text-secondary leading-relaxed selection:bg-brand-cyan/20 overflow-x-auto">
          <code>{snippets[activeLang]}</code>
        </pre>
      </div>
    </Card>
  );
};
