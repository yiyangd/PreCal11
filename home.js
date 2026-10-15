(() => {
  'use strict';
  const storageKey = 'precal11-section24-language';
  const isLanguage = value => value === 'zh' || value === 'en';
  const requestedLanguage = new URLSearchParams(location.search).get('lang');
  let language = isLanguage(requestedLanguage) ? requestedLanguage : 'en';

  const lessonUrl = (section = '2-4') => {
    const destination = new URL(location.protocol === 'file:' ? `sections/${section}/index.html` : `sections/${section}/`, location.href);
    destination.search = location.search;
    destination.searchParams.set('lang', language);
    return destination;
  };
  const redirectLessonAnchor = () => {
    if (!/^#(?:topic-|exercise-|p[12](?:-|$)|textbook-exercises$)/.test(location.hash)) return false;
    const destination = lessonUrl();
    destination.hash = location.hash;
    location.replace(destination.href);
    return true;
  };
  if (redirectLessonAnchor()) return;

  const translations = {
    zh: {
      skip: '跳到课程目录', brand: '学习主页', welcome: '从这里开始。',
      intro: '选择章节，按知识点学习、练习，并查看分步解析。',
      contents: '课程目录', chapter: '第 2 章', chapterTitle: '多项式与有理函数',
      section: '第 2.4 节 · Part 1 + Part 2', lessonTitle: '有理函数：渐近线、空洞与图像',
      meta: '7 个知识点 · 18 道讲义题 · 教材 Exercises', open: '开始学习 2.4',
      section25: '第 2.5 节 · 教材', lesson25Title: '多项式与有理不等式',
      meta25: '8 个知识点 · 6 道例题 · 6 道配套练习 · 128 道节后习题', open25: '开始学习 2.5',
      section26: '第 2.6 节 · 教材', lesson26Title: '多项式函数的零点',
      meta26: '8 个知识点 · 7 道例题 · 7 道配套练习 · 88 道节后习题', open26: '开始学习 2.6',
      section27: '第 2.7 节 · 教材', lesson27Title: '正比、反比与联合比例',
      meta27: '7 个知识点 · 6 道例题 · 6 道配套练习 · 60 道节后习题', open27: '开始学习 2.7',
      footer: '中英文学习笔记', title: 'Pre-Calculus 11 · 学习主页',
      description: 'Pre-Calculus 11 中英文学习目录：知识点、讲义例题、练习与分步解析。',
      announcement: '已切换为中文。'
    },
    en: {
      skip: 'Skip to study contents', brand: 'STUDY HOME', welcome: 'Start here.',
      intro: 'Choose a section to study key concepts, practise, and follow step-by-step solutions.',
      contents: 'Study contents', chapter: 'CHAPTER 2', chapterTitle: 'Polynomial and Rational Functions',
      section: 'Section 2.4 · Part 1 + Part 2', lessonTitle: 'Rational functions: asymptotes, holes and graphs',
      meta: '7 concepts · 18 lecture questions · Textbook exercises', open: 'Study Section 2.4',
      section25: 'Section 2.5 · Textbook', lesson25Title: 'Polynomial and rational inequalities',
      meta25: '8 concepts · 6 examples · 6 practice problems · 128 exercises', open25: 'Study Section 2.5',
      section26: 'Section 2.6 · Textbook', lesson26Title: 'Zeros of a polynomial function',
      meta26: '8 concepts · 7 examples · 7 practice problems · 88 exercises', open26: 'Study Section 2.6',
      section27: 'Section 2.7 · Textbook', lesson27Title: 'Direct, inverse and joint variation',
      meta27: '7 concepts · 6 examples · 6 practice problems · 60 exercises', open27: 'Study Section 2.7',
      footer: 'Bilingual study notes', title: 'Pre-Calculus 11 · Study home',
      description: 'Pre-Calculus 11 bilingual study contents: key concepts, lecture examples, practice, and step-by-step solutions.',
      announcement: 'Switched to English.'
    }
  };

  translations.zh.jump2 = '第 2 章';
  translations.zh.jump3 = '第 3 章';
  translations.zh.jump4 = '第 4 章';
  translations.zh.jump5 = '第 5 章';
  translations.en.jump2 = 'Chapter 2';
  translations.en.jump3 = 'Chapter 3';
  translations.en.jump4 = 'Chapter 4';
  translations.en.jump5 = 'Chapter 5';

  const catalog = JSON.parse(document.getElementById('chapter-catalog')?.textContent || '{"chapters":[]}');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const t = (zh, en) => language === 'zh' ? zh : en;
  const countLabel = section => {
    const counts = section.counts;
    const labels = [
      ['examples', '道例题', 'examples'],
      ['practice', section.slug === '3-summary' ? '道知识问答' : '道配套练习', section.slug === '3-summary' ? 'key questions' : 'practice problems'],
      ['gettingReady', '道前置复习', 'Getting Ready'],
      ['exercises', section.slug.endsWith('-key-ideas') ? '道知识问答' : '道习题', section.slug.endsWith('-key-ideas') ? 'key questions' : 'exercises']
    ];
    return labels.filter(([key]) => counts[key]).map(([key, zh, en]) => `${counts[key]} ${t(zh, en)}`).join(' · ');
  };
  const renderChapters = () => {
    const container = document.getElementById('added-chapters');
    if (!container) return;
    container.innerHTML = catalog.chapters.map(chapter => {
      const cards = chapter.sections.map(section => {
        const regular = /^\d-\d$/.test(section.slug);
        const kind = section.slug.slice(2);
        const badges = {summary:t('要点','Key ideas'),'key-ideas':t('要点','Key ideas'),review:t('复习','Review'),'test-a':t('测试 A','Test A'),cumulative:t('累积复习','Cumulative')};
        const badge = regular ? section.section : badges[kind];
        const title = language === 'en' ? section.en.title : section.title;
        const label = regular ? t(`第 ${section.section} 节 · 教材`,`Section ${section.section} · Textbook`) : t('章末复习 · 教材','Chapter review · Textbook');
        const titleId = `lesson-${section.slug}-title`;
        return `<article class="lesson-card compact-card" aria-labelledby="${titleId}"><div class="section-number${regular ? '' : ' section-word'}" aria-hidden="true">${escape(badge)}</div><div class="lesson-content"><p class="lesson-label">${escape(label)}</p><h4 id="${titleId}">${escape(title)}</h4><p class="lesson-meta">${escape(countLabel(section))}</p><a class="lesson-link" data-section="${escape(section.slug)}" href="${escape(lessonUrl(section.slug).href)}"><span>${escape(regular ? t(`开始学习 ${section.section}`,`Study ${section.section}`) : t('打开复习','Open review'))}</span><span aria-hidden="true">→</span></a></div></article>`;
      }).join('');
      const number = chapter.number;
      const sourcePath = number === 3 ? 'sections/3-test-b/' : `chapters/${number}/test-b-unavailable.html`;
      const sourceLink = `<a data-language-path="${sourcePath}" href="${escape(languageUrl(sourcePath).href)}">${t('测试 B：所给 PDF 不含原题','Practice Test B: source unavailable in the supplied PDF')}</a>`;
      const auditLink = number >= 4 ? `<a data-language-path="chapters/${number}/audit.html" href="${escape(languageUrl(`chapters/${number}/audit.html`).href)}">${t('覆盖与来源说明','Coverage and source notes')}</a><span aria-hidden="true"> · </span>` : '';
      return `<section class="chapter-group" aria-labelledby="chapter-${number}-title"><div class="chapter-heading" id="chapter-${number}"><p class="chapter-label">${t(`第 ${number} 章`,`CHAPTER ${number}`)}</p><h3 id="chapter-${number}-title">${escape(language === 'en' ? chapter.en.title : chapter.title)}</h3></div><div class="chapter-lessons">${cards}</div><p class="chapter-source-note">${auditLink}${sourceLink}</p></section>`;
    }).join('');
  };
  const languageUrl = path => {
    const destination = new URL(location.protocol === 'file:' && path.endsWith('/') ? `${path}index.html` : path, location.href);
    destination.searchParams.set('lang', language);
    return destination;
  };

  const render = () => {
    const text = translations[language];
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-Hans';
    document.title = text.title;
    document.querySelector('meta[name="description"]').content = text.description;
    document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = text[element.dataset.i18n]; });
    document.querySelectorAll('[data-language]').forEach(button => {
      const active = button.dataset.language === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.getElementById('chapter-shortcuts')?.setAttribute('aria-label', t('章节导航', 'Chapters'));
    renderChapters();
    document.querySelectorAll('[data-section]').forEach(link => { link.href = lessonUrl(link.dataset.section).href; });
    const home = new URL(location.protocol === 'file:' ? 'index.html' : './', location.href);
    home.searchParams.set('lang', language);
    document.getElementById('home-link').href = home.href;
    try { localStorage.setItem(storageKey, language); } catch (_) {}
  };

  document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => {
      const next = button.dataset.language;
      if (!isLanguage(next) || next === language) return;
      language = next;
      const current = new URL(location.href);
      current.searchParams.set('lang', language);
      try { history.replaceState(null, '', current.href); } catch (_) {}
      render();
      document.getElementById('announcement').textContent = translations[language].announcement;
    });
  });
  addEventListener('hashchange', redirectLessonAnchor);
  render();
})();
