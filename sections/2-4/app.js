(() => {
  'use strict';
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const list = value => Array.isArray(value) ? value : value == null ? [] : [value];
  const slug = value => String(value ?? '').replace(/[^a-zA-Z0-9_-]/g, '-');
  const topicNames = new Map();
  let graphs = new Map();
  let graphCounter = 0;
  let exerciseRecords = [];
  let concepts = [];
  let sourceData;
  let topicObserver;
  let language = 'zh';
  try { language = new URLSearchParams(location.search).get('lang') || localStorage.getItem('precal11-section24-language') || 'zh'; } catch (_) {}
  if (!['zh', 'en'].includes(language)) language = 'zh';
  const t = (zh, en) => language === 'en' ? en : zh;
  const localized = record => language === 'en' ? {...record, ...record.en} : record;
  function graphLabel(label) {
    return language === 'en' ? ({'原函数':'Original function','倒数':'Reciprocal','反函数':'Inverse'}[label] || label || '') : label || '';
  }

  function applyStaticLanguage() {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-Hans';
    document.title = t('2.4 有理函数 · 学习笔记','2.4 Rational Functions · Study Notes');
    $('meta[name="description"]').content = t('Pre-Calculus 11 第 2.4 节：有理函数的渐近线、空洞与图像，中英文题目和分步解析。','Section 2.4: rational functions, asymptotes, holes and graphs. English and Chinese questions with step-by-step solutions.');
    const textEntries = [
      ['.skip-link','跳到学习内容','Skip to lesson'],
      ['.save-note','进度自动保存在此浏览器','Progress saved in this browser'],
      ['.progress-box > div > span','本节学习进度','Lesson progress'],
      ['.hero-meta span:last-child','知识点 · 例题 · 练习','Concepts · Examples · Practice'],
      ['.hero-note small','从 Part 1 到 Part 2','From Part 1 to Part 2'],
      ['#expand-all','展开全部解析','Expand all solutions'],
      ['#collapse-all','收起全部解析','Collapse all solutions'],
      ['#exercise-title','教材 Exercises','Textbook Exercises'],
      ['#exercise-intro','按知识点找到对应练习，把方法用熟。','Find exercises by concept and put the method into practice.'],
      ['[data-ui="filter-topic"]','知识点','Concept'],
      ['[data-ui="filter-search"]','题号或关键词','Exercise number or keyword'],
      ['#clear-filters','重置','Reset'],
      ['#loading','正在整理本节学习内容…','Loading lesson content…'],
      ['#exercise-empty','没有找到匹配的题目。换一个题号或知识点试试。','No matching exercises. Try another number, keyword or concept.'],
      ['#source-note','根据 Lecture Part 1、Part 2 与教材 2.4 整理','Based on Lecture Parts 1–2 and textbook Section 2.4'],
      ['.page-footer a','回到顶部 ↑','Back to top ↑']
    ];
    textEntries.forEach(([selector,zh,en]) => { const node=$(selector); if(node)node.textContent=t(zh,en); });
    const htmlEntries = [
      ['.brand > span:last-child','Pre-Calculus 11 <small>学习笔记</small>','Pre-Calculus 11 <small>Study notes</small>'],
      ['#print-button','<span aria-hidden="true">↗</span> 打印 / PDF','<span aria-hidden="true">↗</span> Print / PDF'],
      ['.sidebar-title','有理函数<span>Rational functions</span>','Rational functions<span>Section 2.4</span>'],
      ['.exercise-nav','<span aria-hidden="true">▦</span> 教材 Exercises <span aria-hidden="true">↗</span>','<span aria-hidden="true">▦</span> Textbook Exercises <span aria-hidden="true">↗</span>'],
      ['.sidebar-foot','每个知识点<br>方法 → 例题 → 练习 → 教材','For each concept<br>Method → Example → Practice → Textbook'],
      ['#page-title','有理函数的<br><em>渐近线与空洞</em>','Rational functions:<br><em>asymptotes and holes</em>'],
      ['.hero-copy > p','把解题过程拆成清楚的几步，<br class="desktop-break">再把每个知识点连到完整的函数图像。','Break each solution into clear steps,<br class="desktop-break">then connect the concepts to the complete graph.'],
      ['.hero-note p','先看定义域<br>再找渐近线与空洞<br>最后连接图像','Start with the domain<br>Find asymptotes and holes<br>Then sketch the graph'],
      ['.reading-toolbar > p','<span class="status-dot" aria-hidden="true"></span>例题显示解析，练习先自己尝试','<span class="status-dot" aria-hidden="true"></span>Examples explained; try practice questions first']
    ];
    htmlEntries.forEach(([selector,zh,en]) => { const node=$(selector); if(node)node.innerHTML=t(zh,en); });
    const homeUrl=new URL(location.protocol==='file:'?'../../index.html':'../../',location.href);
    homeUrl.searchParams.set('lang',language);
    $('.brand').href=homeUrl.href;
    $('.brand').setAttribute('aria-label',t('返回课程首页','Back to course home'));
    $('#home-link').href=homeUrl.href;
    $('#home-link').textContent='← '+t('返回首页','Back to home');
    $('.sidebar').setAttribute('aria-label',t('本节目录','Lesson contents'));
    $('#topic-nav').setAttribute('aria-label',t('知识点','Concepts'));
    $('#lesson-progress').setAttribute('aria-label',t('本节学习进度','Lesson progress'));
    $('.language-switch').setAttribute('aria-label',t('页面语言','Page language'));
    $('#exercise-search').placeholder=t('例如：9、空洞、graph','e.g. 9, holes, graph');
    $$('[data-lang]').forEach(button => {
      button.setAttribute('aria-pressed',String(button.dataset.lang === language));
      button.classList.toggle('is-active',button.dataset.lang === language);
      button.title=button.dataset.lang==='zh'?t('切换为中文','Switch to Chinese'):t('切换为英文','Switch to English');
    });
  }

  function observeTopics() {
    if(topicObserver)topicObserver.disconnect();
    if(!('IntersectionObserver' in window))return;
    topicObserver=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
      if(!visible.length)return;
      const id=visible[0].target.dataset.topic;
      $$('.nav-link').forEach(link=>link.classList.toggle('active',link.dataset.navTopic===id));
    },{rootMargin:'-95px 0px -58% 0px',threshold:0});
    $$('.topic').forEach(section=>topicObserver.observe(section));
  }

  function renderLanguage(preserve = false) {
    let state;
    if(preserve) {
      const anchor=$$('.topic, .exercise-section, .question-card[id]').filter(node=>{const rect=node.getBoundingClientRect();return rect.top<=110&&rect.bottom>110;}).pop();
      state={filter:$('#exercise-topic').value,query:$('#exercise-search').value,details:$$('.solution,.source-figure').map(node=>node.open),anchor:anchor?.id,offset:anchor?.getBoundingClientRect().top,scroll:window.scrollY};
    }
    const lecture=sourceData.lecture??sourceData.lectures??sourceData;
    const textbook=sourceData.textbook??{};
    concepts=list(lecture.concepts??lecture.topics).map(localized);
    const questions=list(lecture.questions).map(localized);
    exerciseRecords=list(textbook.exercises??textbook.questions).map(localized);
    if(!concepts.length)throw new Error('Lesson concepts are missing.');
    graphs=new Map();graphCounter=0;topicNames.clear();
    concepts.forEach(topic=>topicNames.set(topic.id,topic.title));
    applyStaticLanguage();
    $('#topic-nav').innerHTML=concepts.map((topic,index)=>`<a class="nav-link ${index===0?'active':''}" href="#topic-${slug(topic.id)}" data-nav-topic="${escape(topic.id)}"><span class="nav-number">${String(index+1).padStart(2,'0')}</span><span>${escape(topic.title)}</span></a>`).join('');
    $('#lesson-content').innerHTML=concepts.map((topic,index)=>topicSection(topic,index,questions)).join('');
    $('#exercise-topic').innerHTML=`<option value="all">${t('全部知识点','All concepts')}</option>`+concepts.map(topic=>`<option value="${escape(topic.id)}">${escape(topic.title)}</option>`).join('');
    $('#exercise-list').innerHTML=exerciseRecords.map(exerciseCard).join('');
    $('#textbook-exercises').hidden=!exerciseRecords.length;
    $('#loading').hidden=true;
    if(state){
      $('#exercise-topic').value=state.filter;$('#exercise-search').value=state.query;
      $$('.solution,.source-figure').forEach((node,index)=>{node.open=state.details[index]??node.open;});
    }
    updateProgress();filterExercises();observeTopics();
    $$('.solution[open]').forEach(drawGraphs);
    if(state)requestAnimationFrame(()=>{
      const anchor=state.anchor&&document.getElementById(state.anchor);
      const top=anchor?window.scrollY+anchor.getBoundingClientRect().top-state.offset:state.scroll;
      window.scrollTo({top,behavior:'instant'});
    });
  }

  function selectLanguage(next) {
    if(!['zh','en'].includes(next)||next===language)return;
    language=next;
    try{localStorage.setItem('precal11-section24-language',language);}catch(_){}
    try{const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);}catch(_){}
    renderLanguage(true);
    $('#announcement').textContent=t('已切换为中文。','Switched to English.');
  }
  let completed = new Set();
  try { completed = new Set(JSON.parse(localStorage.getItem('precal11-section24-completed') || '[]')); } catch (_) {}

  // A small, local renderer for the mathematical notation in this chapter.
  // It parses only a fixed set of commands; source text is always escaped.
  function math(source) {
    let input = String(source ?? '').trim().replace(/^\$+|\$+$/g, '').replace(/^\\\(|\\\)$/g, '').replace(/^\\\[|\\\]$/g, '');
    input = input.replace(/\\(?:begin|end)\{(?:aligned|align\*?|gathered|gather\*?|equation\*?)\}/g, '').replace(/(?<!\\)&/g, '');
    let cursor = 0;
    const commands = {infty:'∞',infinity:'∞',cdot:'·',times:'×',div:'÷',pm:'±',mp:'∓',le:'≤',leq:'≤',ge:'≥',geq:'≥',ne:'≠',neq:'≠',equiv:'≡',neg:'¬',approx:'≈',sim:'∼',to:'→',rightarrow:'→',leftarrow:'←',Rightarrow:'⇒',Leftrightarrow:'⇔',leftrightarrow:'↔',therefore:'∴',because:'∵',in:'∈',notin:'∉',cup:'∪',cap:'∩',setminus:'∖',emptyset:'∅',varnothing:'∅',mathbb:'',pi:'π',theta:'θ',alpha:'α',beta:'β',gamma:'γ',Delta:'Δ',delta:'δ',Omega:'Ω',epsilon:'ε',varepsilon:'ε',ell:'ℓ',degree:'°',deg:'deg',prod:'∏',ldots:'…',cdots:'⋯',dots:'…',vert:'|',lvert:'|',rvert:'|',quad:' ',qquad:' ',sin:'sin',cos:'cos',tan:'tan',lim:'lim',log:'log',ln:'ln',max:'max',min:'min'};
    function group() {
      while (input[cursor] === ' ') cursor++;
      if (input[cursor] === '{') { cursor++; return parse('}'); }
      if (input[cursor] === '\\') return command();
      return escape(input[cursor++] ?? '');
    }
    function rawGroup() {
      while (input[cursor] === ' ') cursor++;
      if (input[cursor] !== '{') return input[cursor++] || '';
      cursor++; let depth = 1, result = '';
      while (cursor < input.length && depth) { const c = input[cursor++]; if (c === '{') depth++; if (c === '}') depth--; if (depth) result += c; }
      return result;
    }
    function command() {
      cursor++;
      if (input[cursor] === '\\') { cursor++; return '<br>'; }
      if (/[{}%$#_]/.test(input[cursor] || ' ')) return escape(input[cursor++]);
      if (/[ ,;:!]/.test(input[cursor] || '')) { cursor++; return ' '; }
      let name = ''; while (/[a-zA-Z]/.test(input[cursor] || ' ')) name += input[cursor++];
      if (['left','right','big','Big','bigg','Bigg','displaystyle','textstyle'].includes(name)) return '';
      if (name === 'not') { if (input.slice(cursor).startsWith('\\equiv')) { cursor += 6; return '≢'; } return '̸'; }
      if (['frac','dfrac','tfrac'].includes(name)) { const top = group(), bottom = group(); return `<span class="fraction"><span class="numerator">${top}</span><span class="denominator">${bottom}</span></span>`; }
      if (name === 'sqrt') { let power = ''; if (input[cursor] === '[') { cursor++; while (cursor < input.length && input[cursor] !== ']') power += input[cursor++]; cursor++; } return `<span class="root">${power ? `<sup>${escape(power)}</sup>` : ''}√<span>${group()}</span></span>`; }
      if (['text','textrm','mathrm','operatorname'].includes(name)) return `<span class="math-text">${escape(rawGroup())}</span>`;
      if (['mathbf','mathit','mathcal'].includes(name)) return group();
      if (name === 'mathbb') { const content = rawGroup(); return escape(({R:'ℝ',Z:'ℤ',N:'ℕ',Q:'ℚ',C:'ℂ'})[content] || content); }
      if (['overline','bar'].includes(name)) return `<span style="text-decoration:overline">${group()}</span>`;
      if (name === 'underline') return `<span style="text-decoration:underline">${group()}</span>`;
      return Object.prototype.hasOwnProperty.call(commands, name) ? escape(commands[name]) : escape(name);
    }
    function parse(end = '') {
      let output = '';
      while (cursor < input.length) {
        const character = input[cursor];
        if (end && character === end) { cursor++; break; }
        if (character === '\\') output += command();
        else if (character === '{') { cursor++; output += parse('}'); }
        else if (character === '^' || character === '_') { cursor++; const tag = character === '^' ? 'sup' : 'sub'; output += `<${tag}>${group()}</${tag}>`; }
        else { cursor++; output += character === '-' ? '−' : escape(character); }
      }
      return output;
    }
    return `<span class="formula">${parse()}</span>`;
  }
  function rich(value) {
    if (Array.isArray(value)) return value.map(rich).join('<br>');
    if (value && typeof value === 'object') return rich(value.body ?? value.text ?? value.title ?? '');
    const raw = String(value ?? '');
    const pieces = raw.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g);
    return pieces.map(piece => {
      if (piece.startsWith('$$') || piece.startsWith('\\[')) return `<span class="display-math">${math(piece)}</span>`;
      if (piece.startsWith('$') || piece.startsWith('\\(')) return `<span class="math-inline">${math(piece)}</span>`;
      return escape(piece).replace(/\n/g, '<br>');
    }).join('');
  }
  const body = value => `<div class="body-text">${rich(value)}</div>`;
  function stepList(steps, method = false) {
    const prefix = method ? 'method' : 'solution';
    return `<ol class="${prefix}-list ${method ? '' : 'solution-steps'}">${list(steps).map((step, index) => {
      const item = typeof step === 'string' ? {body:step} : step;
      return `<li class="${prefix}-step"><span class="${method ? 'method' : 'step'}-number" aria-hidden="true">${index + 1}</span><div>${item.title ? `<h4>${rich(item.title)}</h4>` : ''}${body(item.body ?? item.description ?? item.text ?? '')}${item.expressionLatex ? `<div class="question-expression">${math(item.expressionLatex)}</div>` : ''}</div></li>`;
    }).join('')}</ol>`;
  }
  function graphPlaceholder(graph, name = '') {
    if (!graph || typeof graph !== 'object') return '';
    const id = `graph-${++graphCounter}`;
    graphs.set(id, {graph, name});
    return `<figure class="graph-figure"><div id="${id}" class="graph-placeholder"></div><figcaption class="graph-caption"><span><i class="legend-line" aria-hidden="true"></i>${t('函数图像','Function')}</span><span><i class="legend-line asymptote" aria-hidden="true"></i>${t('渐近线','Asymptote')}</span>${list(graph.holes).length ? `<span><i class="legend-dot" aria-hidden="true"></i>${t('空洞','Hole')}</span>` : ''}${list(graph.points).length ? `<span><i class="legend-dot point" aria-hidden="true"></i>${t('关键点','Key point')}</span>` : ''}</figcaption><p class="graph-note">${t('虚线标示渐近线；水平或斜渐近线可以与曲线相交。','Dashed lines show asymptotes. A curve may cross a horizontal or oblique asymptote.')}</p></figure>`;
  }
  function sourceFigure(item) {
    const path = item.sourceImage ?? item.image;
    if (!path || !/^(?:assets\/|\.\/assets\/)[a-zA-Z0-9_.\/-]+$/.test(path)) return '';
    return `<details class="source-figure" ${Number(item.number)>=81&&Number(item.number)<=84?'open':''}><summary>${t('题目附图 · 教材原图','Given graph · From the textbook')}</summary><img src="${escape(path)}" alt="${t('教材题目附图','Given textbook graph')}: ${escape(item.number ?? item.label ?? '')}" loading="lazy"></details>`;
  }
  function solution(item, open = false) {
    const hasSolution = list(item.steps).length || item.answer || item.graph;
    if (!hasSolution) return '';
    return `<details class="solution" ${open ? 'open' : ''}><summary><span>${open ? t('分步解析','Step-by-step solution') : t('查看分步解析','Show step-by-step solution')} <span class="solution-step-count">${list(item.steps).length ? ` · ${list(item.steps).length} ${t('步',list(item.steps).length===1?'step':'steps')}` : ''}</span></span></summary><div class="solution-content">${stepList(item.steps)}${item.answer ? `<div class="answer-box"><strong>${t('答案 · Answer','Answer')}</strong>${body(item.answer)}</div>` : ''}${graphPlaceholder(item.graph, item.label ?? `Exercise ${item.number ?? ''}`)}</div></details>`;
  }
  function lectureQuestion(item, open) {
    const pages = list(item.pages).length ? list(item.pages).join(t('、',', ')) : item.page;
    return `<article class="question-card" id="${slug(item.id)}"><div class="question-meta"><span class="question-label">${escape(item.label || (item.type === 'practice' ? 'Practice question' : 'Example'))}</span><span>Part ${escape(item.part ?? '')}${pages != null ? t(` · PDF 第 ${escape(pages)} 页`,` · PDF p. ${escape(pages)}`) : ''}</span></div>${body(item.prompt)}${item.expressionLatex ? `<div class="question-expression">${math(item.expressionLatex)}</div>` : ''}${sourceFigure(item)}${solution(item, open)}</article>`;
  }
  function conceptKeys(record) {
    return list(record.concepts ?? record.concept ?? record.topics ?? record.topic).flatMap(value => typeof value === 'string' ? [value] : [value?.id]).filter(Boolean);
  }
  function associatedExercises(id) {
    return exerciseRecords.filter(item => conceptKeys(item).includes(id));
  }
  function topicSection(topic, index, questions) {
    const examples = questions.filter(item => conceptKeys(item).includes(topic.id) && item.type === 'example');
    const practices = questions.filter(item => conceptKeys(item).includes(topic.id) && item.type !== 'example');
    const exercises = associatedExercises(topic.id);
    const tag = list(topic.part).length ? list(topic.part).map(part => `Part ${part}`).join(' + ') : '';
    return `<section class="topic" id="topic-${slug(topic.id)}" data-topic="${escape(topic.id)}" aria-labelledby="heading-${slug(topic.id)}"><div class="topic-header"><div class="topic-heading"><span class="topic-index" aria-hidden="true">${index + 1}</span><div><h2 id="heading-${slug(topic.id)}">${escape(topic.title)}</h2><span class="english-title">${escape(language === 'en' ? '' : topic.english || '')}${tag ? ` <span class="part-pill">${escape(tag)}</span>` : ''}</span></div></div><label class="completion"><input type="checkbox" data-complete="${escape(topic.id)}" ${completed.has(topic.id) ? 'checked' : ''}> ${t('已掌握','Mastered')}</label></div><div class="topic-body"><div class="concept-summary">${body(topic.summary)}${list(topic.method).length ? `<h3 class="method-label">${t('解题方法 · Step by step','Method · Step by step')}</h3>${stepList(topic.method, true)}` : ''}${list(topic.pitfalls).length ? `<div class="pitfalls"><strong>${t('容易漏掉','Watch out')}</strong>${list(topic.pitfalls).map(pitfall => `<p>${rich(pitfall)}</p>`).join('')}</div>` : ''}${topic.note ? `<p class="source-tag" style="white-space:normal;margin-top:14px">${rich(topic.note)}</p>` : ''}</div>${examples.length ? `<div class="questions-group"><div class="group-heading"><span class="group-icon" aria-hidden="true">E</span><h3>Lecture Example</h3><small>${t('跟着步骤理解方法','Follow the method')}</small></div>${examples.map(question => lectureQuestion(question, true)).join('')}</div>` : ''}${practices.length ? `<div class="questions-group practice-group"><div class="group-heading"><span class="group-icon" aria-hidden="true">P</span><h3>Lecture Practice</h3><small>${t('先尝试，再展开解析','Try first, then check')}</small></div>${practices.map(question => lectureQuestion(question, false)).join('')}</div>` : ''}<div class="topic-exercises"><strong>${t('接着做教材 Exercises →','Next: textbook exercises →')}</strong><div class="exercise-links">${exercises.slice(0,16).map(exercise => `<a class="exercise-link" href="#exercise-${slug(exercise.number ?? exercise.id)}" data-exercise-link="${escape(exercise.number ?? exercise.id)}">${escape(exercise.number ?? exercise.label ?? exercise.id)}</a>`).join('')}${exercises.length > 16 ? `<button class="exercise-link exercise-link-more" type="button" data-topic-filter="${escape(topic.id)}">${t(`全部 ${exercises.length} 题 ↗`,`All ${exercises.length} exercises ↗`)}</button>` : ''}${!exercises.length ? `<a class="exercise-link" href="#textbook-exercises">${t('查看本节题库 ↗','Browse all exercises ↗')}</a>` : ''}</div></div></div></section>`;
  }
  function exerciseCard(item) {
    const number = item.number ?? item.id;
    const labels = conceptKeys(item).map(key => topicNames.get(key) || key);
    const source = item.printedPage != null ? t(`教材第 ${item.printedPage} 页`,`Textbook p. ${item.printedPage}`) : item.pdfPage != null ? t(`教材 PDF 第 ${item.pdfPage} 页`,`Textbook PDF p. ${item.pdfPage}`) : t('教材 Section 2.4','Textbook Section 2.4');
    return `<article class="question-card exercise-card" id="exercise-${slug(number)}" data-exercise-number="${escape(number)}"><div class="question-meta"><span class="question-label">Exercise ${escape(number)}</span><span class="exercise-source">${escape(source)}</span></div><div class="exercise-topics">${labels.map(label => `<span>${escape(label)}</span>`).join('')}</div><div class="question-prompt">${body(item.prompt)}</div>${sourceFigure(item)}${solution(item)}${list(item.parts ?? item.subquestions).map(part => `<div class="exercise-part"><h4>${escape(part.label ?? part.part ?? '')}</h4>${body(part.prompt)}${part.expressionLatex ? `<div class="question-expression">${math(part.expressionLatex)}</div>` : ''}${solution(part)}</div>`).join('')}</article>`;
  }
  function drawGraphs(root = document) {
    $$('.graph-placeholder', root).forEach(placeholder => {
      if (placeholder.childElementCount) return;
      const record = graphs.get(placeholder.id);
      if (record) placeholder.innerHTML = graphSvg(record.graph, record.name, placeholder.id);
    });
  }
  const finite = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  function polynomial(coefficients, x) { return list(coefficients).reduce((sum, coefficient) => sum * x + Number(coefficient), 0); }
  function numberLabel(number) { return Math.abs(number) < 1e-8 ? '0' : Number(number.toFixed(3)).toString().replace('-', '−'); }
  function niceStep(span) { const value = span / 7, exponent = 10 ** Math.floor(Math.log10(value)), ratio = value / exponent; return (ratio <= 1 ? 1 : ratio <= 2 ? 2 : ratio <= 5 ? 5 : 10) * exponent; }
  function graphSvg(graph, name, id) {
    const bounds = graph.bounds ?? {}, xMin = finite(bounds.xMin, -8), xMax = finite(bounds.xMax, 8), yMin = finite(bounds.yMin, -8), yMax = finite(bounds.yMax, 8);
    if (xMax <= xMin || yMax <= yMin) return `<p class="graph-note">${t('图像坐标范围无效。','Invalid graph bounds.')}</p>`;
    const width = 640, height = 410, left = 47, right = 24, top = 29, bottom = 35;
    const plotWidth = width - left - right, plotHeight = height - top - bottom;
    const X = x => left + (x - xMin) / (xMax - xMin) * plotWidth;
    const Y = y => top + (yMax - y) / (yMax - yMin) * plotHeight;
    const clip = `clip-${id}`, pieces = [];
    const axisX = X(Math.max(xMin, Math.min(xMax, 0))), axisY = Y(Math.max(yMin, Math.min(yMax, 0)));
    pieces.push(`<svg class="function-graph" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${escape(name)}: ${t('有理函数图像','Rational function graph')}</title><desc id="${id}-desc">${t(`实线为函数，金色虚线为渐近线，空心圆表示空洞。横轴范围 ${xMin} 至 ${xMax}，纵轴范围 ${yMin} 至 ${yMax}。`,`Solid curves show functions, gold dashed lines show asymptotes, and open circles show holes. The x-axis runs from ${xMin} to ${xMax}; the y-axis runs from ${yMin} to ${yMax}.`)}</desc><defs><clipPath id="${clip}"><rect x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}"/></clipPath></defs>`);
    const ticks = (min, max) => { const step = niceStep(max-min), result=[]; for(let n = Math.ceil(min/step)*step;n<=max+step*1e-5;n+=step) result.push(Number(n.toPrecision(12))); return result; };
    ticks(xMin,xMax).forEach(x => { pieces.push(`<line x1="${X(x)}" x2="${X(x)}" y1="${top}" y2="${height-bottom}" stroke="#e7ebe2" stroke-width="1"/>`); if (x !== 0) pieces.push(`<text class="graph-tick" x="${X(x)}" y="${Math.min(height-12,Math.max(top+13,axisY+17))}" text-anchor="middle">${numberLabel(x)}</text>`); });
    ticks(yMin,yMax).forEach(y => { pieces.push(`<line x1="${left}" x2="${width-right}" y1="${Y(y)}" y2="${Y(y)}" stroke="#e7ebe2" stroke-width="1"/>`); if (y !== 0) pieces.push(`<text class="graph-tick" x="${Math.max(left+19,axisX-9)}" y="${Y(y)+3}" text-anchor="end">${numberLabel(y)}</text>`); });
    pieces.push(`<line x1="${left}" x2="${width-right}" y1="${axisY}" y2="${axisY}" stroke="#96aaa0" stroke-width="1.2"/><line x1="${axisX}" x2="${axisX}" y1="${top}" y2="${height-bottom}" stroke="#96aaa0" stroke-width="1.2"/><text class="graph-axis-label" x="${width-right+4}" y="${axisY+4}">x</text><text class="graph-axis-label" x="${axisX+7}" y="${top-9}">y</text>${xMin<=0&&xMax>=0&&yMin<=0&&yMax>=0 ? `<text class="graph-tick" x="${axisX-7}" y="${axisY+15}" text-anchor="end">0</text>` : ''}`);
    pieces.push(`<g clip-path="url(#${clip})">`);
    const traces = list(graph.traces).length ? graph.traces : [{numerator:graph.numerator,denominator:graph.denominator,label:''}];
    const asymptotes = [...new Set([...list(graph.verticalAsymptotes),...traces.flatMap(trace=>list(trace.verticalAsymptotes))].map(Number).filter(Number.isFinite))];
    const horizontalAsymptotes = [...new Set([graph.horizontalAsymptote,...traces.map(trace=>trace.horizontalAsymptote)].filter(value=>value!=null).map(Number).filter(Number.isFinite))];
    asymptotes.forEach(x => pieces.push(`<line x1="${X(x)}" x2="${X(x)}" y1="${top}" y2="${height-bottom}" stroke="#b8995d" stroke-width="1.6" stroke-dasharray="6 5"/>`));
    horizontalAsymptotes.forEach(y=>pieces.push(`<line x1="${left}" x2="${width-right}" y1="${Y(y)}" y2="${Y(y)}" stroke="#b8995d" stroke-width="1.6" stroke-dasharray="6 5"/>`));
    if (graph.obliqueAsymptote) { const slope=finite(graph.obliqueAsymptote.slope,0),intercept=finite(graph.obliqueAsymptote.intercept,0); pieces.push(`<line x1="${left}" y1="${Y(slope*xMin+intercept)}" x2="${width-right}" y2="${Y(slope*xMax+intercept)}" stroke="#b8995d" stroke-width="1.6" stroke-dasharray="6 5"/>`); }
    function pathFor(getY, color, dashed = false, poles = asymptotes) {
      let current = '', paths = [], lastX = null, lastY = null;
      const flush = () => { if (current.includes('L')) paths.push(`<path d="${current}" fill="none" stroke="${color}" stroke-width="${dashed ? 1.6 : 2.5}" ${dashed ? 'stroke-dasharray="6 5"' : ''} stroke-linecap="round" stroke-linejoin="round"/>`); current=''; };
      for(let i=0;i<=900;i++) {
        const x=xMin+(xMax-xMin)*i/900, rawY=getY(x);
        const crossed=lastX!=null&&poles.some(pole=>pole>=lastX&&pole<=x);
        const extremeJump=lastY!=null&&Math.abs(rawY-lastY)>(yMax-yMin)*1.8&&Math.sign(rawY)!==Math.sign(lastY);
        if(!Number.isFinite(rawY)||crossed||extremeJump) flush();
        if(Number.isFinite(rawY)) { const y=Math.max(yMin-(yMax-yMin)*3,Math.min(yMax+(yMax-yMin)*3,rawY)); current+=`${current ? 'L':'M'}${X(x).toFixed(2)},${Y(y).toFixed(2)} `; }
        lastX=x;lastY=rawY;
      }
      flush(); return paths.join('');
    }
    if (list(graph.polynomialAsymptote).length) pieces.push(pathFor(x=>polynomial(graph.polynomialAsymptote,x),'#b8995d',true,[]));
    const palette=['#236b69','#796bb1','#cc7e44','#4e81a9'];
    traces.forEach((trace,index)=>{if(!list(trace.numerator).length||!list(trace.denominator).length)return;const color=/^#[a-fA-F0-9]{3,8}$/.test(trace.color||'')?trace.color:palette[index%palette.length];const poles=trace.verticalAsymptotes!==undefined?list(trace.verticalAsymptotes).map(Number).filter(Number.isFinite):asymptotes;pieces.push(pathFor(x=>{const d=polynomial(trace.denominator,x);return Math.abs(d)<1e-11?NaN:polynomial(trace.numerator,x)/d;},color,false,poles));});
    list(graph.points).forEach(point=>{const x=finite(point.x,NaN),y=finite(point.y,NaN);if(Number.isFinite(x)&&Number.isFinite(y))pieces.push(`<circle cx="${X(x)}" cy="${Y(y)}" r="3.5" fill="#236b69" stroke="#fafbf8" stroke-width="1"/>`);});
    const holeKeys=new Set();[...list(graph.holes),...traces.flatMap(trace=>list(trace.holes))].forEach(hole=>{const x=finite(hole.x,NaN),y=finite(hole.y,NaN),key=`${x},${y}`;if(Number.isFinite(x)&&Number.isFinite(y)&&!holeKeys.has(key)){holeKeys.add(key);pieces.push(`<circle cx="${X(x)}" cy="${Y(y)}" r="5" fill="#fafbf8" stroke="#ad6460" stroke-width="2"/><text class="graph-hole-label" x="${X(x)+9}" y="${Y(y)-10}">(${numberLabel(x)}, ${numberLabel(y)})</text>`);}});
    pieces.push('</g>');
    asymptotes.filter(x=>x>=xMin&&x<=xMax).forEach(x=>pieces.push(`<text class="graph-value-label" x="${Math.min(width-right-50,X(x)+7)}" y="${top+13}">x = ${numberLabel(x)}</text>`));
    horizontalAsymptotes.filter(y=>y>=yMin&&y<=yMax).forEach(y=>pieces.push(`<text class="graph-value-label" x="${width-right-5}" y="${Math.max(top+13,Y(y)-7)}" text-anchor="end">y = ${numberLabel(y)}</text>`));
    if (graph.obliqueAsymptote) { const slope=finite(graph.obliqueAsymptote.slope,0),intercept=finite(graph.obliqueAsymptote.intercept,0); const label=`y = ${slope === 1 ? 'x' : slope === -1 ? '−x' : `${numberLabel(slope)}x`}${intercept>0?` + ${numberLabel(intercept)}`:intercept<0?` − ${numberLabel(-intercept)}`:''}`; pieces.push(`<text class="graph-value-label" x="${left+9}" y="${height-bottom-10}">${escape(label)}</text>`); }
    if (traces.length>1) traces.forEach((trace,index)=>pieces.push(`<text x="${left+9}" y="${top+15+index*17}" fill="${palette[index%palette.length]}" font-size="11" font-family="Segoe UI, sans-serif">${escape(graphLabel(trace.label)||t(`函数 ${index+1}`,`Function ${index+1}`))}</text>`));
    pieces.push('</svg>');return pieces.join('');
  }
  function updateProgress() {
    const count=concepts.filter(topic=>completed.has(topic.id)).length;
    $('#progress-label').textContent=`${count} / ${concepts.length}`;
    $('#lesson-progress').max=concepts.length;$('#lesson-progress').value=count;
    $$('.nav-link').forEach(link=>link.classList.toggle('completed',completed.has(link.dataset.navTopic)));
  }
  function filterExercises() {
    const topic=$('#exercise-topic').value,query=$('#exercise-search').value.trim().toLowerCase();let visible=0;
    const numberQuery=query.match(/^(\d+)(?:\s*[-–~]\s*(\d+))?$/);
    $$('.exercise-card').forEach((card,index)=>{const item=exerciseRecords[index],base=sourceData.textbook.exercises[index];const topicWords=sourceData.lecture.concepts.filter(concept=>conceptKeys(item).includes(concept.id)).flatMap(concept=>[concept.title,concept.english,concept.en?.title,concept.en?.english]);const haystack=[item.number,item.label,base.prompt,base.en?.prompt,...topicWords,...conceptKeys(item)].join(' ').toLowerCase();const queryMatch=numberQuery?Number(item.number)>=Number(numberQuery[1])&&Number(item.number)<=Number(numberQuery[2]??numberQuery[1]):!query||haystack.includes(query);const match=(topic==='all'||conceptKeys(item).includes(topic))&&queryMatch;card.hidden=!match;if(match)visible++;});
    $('#exercise-empty').hidden=visible>0;$('#exercise-count').textContent=`${visible} / ${exerciseRecords.length} ${t('题','exercises')}`;
  }
  function jumpToExercise(number) {
    $('#exercise-topic').value='all';$('#exercise-search').value='';filterExercises();
    const target=document.getElementById(`exercise-${slug(number)}`);if(!target)return;
    const solution=$('.solution',target);if(solution)solution.open=true;
    drawGraphs(target);target.scrollIntoView({behavior:'smooth',block:'start'});target.classList.remove('highlight-target');requestAnimationFrame(()=>target.classList.add('highlight-target'));
  }
  function preparePrinting() { $$('.solution, .source-figure').forEach(detail=>detail.open=true);drawGraphs(); }
  function installInteractions() {
    $$('[data-lang]').forEach(button=>button.addEventListener('click',()=>selectLanguage(button.dataset.lang)));
    $('#expand-all').addEventListener('click',()=>{$$('.solution').forEach(detail=>detail.open=true);drawGraphs();$('#announcement').textContent=t('已展开全部分步解析。','All step-by-step solutions expanded.');});
    $('#collapse-all').addEventListener('click',()=>{$$('.solution').forEach(detail=>detail.open=false);$('#announcement').textContent=t('已收起全部分步解析。','All step-by-step solutions collapsed.');});
    $('#print-button').addEventListener('click',()=>{preparePrinting();window.print();});
    window.addEventListener('beforeprint',preparePrinting);
    $('#exercise-topic').addEventListener('change',filterExercises);$('#exercise-search').addEventListener('input',filterExercises);
    $('#clear-filters').addEventListener('click',()=>{$('#exercise-topic').value='all';$('#exercise-search').value='';filterExercises();});
    document.addEventListener('change',event=>{if(!event.target.matches('[data-complete]'))return;const id=event.target.dataset.complete;if(event.target.checked)completed.add(id);else completed.delete(id);try{localStorage.setItem('precal11-section24-completed',JSON.stringify([...completed]));}catch(_){}updateProgress();});
    document.addEventListener('click',event=>{const link=event.target.closest('[data-exercise-link]');if(link){event.preventDefault();jumpToExercise(link.dataset.exerciseLink);}const filter=event.target.closest('[data-topic-filter]');if(filter){$('#exercise-search').value='';$('#exercise-topic').value=filter.dataset.topicFilter;filterExercises();$('#textbook-exercises').scrollIntoView({behavior:'smooth'});}});
    document.addEventListener('toggle',event=>{if(event.target.matches('.solution')&&event.target.open)drawGraphs(event.target);},true);
  }
  async function start() {
    let data=window.SECTION_DATA;
    if(!data){const inline=$('#lesson-data');if(inline)try{data=JSON.parse(inline.textContent);}catch(_){} }
    if(!data){const response=await fetch('data.json');if(!response.ok)throw new Error(`Content could not be loaded (${response.status})`);data=await response.json();}
    sourceData=data;
    renderLanguage();installInteractions();
    if(location.hash.startsWith('#exercise-'))jumpToExercise(location.hash.slice(10));
  }
  start().catch(error=>{const status=$('#loading');status.innerHTML=t('<strong>学习内容暂时无法载入。</strong><br>请刷新网页重试。','<strong>Lesson content could not be loaded.</strong><br>Please refresh and try again.');status.setAttribute('role','alert');console.error(error);});
})();
