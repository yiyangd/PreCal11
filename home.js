(() => {
  'use strict';
  const storageKey = 'precal11-section24-language';
  const isLanguage = value => value === 'zh' || value === 'en';
  let storedLanguage;
  try { storedLanguage = localStorage.getItem(storageKey); } catch (_) {}
  const requestedLanguage = new URLSearchParams(location.search).get('lang');
  let language = isLanguage(requestedLanguage) ? requestedLanguage : isLanguage(storedLanguage) ? storedLanguage : 'zh';

  const lessonUrl = () => {
    const destination = new URL(location.protocol === 'file:' ? 'sections/2-4/index.html' : 'sections/2-4/', location.href);
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
      footer: 'Bilingual study notes', title: 'Pre-Calculus 11 · Study home',
      description: 'Pre-Calculus 11 bilingual study contents: key concepts, lecture examples, practice, and step-by-step solutions.',
      announcement: 'Switched to English.'
    }
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
    document.getElementById('lesson-link').href = lessonUrl().href;
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
