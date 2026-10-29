# orilabオリ — B2B Web Planning(定稿)

**版本：v3.0（定稿）| 修訂日期：2026-10-15 | 目標上線：2026-11-01**
**定位：英文為主的 B2B 產品展示網站（無線上訂單系統，附產品管理後台）**
**Tech 定案：Astro + Sanity CMS + Cloudflare Pages/Vercel**
**兼顧 SEO、Core Web Vitals 與日後易維護性**

> **v3.0 修訂紀錄（相對 v2.0):**
> 1. `collection` 拆分為兩個獨立 schema:`petcollection`（文創，MVP 四個範疇）+ `patchcollection`（貼布創作，按 theme 分類）
> 2. `patchcollection` 新增獨立 `theme` 欄位；兩條產品線前台皆提供電商式篩選（pet 按 type / patch 按 theme)
> 3. `product` 改為單一 reference(`selectCollection`）同時指向兩種系列；**刻意移除 MOQ / Lead Time 欄位**（改為洽談時報價）,Product Card 與詳情頁模板同步移除 MOQ 顯示
> 4. Catalog **不再建 Sanity schema**，改為純前端靜態頁面 + PDF 連結（檔案放 `/public/catalog/`)
> 5. 新增 `blog` schema（僅後台就緒，前台頁面維持 V2 再做）
> 6. 修正 5 個 schema 程式碼 bug（見 3.2 修正清單，含可直接替換的代碼）
> 7. 其餘網頁約束限制（SEO、CWV、安全、精簡代碼）與 v2.0 完全一致

---

# Part One:Web Structure

## 1.1 Site Map

```
/                              主頁 (Home)
/about                         Brand Intro (About Us)
/pet-collection                Pet Collection 總頁（按 type 電商式篩選）
/pet-collection/[slug]         文創分類頁（= petcollection 的四個範疇,各一頁）
/product/[slug]                產品詳情頁（全品類共用模板）
/embroidered-patches           Embride Patches 主頁（patch 展示牆按 theme 篩選 + B2B 招商）
/embroidered-patches/[series]  每月/每季系列頁（= patchcollection 文件,SEO 增長引擎）
/catalog                       Catalog 下載頁（純前端靜態頁,PDF 連結,v3 簡化）
/contact                       Contact + FAQ
/wholesale-terms               Shop Policy（批發條款、MOQ 政策、交期說明）
/privacy                       Privacy Policy（B2B 表單合規必需）
/studio                        Sanity 後台（noindex + 登入保護）
/sitemap.xml                   自動生成（@astrojs/sitemap）
/robots.txt                    靜態
[V2 預留] /blog, /blog/[slug]  Blog（schema 已建,前台第二期）
```

**v3 變更說明：**
- `/catalog/[name]` 動態頁取消。Catalog 改為單一靜態頁，PDF 直接放前端專案 `/public/catalog/` 資料夾，頁面內手動加連結。更新 catalog = 替換檔案 + 改頁面，push 後自動部署。
- `/pet-collection/[slug]` 與 `/embroidered-patches/[series]` 的資料來源分別對應 `petcollection` 與 `patchcollection` 兩種文件，不再是統一的 `collection`。

