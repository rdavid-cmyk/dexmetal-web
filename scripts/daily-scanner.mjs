#!/usr/bin/env node
/**
 * DexMetal Daily Health Scanner
 * Runs at 06:00 AST (10:00 UTC) via cron
 * Checks endpoints, DOM, SSL, PM2, disk — auto-fixes safe issues — sends Telegram report
 */

import tls from 'tls';
import { execSync, exec } from 'child_process';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { promisify } from 'util';
import { runSeoChecks } from '/var/www/dexmetal-monitor/seo-checks.mjs';

const execAsync = promisify(exec);

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const APP_ROOT = '/var/www/dexmetal-web';
const TELEGRAM_CHAT_ID = '1894405483';
const SCAN_DATE = new Date().toLocaleString('en-US', {
  timeZone: 'America/Port_of_Spain',
  dateStyle: 'medium',
  timeStyle: 'short',
});

const ENDPOINTS = [
  { url: 'https://dexmetal.com', method: 'GET' },
  { url: 'https://dexmetal.com/tools', method: 'GET' },
  { url: 'https://dexmetal.com/tools/basel-classification-quickscan', method: 'GET' },
  { url: 'https://dexmetal.com/tools/ewaste-material-recovery', method: 'GET' },
  { url: 'https://dexmetal.com/tools/ewaste-route-mapper', method: 'GET' },
  { url: 'https://dexmetal.com/tools/pic-status-checker', method: 'GET' },
  { url: 'https://dexmetal.com/tools/shipment-eligibility-checker', method: 'GET' },
  { url: 'https://dexmetal.com/tools/ulab-export-calculator', method: 'GET' },
  { url: 'https://dexmetal.com/tools/basel-navigator', method: 'GET' },
  { url: 'https://dexmetal.com/blog', method: 'GET' },
  { url: 'https://dexmetal.com/playbook', method: 'GET' },
  {
    url: 'https://api.dexmetal.com/api/v1/classify',
    method: 'POST',
    body: { description: 'used lead acid batteries', quantity: 10, unit: 'kg' },
    acceptStatus: [200, 401, 405],
    expectField: 'waste_code',
  },
  { url: 'https://mcp.dexmetal.com/sse', method: 'GET', acceptStatus: [200, 204] },
];

const DOM_CHECKS = [
  { url: 'https://dexmetal.com', checks: ['copilot', 'tools-nav', 'images'] },
  { url: 'https://dexmetal.com/tools/basel-classification-quickscan', checks: ['copilot', 'form'] },
  { url: 'https://dexmetal.com/tools/ewaste-material-recovery', checks: ['copilot', 'form'] },
  { url: 'https://dexmetal.com/tools/ewaste-route-mapper', checks: ['copilot', 'form'] },
  { url: 'https://dexmetal.com/tools/pic-status-checker', checks: ['copilot', 'form'] },
  { url: 'https://dexmetal.com/tools/shipment-eligibility-checker', checks: ['copilot', 'form'] },
  { url: 'https://dexmetal.com/tools/ulab-export-calculator', checks: ['copilot', 'form'] },
  { url: 'https://dexmetal.com/tools/basel-navigator', checks: ['copilot', 'form', 'no-js-errors'] },
];

const SSL_DOMAINS = ['dexmetal.com', 'api.dexmetal.com', 'mcp.dexmetal.com'];

// ─── STATE ────────────────────────────────────────────────────────────────────

