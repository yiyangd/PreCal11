# Pre-Calculus 11 · Section 2.4

A bilingual study page for rational functions, asymptotes, holes, and graphs. / 有理函数、渐近线、空洞与图像的中英双语学习网页。

Repository / 仓库: [yiyangd/PreCal11](https://github.com/yiyangd/PreCal11)

Expected site after GitHub Pages is enabled / 启用 GitHub Pages 后的预期网址: [Chinese / 中文](https://yiyangd.github.io/PreCal11/) · [English / 英文](https://yiyangd.github.io/PreCal11/?lang=en)

## Features / 功能

- Chinese / English menu switch; English content is based on the supplied textbook and lecture notes. / 菜单栏切换中英文，英文内容依据教材和讲义整理。
- 7 concepts, 18 lecture examples and practice questions, and 137 textbook exercises with step-by-step explanations. / 7 个知识点、18 道讲义例题与练习，以及 137 道教材练习及分步解析。
- Graphs, concept and exercise filters, browser-saved learning progress, and print / PDF support. / 图像、知识点与题号筛选、浏览器学习进度保存及打印功能。
- Static HTML, CSS, and JavaScript; no installation or build required. / 纯静态网页，无需安装依赖或构建。

## Open locally / 本地打开

Open `index.html` in a modern browser. The lesson data is embedded for local use. Click **English** or **中文** to switch languages. / 用浏览器直接打开 `index.html`，再点击 **English** 或 **中文**。

Optional local preview, run in this folder: / 如需本地预览，在本文件夹运行：

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Then open [the local preview](http://127.0.0.1:8000/), or [English](http://127.0.0.1:8000/?lang=en). / 随后打开本地预览地址；`?lang=en` 可直接进入英文版。

## Files / 文件

```text
index.html       Page and embedded lesson data / 网页及内嵌题目数据
styles.css       Responsive and print styles / 页面及打印样式
app.js           Language switch, solutions, filters, progress, graphs / 页面功能
data.json       Same lesson data as embedded in index.html / 同步的题目数据
assets/          Six textbook exercise figures / 六张教材练习图
.nojekyll        Static GitHub Pages deployment / 静态部署标记
README.md        This guide / 使用说明
```

When changing lesson content, update both `data.json` and the JSON in the `lesson-data` script in `index.html`. / 修改题目内容时，请同时更新 `data.json` 和 `index.html` 中 `lesson-data` 的内嵌 JSON。

## GitHub Pages / 发布网页

Upload the contents of this folder to the repository root, with `index.html` at the top level. / 将本文件夹中的内容上传到仓库根目录，`index.html` 应位于最外层。

In the repository, open **Settings → Pages**. Choose **Deploy from a branch**, select `main` and **/(root)**, then click **Save**. / 在仓库的 **Settings → Pages** 中选择 **Deploy from a branch**，选择 `main` 及 **/(root)**，然后 **Save**。

After deployment, Pages displays the site URL. Add `?lang=en` for the English version. / 部署完成后，Pages 会显示网址；网址后添加 `?lang=en` 可进入英文版。

[GitHub Pages publishing guide / GitHub Pages 官方部署说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Sources / 内容来源

- `Section 2.4 Part 1.pdf` — lecture Part 1, 28 PDF pages. / 第 1 部分讲义，共 28 页。
- `Section 2.4 Part 2.pdf` — lecture Part 2, 13 PDF pages. / 第 2 部分讲义，共 13 页。
- `Precalculus A Unit Circle Approach 4th Edition by J. S. Ratti.pdf` — Section 2.4 *Rational Functions*, printed pp. 199–219 (PDF pp. 223–243). Exercises are on printed pp. 215–219 (PDF pp. 239–243). / 教材第 2.4 节印刷页 199–219（PDF 页 223–243），练习位于印刷页 215–219（PDF 页 239–243）。

Question-specific source page numbers are retained in the lesson data. The original PDFs are not included in this repository. / 题目数据保留各题来源页码；仓库不包含原始 PDF。

Exercise 137: the original GeoGebra applet and exact formula were not verified during preparation. Its solution is explicitly marked as a supplementary model, `F(x)=(x-a)/[(x-b)(x-c)]`, and must be checked against the original applet for the original exercise. / 第 137 题：原 GeoGebra 互动内容及准确公式尚未核实。页面明确将 `F(x)=(x-a)/[(x-b)(x-c)]` 标为补充模型，原题仍需对照原互动内容核实。
