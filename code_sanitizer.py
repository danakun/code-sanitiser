#!/usr/bin/env python3
"""
Code Data Sanitizer - CLI Version
Remove sensitive data before sharing with AI services

Usage:
    python3 code_sanitizer.py <file_path> [options]
    
Examples:
    python3 code_sanitizer.py app.py
    python3 code_sanitizer.py src/config.js --prefix "clean_"
    python3 code_sanitizer.py *.py --skip-comments --skip-emails
"""

import re
import argparse
import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple
import glob

class CodeSanitizer:
    def __init__(self):
        self.patterns = {
            'api_keys': [
                # Generic API keys
                re.compile(r"(['\"`])[A-Za-z0-9_-]{20,}['\"`]"),
                re.compile(r"api[_-]?key\s*[:=]\s*['\"`][^'\"`]+['\"`]", re.IGNORECASE),
                re.compile(r"access[_-]?token\s*[:=]\s*['\"`][^'\"`]+['\"`]", re.IGNORECASE),
                re.compile(r"secret[_-]?key\s*[:=]\s*['\"`][^'\"`]+['\"`]", re.IGNORECASE),
                re.compile(r"bearer\s+[A-Za-z0-9_-]{20,}", re.IGNORECASE),
                # AWS
                re.compile(r"AKIA[0-9A-Z]{16}"),
                # GitHub
                re.compile(r"ghp_[A-Za-z0-9]{36}"),
                re.compile(r"github_pat_[A-Za-z0-9_]{82}"),
                # Google
                re.compile(r"AIza[0-9A-Za-z_-]{35}"),
                # Stripe
                re.compile(r"sk_live_[0-9a-zA-Z]{24}"),
                re.compile(r"pk_live_[0-9a-zA-Z]{24}"),
                # JWT tokens
                re.compile(r"eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*")
            ],
            'passwords': [
                re.compile(r"password\s*[:=]\s*['\"`][^'\"`]+['\"`]", re.IGNORECASE),
                re.compile(r"passwd\s*[:=]\s*['\"`][^'\"`]+['\"`]", re.IGNORECASE),
                re.compile(r"pwd\s*[:=]\s*['\"`][^'\"`]+['\"`]", re.IGNORECASE),
                re.compile(r"pass\s*[:=]\s*['\"`][^'\"`]+['\"`]", re.IGNORECASE)
            ],
            'emails': [
                re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")
            ],
            'urls': [
                re.compile(r"https?://(?!example\.com)[^\s'\"<>]+"),
                re.compile(r"www\.(?!example\.com)[^\s'\"<>]+"),
                re.compile(r"[a-zA-Z0-9-]+\.(?!example\.com)[a-zA-Z]{2,}(?:/[^\s'\"<>]*)?")
            ],
            'ips': [
                re.compile(r"\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b"),
                re.compile(r"\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b")
            ],
            'paths': [
                re.compile(r"[C-Z]:\\[^\s'\"<>]+"),
                re.compile(r"/(?:home|Users|var|opt|etc|usr)/[^\s'\"<>]+"),
                re.compile(r"~/[^\s'\"<>]+")
            ],
            'db_strings': [
                re.compile(r"mongodb://[^\s'\"<>]+"),
                re.compile(r"postgres://[^\s'\"<>]+"),
                re.compile(r"mysql://[^\s'\"<>]+"),
                re.compile(r"redis://[^\s'\"<>]+"),
                re.compile(r"Server\s*=\s*[^;]+;[^;]*Database\s*=\s*[^;]+", re.IGNORECASE)
            ],
            'comments': [
                re.compile(r"//\s*TODO:.*$", re.MULTILINE),
                re.compile(r"//\s*FIXME:.*$", re.MULTILINE),
                re.compile(r"//\s*HACK:.*$", re.MULTILINE),
                re.compile(r"/\*[\s\S]*?\*/"),
                re.compile(r"#\s*TODO:.*$", re.MULTILINE),
                re.compile(r"#\s*FIXME:.*$", re.MULTILINE)
            ]
        }
        
        self.replacements = {
            'api_keys': 'API_KEY_REDACTED',
            'passwords': 'PASSWORD_REDACTED',
            'emails': 'user@example.com',
            'urls': 'https://example.com',
            'ips': '192.168.1.1',
            'paths': '/path/to/file',
            'db_strings': 'database://connection_redacted',
            'comments': '// Comment removed'
        }
        
        self.sanitized_indicators = [
            'API_KEY_REDACTED',
            'PASSWORD_REDACTED',
            'user@example.com',
            'https://example.com',
            '192.168.1.1',
            '/path/to/file',
            'database://connection_redacted',
            'Comment removed'
        ]

    def is_already_sanitized(self, content: str) -> bool:
        """Check if content appears to already be sanitized"""
        indicator_count = sum(1 for indicator in self.sanitized_indicators if indicator in content)
        return indicator_count >= 3

    def sanitize_content(self, content: str, options: Dict[str, bool]) -> Tuple[str, int]:
        """Sanitize content based on selected options"""
        if self.is_already_sanitized(content):
            return content, 0
        
        sanitized = content
        total_replacements = 0
        
        for option, enabled in options.items():
            if not enabled or option not in self.patterns:
                continue
                
            for pattern in self.patterns[option]:
                matches = pattern.findall(sanitized)
                if matches:
                    # Count matches that aren't already sanitized
                    valid_matches = [
                        match for match in matches 
                        if not any(indicator in str(match) for indicator in self.sanitized_indicators)
                    ]
                    total_replacements += len(valid_matches)
                    
                    # Replace matches
                    def replace_match(match_obj):
                        match_text = match_obj.group(0)
                        # Skip if already sanitized
                        if any(indicator in match_text for indicator in self.sanitized_indicators):
                            return match_text
                        
                        # Special handling for key-value pairs
                        if option in ['api_keys', 'passwords'] and '=' in match_text:
                            parts = match_text.split('=', 1)
                            return f"{parts[0]}=\"{self.replacements[option]}\""
                        elif option == 'comments' and match_text.startswith('/*'):
                            return '/* Comment removed */'
                        
                        return self.replacements[option]
                    
                    sanitized = pattern.sub(replace_match, sanitized)
        
        return sanitized, total_replacements

    def process_file(self, file_path: str, options: Dict[str, bool], prefix: str = "sanitized_") -> Dict:
        """Process a single file"""
        try:
            # Try to read file with UTF-8, fallback to other encodings
            encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']
            original_content = None
            used_encoding = None
            
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        original_content = f.read()
                    used_encoding = encoding
                    break
                except UnicodeDecodeError:
                    continue
            
            if original_content is None:
                raise Exception("Could not decode file with any supported encoding")
            
            # Sanitize content
            sanitized_content, replacements = self.sanitize_content(original_content, options)
            
            # Generate output filename
            path = Path(file_path)
            output_file = path.parent / f"{prefix}{path.name}"
            
            # Write sanitized file using the same encoding
            with open(output_file, 'w', encoding=used_encoding) as f:
                f.write(sanitized_content)
            
            return {
                'success': True,
                'input_file': file_path,
                'output_file': str(output_file),
                'replacements': replacements,
                'lines': len(sanitized_content.splitlines()),
                'chars_removed': len(original_content) - len(sanitized_content),
                'encoding': used_encoding
            }
            
        except Exception as e:
            return {
                'success': False,
                'input_file': file_path,
                'error': str(e)
            }