const results = {
  healthy: [],
  critical: [],
  warnings: [],
  autoFixed: [],
  stats: {
    endpointsChecked: 0,
    pagesScanned: 0,
    issuesFound: 0,
    autoFixed: 0,
    ssl: {},
    pm2Memory: 0,
    diskPct: 0,
    coverageChecks: 0,
    sentryIssues24h: 0,
    sentryRegressions24h: 0,
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getTelegramToken() {
  if (
    process.env.TELEGRAM_BOT_TOKEN &&
    process.env.TELEGRAM_BOT_TOKEN !== 'REPLACE_WITH_VALUE_FROM_BITWARDEN'
  ) {
    return process.env.TELEGRAM_BOT_TOKEN;
  }
  try {
    const env = readFileSync(`${APP_ROOT}/.env.local`, 'utf8');
    const match = env.match(/TELEGRAM_BOT_TOKEN=(.+)/);
    if (match && match[1].trim() !== 'REPLACE_WITH_VALUE_FROM_BITWARDEN') {
      return match[1].trim();
    }
  } catch {}
  return null;
}

function getSentryToken() {
  if (process.env.SENTRY_GEO1_AUTH_TOKEN) return process.env.SENTRY_GEO1_AUTH_TOKEN;
  try {
    const env = readFileSync(`${APP_ROOT}/.env.local`, 'utf8');
    const match = env.match(/^SENTRY_GEO1_AUTH_TOKEN=(.+)$/m);
    if (match) return match[1].trim().replace(/^['"]|['"]$/g, '');
  } catch {}
  return null;
}

async function fetchSentryIssues(token, query) {
  const url = new URL('https://sentry.io/api/0/projects/dexmetal/dexmetal-web/issues/');
  url.searchParams.set('query', query);
  url.searchParams.set('limit', '100');
  url.searchParams.set('sort', 'freq');
  const { res } = await fetchWithTimeout(url, {
    headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'DexMetal-GEO1/1.0' },
  });
  if (!res.ok) throw new Error(`Sentry API HTTP ${res.status}`);
  return res.json();
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const start = Date.now();
    const res = await fetch(url, { ...options, signal: controller.signal });
    const elapsed = Date.now() - start;
    return { res, elapsed };
  } finally {
    clearTimeout(timer);
  }
}

function checkSslDays(domain) {
  return new Promise((resolve) => {
    const socket = tls.connect({ host: domain, port: 443, servername: domain }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      if (!cert || !cert.valid_to) return resolve({ domain, days: null, error: 'No cert' });
      const expiry = new Date(cert.valid_to);
      const days = Math.floor((expiry - Date.now()) / 86400000);
      resolve({ domain, days, expiry: expiry.toISOString().split('T')[0] });
    });
    socket.on('error', (err) => resolve({ domain, days: null, error: err.message }));
    socket.setTimeout(10000, () => {
      socket.destroy();
      resolve({ domain, days: null, error: 'timeout' });
    });
  });
}

// ─── 2A — ENDPOINT CHECKS ────────────────────────────────────────────────────

async function checkEndpoints() {
  console.log('\n[2A] Checking endpoints...');
  for (const ep of ENDPOINTS) {
    results.stats.endpointsChecked++;
    try {
      const opts = { method: ep.method, headers: { 'User-Agent': 'DexMetal-Scanner/1.0' } };
      if (ep.body) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(ep.body);
      }
      const { res, elapsed } = await fetchWithTimeout(ep.url, opts);
      const acceptable = ep.acceptStatus
        ? ep.acceptStatus.includes(res.status)
        : res.status === 200;

      if (!acceptable) {
        results.critical.push({ item: ep.url, detail: `HTTP ${res.status} (expected ${ep.acceptStatus || 200})` });
        results.stats.issuesFound++;
        console.log(`  ❌ ${ep.url} → ${res.status} (${elapsed}ms)`);
        continue;
      }

      if (ep.expectField && res.status === 200) {
        let json;
        try { json = await res.json(); } catch { json = {}; }
        if (!json[ep.expectField]) {
          results.critical.push({ item: ep.url, detail: `Response missing field '${ep.expectField}'` });
          results.stats.issuesFound++;
          console.log(`  ❌ ${ep.url} → missing '${ep.expectField}' in response`);
          continue;
        }
      }

      results.healthy.push(`${ep.url} → ${res.status} (${elapsed}ms)`);
      console.log(`  ✅ ${ep.url} → ${res.status} (${elapsed}ms)`);
    } catch (err) {
      results.critical.push({ item: ep.url, detail: err.message });
      results.stats.issuesFound++;
      console.log(`  ❌ ${ep.url} → ${err.message}`);
    }
  }
}

// ─── 2B — DOM CHECKS VIA PLAYWRIGHT ──────────────────────────────────────────

