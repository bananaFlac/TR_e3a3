/**
 * scripts.js
 * 課題研究ポータルサイト - インタラクティブ機能
 *
 * 導入: </body>直前に <script src="js/scripts.js"></script> を追加
 *
 * 含まれる機能:
 *   1. ナビゲーション アクティブハイライト
 *   2. JSONファイルによるタイムライン進捗バッジ表示
 *   3. 画像のレイジーロード
 *   4. アンカーリンクのスムーズスクロール
 *   5. モバイルメニューの開閉
 *   6. リンク切れ（href="#") のフォールバック
 *   7. ページトップに戻るボタン
 *   8. スクロールフェードインアニメーション
 *   9. ナビバーのスクロール影強調
 *  10. 外部リンクへの rel 自動付与
 *  11. Escapeキーでモバイルメニューを閉じる
 */

// ============================================
// 1. ナビゲーション アクティブハイライト
// ============================================
function initNavigationHighlight() {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const sections = document.querySelectorAll('section[id], div[id]');

  if (!navLinks.length || !sections.length) return;

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: '-10% 0px -60% 0px' }
  );

  sections.forEach((sec) => navObserver.observe(sec));
}

// ============================================
// 2. JSONファイルによるタイムライン進捗バッジ表示
// ============================================
function initTimelineBadges() {
  fetch('./research_status.json')
    .then(response => response.json())
    .then(data => {
      if (data.phases && Array.isArray(data.phases)) {
        data.phases.forEach(phase => {
          const timelineItem = document.querySelector(`[data-phase="${phase.id}"]`);
          if (timelineItem) {
            // ステータスに応じてクラスを付与
            timelineItem.classList.add(`phase--${phase.status}`);
            // ステータスに応じた絵文字バッジを追加
            let badge = '';
            switch (phase.status) {
              case 'done':
                badge = '✅ ';
                break;
              case 'in-progress':
                badge = '🔄 ';
                break;
              case 'pending':
                badge = '⏳ ';
                break;
            }
            if (badge) {
              const badgeSpan = document.createElement('span');
              badgeSpan.textContent = badge;
              timelineItem.prepend(badgeSpan);
            }
          }
        });
      }
    })
    .catch(err => {
      console.warn('research_status.json が見つかりません:', err);
    });
}

// ============================================
// 3. 画像のレイジーロード対応
// ============================================
function initLazyLoad() {
  document.querySelectorAll('img:not([loading])').forEach((img) => {
    img.setAttribute('loading', 'lazy');
  });
}

// ============================================
// 4. アンカーリンクのスムーズスクロール
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================
// 5. モバイルメニューの開閉処理
// ============================================
function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuIcon = document.getElementById('menu-icon');

  if (!mobileMenuButton || !mobileMenu || !mobileMenuIcon) return;

  // メニューボタンクリック時の処理
  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');

    if (mobileMenu.classList.contains('hidden')) {
      mobileMenuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    } else {
      mobileMenuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
    }
  });

  // メニュー内リンククリック時は自動的に閉じる
  const mobileLinks = document.querySelectorAll('.mobile-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    });
  });
}

// ============================================
// 6. リンク切れ（href="#"）のフォールバック処理
// ============================================
function initBrokenLinkFallback() {
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.title = '準備中';
    link.style.cursor = 'not-allowed';
    link.style.opacity = '0.5';
    
    link.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
}

// ============================================
// 9. ナビバーのスクロール影強調
// ============================================
function initNavbarShadowOnScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const updateShadow = () => {
    nav.classList.toggle('shadow-md', window.scrollY > 10);
  };

  updateShadow();
  window.addEventListener('scroll', updateShadow, { passive: true });
}

// ============================================
// 10. 外部リンクへの rel 自動付与
// ============================================
function initExternalLinkRel() {
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const existingRel = link.getAttribute('rel') || '';
    const relValues = new Set(existingRel.trim().split(/\s+/).filter(Boolean));

    relValues.add('noopener');
    relValues.add('noreferrer');

    if (relValues.size > 0) {
      link.setAttribute('rel', Array.from(relValues).join(' '));
    }
  });
}