def create_parser():
    """Create command line argument parser"""
    parser = argparse.ArgumentParser(
        description='Remove sensitive data from code files before sharing with AI services',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python3 code_sanitizer.py app.py
    python3 code_sanitizer.py index.html --prefix "clean_"
    python3 code_sanitizer.py main.js --prefix "safe_"
    python3 code_sanitizer.py "*.html" "*.js" "*.css" --skip-comments
    python3 code_sanitizer.py project/ --recursive --prefix "sanitized_"
    python3 code_sanitizer.py *.php *.jsx *.ts --verbose
        """
    )
    
    parser.add_argument('files', nargs='+', help='File(s) or pattern to sanitize')
    parser.add_argument('--prefix', '-p', default='sanitized_', 
                       help='Prefix for output files (default: sanitized_)')
    parser.add_argument('--recursive', '-r', action='store_true',
                       help='Process directories recursively')
    
    # Options to skip certain types
    parser.add_argument('--skip-api-keys', action='store_true',
                       help='Skip API keys and tokens')
    parser.add_argument('--skip-passwords', action='store_true',
                       help='Skip passwords')
    parser.add_argument('--skip-emails', action='store_true',
                       help='Skip email addresses')
    parser.add_argument('--skip-urls', action='store_true',
                       help='Skip URLs and domains')
    parser.add_argument('--skip-ips', action='store_true',
                       help='Skip IP addresses')
    parser.add_argument('--skip-paths', action='store_true',
                       help='Skip file paths')
    parser.add_argument('--skip-db-strings', action='store_true',
                       help='Skip database connection strings')
    parser.add_argument('--skip-comments', action='store_true',
                       help='Skip personal comments')
    
    parser.add_argument('--quiet', '-q', action='store_true',
                       help='Suppress output except errors')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Show detailed output')
    
    return parser

def get_files_to_process(file_patterns: List[str], recursive: bool = False) -> List[str]:
    """Get list of files to process from patterns"""
    files = []
    
    # Common code file extensions
    code_extensions = {
        '.py', '.js', '.ts', '.jsx', '.tsx', '.html', '.htm', '.css', '.scss', '.sass',
        '.php', '.rb', '.go', '.java', '.c', '.cpp', '.h', '.hpp', '.cs', '.swift',
        '.kt', '.rs', '.vue', '.svelte', '.json', '.xml', '.yaml', '.yml', '.toml',
        '.ini', '.cfg', '.conf', '.env', '.sh', '.bat', '.ps1', '.sql', '.r', '.m',
        '.scala', '.clj', '.hs', '.elm', '.dart', '.lua', '.pl', '.pm', '.tcl'
    }
    
    for pattern in file_patterns:
        if os.path.isfile(pattern):
            files.append(pattern)
        elif os.path.isdir(pattern):
            if recursive:
                for root, _, filenames in os.walk(pattern):
                    for filename in filenames:
                        if not filename.startswith('.'):  # Skip hidden files
                            # Check if it's a code file or process all files
                            file_path = os.path.join(root, filename)
                            _, ext = os.path.splitext(filename)
                            if ext.lower() in code_extensions or not ext:  # Include extensionless files
                                files.append(file_path)
            else:
                print(f"Warning: {pattern} is a directory. Use --recursive to process directories.")
        else:
            # Treat as glob pattern
            matched_files = glob.glob(pattern)
            if matched_files:
                files.extend(matched_files)
            else:
                print(f"Warning: No files found matching pattern: {pattern}")
    
    return list(set(files))  # Remove duplicates

def print_results(results: List[Dict], quiet: bool = False, verbose: bool = False):
    """Print processing results"""
    if quiet:
        return
    
    total_files = len(results)
    successful = [r for r in results if r['success']]
    failed = [r for r in results if not r['success']]
    total_replacements = sum(r.get('replacements', 0) for r in successful)
    
    print("\n" + "="*60)
    print("📄 CODE SANITIZER RESULTS")
    print("="*60)
    
    if successful:
        print(f"✅ Successfully processed: {len(successful)} files")
        print(f"🔧 Total replacements made: {total_replacements}")
        
        if verbose:
            print("\nDetailed Results:")
            print("-" * 40)
            for result in successful:
                print(f"📁 {result['input_file']}")
                print(f"   → {result['output_file']}")
                print(f"   🔄 {result['replacements']} replacements")
                print(f"   📊 {result['lines']} lines, {abs(result['chars_removed'])} chars changed")
                print()
    
    if failed:
        print(f"\n❌ Failed to process: {len(failed)} files")
        if verbose:
            for result in failed:
                print(f"   📁 {result['input_file']}: {result['error']}")
    
    print("="*60)

def main():
    """Main function"""
    parser = create_parser()
    args = parser.parse_args()
    
    # Get options
    options = {
        'api_keys': not args.skip_api_keys,
        'passwords': not args.skip_passwords,
        'emails': not args.skip_emails,
        'urls': not args.skip_urls,
        'ips': not args.skip_ips,
        'paths': not args.skip_paths,
        'db_strings': not args.skip_db_strings,
        'comments': not args.skip_comments
    }
    
    # Get files to process
    files_to_process = get_files_to_process(args.files, args.recursive)
    
    if not files_to_process:
        print("❌ No files found to process.")
        sys.exit(1)
    
    if not args.quiet:
        print(f"🚀 Processing {len(files_to_process)} file(s)...")
    
    # Create sanitizer and process files
    sanitizer = CodeSanitizer()
    results = []
    
    for file_path in files_to_process:
        if not args.quiet:
            print(f"   Processing: {file_path}")
        
        result = sanitizer.process_file(file_path, options, args.prefix)
        results.append(result)
        
        if not result['success'] and not args.quiet:
            print(f"   ❌ Error: {result['error']}")
    
    # Print results
    print_results(results, args.quiet, args.verbose)
    
    # Exit with appropriate code
    failed_count = len([r for r in results if not r['success']])
    sys.exit(1 if failed_count > 0 else 0)

if __name__ == "__main__":
    main()