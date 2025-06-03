# Code Sanitizer

A professional web-based tool for removing sensitive data from code before sharing with AI services like Claude, ChatGPT, or GitHub Copilot. Features a clean, minimal interface with GitHub-style diff visualization to show exactly what changes were made.

![Code Sanitizer Screenshot](https://via.placeholder.com/800x400/000000/FFFFFF?text=Code+Sanitizer)

## 🔒 Why Use Code Sanitizer?

When working with AI coding assistants, you often need to share code that contains:

- API keys and tokens
- Database credentials
- Personal email addresses
- Internal URLs and IP addresses
- File system paths
- Sensitive comments

This tool automatically detects and replaces sensitive information with safe placeholders while preserving your code's structure and functionality.

## ✨ Features

### 🎯 Comprehensive Detection

- **API Keys**: AWS, GitHub, Google, Stripe, JWT tokens
- **Database Strings**: MongoDB, PostgreSQL, Redis, MySQL connections
- **Personal Information**: Email addresses, phone numbers
- **Network Data**: URLs, IP addresses, domain names
- **System Paths**: Windows, macOS, and Linux file paths
- **Comments**: TODO, FIXME, and personal notes

### 🔍 GitHub-Style Diff View

- Visual before/after comparison
- Line-by-line change highlighting
- Red highlighting for removed sensitive data
- Green highlighting for safe replacements
- Toggle between diff and clean output views

### 🎨 Professional Interface

- Clean, minimal black & white design
- Monospace fonts for code readability
- Responsive design for all devices
- Real-time statistics and feedback

### 🛡️ Smart Protection

- Detects already-sanitized code
- Preserves code structure and syntax
- Configurable detection options
- Safe placeholder replacements

## 🚀 Getting Started

### Quick Start

1. Open the Code Sanitizer in your web browser
2. Paste your code into the input area
3. Select which types of data to sanitize (all enabled by default)
4. Click "Sanitize Code"
5. Review changes in the diff view
6. Copy the clean output to share safely

### Example Usage

**Before Sanitization:**

```javascript
const config = {
  apiKey: 'sk_live_51H9j4kL2Kk3j2k5k6k7k8k9',
  email: 'john.doe@company.com',
  dbUrl: 'mongodb://user:pass@cluster.mongodb.net/db',
};
```

**After Sanitization:**

```javascript
const config = {
  apiKey: 'API_KEY_REDACTED',
  email: 'user@example.com',
  dbUrl: 'database://connection_redacted',
};
```

## 🔧 Configuration Options

| Option            | Description                        | Default     |
| ----------------- | ---------------------------------- | ----------- |
| API Keys & Tokens | AWS, GitHub, Google, Stripe, JWT   | ✅ Enabled  |
| Passwords         | Password fields and secrets        | ✅ Enabled  |
| Email Addresses   | Personal and business emails       | ✅ Enabled  |
| URLs & Domains    | Web addresses and domains          | ✅ Enabled  |
| IP Addresses      | IPv4 and IPv6 addresses            | ✅ Enabled  |
| File Paths        | System file and directory paths    | ✅ Enabled  |
| Database Strings  | Connection strings and credentials | ✅ Enabled  |
| Personal Comments | TODO, FIXME, personal notes        | ❌ Disabled |

## 🎯 Detection Patterns

### API Keys & Tokens

- Generic API keys (20+ characters)
- AWS access keys (`AKIA...`)
- GitHub tokens (`ghp_...`, `github_pat_...`)
- Google API keys (`AIza...`)
- Stripe keys (`sk_live_...`, `pk_live_...`)
- JWT tokens (`eyJ...`)

### Database Connections

- MongoDB connection strings
- PostgreSQL connection strings
- Redis connection strings
- MySQL connection strings
- Generic database URLs

### Network Information

- HTTP/HTTPS URLs
- Domain names
- IPv4 addresses
- IPv6 addresses
- Internal network addresses

### System Paths

- Windows paths (`C:\Users\...`)
- Unix/Linux paths (`/home/...`, `/var/...`)
- macOS paths (`/Users/...`)
- Relative paths (`~/...`)

## 🛡️ Security & Privacy

### Client-Side Processing

- **No data transmission**: All processing happens in your browser
- **No server uploads**: Your code never leaves your device
- **No logging**: No sensitive data is stored or tracked
- **Offline capable**: Works without internet connection

### Safe Replacements

- Maintains code structure and syntax
- Uses recognizable placeholder values
- Preserves variable names and logic
- Ensures code remains functional

## 💻 Technical Details

### Built With

- Pure HTML, CSS, and JavaScript
- No external dependencies
- Modern browser features
- Responsive CSS Grid and Flexbox

### Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### File Size

- HTML: ~15KB
- No external resources required
- Loads instantly

## 🔄 Diff View Features

The diff view provides GitHub-style visualization of changes:

- **Line numbers** with +/- indicators
- **Red highlighting** for removed sensitive data
- **Green highlighting** for added safe replacements
- **Unchanged lines** shown in normal styling
- **Scrollable container** for long files
- **Toggle between views** (diff vs clean output)

## 📋 Use Cases

### Before Sharing with AI

- ChatGPT code assistance
- Claude code review
- GitHub Copilot prompts
- Stack Overflow questions

### Before Code Reviews

- Internal team reviews
- Open source contributions
- Documentation examples
- Tutorial content

### Before Demos

- Client presentations
- Conference talks
- Video tutorials
- Blog posts

## ⚡ Performance

- **Instant processing** for files up to 10MB
- **Real-time stats** showing replacements made
- **Memory efficient** client-side processing
- **No network latency** concerns

## 🔮 Future Enhancements

- [ ] Custom replacement patterns
- [ ] Export/import configuration
- [ ] Additional language support
- [ ] Undo/redo functionality

**⚠️ Important**: Always review the diff output before sharing sanitized code to ensure all sensitive data has been properly removed and your code remains functional.
