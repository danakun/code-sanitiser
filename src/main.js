import './styles/style.css';
import { patterns, replacements } from './constants/constants';

let totalReplacements = 0;
let totalCharsRemoved = 0;
let originalCode = '';
let sanitizedCode = '';

window.sanitizeCode = function () {
  const inputCode = document.getElementById('inputCode').value;
  if (!inputCode.trim()) return;

  originalCode = inputCode;
  sanitizedCode = inputCode;
  totalReplacements = 0;
  totalCharsRemoved = 0;
  const originalLength = inputCode.length;

  // Check if code is already sanitized (need multiple indicators to be sure)
  const alreadySanitizedIndicators = [
    'API_KEY_REDACTED',
    'PASSWORD_REDACTED',
    'user@example.com',
    'https://example.com',
    '192.168.1.1',
    '/path/to/file',
    'database://connection_redacted',
    'Comment removed',
  ];

  const sanitizedIndicatorCount = alreadySanitizedIndicators.filter(indicator =>
    inputCode.includes(indicator)
  ).length;

  // Only consider it sanitized if it has 3+ sanitized placeholders
  if (sanitizedIndicatorCount >= 3) {
    document.getElementById('outputCode').value = inputCode;
    document.getElementById('stats').style.display = 'none';
    document.getElementById('diffView').style.display = 'none';
    showMessage('This code appears to already be sanitized. No changes needed.', 'warning');
    return;
  }

  // Get selected options
  const options = [
    'apiKeys',
    'passwords',
    'emails',
    'urls',
    'ips',
    'paths',
    'dbStrings',
    'comments',
  ];

  options.forEach(option => {
    if (document.getElementById(option).checked) {
      patterns[option].forEach(pattern => {
        const matches = sanitizedCode.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // Skip if already a sanitized placeholder
            if (alreadySanitizedIndicators.some(indicator => match.includes(indicator))) {
              return;
            }
            totalReplacements++;
          });

          sanitizedCode = sanitizedCode.replace(pattern, match => {
            // Skip if already sanitized
            if (alreadySanitizedIndicators.some(indicator => match.includes(indicator))) {
              return match;
            }

            // Special handling for different types
            if (option === 'apiKeys' && match.includes('=')) {
              return match.split('=')[0] + '=' + `"${replacements[option]}"`;
            } else if (option === 'passwords' && match.includes('=')) {
              return match.split('=')[0] + '=' + `"${replacements[option]}"`;
            } else if (option === 'comments' && match.startsWith('/*')) {
              return '/* Comment removed */';
            }
            return replacements[option];
          });
        }
      });
    }
  });

  totalCharsRemoved = originalLength - sanitizedCode.length;
  const linesProcessed = sanitizedCode.split('\n').length;

  // Update output
  document.getElementById('outputCode').value = sanitizedCode;

  // Generate and show diff
  generateDiff();

  // Update stats
  document.getElementById('replacements').textContent = totalReplacements;
  document.getElementById('linesProcessed').textContent = linesProcessed;
  document.getElementById('charsRemoved').textContent = Math.abs(totalCharsRemoved);
  document.getElementById('stats').style.display = 'flex';
  document.getElementById('diffView').style.display = 'block';

  // Show result message
  if (totalReplacements > 0) {
    showMessage(
      `Successfully sanitized ${totalReplacements} sensitive items from your code!`,
      'success'
    );
  } else {
    showMessage('No sensitive data detected in your code.', 'warning');
  }
};

function generateDiff() {
  const originalLines = originalCode.split('\n');
  const sanitizedLines = sanitizedCode.split('\n');
  const diffContent = document.getElementById('diffContent');

  diffContent.innerHTML = '';

  const maxLines = Math.max(originalLines.length, sanitizedLines.length);

  for (let i = 0; i < maxLines; i++) {
    const originalLine = originalLines[i] || '';
    const sanitizedLine = sanitizedLines[i] || '';

    if (originalLine === sanitizedLine) {
      // Unchanged line
      const lineDiv = document.createElement('div');
      lineDiv.className = 'diff-line line-unchanged';
      lineDiv.innerHTML = `
                <div class="line-number">${i + 1}</div>
                <div class="line-content">${escapeHtml(originalLine)}</div>
            `;
      diffContent.appendChild(lineDiv);
    } else {
      // Show removed line (original)
      if (originalLine) {
        const removedDiv = document.createElement('div');
        removedDiv.className = 'diff-line line-removed';
        removedDiv.innerHTML = `
                    <div class="line-number">-${i + 1}</div>
                    <div class="line-content">- ${escapeHtml(originalLine)}</div>
                `;
        diffContent.appendChild(removedDiv);
      }

      // Show added line (sanitized)
      if (sanitizedLine) {
        const addedDiv = document.createElement('div');
        addedDiv.className = 'diff-line line-added';
        addedDiv.innerHTML = `
                    <div class="line-number">+${i + 1}</div>
                    <div class="line-content">+ ${escapeHtml(sanitizedLine)}</div>
                `;
        diffContent.appendChild(addedDiv);
      }
    }
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.showDiff = function () {
  document.getElementById('diffContainer').style.display = 'block';
  document.querySelector('.output-section').style.display = 'none';

  // Update toggle buttons
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
};

window.showOutput = function () {
  document.getElementById('diffContainer').style.display = 'none';
  document.querySelector('.output-section').style.display = 'block';

  // Update toggle buttons
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
};

window.clearAll = function () {
  document.getElementById('inputCode').value = '';
  document.getElementById('outputCode').value = '';
  document.getElementById('stats').style.display = 'none';
  document.getElementById('diffView').style.display = 'none';
  originalCode = '';
  sanitizedCode = '';
  clearMessages();
};

window.copyOutput = function () {
  const outputCode = sanitizedCode || document.getElementById('outputCode').value;
  if (!outputCode.trim()) {
    showMessage('No output to copy. Please sanitize some code first.', 'warning');
    return;
  }

  navigator.clipboard
    .writeText(outputCode)
    .then(() => {
      showMessage('Sanitized code copied to clipboard!', 'success');
    })
    .catch(() => {
      showMessage('Failed to copy to clipboard. Please select and copy manually.', 'warning');
    });
};

function showMessage(message, type) {
  clearMessages();
  const messageDiv = document.createElement('div');
  messageDiv.className = type;
  messageDiv.textContent = message;

  const controls = document.querySelector('.controls');
  controls.parentNode.insertBefore(messageDiv, controls.nextSibling);

  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

function clearMessages() {
  const messages = document.querySelectorAll('.warning, .success');
  messages.forEach(msg => msg.remove());
}

// Auto-resize textareas
document.querySelectorAll('textarea').forEach(textarea => {
  textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.max(200, this.scrollHeight) + 'px';
  });
});

// Sample code for testing
document.getElementById('inputCode').value = `// Sample code with sensitive data
const config = {
    apiKey: "sk_live_51H9j4kL2Kk3j2k5k6k7k8k9",
    password: "mySecretPassword123",
    databaseUrl: "mongodb://user:pass@cluster.mongodb.net/mydb",
    email: "john.doe@company.com",
    serverUrl: "https://api.mycompany.com/v1",
    backupPath: "/Users/john/Documents/backups"
};

// TODO: Fix this security issue
const token = "ghp_1234567890abcdef1234567890abcdef12345678";`;