// ============================================
// 11. Escapeキーでモバイルメニューを閉じる
// ============================================
function initMobileMenuEscape() {
  const mobileMenuButton = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuIcon = document.getElementById('menu-icon');

  if (!mobileMenuButton || !mobileMenu || !mobileMenuIcon) return;

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (mobileMenu.classList.contains('hidden')) return;

    mobileMenu.classList.add('hidden');
    mobileMenuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');

    if (mobileMenuButton.hasAttribute('aria-expanded')) {
      mobileMenuButton.setAttribute('aria-expanded', 'false');
    }
  });
}

// ============================================
// 12. 右クリックメニューの無効化
// ============================================
function initDisableContextMenu() {
  const blockContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  document.addEventListener('contextmenu', blockContextMenu, true);
  document.addEventListener(
    'mousedown',
    (event) => {
      if (event.button === 2 || event.button === 1) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true
  );

  document.addEventListener(
    'dragstart',
    (event) => {
      event.preventDefault();
      event.stopPropagation();
    },
    true
  );
}

// ============================================
// 13. .no-save-img 対象要素の保護処理
// ============================================
function initProtectNoSaveImages() {
  const protectedElements = document.querySelectorAll('.no-save-img');

  protectedElements.forEach((element) => {
    element.style.pointerEvents = 'auto';

    const blockEvent = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    element.addEventListener('contextmenu', blockEvent, true);
    element.addEventListener('dragstart', blockEvent, true);
    element.addEventListener(
      'mousedown',
      (event) => {
        if (event.button === 2 || event.button === 1) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true
    );
  });
}

// ============================================
// 7. ページトップに戻るボタン
// ============================================
function initBackToTop() {
  const backToTop = document.createElement('button');
  backToTop.textContent = '↑';
  backToTop.id = 'back-to-top';
  backToTop.setAttribute('aria-label', 'ページトップへ戻る');

  Object.assign(backToTop.style, {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: 'none',
    background: 'var(--primary, #2563eb)',
    color: '#fff',
    fontSize: '1.2rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    opacity: '0',
    transition: 'opacity 0.3s',
    zIndex: '9999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  document.body.appendChild(backToTop);

  // スクロール位置でボタン表示切り替え
  window.addEventListener(
    'scroll',
    () => {
      const isVisible = window.scrollY > 300;
      backToTop.style.opacity = isVisible ? '1' : '0';
      backToTop.style.pointerEvents = isVisible ? 'auto' : 'none';
    },
    { passive: true }
  );

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// 8. スクロールフェードインアニメーション
// ============================================
function initFadeInAnimation() {
  const fadeEls = document.querySelectorAll('.fade-in');
  if (!fadeEls.length) return;

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  fadeEls.forEach((el) => fadeObserver.observe(el));
}

// ============================================
// 初期化 - DOMContentLoaded時に全機能を実行
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initMobileMenuEscape();
  initDisableContextMenu();
  initProtectNoSaveImages();
  initExternalLinkRel();
  initNavbarShadowOnScroll();
  initSmoothScroll();
  initLazyLoad();
  initNavigationHighlight();
  initTimelineBadges();
  initBrokenLinkFallback();
  initBackToTop();
  initFadeInAnimation();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'PrintScreen') {
        // クリップボードのクリアを試みる（フォールバック付き）
        try {
            navigator.clipboard.writeText("");
        } catch (err) {
            // iframeなどの制限で navigator.clipboard が動かない場合の代替手段
            const dummyInput = document.createElement('input');
            dummyInput.value = ' ';
            document.body.appendChild(dummyInput);
            dummyInput.select();
            document.execCommand('copy');
            document.body.removeChild(dummyInput);
        }
        alert("このサイトではスクリーンショットによる保存は禁止されています。");
    }

    // Macの「Cmd + Shift + 3 / 4（スクショのショートカット）」を検知して動作をキャンセル
    if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4')) {
        e.preventDefault();
        alert("スクリーンショットは制限されています。");
    }
});

// 2. 右クリックメニュー（名前を付けて画像を保存）を完全に禁止
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// 3. 画面上のテキストや画像のドラッグ選択（コピー）を禁止
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});