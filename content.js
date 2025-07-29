(function() {
  'use strict';

  function appendModelParameter() {
    chrome.storage.sync.get(['selectedModel'], function(result) {
      const model = result.selectedModel || 'gpt-4';
      const currentUrl = new URL(window.location.href);
      
      if (!currentUrl.searchParams.has('model')) {
        currentUrl.searchParams.set('model', model);
        
        if (currentUrl.href !== window.location.href) {
          window.history.replaceState({}, '', currentUrl.href);
        }
      }
    });
  }

  function checkAndRedirect() {
    chrome.storage.sync.get(['selectedModel'], function(result) {
      const model = result.selectedModel || 'gpt-4';
      const currentUrl = new URL(window.location.href);
      
      // Prevent adding model parameter to conversation URLs
      if (currentUrl.pathname.includes('/c/') || currentUrl.pathname.includes('/g/')) {
        return;
      }
      
      if (!currentUrl.searchParams.has('model')) {
        currentUrl.searchParams.set('model', model);
        window.location.replace(currentUrl.href);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndRedirect);
  } else {
    checkAndRedirect();
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