**關鍵命名決策（維持）**:URL 用英文關鍵字而非品牌內部用語。URL 用 `/embroidered-patches`(Google 搜尋量高的產品詞），頁面標題與文案內保留品牌名「Embride Patches」，品牌詞 + 產品詞兩邊的搜尋流量都接得住。

## 1.2 Header / Footer

**Header(6 項 + CTA，行動裝置收合為漢堡選單）:**

```
1. [Brand icon]
2. About Us
3. Pet Collection
4. Embroidered Patches
5. Download Catalog
6. Contact
   [Start Your Order →]   ← 唯一 CTA 按鈕（高亮色）
```

- CTA 按鈕文案定案為「Start Your Order」（簡短、手機版不爆版）;「Let your store live in your customers' pockets」保留為 Hero 副標語，不做按鈕。
- CTA 實際功能 =「Start Your Wholesale Inquiry」，導向 /contact 批發表單。落地頁清楚說明流程：詢價 → 報價 → 打樣 → 下單。
- 「Download Catalog」導向 `/catalog` 頁（v3：靜態頁面，PDF 連結直接列在頁面上，可預覽/下載）。

**Footer:**

```
Column 1: Shop
  - Pet Collection
  - Embroidered Patches
  - Monthly Series
  - Download Catalog
Column 2: Company
  - Our Story (/about)
  - Shop Policy (/wholesale-terms)
  - Privacy Policy
Column 3: Contact
  - Email / WhatsApp / 地址
  - Social Media Icon (Instagram / Facebook)
  - Newsletter 或「Request a Sample Kit」入口（選配,第二期）
Bottom: © 2026 orilabオリ · Sitemap 連結
```

---

# Part Two:Page Content Details

**品牌調性錨點**:Japanese simplicity × warm & cute × wabi-sabi × playful pop
**文字風格** = 簡短、留白、溫暖，不賣弄。

## 2.1 主頁 `/`

**SEO 設定**
- Title: `orilabオリ | Wholesale Embroidered Patches & Pet Lifestyle Goods`
- Meta description: `Wholesales, in-house factory, OEM & custom orders embroidered patches and pet lifestyle products for retailers. And Korean Monthly DIY patch series which can pop your store.`
- H1（頁面唯一）放在 Hero,H1 是純文字，不包連結。

**Section 1 — Hero（品牌氛圍 Banner)**
- 視覺：一張自定義的橫屏短片。
- H1: `Your Daily Pixel Fluffy Pet World`
- 副標： `Wholesale embroidered patches & lifestyle goods — crafted in our own factory. Let your store live in your customers' pockets.`
- CTA ×2:`[Browse Collections]`(導 /pet-collection)+ `[Start Your Order]`(導 /contact)
- 技術：Hero 圖片設 `fetchpriority="high"` + 固定寬高 + AVIF，直接決定 LCP。

**Section 2 — Shop by Your Needs（產品分類入口）**
- 標題： `Shop by Your Needs`
- Icon 分類卡（**v3 資料驅動對齊 schema**):
  - 前 4 張卡 = `petcollection` 的四個範疇（type):**Book & Station / Phone Accessories / Personal Accessories / Lifestyle** — 各導向 `/pet-collection/[slug]`(MVP 固定四個，日後擴充只需在 schema list 加值）
  - 第 5 張：**Embride Patches DIY** → 導向 `/embroidered-patches`
  - 第 6 張：**Custom & OEM** → *Using our craft to create your own product* → 導向 /contact
- 每張卡片 = 一個分類頁內鏈，是 SEO 重要的站內連結結構。

**Section 3 — Best Sellers**
- 標題： `Best Sellers`
- 8–12 個產品卡片橫滑/網格，從 Sanity `isBestSell == true` 的產品自動拉取（不寫死）。
- 卡片元素（**v3 移除 MOQ**)：產品圖、名稱、所屬系列、「View Details」。

**Section 4 — Two Themes（兩大主題對比展示）**
- 雙欄佈局：
  - 左：**Embride Patches** — `DIY patches your customers iron on, love, and keep.` 強調「客人現場製作、月度新系列」。
  - 右：**Pet & Lifestyle Collection** — `Practical goods with a pet's-eye view of beauty.` 強調實用 × 美觀。
- 各帶一個 CTA 進入各自產品線頁。

