# Vanilla JS Project Template

A modern vanilla JavaScript project template with Prettier formatting, ESLint linting, and conventional commit setup.

## Features

- 🚀 [Vite](https://vitejs.dev/) for fast development and optimized builds
- 🧹 [ESLint](https://eslint.org/) for code quality
- ✨ [Prettier](https://prettier.io/) for consistent code formatting
- 📝 [Conventional Commits](https://www.conventionalcommits.org/) for standardized commit messages
- 🪝 [Husky](https://typicode.github.io/husky/) for Git hooks
- 🧪 Automated linting and formatting on commit

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run commit` - Use commitizen for conventional commits

## Committing Changes

This project uses [conventional commits](https://www.conventionalcommits.org/) for standardized commit messages.

To make a commit:

```bash
git add .
npm run commit
```

Follow the prompts to create a properly formatted commit message.

## Project Structure

```
/
├── src/                    # Source files
│   ├── components/         # UI components
│   ├── constants/          # Constants and config
│   ├── styles/             # CSS styles
│   └── main.js             # Application entry point
├── public/                 # Static assets
├── .eslintrc.json          # ESLint configuration
├── .prettierrc.json        # Prettier configuration
├── commitlint.config.js    # Commitlint configuration
└── index.html              # HTML entry point
```

## License

MIT