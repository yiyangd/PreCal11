# Pre-Calculus 11

A simple bilingual course homepage with Section 2.4 on rational functions, Section 2.5 on inequalities, and Section 2.6 on polynomial zeros. / 简洁的中英双语课程首页，包含第 2.4 节有理函数、第 2.5 节不等式和第 2.6 节多项式零点。

Repository / 仓库: [yiyangd/PreCal11](https://github.com/yiyangd/PreCal11)

Course homepage / 课程首页: [中文](https://yiyangd.github.io/PreCal11/?lang=zh) · [English](https://yiyangd.github.io/PreCal11/?lang=en)

Section 2.4 / 第 2.4 节: [中文](https://yiyangd.github.io/PreCal11/sections/2-4/?lang=zh) · [English](https://yiyangd.github.io/PreCal11/sections/2-4/?lang=en)

Section 2.5 / 第 2.5 节: [中文](https://yiyangd.github.io/PreCal11/sections/2-5/?lang=zh) · [English](https://yiyangd.github.io/PreCal11/sections/2-5/?lang=en)

Section 2.6 / 第 2.6 节: [中文](https://yiyangd.github.io/PreCal11/sections/2-6/?lang=zh) · [English](https://yiyangd.github.io/PreCal11/sections/2-6/?lang=en)

## Features / 功能

- Chinese / English menu switch; English content is based on the supplied textbook and lecture notes. / 菜单栏切换中英文，英文内容依据教材和讲义整理。
- Pages open in English by default. Choose **中文** to switch, or use `?lang=zh`; selected language is carried in navigation links. / 默认英语；点击 **中文** 或使用 `?lang=zh` 可切换，页面导航会保留所选语言。
- Section 2.4: 7 concepts, 18 lecture examples and practice questions, and 137 textbook exercises with step-by-step explanations. / 第 2.4 节：7 个知识点、18 道讲义例题与练习，以及 137 道教材练习及分步解析。
- Section 2.5: 8 concepts, all 6 textbook Examples, all 6 Practice Problems, and Exercises 1–128. Sign charts show interval signs and endpoint inclusion separately. / 第 2.5 节：8 个知识点、全部 6 道教材例题、6 道配套练习及节后习题 1–128。符号表分别显示区间符号和端点是否包含。
- Section 2.6: 8 concepts, all 7 textbook Examples, all 7 Practice Problems, and Exercises 1–88. Synthetic division tables align every coefficient, product, quotient entry, and remainder. / 第 2.6 节：8 个知识点、全部 7 道教材例题、7 道配套练习及节后习题 1–88。合成除法表逐列展示系数、乘积、商与余数。
- Graphs, concept and exercise filters, browser-saved learning progress, and print / PDF support. / 图像、知识点与题号筛选、浏览器学习进度保存及打印功能。
- Static HTML, CSS, and JavaScript; no installation or build required. / 纯静态网页，无需安装依赖或构建。

## Open locally / 本地打开

Open `index.html` in a modern browser, choose **English** or **中文**, then choose a section. The lesson data is embedded for local use. / 用浏览器直接打开 `index.html`，选择语言及章节；课程页内嵌题目数据，支持离线使用。

Optional local preview, run in this folder: / 如需本地预览，在本文件夹运行：

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Then open [the local preview](http://127.0.0.1:8000/), or [English](http://127.0.0.1:8000/?lang=en). / 随后打开本地预览地址；`?lang=en` 可直接进入英文版。

## Files / 文件

```text
index.html             Course homepage / 课程首页
home.css, home.js      Homepage layout and language switch / 首页样式与语言切换
sections/2-4/
  index.html           Lesson and embedded data / 学习页及内嵌题目数据
  styles.css, app.js   Lesson layout and functions / 学习页样式与功能
  data.json            Same data as embedded in lesson HTML / 同步的题目数据
  assets/              Six textbook exercise figures / 六张教材练习图
sections/2-5/
  index.html           Textbook-based lesson and embedded data / 教材学习页及内嵌题目数据
  styles.css, app.js   Lesson functions, sign charts and graphs / 学习功能、符号表与图像
  data.json            Same data as embedded in lesson HTML / 同步的题目数据
  assets/              Original given exercise figures / 教材题目原图
sections/2-6/
  index.html           Polynomial zeros lesson and embedded data / 多项式零点学习页及内嵌数据
  styles.css, app.js   Lesson functions and synthetic-division tables / 学习功能与合成除法表
  data.json            Same data as embedded in lesson HTML / 同步的题目数据
  assets/              Original exercise graphs / 教材题目原图
.nojekyll              Static GitHub Pages deployment / 静态部署标记
README.md              This guide / 使用说明
```

When changing lesson content, update both the section's `data.json` and the JSON in its `index.html` `lesson-data` script. / 修改题目内容时，请同步更新对应章节的 `data.json` 和 `index.html` 内嵌 JSON。

The lesson includes a **Back to home** link. Selected language is retained in navigation links and learning progress remains saved. A URL with no valid language parameter opens in English. Previous homepage links to a concept or exercise are redirected to Section 2.4. / 学习页可返回首页，页面导航保留所选语言，学习进度继续保存；无有效语言参数的网址默认英语。原首页上的知识点、题号链接会自动进入第 2.4 节。

## GitHub Pages / 发布网页

Upload the contents of this folder to the repository root, with `index.html` at the top level. / 将本文件夹中的内容上传到仓库根目录，`index.html` 应位于最外层。

In the repository, open **Settings → Pages**. Choose **Deploy from a branch**, select `main` and **/(root)**, then click **Save**. / 在仓库的 **Settings → Pages** 中选择 **Deploy from a branch**，选择 `main` 及 **/(root)**，然后 **Save**。

After deployment, Pages displays the site URL. Add `?lang=en` for the English version. / 部署完成后，Pages 会显示网址；网址后添加 `?lang=en` 可进入英文版。

[GitHub Pages publishing guide / GitHub Pages 官方部署说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Sources / 内容来源

- `Section 2.4 Part 1.pdf` — lecture Part 1, 28 PDF pages. / 第 1 部分讲义，共 28 页。
- `Section 2.4 Part 2.pdf` — lecture Part 2, 13 PDF pages. / 第 2 部分讲义，共 13 页。
- `Precalculus A Unit Circle Approach 4th Edition by J. S. Ratti.pdf` — Section 2.4 *Rational Functions*, printed pp. 199–219 (PDF pp. 223–243). Exercises are on printed pp. 215–219 (PDF pp. 239–243). / 教材第 2.4 节印刷页 199–219（PDF 页 223–243），练习位于印刷页 215–219（PDF 页 239–243）。
- The same textbook — Section 2.5 *Polynomial and Rational Inequalities*, printed pp. 220–234 (PDF pp. 244–258). Exercises are on printed pp. 230–234 (PDF pp. 254–258). Section 2.5 is textbook-based; lecture notes have not yet been supplied. Applications, domains and construction topics extend the method through the section exercises. / 同一教材第 2.5 节印刷页 220–234（PDF 页 244–258），习题位于印刷页 230–234（PDF 页 254–258）。第 2.5 节依据教材整理，尚无讲义；应用、定义域与构造知识点来自节后习题。
- The same textbook — Section 2.6 *Zeros of a Polynomial Function*, printed pp. 235–245 (PDF pp. 259–269). Exercises are on printed pp. 243–245 (PDF pp. 267–269). The page follows the textbook, including all subparts of the Cardano and Vieta exercises. / 同一教材第 2.6 节印刷页 235–245（PDF 页 259–269），习题位于印刷页 243–245（PDF 页 267–269），完整保留 Cardano 与 Vieta 题的各小问。

Section 2.6 uses a negative test number for the standard synthetic-division lower-bound rule. The printed text's unrestricted “any k” omits this necessary restriction; the preparation audit records a counterexample. / 第 2.6 节的合成除法下界判据使用负数测试。教材“any k”漏写此必要限制，数据审核记录了反例。

Question-specific source page numbers are retained in the lesson data. The original PDFs are not included in this repository. / 题目数据保留各题来源页码；仓库不包含原始 PDF。

Exercise 137: the original GeoGebra applet and exact formula were not verified during preparation. Its solution is explicitly marked as a supplementary model, `F(x)=(x-a)/[(x-b)(x-c)]`, and must be checked against the original applet for the original exercise. / 第 137 题：原 GeoGebra 互动内容及准确公式尚未核实。页面明确将 `F(x)=(x-a)/[(x-b)(x-c)]` 标为补充模型，原题仍需对照原互动内容核实。