**Section 5 — Our Own Factory（信任背書）**
- 標題： `Made in Our Own Factory`
- 要點（3–4 個 icon + 一句話）:
  - In-house production, from thread to finish
  - Consistent quality control
  - Flexible order terms for growing stores(v3 措辭調整：不再公開 MOQ 數字，保留彈性合作的訊息）
  - OEM & custom craftsmanship welcome
- B2B 轉換核心：買家最怕代工品質不穩，自建廠 = 最大信任訊號。

**Section 6 — All Business Available（合作模式，不與 Section 2 重複）**
- 標題： `All Business Models Available`
- 內容定案為 5 種合作模式卡片（純 B2B 合作方式，不放產品分類）:
  1. Wholesale & OEM/ODM
  2. Co-Branding
  3. Turnkey Retail
  4. Corporate Gifting & Event B2B Solutions
  5. Exclusive Regional Distribution
- 每張卡片一句說明 + 導向 /contact（表單自動帶入合作模式選項）。

**Section 7 — Custom DIY Orders（工藝訂製接單）**
- 標題： `Your Design, Our Craftsmanship`
- OEM/訂製刺繡流程 3 步：Send your design → We sample → You order。
- CTA: `[Request a Quote]` → /contact

**Section 8 — Footer 前置 CTA 帶**
- `Ready to stock something your customers will love?` + `[Start Your Order]`

## 2.2 Brand Intro `/about`

**SEO**:Title `Our Story | orilabオリ`;H1: `A Fluffy Little World, Stitched with Love`

**Block 1 — Slogan**（全站唯一一句，各處重複使用）
- 定案： **"Small stitches. Soft days."**
- 備選："Wabi-sabi warmth for the pet-loving world."

**Block 2 — Our Story(brand short intro)**
- 3–4 句英文短文案，要素：刺繡文創品牌、日本簡約刺繡、生活在毛絨絨的寵物世界、極重品質。示意：
  > orilabオリ began with a simple belief: the smallest stitch can hold the warmest feeling. We create embroidered goods and lifestyle products inspired by Japanese simplicity — quiet, playful, and made to last.

**Block 3 — Let Time & Them Speak for Us（品牌背景 + 企業理念）**
- 品牌時間軸（創立 → 自建廠 → 韓式 DIY 產品線 → 月度系列機制）
- Corporate method 三條：Craft over speed / Quality you can re-order, again and again / New series, every month, without fail
- 合作客戶 logo 牆（若有；B2B 信任訊號，強烈建議收集）

**Block 4 — What We Bring for You（給 B2B 買家的價值主張）**
- 三支柱：**@One Partner / @Complete Execution / @End-to-End Vertical Integration**
- 對應說明：
  - A product line that refreshes itself（月度/季度新系列 → 店家回購理由）
  - Consistent quality, reduced risk
  - Factory-direct quality & pricing
  - Faster time-to-market

## 2.3 Pet Collection `/pet-collection`（文創線）

**Filter(v3 定案：電商式篩選，對齊 schema):**
- **By Category（主篩選）** = `petcollection.type` 四個範疇：Book & Station / Phone Accessories / Personal Accessories / Lifestyle
- **By Series** = `petcollection` 各系列文件（當季系列優先）
- **By Tags** = `petcollection.tags`（自由標籤，可作 secondary filter)
- 實作：URL 參數篩選（`?type=phone-accessories`),Astro 靜態頁 + 輕量前端顯示切換；篩選狀態 canonical 指向主分類頁，避免重複內容。
- 四個範疇各自有獨立分類頁 `/pet-collection/[slug]`（靜態生成，承接 type 關鍵字搜尋）。
- **v3 移除** v2 的 By pet(Dog/Cat）與 By function(Wear/Play）篩選——現行 schema 無對應欄位；如日後需要，在 `petcollection` 加欄位即可，URL 結構不用改。

## 2.4 Embride Patches `/embroidered-patches`（貼布創作線）

**招商主標**:H1: `Join Us — Let Your Store Live in Your Customers' Pockets`

**區塊結構：**
1. **Patch 展示牆**：網格展示原創徽章，**按 theme 電商式篩選**(v3:`patchcollection.theme` 獨立欄位，如 Animals / Food / Festival / Nature，主題清單在 schema list 統一管理，日後加主題只改 schema)
2. **How the DIY model works**:
   - Step 1: Choose from 40+ accessories（鑰匙扣、小包包等）
   - Step 2: Pick original patches(iron-on backing，客人現場熨燙）
   - Step 3: Your customer walks out with something one-of-a-kind
3. **Monthly Series 機制**：每月當月系列 + 每季新系列 → 「Your display never goes stale.」
4. **Why it sells**：高毛利、低庫存壓力（配件+徽章分開備貨）、體驗式消費停留時間長
5. CTA: `[Become a Stockist]` → /contact

**系列子頁 `/embroidered-patches/[series]`**：每個 `patchcollection` 文件一頁，模板含系列故事、全部徽章（products where selectCollection → 此系列）、搭配配件建議。**SEO 長期增長引擎**——每月固定新增一個有主題關鍵字的著陸頁（如 "June 2026 Cat Patch Series")。

## 2.5 Catalog 下載頁 `/catalog`(v3 簡化：純前端）

- **單一靜態頁面**：列出所有 catalog（封面縮圖、標題、版本號、更新日期），每本一個下載/預覽連結。
- PDF 檔案放前端專案 `/public/catalog/`，頁面用 `<a href="/catalog/xxx.pdf">` 直接連結；預覽可用 `<embed>` 或讓瀏覽器原生開啟。
- 更新流程：替換 `/public/catalog/` 內的 PDF + 編輯 `/catalog` 頁面 → git push → 自動部署。**不走 Sanity。**
- SEO 價值（維持）:PDF 檔名用英文關鍵字（如 `orilab-pet-collection-catalog-2026.pdf`),PDF 加上文件標題 metadata(Google 會索引 PDF);`/catalog` 頁本身承接 "orilab catalog 2026" 類搜尋。

## 2.6 Contact + FAQ `/contact`

- **批發詢價表單**（欄位：Company / Country / Business type / Product line of interest / Estimated quantity / Message；從產品頁或合作模式卡進入時自動帶入對應選項）。
- 表單提交 → Email 通知你們 + 自動回覆客人；Sanity `inquiry` 留存為進階選項（V1 可省略）。
- **FAQ**(5–8 題，務必加 FAQPage JSON-LD):
  - What is your MOQ?（回答引導至洽談：MOQ varies by product line — contact us for a quote)
  - Do you offer OEM / custom embroidery?
  - How does the DIY patch program work for retailers?
  - What are your lead times?
  - Can I request samples?
  - How often do new series launch?

