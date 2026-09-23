const { chromium } = require("playwright");
const fs = require("node:fs");
const ts = require("typescript");
const assert = require("node:assert/strict");

(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.platform === "win32" ? "msedge" : undefined });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.setContent('<div id="root"></div>');
    await page.addScriptTag({ path: require.resolve("../node_modules/react/umd/react.development.js") });
    await page.addScriptTag({ path: require.resolve("../node_modules/react-dom/umd/react-dom.development.js") });
    const css = fs.readFileSync("app/globals.css", "utf8");
    await page.addStyleTag({ content: css.slice(css.indexOf(".sf-banner-slider")) });
    const code = ts.transpileModule(fs.readFileSync("components/StoreBannerSlider.tsx", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true } }).outputText;
    await page.evaluate((source) => {
      const module = { exports: {} };
      const require = (name) => name === "react" ? window.React : name === "next/image" ? (props) => window.React.createElement("img", { src: props.src, alt: props.alt, style: { ...props.style, width: "100%", height: "100%", position: "absolute" } }) : { FiChevronLeft: () => "‹", FiChevronRight: () => "›" };
      new Function("require", "module", "exports", "React", source)(require, module, module.exports, window.React);
      window.slider = module.exports.default;
      window.root = window.ReactDOM.createRoot(document.getElementById("root"));
      window.banners = [1, 2, 3].map(i => ({ url: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="600"><rect width="1600" height="600" fill="#ddd"/></svg>`), alt: `Offer ${i}` }));
      window.root.render(window.React.createElement(window.slider, { banners: window.banners }));
    }, code);
    await page.getByAltText("Offer 1").waitFor();
    await page.getByRole("button", { name: "Next banner" }).click();
    await page.getByAltText("Offer 2").waitFor();
    await page.getByRole("button", { name: "Show banner 3" }).click();
    await page.getByAltText("Offer 3").waitFor();
    await page.getByRole("button", { name: "Next banner" }).click();
    await page.getByAltText("Offer 1").waitFor();
    await page.getByRole("button", { name: "Previous banner" }).click();
    await page.getByAltText("Offer 3").waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.evaluate(() => window.root.render(window.React.createElement(window.slider, { banners: window.banners.slice(0, 1) })));
    await page.getByAltText("Offer 1").waitFor();
    assert.equal(await page.getByRole("button", { name: "Next banner" }).count(), 0);
    await page.clock.install();
    await page.mouse.move(380, 800);
    await page.evaluate(() => window.root.render(window.React.createElement(window.slider, { key: "autoplay", banners: window.banners })));
    await page.getByRole("button", { name: "Pause auto-slide" }).waitFor();
    await page.clock.runFor(2900);
    assert.equal(await page.getByAltText("Offer 1").count(), 1);
    await page.clock.runFor(200);
    await page.getByAltText("Offer 2").waitFor();
    await page.evaluate(() => window.root.render(window.React.createElement(window.slider, { key: "custom", banners: window.banners, delay: 5 })));
    await page.getByAltText("Offer 1").waitFor();
    await page.clock.runFor(4900);
    assert.equal(await page.getByAltText("Offer 1").count(), 1);
    await page.clock.runFor(200);
    await page.getByAltText("Offer 2").waitFor();
    await page.evaluate(() => window.root.render(window.React.createElement(window.slider, { key: "custom", banners: window.banners, autoSlide: false, delay: 5 })));
    await page.getByRole("button", { name: "Pause auto-slide" }).waitFor({ state: "detached" });
    await page.clock.runFor(10000);
    assert.equal(await page.getByAltText("Offer 2").count(), 1);
    console.log("Default 3-second autoplay, custom delay, and disabling autoplay checks passed");
    console.log("Banner navigation, wraparound, mobile fit, and single-banner checks passed");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
