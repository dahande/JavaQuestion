/* =========================================================
   Javaの基礎問題集 - Shared Application Script
   - Theme toggle (light / dark, persisted)
   - Unified answer reveal (supports legacy patterns)
   - Reveal-all / Hide-all / Reset quiz controls
   - Interactive choice picking (when answer key detected)
   - Sticky reading progress bar
   - Scroll-to-top floating button
   - Keyboard shortcuts (j/k next/prev section, space = reveal)
   - Home-page search & category tabs
   ========================================================= */
(function () {
    'use strict';

    /* ---------- Global helpers kept for legacy inline handlers ---------- */
    window.goBack = function () { window.history.back(); };
    window.toggleAnswer = function () { /* handled by setupAnswerToggles */ };

    /* ---------- Theme ---------- */
    const THEME_KEY = 'jq-theme';
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const btn = document.querySelector('[data-action="toggle-theme"]');
        if (btn) {
            btn.textContent = theme === 'dark' ? '☀' : '☽';
            btn.setAttribute('aria-label',
                theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え');
        }
    }
    function initialTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(initialTheme());

    /* ---------- On DOM ready ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        setupTopBar();
        setupAnswerToggles();
        setupQuizActions();
        setupInteractiveChoices();
        setupProgressBar();
        setupScrollTop();
        setupKeyboardShortcuts();
        setupSearch();
        setupTabs();
    });

    /* ---------- Top bar (theme button) ---------- */
    function setupTopBar() {
        const toggle = document.querySelector('[data-action="toggle-theme"]');
        if (toggle) {
            toggle.addEventListener('click', function () {
                const current = document.documentElement.getAttribute('data-theme') || 'light';
                const next = current === 'dark' ? 'light' : 'dark';
                localStorage.setItem(THEME_KEY, next);
                applyTheme(next);
            });
            applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
        }
    }

    /* ---------- Answer toggles (unified) ----------
       Supports both legacy patterns:
       (1) <button id="toggleAnswerN">  + <p id="answerN" style="display:none">
       (2) <button onclick="toggleAnswer(N)"> + <div id="answerN" class="answer">
    */
    function findAnswerElement(button) {
        const id = button.id || '';
        const onclick = button.getAttribute('onclick') || '';
        let n = null;
        let m = id.match(/toggleAnswer(\d+)/);
        if (m) n = m[1];
        if (!n) {
            m = onclick.match(/toggleAnswer\s*\(\s*(\d+)\s*\)/);
            if (m) n = m[1];
        }
        if (n) {
            const el = document.getElementById('answer' + n);
            if (el) return el;
        }
        const section = button.closest('.section') || button.parentElement;
        if (section) {
            const candidate = section.querySelector('[id^="answer"], .answer');
            if (candidate) return candidate;
        }
        return null;
    }

    function isVisible(el) {
        if (el.classList.contains('is-visible')) return true;
        const display = el.style.display;
        if (display === 'block') return true;
        if (display === 'none') return false;
        const computed = window.getComputedStyle(el).display;
        return computed !== 'none';
    }

    function showAnswer(button, answer) {
        answer.classList.add('is-visible');
        answer.style.display = 'block';
        button.classList.add('is-open');
        button.textContent = '答えを隠す';
    }
    function hideAnswer(button, answer) {
        answer.classList.remove('is-visible');
        answer.style.display = 'none';
        button.classList.remove('is-open');
        button.textContent = '答えを見る';
    }

    function setupAnswerToggles() {
        const buttons = Array.from(document.querySelectorAll(
            'button[id^="toggleAnswer"], button[onclick*="toggleAnswer"]'
        ));
        buttons.forEach(function (button) {
            const answer = findAnswerElement(button);
            if (!answer) return;
            button.removeAttribute('onclick');
            if (isVisible(answer)) {
                hideAnswer(button, answer);
            }
            if (!button.textContent.trim() || button.textContent.trim() === '答えを見る') {
                button.textContent = '答えを見る';
            }
            button.addEventListener('click', function (ev) {
                ev.preventDefault();
                if (isVisible(answer)) hideAnswer(button, answer);
                else showAnswer(button, answer);
            });
        });
    }

    /* ---------- Quiz action bar (reveal all / hide all / reset) ---------- */
    function setupQuizActions() {
        const container = document.querySelector('.container') || document.querySelector('main');
        if (!container) return;
        const sections = container.querySelectorAll('.section');
        if (sections.length < 2) return;

        const existing = container.querySelector('.quiz-actions');
        if (existing) return;

        const firstSection = sections[0];
        if (!firstSection || !firstSection.parentElement) return;

        const bar = document.createElement('div');
        bar.className = 'quiz-actions';
        bar.innerHTML = ''
            + '<button type="button" class="btn-ghost" data-action="reveal-all">すべて表示</button>'
            + '<button type="button" class="btn-ghost" data-action="hide-all">すべて隠す</button>'
            + '<button type="button" class="btn-ghost" data-action="reset-quiz">リセット</button>';
        firstSection.parentElement.insertBefore(bar, firstSection);

        bar.addEventListener('click', function (ev) {
            const action = ev.target.getAttribute('data-action');
            if (!action) return;
            const buttons = container.querySelectorAll(
                'button[id^="toggleAnswer"], button[onclick*="toggleAnswer"]'
            );
            if (action === 'reveal-all' || action === 'hide-all') {
                buttons.forEach(function (btn) {
                    const ans = findAnswerElement(btn);
                    if (!ans) return;
                    if (action === 'reveal-all') showAnswer(btn, ans);
                    else hideAnswer(btn, ans);
                });
            }
            if (action === 'reset-quiz') {
                buttons.forEach(function (btn) {
                    const ans = findAnswerElement(btn);
                    if (ans) hideAnswer(btn, ans);
                });
                container.querySelectorAll('.section ul li').forEach(function (li) {
                    li.classList.remove('is-selected', 'is-correct', 'is-incorrect');
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    /* ---------- Interactive choices ----------
       If the answer text includes "正解はX)" with X in A-D,
       make the <li> choices clickable and show correctness.
    */
    function detectCorrectLetter(answerEl) {
        const text = (answerEl.textContent || '').replace(/\s+/g, '');
        const m = text.match(/正解は([A-D])/);
        return m ? m[1] : null;
    }
    function letterForListItem(li, index) {
        const text = (li.textContent || '').trim();
        const m = text.match(/^([A-D])[\)．.]/);
        if (m) return m[1];
        return ['A', 'B', 'C', 'D'][index] || null;
    }
    function setupInteractiveChoices() {
        const sections = document.querySelectorAll('.section');
        sections.forEach(function (section) {
            const list = section.querySelector('ul');
            const button = section.querySelector(
                'button[id^="toggleAnswer"], button[onclick*="toggleAnswer"]'
            );
            if (!list || !button) return;
            const answer = findAnswerElement(button);
            if (!answer) return;
            const correct = detectCorrectLetter(answer);
            if (!correct) return;
            const items = Array.from(list.querySelectorAll(':scope > li'));
            if (items.length < 2) return;
            list.classList.add('is-interactive');
            items.forEach(function (li, idx) {
                const letter = letterForListItem(li, idx);
                li.setAttribute('role', 'button');
                li.setAttribute('tabindex', '0');
                li.dataset.letter = letter;
                const handler = function () {
                    items.forEach(function (other) {
                        other.classList.remove('is-selected', 'is-correct', 'is-incorrect');
                    });
                    li.classList.add('is-selected');
                    if (letter === correct) {
                        li.classList.add('is-correct');
                    } else {
                        li.classList.add('is-incorrect');
                        const good = items.find(function (x) { return x.dataset.letter === correct; });
                        if (good) good.classList.add('is-correct');
                    }
                    const ans = findAnswerElement(button);
                    if (ans && !isVisible(ans)) showAnswer(button, ans);
                };
                li.addEventListener('click', handler);
                li.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
                });
            });
        });
    }

    /* ---------- Reading progress bar ---------- */
    function setupProgressBar() {
        const fill = document.querySelector('.progress-fill');
        if (!fill) return;
        function update() {
            const h = document.documentElement;
            const scroll = h.scrollTop || document.body.scrollTop;
            const height = h.scrollHeight - h.clientHeight;
            const pct = height > 0 ? Math.min(100, (scroll / height) * 100) : 0;
            fill.style.width = pct + '%';
        }
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
    }

    /* ---------- Scroll-to-top ---------- */
    function setupScrollTop() {
        let btn = document.querySelector('.scroll-top');
        if (!btn) {
            btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'scroll-top';
            btn.setAttribute('aria-label', 'ページの先頭に戻る');
            btn.innerHTML = '↑';
            document.body.appendChild(btn);
        }
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.addEventListener('scroll', function () {
            if (window.scrollY > 320) btn.classList.add('is-visible');
            else btn.classList.remove('is-visible');
        }, { passive: true });
    }

    /* ---------- Keyboard shortcuts ---------- */
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function (e) {
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const sections = Array.from(document.querySelectorAll('.section'));
            if (e.key === 'j' || e.key === 'ArrowDown' && e.shiftKey) {
                const idx = findNextSection(sections, 1);
                if (idx !== -1) {
                    sections[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
                    e.preventDefault();
                }
            } else if (e.key === 'k' || e.key === 'ArrowUp' && e.shiftKey) {
                const idx = findNextSection(sections, -1);
                if (idx !== -1) {
                    sections[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
                    e.preventDefault();
                }
            }
        });
    }
    function findNextSection(sections, direction) {
        const offset = 120;
        if (direction > 0) {
            for (let i = 0; i < sections.length; i++) {
                const top = sections[i].getBoundingClientRect().top;
                if (top > offset + 4) return i;
            }
            return sections.length - 1;
        } else {
            for (let i = sections.length - 1; i >= 0; i--) {
                const top = sections[i].getBoundingClientRect().top;
                if (top < offset - 4) return i;
            }
            return 0;
        }
    }

    /* ---------- Search (home page) ---------- */
    function setupSearch() {
        const input = document.querySelector('[data-role="search"]');
        if (!input) return;
        const targets = Array.from(document.querySelectorAll('[data-searchable] li'));
        input.addEventListener('input', function () {
            const q = input.value.trim().toLowerCase();
            targets.forEach(function (li) {
                const text = (li.textContent || '').toLowerCase();
                const match = !q || text.indexOf(q) !== -1;
                li.style.display = match ? '' : 'none';
            });
            document.querySelectorAll('[data-searchable]').forEach(function (group) {
                const any = Array.from(group.querySelectorAll('li'))
                    .some(function (li) { return li.style.display !== 'none'; });
                const header = group.previousElementSibling;
                if (header && header.classList.contains('category-header')) {
                    header.style.display = any ? '' : 'none';
                }
                group.style.display = any ? '' : 'none';
            });
        });
    }

    /* ---------- Tabs (home page) ---------- */
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        if (!tabButtons.length) return;
        tabButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const target = btn.getAttribute('data-tab');
                tabButtons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
                document.querySelectorAll('.tab-panel').forEach(function (panel) {
                    panel.classList.toggle('is-active', panel.getAttribute('data-tab-panel') === target);
                });
            });
        });
    }
})();
