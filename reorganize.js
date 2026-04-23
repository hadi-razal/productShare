const fs = require('fs');
const path = require('path');

const dashboardStorePath = path.join(__dirname, 'app', '(dashboard)', 'store');
const storefrontStorePath = path.join(__dirname, 'app', '(storefront)', 'store');

fs.mkdirSync(dashboardStorePath, { recursive: true });
fs.mkdirSync(storefrontStorePath, { recursive: true });

const sourceStore = path.join(__dirname, 'app', 'store');

const files = fs.readdirSync(sourceStore);

for (const file of files) {
  if (file === '[storeId]') {
    fs.renameSync(path.join(sourceStore, file), path.join(storefrontStorePath, file));
  } else {
    fs.renameSync(path.join(sourceStore, file), path.join(dashboardStorePath, file));
  }
}

fs.rmdirSync(sourceStore);
console.log('Done reorganizing.');