async function checkDom() {
  console.log('\n[2B] Running DOM checks via Playwright...');

  try {
    execSync('npx playwright install chromium --with-deps', {
      cwd: APP_ROOT,
      stdio: 'pipe',
      timeout: 120000,
    });
  } catch {}

  let browser;
  let chromium;
  try {
    const mod = await import('playwright');
    chromium = mod.chromium || mod.default?.chromium;
    if (!chromium) {
      throw new Error('Playwright chromium export unavailable');
    }
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (err) {
    results.warnings.push({ item: 'DOM checks', detail: `Playwright unavailable: ${err.message}` });
    console.log('  ⚠️  Playwright unavailable — skipping DOM checks');
    return;
  }

  for (const pageConfig of DOM_CHECKS) {
    results.stats.pagesScanned++;
    const context = await browser.newContext();
    const page = await context.newPage();
    const jsErrors = [];
    page.on('pageerror', (err) => jsErrors.push(err.message));

    try {
      await page.goto(pageConfig.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
      const html = await page.content();
      const url = pageConfig.url;

      for (const check of pageConfig.checks) {
        if (check === 'tools-nav') {
          const hasTools =
            html.includes('>Tools<') ||
            html.includes('href="/tools"') ||
            html.includes('/tools"');
          if (!hasTools) {
            results.warnings.push({ item: url, detail: 'Nav "Tools" link not found' });
            results.stats.issuesFound++;
          }
        }

        if (check === 'images') {
          const imgSrcs = await page
            .$$eval('img', (imgs) => imgs.map((i) => i.src).filter(Boolean))
            .catch(() => []);
          const broken = [];
          for (const src of imgSrcs.slice(0, 20)) {
            try {
              const r = await fetch(src, { method: 'HEAD' }).catch(() => null);
              if (r && r.status >= 400) broken.push(src);
            } catch {}
          }
          if (broken.length) {
            results.warnings.push({ item: url, detail: `${broken.length} broken image(s)` });
            results.stats.issuesFound++;
          }
        }

        if (check === 'form') {
          const hasForm =
            (await page.$('form').catch(() => null)) ||
            (await page.$('button').catch(() => null)) ||
            (await page.$('input').catch(() => null));
          if (!hasForm) {
            results.warnings.push({
              item: url,
              detail: 'No form/interactive element found — page may be blank',
            });
            results.stats.issuesFound++;
            console.log(`  ⚠️  ${url} → no interactive element`);
          }
        }

        // 'email-gate' check DISABLED 2026-08-14 (Chairman): this check never
        // walked each tool's real question flow before looking for the gate,
        // so it checked for a literal "Unlock Results" button that has never
        // been the real CTA text on any tool -- guaranteed false positive
        // every single day since it was added. The check that actually
        // matters (is a tool gated on load, locking out real first-time
        // visitors) is covered correctly and separately by
        // /var/www/dexmetal-monitor/check-tools-health.py (real Playwright
        // click-test, runs daily). Removed from every tool's checks[] above
        // rather than deleting this handler, in case a real per-tool
        // click-through check gets built here later.
        if (check === 'email-gate') {
          let hasEmail = await page.$('input[type="email"]').catch(() => null);
          if (!hasEmail) {
            const unlockButton = page.getByRole('button', { name: /unlock results/i }).first();
            const hasUnlockButton = await unlockButton.count().catch(() => 0);
            if (hasUnlockButton) {
              await unlockButton.click().catch(() => {});
              hasEmail = await page.waitForSelector('input[type="email"]', { timeout: 3000 }).catch(() => null);
            }
          }
          if (!hasEmail) {
            results.warnings.push({ item: url, detail: 'Email gate flow missing: no Unlock Results CTA or email input detected' });
            results.stats.issuesFound++;
          }
        }

        if (check === 'no-js-errors') {
          if (jsErrors.length) {
            results.warnings.push({
              item: url,
              detail: `JS errors: ${jsErrors.slice(0, 3).join(' | ')}`,
            });
            results.stats.issuesFound++;
            console.log(`  ⚠️  ${url} → ${jsErrors.length} JS error(s)`);
          } else {
            console.log(`  ✅ ${url} → no JS errors`);
          }
        }
      }
    } catch (err) {
      results.warnings.push({ item: pageConfig.url, detail: `Page load failed: ${err.message}` });
      results.stats.issuesFound++;
      console.log(`  ❌ ${pageConfig.url} → ${err.message}`);
    } finally {
      await context.close().catch(() => {});
    }
  }

  await browser.close().catch(() => {});
}

// ─── 2C — SSL CERTIFICATE CHECK ──────────────────────────────────────────────

async function checkSsl() {
  console.log('\n[2C] Checking SSL certificates...');
  for (const domain of SSL_DOMAINS) {
    const { days, expiry, error } = await checkSslDays(domain);
    if (error) {
      results.warnings.push({ item: domain, detail: `SSL check failed: ${error}` });
      results.stats.issuesFound++;
      results.stats.ssl[domain] = 'error';
      console.log(`  ⚠️  ${domain} → SSL error: ${error}`);
    } else {
      results.stats.ssl[domain] = days;
      if (days < 30) {
        results.critical.push({ item: domain, detail: `SSL expires in ${days} days (${expiry})` });
        results.stats.issuesFound++;
        console.log(`  🔴 ${domain} → ${days} days remaining (CRITICAL)`);
      } else {
        results.healthy.push(`SSL ${domain} → ${days} days`);
        console.log(`  ✅ ${domain} → ${days} days remaining`);
      }
    }
  }
}

// ─── 2D — PM2 PROCESS CHECK ──────────────────────────────────────────────────

async function checkPm2() {
  console.log('\n[2D] Checking PM2 processes...');
  try {
    const { stdout } = await execAsync('pm2 jlist');
    const processes = JSON.parse(stdout);
    const web = processes.find((p) => p.name === 'dexmetal-web');

    if (!web) {
      results.critical.push({ item: 'dexmetal-web', detail: 'Process not found in PM2' });
      results.stats.issuesFound++;
      return;
    }

    if (web.pm2_env.status !== 'online') {
      results.critical.push({
        item: 'dexmetal-web',
        detail: `Status: ${web.pm2_env.status} — auto-restarting`,
      });
      results.stats.issuesFound++;
      try {
        execSync('pm2 restart dexmetal-web', { stdio: 'pipe' });
        results.autoFixed.push('dexmetal-web restarted (was offline)');
        results.stats.autoFixed++;
        console.log('  🔧 dexmetal-web was offline — restarted');
      } catch (e) {
        console.log('  ❌ Auto-restart failed:', e.message);
      }
    } else {
      console.log('  ✅ dexmetal-web → online');
    }

    const memMB = Math.round((web.monit?.memory ?? 0) / 1024 / 1024);
    results.stats.pm2Memory = memMB;
    if (memMB > 512) {
      results.warnings.push({ item: 'dexmetal-web', detail: `Memory high: ${memMB}MB (limit 512MB)` });
      results.stats.issuesFound++;
      console.log(`  ⚠️  Memory: ${memMB}MB (over 512MB)`);
    } else {
      console.log(`  ✅ Memory: ${memMB}MB`);
    }

    const restarts = web.pm2_env.restart_time ?? 0;
    if (restarts > 5) {
      results.warnings.push({ item: 'dexmetal-web', detail: `High restart count: ${restarts}` });
      results.stats.issuesFound++;
      console.log(`  ⚠️  Restart count: ${restarts} (>5 threshold)`);
    } else {
      console.log(`  ✅ Restart count: ${restarts}`);
    }
  } catch (err) {
    results.warnings.push({ item: 'PM2', detail: `pm2 jlist failed: ${err.message}` });
    results.stats.issuesFound++;
  }
}

// ─── 2E — DISK SPACE CHECK ───────────────────────────────────────────────────

async function checkDisk() {
  console.log('\n[2E] Checking disk space...');
  try {
    const { stdout } = await execAsync('df -h /');
    const dataLine = stdout.trim().split('\n')[1];
    const match = dataLine.match(/(\d+)%/);
    if (match) {
      const pct = parseInt(match[1], 10);
      results.stats.diskPct = pct;
      if (pct > 80) {
        results.warnings.push({ item: 'Disk /', detail: `${pct}% used — auto-cleaning` });
        results.stats.issuesFound++;
        console.log(`  ⚠️  Disk: ${pct}% — running cleanup`);
        try {
          execSync(`cd ${APP_ROOT} && npm cache clean --force`, { stdio: 'pipe', timeout: 30000 });
          execSync('find /tmp -mtime +7 -type f -delete 2>/dev/null || true', { stdio: 'pipe' });
          results.autoFixed.push(`Disk cleanup: npm cache + /tmp >7d (was ${pct}%)`);
          results.stats.autoFixed++;
        } catch (e) {
          console.log('  Cleanup partial:', e.message);
        }
      } else {
        results.healthy.push(`Disk / → ${pct}% used`);
        console.log(`  ✅ Disk: ${pct}% used`);
      }
    }
  } catch (err) {
    results.warnings.push({ item: 'Disk', detail: `df check failed: ${err.message}` });
  }
}


// ─── 2F — BROAD SYSTEM COVERAGE (GEO-1 V2) ──────────────────────────────────

async function checkSystemCoverage() {
  console.log('\n[2F] Running GEO-1 broad system coverage...');
  try {
    const { stdout } = await execAsync(
      '/usr/bin/python3 /var/www/dexmetal-monitor/geo1-coverage-scan.py',
      { timeout: 60000 }
    );
    const coverage = JSON.parse(stdout);
    results.stats.coverageChecks = coverage.total || 0;
    for (const c of coverage.checks || []) {
      const item = 'GEO-1 ' + c.name;
      if (c.status === 'CRITICAL') {
        results.critical.push({ item, detail: c.detail });
        results.stats.issuesFound++;
      } else if (c.status === 'WARN') {
        results.warnings.push({ item, detail: c.detail });
        results.stats.issuesFound++;
      } else {
        results.healthy.push(item + ' -> ' + c.detail);
      }
    }
    console.log('  Coverage: ' + coverage.pass + '/' + coverage.total + ' pass, ' + coverage.warn + ' warn, ' + coverage.critical + ' critical');
  } catch (err) {
    results.warnings.push({ item: 'GEO-1 broad coverage', detail: 'Coverage scan failed: ' + err.message });
    results.stats.issuesFound++;
    console.log('  GEO-1 coverage scan failed: ' + err.message);
  }
}

// ─── 4 — TELEGRAM REPORT ─────────────────────────────────────────────────────
// Warning throttling (added 2026-08-14, Chairman): a warning that's already
// known, understood, and unchanged in kind (e.g. the contained restart-count
// pattern) used to get printed in full every single day forever. This
// tracks how many days in a row each warning "signature" (item + detail with
// digits stripped, so a count ticking 30->32 still matches) has fired, and
// collapses it to a short line after REPEAT_THRESHOLD days instead of
// repeating the full detail. CRITICAL items are never throttled - only
// warnings, which are explicitly the "monitor, don't panic" tier already.
const SCANNER_STATE_FILE = '/var/www/dexmetal-web/scripts/.scanner-warning-state.json';
const WARNING_REPEAT_THRESHOLD = 3;

function loadScannerState() {
  try {
    if (existsSync(SCANNER_STATE_FILE)) return JSON.parse(readFileSync(SCANNER_STATE_FILE, 'utf8'));
  } catch {}
  return {};
}
function saveScannerState(state) {
  try { writeFileSync(SCANNER_STATE_FILE, JSON.stringify(state, null, 2)); } catch {}
}
function throttleWarnings(warnings) {
  const state = loadScannerState();
  const currentSigs = new Set();
  const fresh = [];
  const collapsed = [];
  for (const w of warnings) {
    const sig = `${w.item}::${w.detail.replace(/\d+/g, '#')}`;
    currentSigs.add(sig);
    const timesShown = (state[sig] || 0) + 1;
    state[sig] = timesShown;
    if (timesShown <= WARNING_REPEAT_THRESHOLD) {
      fresh.push(w);
    } else {
      collapsed.push(w);
    }
  }
  // drop signatures that didn't fire today (resolved) so they start fresh if they ever recur
  for (const sig of Object.keys(state)) {
    if (!currentSigs.has(sig)) delete state[sig];
  }
  saveScannerState(state);
  return { fresh, collapsed };
}

async function sendTelegram() {
  const token = getTelegramToken();

  const sslLine = SSL_DOMAINS.map((d) => {
    const v = results.stats.ssl[d] ?? 'err';
    const label = d.replace('.dexmetal.com', '').replace('dexmetal.com', 'main');
    return `${label}=${v}d`;
  }).join(' ');

  let msg = `🤖 DexMetal Daily Scan — ${SCAN_DATE} AST\n`;
  msg += `✅ HEALTHY (${results.healthy.length} checks passed)\n`;

  if (results.critical.length) {
    msg += `\n🔴 CRITICAL (action required):\n`;
    results.critical.forEach((c) => (msg += `- ${c.item}: ${c.detail}\n`));
  }
  if (results.warnings.length) {
    const { fresh, collapsed } = throttleWarnings(results.warnings);
    msg += `\n⚠️ WARNINGS (monitor):\n`;
    fresh.forEach((w) => (msg += `- ${w.item}: ${w.detail}\n`));
    if (collapsed.length) {
      msg += `- + ${collapsed.length} known warning(s) unchanged, already flagged ${WARNING_REPEAT_THRESHOLD}+ days running (see STATE.md / yesterday's scan for detail)\n`;
    }
  }
  if (results.autoFixed.length) {
    msg += `\n🔧 AUTO-FIXED:\n`;
    results.autoFixed.forEach((f) => (msg += `- ${f}\n`));
  }

  msg += `\n📊 STATS:\n`;
  msg += `- Endpoints checked: ${results.stats.endpointsChecked}\n`;
  msg += `- Pages scanned: ${results.stats.pagesScanned}\n`;
  msg += `- System coverage checks: ${results.stats.coverageChecks}\n`;
  msg += `- Issues found: ${results.stats.issuesFound}\n`;
  msg += `- Auto-fixed: ${results.stats.autoFixed}\n`;
  msg += `- SSL days remaining: ${sslLine}\n`;
  msg += `- PM2 memory: ${results.stats.pm2Memory}MB\n`;
  msg += `- Disk: ${results.stats.diskPct}% used\n`;
  msg += `- Sentry unresolved (24h): ${results.stats.sentryIssues24h}\n`;
  msg += `- Sentry regressions (24h): ${results.stats.sentryRegressions24h}\n`;
  msg += `\n🕐 Next scan: tomorrow 06:00 AST`;

  console.log('\n─── TELEGRAM REPORT ───────────────────────────────────');
  console.log(msg);
  console.log('───────────────────────────────────────────────────────');

  if (!token) {
    console.log('⚠️  TELEGRAM_BOT_TOKEN not set — report printed to log only');
    return;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg }),
    });
    const data = await res.json();
    if (data.ok) {
      console.log('✅ Telegram report sent successfully');
    } else {
      console.log('❌ Telegram send failed:', data.description);
    }
  } catch (err) {
    console.log('❌ Telegram send error:', err.message);
  }
}


