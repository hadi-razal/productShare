const { chromium } = require("playwright");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const envText = [".env.local", ".env"]
  .filter((p) => fs.existsSync(p))
  .map((p) => fs.readFileSync(p, "utf8"))
  .join("\n");
const match = envText.match(/^NEXT_PUBLIC_SUPABASE_URL\s*=\s*["']?([^\s"']+)/m);
const supabaseUrl = match?.[1] || "https://placeholder.supabase.co";
const project = new URL(supabaseUrl).hostname.split(".")[0];
const id = "11111111-1111-4111-8111-111111111111";
const user = {
  id,
  email: "test@example.com",
  aud: "authenticated",
  role: "authenticated",
  app_metadata: {},
  user_metadata: {},
  created_at: new Date().toISOString(),
};
const token = [
  "e30",
  Buffer.from(
    JSON.stringify({ sub: id, exp: Math.floor(Date.now() / 1000) + 3600 }),
  ).toString("base64url"),
  "test",
].join(".");
let draft = null,
  submissions = 0,
  failSave = false;
(async () => {
  const browser = await chromium.launch({
    headless: true,
    channel:
      process.env.PLAYWRIGHT_CHANNEL ||
      (process.platform === "win32" ? "msedge" : undefined),
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await context.addInitScript(
    ({ key, session }) => localStorage.setItem(key, JSON.stringify(session)),
    {
      key: `sb-${project}-auth-token`,
      session: {
        access_token: token,
        refresh_token: "test",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        expires_in: 3600,
        token_type: "bearer",
        user,
      },
    },
  );
  await context.route(`${supabaseUrl}/**`, async (route) => {
    const url = new URL(route.request().url());
    let body = {};
    if (url.pathname.includes("/auth/v1/user")) body = user;
    else if (url.pathname.includes("/rest/v1/store_onboarding")) {
      if (route.request().method() === "GET") body = draft;
      else {
        if (failSave)
          return route.fulfill({
            status: 503,
            contentType: "application/json",
            body: JSON.stringify({ message: "Offline" }),
          });
        draft = route.request().postDataJSON();
        body = draft;
      }
    } else if (url.pathname.includes("/rest/v1/stores")) {
      body =
        url.searchParams.get("select") === "id"
          ? url.searchParams.get("username") === "eq.taken-store"
            ? [{ id: "other" }]
            : []
          : {
              id,
              uid: id,
              username: "newstore",
              name: "",
              email: user.email,
              onboarding_completed: false,
            };
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
  await context.route("**/api/onboarding", async (route) => {
    submissions++;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"success":true}',
    });
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(
    `${process.env.ONBOARDING_TEST_URL || "http://localhost:3001"}/onboarding`,
  );
  await page
    .getByRole("button", { name: "Get started" })
    .waitFor({ timeout: 60000 });
  await page
    .locator(".ob-preview-panel .ob-product img")
    .evaluateAll((images) =>
      Promise.all(images.map((image) => image.decode())),
    );
  await page.screenshot({
    path: "tests/onboarding-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Get started" }).click();
  await page.getByLabel("Full name", { exact: true }).fill("Ananya Sharma");
  await page.getByLabel("Contact number", { exact: true }).fill("1234567890");
  assert.equal(
    await page
      .getByRole("button", { name: "Continue", exact: true })
      .isDisabled(),
    true,
    "Reject invalid Indian number before later steps are filled",
  );
  await page.getByLabel("Contact number", { exact: true }).fill("9876543210");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Store or business name").fill("The Everyday Edit");
  await page
    .getByLabel("Short description")
    .fill("Thoughtful essentials for everyday living.");
  await page.getByLabel("City", { exact: true }).fill("Kochi");
  await page.getByLabel("State", { exact: true }).fill("Kerala");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Home Décor", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: "WhatsApp images", exact: true })
    .click();
  await page.getByRole("button", { name: "20–50", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const slug = page.getByLabel("Your catalogue link");
  assert.equal(await slug.inputValue(), "the-everyday-edit");
  await slug.fill("taken-store");
  await page.getByText("Already taken. Try an alternative below.").waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Continue", exact: true })
      .isDisabled(),
    true,
  );
  await slug.fill("everyday-custom");
  await page.getByText("✓ Available — this link can be yours").waitFor();
  await page.getByLabel("WhatsApp enquiry number").fill("919999999999");
  await page.getByLabel("Preferred currency").selectOption("USD");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("heading", { name: "Everything looks good, Ananya!" })
    .waitFor();
  await page.reload();
  await page
    .getByRole("heading", { name: "Everything looks good, Ananya!" })
    .waitFor();
  await page.getByRole("button", { name: "Edit catalogue identity" }).click();
  assert.equal(
    await page.getByLabel("Your catalogue link").inputValue(),
    "everyday-custom",
    "Restore custom slug",
  );
  assert.equal(
    await page.getByLabel("WhatsApp enquiry number").inputValue(),
    "919999999999",
    "Restore custom WhatsApp",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    "No horizontal overflow",
  );
  await page.getByText("Preview your store", { exact: false }).click();
  await page.screenshot({
    path: "tests/onboarding-mobile.png",
    fullPage: true,
  });
  await page.getByText("✓ Available — this link can be yours").waitFor();
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `No overflow at ${width}px`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  failSave = true;
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByText(
      "Your progress couldn’t be saved. Check your connection and retry.",
    )
    .waitFor();
  failSave = false;
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: "Create my catalogue", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Your ProductShare store is ready!" })
    .waitFor();
  await page.getByRole("button", { name: "Pause redirect" }).click();
  assert.equal(submissions, 1);
  assert.match(
    await page
      .getByRole("link", { name: "Chat with us on WhatsApp" })
      .getAttribute("href"),
    /^https:\/\/wa.me\/919400244731\?text=/,
  );
  assert.equal(
    await page
      .getByRole("link", { name: "Chat with us on WhatsApp" })
      .getAttribute("target"),
    "_blank",
  );
  await page.screenshot({
    path: "tests/onboarding-success.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  await page.clock.install();
  await page.clock.runFor(11000);
  assert.match(page.url(), /onboarding$/);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.clock.runFor(11000);
  await page.waitForURL("**/store");
  const unauthorized = await context.request.post(
    `${process.env.ONBOARDING_TEST_URL || "http://localhost:3001"}/api/onboarding`,
    { data: {} },
  );
  assert.equal(unauthorized.status(), 401);

  console.log(
    "PASS: seven steps, validation, slug collision, draft restoration, mobile layout, save retry, completion, support and pause.",
  );
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

