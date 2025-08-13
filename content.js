(function() {
  'use strict';

  function isLoggedOutPageHeuristic() {
    try {
      const url = new URL(window.location.href);
      const path = url.pathname || '';

      // Known auth/marketing paths where users aren't in an active chat session
      if (
        path.startsWith('/auth') ||
        path.startsWith('/login') ||
        path.startsWith('/signup') ||
        path.includes('/accounts')
      ) {
        return true;
      }

      // Heuristic: presence of "Log in"/"ログイン" button or auth links on landing
      const loginLink = document.querySelector(
        'a[href*="/auth/login"], a[href*="/login"], a[href*="accounts.openai.com"], a[href*="auth.openai.com"]'
      );
      if (loginLink) return true;

      const hasLoginText = Array.from(document.querySelectorAll('a,button'))
        .some(el => /(^|\s)(log in|ログイン)(\s|$)/i.test(el.textContent || ''));
      return hasLoginText;
    } catch (_) {
      return false;
    }
  }

  function queryBackgroundLoginState(timeoutMs = 1500) {
    return new Promise((resolve) => {
      let done = false;
      const timer = setTimeout(() => {
        if (done) return; done = true; resolve(undefined);
      }, timeoutMs);

      try {
        chrome.runtime.sendMessage({ type: 'GET_LOGIN_STATE' }, (resp) => {
          if (done) return;
          clearTimeout(timer);
          if (resp && resp.ok === true && typeof resp.isLoggedIn === 'boolean') {
            done = true; resolve(resp.isLoggedIn);
          } else {
            done = true; resolve(undefined);
          }
        });
      } catch (_) {
        if (done) return; clearTimeout(timer); done = true; resolve(undefined);
      }
    });
  }

  async function checkAndRedirect() {
    // First, try explicit login detection via background (cookies). Fallback to heuristic.
    let isLoggedOut = false;
    const bgState = await queryBackgroundLoginState();
    if (bgState === undefined) {
      // Background unavailable or timed out; use heuristic
      isLoggedOut = isLoggedOutPageHeuristic();
    } else {
      isLoggedOut = !bgState || isLoggedOutPageHeuristic();
    }

    if (isLoggedOut) return; // avoid loops when not authenticated

    chrome.storage.sync.get(['selectedModel'], function(result) {
      const fallbackModel = (typeof window !== 'undefined' && window.DEFAULT_MODEL) ? window.DEFAULT_MODEL : 'gpt-5-thinking';
      const model = result.selectedModel || fallbackModel;
      const currentUrl = new URL(window.location.href);

      // Prevent adding model parameter to conversation URLs
      if (currentUrl.pathname.includes('/c/') || currentUrl.pathname.includes('/g/')) {
        return;
      }

      if (!currentUrl.searchParams.has('model')) {
        currentUrl.searchParams.set('model', model);
        // Logged-in flow: navigate so the app can pick up the param reliably
        window.location.replace(currentUrl.href);
      }
    });
  }

  // Run after DOM ready so we can detect login UI reliably
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndRedirect);
  } else {
    setTimeout(checkAndRedirect, 0);
  }

  let lastUrl = window.location.href;
  new MutationObserver(() => {
    const url = window.location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(checkAndRedirect, 100);
    }
  }).observe(document, { subtree: true, childList: true });

  window.addEventListener('popstate', checkAndRedirect);
  window.addEventListener('pushstate', checkAndRedirect);
  
  const originalPushState = history.pushState;
  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(checkAndRedirect, 100);
  };
  
  const originalReplaceState = history.replaceState;
  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    setTimeout(checkAndRedirect, 100);
  };
})();
