
git checkout gh-pages
rm -rf static index.html
cp -r dist/. ./
git add .
git commit
git pull
git push
