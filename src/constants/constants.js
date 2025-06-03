export const patterns = {
  apiKeys: [
    // Generic API keys
    /(['"`])[A-Za-z0-9_-]{20,}['"`]/g,
    /api[_-]?key\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /access[_-]?token\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /secret[_-]?key\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /bearer\s+[A-Za-z0-9_-]{20,}/gi,
    // AWS
    /AKIA[0-9A-Z]{16}/g,
    // GitHub
    /ghp_[A-Za-z0-9]{36}/g,
    /github_pat_[A-Za-z0-9_]{82}/g,
    // Google
    /AIza[0-9A-Za-z_-]{35}/g,
    // Stripe
    /sk_live_[0-9a-zA-Z]{24}/g,
    /pk_live_[0-9a-zA-Z]{24}/g,
    // JWT tokens
    /eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g,
  ],
  passwords: [
    /password\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /passwd\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /pwd\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /pass\s*[:=]\s*['"`][^'"`]+['"`]/gi,
  ],
  emails: [/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g],
  urls: [
    /https?:\/\/(?!example\.com)[^\s'"<>]+/g,
    /www\.(?!example\.com)[^\s'"<>]+/g,
    /[a-zA-Z0-9-]+\.(?!example\.com)[a-zA-Z]{2,}(?:\/[^\s'"<>]*)?/g,
  ],
  ips: [/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g],
  paths: [/[C-Z]:\\[^\s'"<>]+/g, /\/(?:home|Users|var|opt|etc|usr)\/[^\s'"<>]+/g, /~\/[^\s'"<>]+/g],
  dbStrings: [
    /mongodb:\/\/[^\s'"<>]+/g,
    /postgres:\/\/[^\s'"<>]+/g,
    /mysql:\/\/[^\s'"<>]+/g,
    /redis:\/\/[^\s'"<>]+/g,
    /Server\s*=\s*[^;]+;[^;]*Database\s*=\s*[^;]+/gi,
  ],
  comments: [
    /\/\/\s*TODO:.*$/gm,
    /\/\/\s*FIXME:.*$/gm,
    /\/\/\s*HACK:.*$/gm,
    /\/\*[\s\S]*?\*\//g,
    /#\s*TODO:.*$/gm,
    /#\s*FIXME:.*$/gm,
  ],
};

export const replacements = {
  apiKeys: 'API_KEY_REDACTED',
  passwords: 'PASSWORD_REDACTED',
  emails: 'user@example.com',
  urls: 'https://example.com',
  ips: '192.168.1.1',
  paths: '/path/to/file',
  dbStrings: 'database://connection_redacted',
  comments: '// Comment removed',
};