// ─── 2F — SECURITY CHECKS ────────────────────────────────────────────────────

async function checkSecurity() {
  console.log("\n[2F] Running security checks...");

  // 1. Security header checks
  const securityHeaders = [
    "x-frame-options",
    "x-content-type-options",
    "strict-transport-security",
    "content-security-policy",
  ];

  try {
    const { res } = await fetchWithTimeout("https://dexmetal.com", {});
    const missingHeaders = securityHeaders.filter((h) => !res.headers.get(h));
    if (missingHeaders.length > 0) {
      results.critical.push({
        item: "Security Headers",
        detail: `Missing: ${missingHeaders.join(", ")}`,
      });
      results.stats.issuesFound++;
      console.log(`  ❌ Missing security headers: ${missingHeaders.join(", ")}`);
    } else {
      results.healthy.push("Security headers → all 4 present");
      console.log("  ✅ All security headers present");
    }
  } catch (err) {
    results.warnings.push({ item: "Security Headers", detail: `Check failed: ${err.message}` });
  }

  // 2. .env.local public exposure check
  try {
    const { res: envRes } = await fetchWithTimeout("https://dexmetal.com/.env.local", {}, 10000);
    if (envRes.status === 200) {
      results.critical.push({
        item: ".env.local",
        detail: "CRITICAL: .env.local is publicly accessible at /.env.local",
      });
      results.stats.issuesFound++;
      console.log("  🔴 CRITICAL: .env.local is publicly exposed!");
    } else {
      results.healthy.push(`.env.local → not exposed (HTTP ${envRes.status})`);
      console.log(`  ✅ .env.local not exposed (HTTP ${envRes.status})`);
    }
  } catch (err) {
    results.healthy.push(".env.local → not exposed (connection refused)");
    console.log("  ✅ .env.local not exposed");
  }

  // 3. Rate limit smoke test — 25 requests to /api/chat, expect at least one 429
  try {
    const testPayload = JSON.stringify({ message: "rate-limit-smoke-test" });
    let got429 = false;
    for (let i = 0; i < 25; i++) {
      const { res: chatRes } = await fetchWithTimeout(
        "http://localhost:3000/api/chat",
        { method: "POST", headers: { "Content-Type": "application/json", "X-Real-IP": "scanner-smoke-test-ip" }, body: testPayload },
        5000
      );
      if (chatRes.status === 429) { got429 = true; break; }
    }
    if (!got429) {
      results.warnings.push({
        item: "Rate Limit",
        detail: "/api/chat did not return 429 after 25 requests — rate limit may not be active",
      });
      results.stats.issuesFound++;
      console.log("  ⚠️  Rate limit not triggered after 25 requests");
    } else {
      results.healthy.push("Rate limit → 429 returned as expected");
      console.log("  ✅ Rate limit active — 429 returned");
    }
  } catch (err) {
    results.warnings.push({ item: "Rate Limit", detail: `Smoke test failed: ${err.message}` });
  }
}


