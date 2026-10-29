# Market 與 Product Detail 資料連結指南

## 內容人員的日常操作

1. 在 Sanity Studio 建立 `Pet Collection / Series` 或 `Patch Collection / Series`，填寫名稱、Slug、分類／Theme，並開啟 `isActive`。
2. 建立 `Product`，將 `status` 設為 `published`，上傳 Main Image（必填 Alt Text），並在「產品系列選取」指定一個 collection。
3. 如需滑過產品卡後顯示第二張照片，於「其他照片」上傳第一張圖片；第一張會是 hover 圖。
4. 填寫短描述、SKU、Material、Size；詳情頁自動顯示。`longDescription` 會顯示在 Description 區塊。
5. 發佈後觸發部署 webhook；網站重新建置後，Market、產品頁與 Related Products 會自動更新。

## 資料如何流動

`product.selectCollection` 是唯一的關係欄位。

- 指向 `petcollection`：顯示在 `/pet-collection`，左側依 Pet collection 篩選。
- 指向 `patchcollection`：顯示在 `/patch-collection`，左側依 Patch collection 篩選。
- `/product/[slug]` 自動讀取同一筆 reference，產生麵包屑、規格的 Collection 名稱與最多四項 Related Products。

## 固定 Market Banner

所有 Market 頁共用：`public/images/market/market-collection-cover.webp`。

直接以相同檔名覆蓋即可，無需修改程式。建議輸出尺寸為：

- Desktop：1328 × 320px，或更大並維持約 4.15:1。
- Mobile：375 × 359px；同一張圖會以 `object-fit: cover` 自動裁切。

## 篩選、排序與分頁

- URL `?collection=<Sanity document id>` 保留目前篩選，分享網址仍會顯示相同清單。
- `Latest` 使用 Sanity 的建立日期；`Name` 使用產品名稱英文排序。
- 每頁固定九個產品，前端最多顯示五個頁碼按鈕。
- 這些操作只在瀏覽器內更新，不會重複請求 Sanity，也不需要額外後端。

## 上線前檢查

- 每個已發佈產品都應有 Main Image 和 Alt Text。
- Slug 在同一網站中不可重複。
- Product 的 `selectCollection` 必須已選取；否則不會進入任何 Market。
- 詳情頁的詢價按鈕會前往 `/contact?product=<slug>`；待 Contact 頁完成後，表單可用此參數自動帶入產品。
