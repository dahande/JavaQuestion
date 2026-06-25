// ビルド後に各ルートの静的HTML（ページ固有のtitle/description/OGP/本文）と
// sitemap.xml を生成する簡易プリレンダラ。クローラーが各URLで適切な情報を取得でき、
// JavaScript無効でも要約が読めるようにする。
import { build } from 'esbuild'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const dist = resolve(root, 'dist')
const SITE = 'https://dahande.github.io/JavaQuestion'

// --- seo-routes.ts を esbuild でバンドルして読み込む（アプリ実データを再利用） ---
const bundled = await build({
  entryPoints: [resolve(__dirname, 'seo-routes.ts')],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  logLevel: 'silent',
})
const dataUrl =
  'data:text/javascript;charset=utf-8;base64,' +
  Buffer.from(bundled.outputFiles[0].text).toString('base64')
const { getRoutes } = await import(dataUrl)
const routes = getRoutes()

const template = readFileSync(resolve(dist, 'index.html'), 'utf8')

const escAttr = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
const escText = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const setProp = (html, prop, val) =>
  html.replace(
    new RegExp('<meta[^>]*property="' + prop + '"[^>]*>'),
    `<meta property="${prop}" content="${escAttr(val)}" />`,
  )
const setName = (html, name, val) =>
  html.replace(
    new RegExp('<meta[^>]*name="' + name + '"[^>]*>'),
    `<meta name="${name}" content="${escAttr(val)}" />`,
  )

function pageHtml(meta, urlPath) {
  const url = SITE + '/' + (urlPath ? urlPath + '/' : '')
  let h = template
  h = h.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escText(meta.title)} | JavaLearn</title>`,
  )
  h = setName(h, 'description', meta.description)
  h = h.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${url}" />`,
  )
  h = setProp(h, 'og:url', url)
  h = setProp(h, 'og:title', meta.title)
  h = setProp(h, 'og:description', meta.description)
  h = setName(h, 'twitter:title', meta.title)
  h = setName(h, 'twitter:description', meta.description)
  const noscript =
    `<noscript><h1>${escText(meta.title)}</h1>` +
    `<p>${escText(meta.description)}</p>` +
    `<p><a href="${SITE}/">JavaLearn トップへ</a></p></noscript>`
  h = h.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${noscript}</div>`)
  return h
}

let count = 0
for (const r of routes) {
  const html = pageHtml(r, r.path)
  if (r.path === '') {
    writeFileSync(resolve(dist, 'index.html'), html)
  } else {
    const dir = resolve(dist, r.path)
    mkdirSync(dir, { recursive: true })
    writeFileSync(resolve(dir, 'index.html'), html)
  }
  count++
}

// --- sitemap.xml ---
const lastmod = new Date().toISOString().slice(0, 10)
const urlset = routes
  .map((r) => {
    const loc = SITE + '/' + (r.path ? r.path + '/' : '')
    return (
      `  <url>\n` +
      `    <loc>${loc}</loc>\n` +
      `    <lastmod>${lastmod}</lastmod>\n` +
      `    <priority>${r.priority.toFixed(1)}</priority>\n` +
      `  </url>`
    )
  })
  .join('\n')
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urlset +
  `\n</urlset>\n`
writeFileSync(resolve(dist, 'sitemap.xml'), sitemap)

console.log(`prerendered ${count} routes, sitemap with ${routes.length} URLs`)