---

# Part Three:Data Schema(Sanity CMS 版）

## 3.1 現行 Schema 總覽（v3 定案，對應你的 4 個 .js 檔）

```
petcollection（文創系列/範疇)
  name*, slug*, type(Book_Station | Phone_Accessories | Personal_Accessories | Lifestyle),
  season, description, coverImage*(含必填 alt),
  tags[], isActive, sortOrder

patchcollection（貼布創作系列)
  name*(≤70字), slug*, coverImage(含必填 alt), description,
  theme*(animals | food | festival | nature — v3 新增,主題清單於 schema 統一管理),
  tags[], isActive, sortOrder

product(產品主表 —— 全品類共用)
  productname*, slug*, sku,
  coverImage(含必填 alt), images[](每張必填 alt — v3 修正),
  selectCollection → reference(petcollection | patchcollection),
  shortDescription, longDescription(block content),
  material, size,
  isBestSell(bool,主頁自動拉取),
  status(draft | published | archived — v3 修正拼字),
  seoTitle, seoDescription(≤160字,後台可逐品覆寫)
  【v3 刻意移除:moq, leadTime, categories, line — MOQ/交期改為洽談報價;
    分類與產品線歸屬由 selectCollection 的目標文件決定】

blog(V2 前台,schema 先就緒)
  title*, slug*, mainImage(含必填 alt), body(block content + image),
  publishedAt, excerpt(≤200字), tags[], sortOrder, isFeatured,
  seoTitle, seoDescription(≤160字)
```

**資料關係閉環：**

```
petcollection(type=四範疇) ←┐
                             ├─ product.selectCollection(單一 reference,二擇一)
patchcollection(theme 分類)  ←┘

前台推導邏輯:
- 產品屬於哪條線 → 看 selectCollection 指向的 _type(petcollection=文創 / patchcollection=貼布)
- 產品分類頁 /pet-collection/[slug] → petcollection 文件
- 系列頁 /embroidered-patches/[series] → patchcollection 文件
- Patch 展示牆 theme 篩選 → 產品所屬 patchcollection 的 theme
- 主頁 Best Sellers → product.isBestSell == true && status == "published"
```

**設計重點（維持）:**
- 圖片 `alt` 全部 `validation: required`——圖片 SEO 對產品展示站影響極大（Google Images 是 B2B 買家常用入口）。
- `seoTitle / seoDescription` 留空時前端自動用 productname + shortDescription 生成，重要產品可手動覆寫。
- `status = draft` 的產品不出現在前台與 sitemap。
- 所有列表頁、篩選、Best Seller 區全部由 Sanity 資料驅動，**任何產品資訊不寫死在程式碼裡**。

## 3.2 ⚠️ Schema 修正清單（錄入產品前必改，共 5 項）

> 現在還沒錄入正式產品，是改欄位名的最後安全窗口；一旦錄入資料再改名就需要 migration。

**修正 1 — `patchcollection.js`:`field` → `fields`（嚴重：alt 欄位目前不生效）**

```js
// 第 33 行附近,原:
field: [
// 改為:
fields: [
```

**修正 2 — `patchcollection.js`：新增 `theme` 欄位 + 修 preview（可直接替換的關鍵段落）**

