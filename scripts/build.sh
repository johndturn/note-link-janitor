tsc -p . --outDir dist
chmod +x dist/index.js
rm -rf ~/Developer/Personal/personal-site/scripts/note-link-janitor/
cp -r dist/ ~/Developer/Personal/personal-site/scripts/note-link-janitor/