// ─── 2G — SEO & METADATA CHECKS ──────────────────────────────────────────────

async function checkSeo() {
  console.log('\n[SEO] Running SEO and metadata checks...');
  try {
    const { issues, passes, warnings } = await runSeoChecks();
    for (const p of passes) {
      results.healthy.push(p);
      console.log(p);
    }
    for (const w of warnings) {
      results.warnings.push({ check: 'SEO', detail: w });
      console.log(w);
    }
    for (const i of issues) {
      results.critical.push({ check: 'SEO', detail: i });
      console.error(i);
    }
    if (issues.length === 0) {
      console.log(`[SEO] All ${passes.length} checks passed.`);
    } else {
      console.error(`[SEO] ${issues.length} FAILURES detected.`);
    }
  } catch (e) {
    results.warnings.push({ check: 'SEO', detail: 'SEO check threw: ' + e.message });
    console.error('[SEO] Check failed:', e.message);
  }
}

async function checkSentry() {
  console.log('\n[SENTRY] Checking production errors and regressions...');
  const token = getSentryToken();
  if (!token) {
    results.warnings.push({ item: 'Sentry', detail: 'GEO-1 read-only token is not configured' });
    results.stats.issuesFound++;
    return;
  }

  try {
    const [recent, regressed] = await Promise.all([
      fetchSentryIssues(token, 'is:unresolved lastSeen:-24h'),
      fetchSentryIssues(token, 'is:unresolved is:regressed lastSeen:-24h'),
    ]);
    results.stats.sentryIssues24h = recent.length;
    results.stats.sentryRegressions24h = regressed.length;
    if (recent.length === 0) {
      results.healthy.push('Sentry → no unresolved production issues in 24h');
    } else {
      const count = recent.length === 100 ? '100+' : String(recent.length);
      results.warnings.push({ item: 'Sentry', detail: `${count} unresolved production issue(s) seen in 24h` });
      results.stats.issuesFound++;
    }
    if (regressed.length > 0) {
      const count = regressed.length === 100 ? '100+' : String(regressed.length);
      results.critical.push({ item: 'Sentry regression', detail: `${count} regressed issue(s) seen in 24h` });
      results.stats.issuesFound++;
    }
  } catch (err) {
    results.warnings.push({ item: 'Sentry', detail: `Read-only API check failed: ${err.message}` });
    results.stats.issuesFound++;
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${'═'.repeat(55)}`);
  console.log(`  DexMetal Daily Scanner — ${SCAN_DATE} AST`);
  console.log(`${'═'.repeat(55)}`);

  await checkEndpoints();
  await checkSsl();
  await checkPm2();
  await checkDisk();
  await checkSystemCoverage();
  await checkSecurity();
  await checkDom();
  await checkSeo();
  await checkSentry();
  await sendTelegram();

  console.log('\n✅ Scanner complete.');
  process.exit(results.critical.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(2);
});