```js
// 在 description 之後插入:
defineField({
    name: 'theme',
    title: '主題 (Theme)',
    type: 'string',
    options: {
        list: [
            {title: 'Animals 動物', value: 'animals'},
            {title: 'Food 食物', value: 'food'},
            {title: 'Festival 節慶', value: 'festival'},
            {title: 'Nature 自然', value: 'nature'},
        ],
        layout: 'radio',
    },
    validation: (r) => r.required().error('必須選擇主題'),
}),

// preview.prepare 原回傳字串 'name'/'media'/'isActive',且鍵名錯誤。改為:
preview: {
    select: { name: 'name', theme: 'theme', media: 'coverImage' },
    prepare({ name, theme, media }) {
        return {
            title: name,
            subtitle: theme ? `Theme: ${theme}` : '未設主題',
            media: media,
        }
    },
},
```

**修正 3 — `product.js`:`iamges` → `images`，且其他照片補上必填 alt**

```js
defineField({
    name: 'images',              // 原誤植 'iamges'
    title: '其他照片',
    group: 'productdetail',
    type: 'array',
    of: [{
        type: 'image',
        options: {hotspot: true},
        fields: [                 // 原缺:其他照片也要強制 alt
            {
                name: 'alt',
                type: 'string',
                title: '替代文字 (Alt Text)',
                validation: (r) => r.required(),
            },
        ],
    }],
}),
```

**修正 4 — `product.js`:status 拼字 + 描述欄位拼字**

```js
// 第 118 行,原:
list: ['draft','published', 'archieved']
// 改為(與 preview 翻譯表的 'archived' 對齊):
list: ['draft', 'published', 'archived']

// 同時建議改名(現在改零成本):
// shortDesciption → shortDescription
// longDesciption  → longDescription
// rows: '4' → rows: 4(字串改數字)
```

**修正 5 — `petcollection.js`:preview 鍵名修正 + type 顯示標籤**

```js
// type 建議改為帶顯示標籤的物件(後台更友善,value 維持不變):
options: {list: [
    {title: 'Book & Station 書冊文具', value: 'Book_Station'},
    {title: 'Phone Accessories 手機配件', value: 'Phone_Accessories'},
    {title: 'Personal Accessories 個人配件', value: 'Personal_Accessories'},
    {title: 'Lifestyle 生活雜貨', value: 'Lifestyle'},
]},

// preview 原回傳 name:/type: 鍵名無效,改為:
preview: {
    select: { name: 'name', type: 'type', media: 'coverImage', isActive: 'isActive' },
    prepare({ name, type, media, isActive }) {
        return {
            title: name,
            subtitle: `${type || '未分類'}${isActive ? '' : ' · 已下架'}`,
            media: media,
        }
    },
},
```

**非阻斷提醒（可不改）:**
- `product.js` 頂部 import 了 petcollection / patchcollection 但未使用，可刪除兩行 import。
- `index.js` 註冊順序建議 `[product, petcollection, patchcollection, blog]`，後台左側把 Product 排最前（日常操作最多）。
- `siteSettings` 與 `inquiry` schema v3 未建：全站設定暫以前端常數檔管理（`src/config/site.ts`),inquiry 依賴表單服務即可。日後需要再補。

## 3.3 Product Card(列表頁元件,v3 更新）

```
┌─────────────────┐
│  產品主圖(1:1)  │  ← 懶加載 + Sanity CDN 自動 AVIF/WebP
├─────────────────┤
│ 產品名稱         │
│ 所屬系列名        │   ← v3:移除 MOQ
│ [View Details]  │
└─────────────────┘
```
Hover 顯示第二張圖（選配，第二期）。

## 3.4 Product Detail Page `/product/[slug]`(v3 更新）

```
[麵包屑: Home / Pet Collection(或 Embroidered Patches)/ 產品名]   ← BreadcrumbList JSON-LD
左:圖片畫廊(coverImage + images[],可放大)
右:產品名(H1)
  所屬系列、SKU、材質、尺寸
  【v3 移除 MOQ / Lead time 顯示 — 改為洽談報價】
  [Request a Quote] → /contact 表單帶入產品名
下:長描述 + 細節圖
  Related Products(同 selectCollection 系列 4 個 —— 站內連結 + 瀏覽深度)
頁尾:Product JSON-LD(name, image, brand, sku, category)
```

> MOQ 政策的落點：產品頁不顯示數字，但 `/wholesale-terms` 保留 MOQ/交期的政策說明文字（引導洽談）,FAQ 第一題回答亦引導洽談。這樣 B2B 買家仍有預期管理，價格彈性保留在你們手上。

---

