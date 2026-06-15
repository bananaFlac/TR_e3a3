/**
 * scripts.js
 * 課題研究ポータルサイト - インタラクティブ機能
 *
 * 含まれる機能:
 *   1. ナビゲーション アクティブハイライト
 *   2. JSONファイルによるタイムライン進捗バッジ表示
 *   3. 画像のレイジーロード
 *   4. アンカーリンクのスムーズスクロール
 *   5. モバイルメニューの開閉
 *   6. リンク切れ（href="#"）のフォールバック
 *   7. スクロールフェードインアニメーション
 *   8. ページトップに戻るボタン
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
              timelineItem.textContent = badge + timelineItem.textContent;
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
  initSmoothScroll();
  initLazyLoad();
  initNavigationHighlight();
  initTimelineBadges();
  initBackToTop();
  initBrokenLinkFallback();
  initFadeInAnimation();
});
