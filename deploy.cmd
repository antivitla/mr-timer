git checkout gh-pages
rm -rf static index.html
cp -r dist/. ./
git add .