# Part Four:Technical（定案：Astro + Sanity)

## 4.1 架構總覽

```
內容管理          建置                 託管/CDN              表單
┌──────────┐   ┌──────────────┐   ┌─────────────────┐   ┌──────────────┐
│  Sanity   │ → │ Astro (SSG)  │ → │ Cloudflare Pages │   │ Web3Forms /  │
│  CMS 雲端 │   │ build 時生成  │   │ 或 Vercel(免費) │   │ Formspree    │
│  + /studio│   │ 全靜態 HTML   │   │ 全球 CDN + HTTPS │   │ + Turnstile  │
└──────────┘   └──────────────┘   └─────────────────┘   └──────────────┘
      │                ↑
      └── Webhook → Deploy Hook(後台發佈內容 → 自動重建網站,約 1-2 分鐘生效)

Catalog PDF:不走 CMS,直接放 /public/catalog/,隨 git push 部署
```

- **前台**:Astro，全站靜態生成（SSG)——產品頁、系列頁、分類頁全部 build 時生成 HTML，幾乎零 JS,CWV 天然優勢。
- **後台**:Sanity Studio 嵌入 `/studio` 路由，管理 product / petcollection / patchcollection / blog 四種文件。
- **圖片管線**:Sanity CDN 內建——前端用 `@sanity/image-url` 請求任意尺寸 + 自動 AVIF/WebP。
- **內容更新流程**：後台按 Publish → Sanity Webhook 觸發 Deploy Hook → 自動重新 build → 1–2 分鐘內上線。
  - Webhook filter(v3 更新）:`_type in ["product", "petcollection", "patchcollection", "blog"]`
- **Catalog 更新流程（v3)**：編輯靜態頁 + 替換 PDF → git push → 自動部署（不經 webhook)。
- **詢價表單**:Web3Forms 或 Formspree + Cloudflare Turnstile;inquiry 寫入 Sanity 為進階選項，V1 省略。
- **資料備份**:Sanity 雲端自動保存文件歷史；每月 `sanity dataset export` 手動備份。

## 4.2 為什麼不是 WordPress / Next.js + Payload（決策紀錄，維持）

- WordPress：達到 2026 CWV 標準需大量快取與優化外掛，安全維護是長期負擔，不符合「極簡代碼」目標。
- Next.js + Payload：功能最強但需自管 PostgreSQL 與伺服器知識；以「展示站 + 簡單後台」的需求規模，Astro + Sanity 維護成本更低、速度上限更高。
- 若第二期需要會員系統/詢價籃等重互動功能，Astro 可平滑加入 islands 或遷移 API route，架構不鎖死。

---

# Part Five:SEO 與性能執行清單（2026 Google Standard)

## 5.1 On-page SEO（每頁硬性檢查）

- [ ] 每頁唯一 `title`(≤60 字元）與 `meta description`(≤155 字元），後台可覆寫
- [ ] 每頁唯一 H1（純文字不包連結）;H2/H3 層級不跳級
- [ ] Open Graph + Twitter Card meta（產品頁用產品主圖）
- [ ] canonical 標籤；篩選頁（`?type=...`、`?theme=...`)canonical 指向主分類頁
- [ ] 圖片全部有描述性 `alt`(Sanity schema 強制必填——**含 product 的其他照片，見 3.2 修正 3**)
- [ ] 結構化數據（JSON-LD):
  - 全站：`Organization`(logo、聯絡、社交連結）
  - 產品頁：`Product` + `BreadcrumbList`
  - Contact 頁：`FAQPage`
  - 系列頁：`CollectionPage` / `ItemList`
- [ ] 分頁用清晰連結 + canonical(`rel="next/prev"` 已廢）

## 5.2 技術 SEO

- [ ] **XML sitemap**:`@astrojs/sitemap` 自動生成，提交 Google Search Console + Bing Webmaster Tools
- [ ] **robots.txt**：放行產品/系列頁，封 `/studio`、草稿、站內搜尋結果頁
- [ ] `/studio` 全區 noindex + Sanity 登入保護
- [ ] 自訂 404 頁（帶回產品分類連結）
- [ ] URL 全小寫、連字符、語意化（`/product/mochi-cat-keychain` 而非 `?id=123`)
- [ ] hreflang:V1 英文單語設 `x-default`;URL 結構預留 `/ja`、`/zh` 前綴，第二期加語言不改架構
- [ ] **AI 搜尋可讀性（2026 重點）**：產品描述寫成完整、資訊密度高的句子（規格、材質、使用場景）,讓 Google AI Overviews / LLM 搜尋可直接引用；FAQ 頁同理
- [ ] PDF catalog 檔名含英文關鍵字，放 `/public/catalog/`;PDF 加文件標題 metadata(Google 會索引 PDF)

## 5.3 Core Web Vitals 預算（建站時定死）

| 指標 | 目標 | 手段 |
|---|---|---|
| LCP | < 2.0s | Hero 圖 AVIF + `fetchpriority="high"` + 預載；字體 `font-display: swap` |
| INP | < 200ms | 極少客戶端 JS；篩選用 URL 參數 + 顯示切換；非關鍵腳本延後 |
| CLS | < 0.05 | 所有圖片寫死寬高；webfont 預載 |

- 圖片：Sanity CDN `@sanity/image-url` 輸出多尺寸 srcset(300/600/1200px)+ `auto=format`(AVIF/WebP)
- CSS:Tailwind（按需打包，單頁 CSS < 15KB)，不用整套 UI 框架
- 字體：自託管 1–2 個字體子集（日文品牌字 + 英文內文），不走 Google Fonts 外部請求
- 驗收標準：Lighthouse Performance ≥ 95 / SEO = 100（寫進上線檢查表）

