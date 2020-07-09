const path = require('path');
const {readdirSync, statSync, writeFileSync} = require('fs');

const src = path.resolve(__dirname, `data/${process.env.NODE_LABEL}/validation`);

const labels = readdirSync(src).filter((file) => {
  if (!file.includes('.DS_Store')) {
    return statSync(`${src}/${file}`).isDirectory();
  }

  return false;
});

const json = JSON.stringify(labels);
writeFileSync(path.resolve(__dirname, `${process.env.NODE_LABEL}-labels.json`), json, 'utf8');
