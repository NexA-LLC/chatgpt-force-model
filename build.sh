#!/bin/bash

# Chrome Web Store submission build script

# Exit on error
set -e

echo "🚀 Building Chrome extension for submission..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Create directories
echo "📁 Creating directories..."
mkdir -p dist
mkdir -p releases

# Copy necessary files
echo "📋 Copying extension files..."
cp manifest.json dist/
cp content.js dist/
cp background.js dist/
cp options.html dist/
cp options.js dist/
cp shared.js dist/
cp icon*.png dist/

# Get version from manifest.json
VERSION=$(grep -o '"version": "[^"]*"' manifest.json | cut -d'"' -f4)
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Create submission zip
echo "📦 Creating submission zip..."
cd dist
zip -r ../releases/chatgpt-force-model-v${VERSION}-submission-${TIMESTAMP}.zip . -x ".*" -x "__MACOSX/*" -x "*.DS_Store"
cd ..

# Create source code zip (required by Chrome Web Store)
echo "📦 Creating source code zip..."
zip -r releases/chatgpt-force-model-v${VERSION}-source-${TIMESTAMP}.zip . \
  -x ".*" \
  -x "__MACOSX/*" \
  -x "*.DS_Store" \
  -x "dist/*" \
  -x "releases/*" \
  -x "*.zip" \
  -x "node_modules/*" \
  -x ".git/*"

# Create symlinks for latest versions
ln -sf chatgpt-force-model-v${VERSION}-submission-${TIMESTAMP}.zip releases/latest-submission.zip
ln -sf chatgpt-force-model-v${VERSION}-source-${TIMESTAMP}.zip releases/latest-source.zip

echo "✅ Build complete!"
echo ""
echo "📦 Generated files in releases/:"
echo "  - chatgpt-force-model-v${VERSION}-submission-${TIMESTAMP}.zip (for Chrome Web Store upload)"
echo "  - chatgpt-force-model-v${VERSION}-source-${TIMESTAMP}.zip (source code archive)"
echo "  - latest-submission.zip (symlink to latest submission)"
echo "  - latest-source.zip (symlink to latest source)"
echo ""
echo "📋 Next steps:"
echo "  1. Go to https://chrome.google.com/webstore/devconsole/"
echo "  2. Click 'New Item' and upload the submission zip from releases/"
echo "  3. Fill in the required information"
echo "  4. Submit for review"