## 5.4 安全清單

- [ ] 全站 HTTPS(Cloudflare/Vercel 自動簽發；開 HSTS)
- [ ] 安全 headers:Content-Security-Policy、X-Frame-Options、X-Content-Type-Options、Referrer-Policy（靜態站用 `_headers` 檔或平台設定）
- [ ] 後台：Sanity 帳號開 Google 登入 + 雙因素；成員權限分級（編輯/管理）
- [ ] 表單：honeypot 隱藏欄位 + Cloudflare Turnstile（不拖慢 CWV)；伺服器端驗證
- [ ] 依賴鎖定版本 + 每月 `npm outdated` 檢查更新
- [ ] Sanity API token 只放後端環境變數，前端只用 read-only public dataset

## 5.5 精簡代碼原則

- 產品/系列頁全靜態生成；JS 只保留三處互動：篩選、圖片畫廊、表單
- 每頁 JS 預算 < 80KB(gzip)；第三方腳本白名單制
- 分析工具用輕量的 Cloudflare Web Analytics 或 Plausible；如用 GA4 則延遲載入

---

# Part Six：上線總覽（v3 更新）

Schema 已建好（含本版 3.2 修正後）,W1 進度超前；剩餘工作以前台開發為主。

| 週 | 里程碑 | 產出 |
|---|---|---|
| W1（已完成大半） | 定案 + 地基 | ✅ Sanity schema 四種文件建好（套用 3.2 修正後定案）、Astro 專案初始化、GitHub + 部署管線、Webhook 閉環、視覺方向稿 |
| W2 | 前台模板 | Header/Footer、產品卡片（無 MOQ)/詳情/分類頁（pet type 篩選）/系列頁（patch theme 篩選）/靜態 Catalog 頁、第一批 10–20 個產品錄入 |
| W3 | 內容頁 + SEO | 首頁八區、About、Contact+FAQ 表單、JSON-LD 全套、sitemap/robots、404、政策頁 |
| W4 | 優化 + 上線 | CWV 調校達標、表單測試、QA、DNS 切換、Search Console 提交 |

**你方需備齊的素材：** 品牌 logo(SVG)、Hero 橫屏照片、產品照片（白底+情境圖）、40+ 配件與徽章清單、MOQ/交期政策文字（用於 /wholesale-terms 與 FAQ)、公司聯絡資訊、Catalog PDF 檔（英文關鍵字檔名）。

---

# Part Seven：二次開發（V2，架構已預留）

- **Blog 前台頁面**(schema 已建，只需做 `/blog` 列表頁 + `/blog/[slug]` 文章頁 + Article JSON-LD；搶 "wholesale embroidered patches" 類關鍵字）
- 多語言（日文/繁中，hreflang 與 URL 結構已預留）
- 詢價籃（Inquiry Cart)：勾多個產品一次送出詢價
- 經銷商帳號與批發價顯示（屆時才需要真正的後端）
- Newsletter / 新系列通知訂閱
- petcollection 範疇擴充（schema list 加值即可）;patchcollection theme 擴充同理
- siteSettings / inquiry schema（全站設定後台化、詢價留存）
