// Background service worker for explicit login detection via cookies
// MV3 service worker context
(function() {
  'use strict'

  const LOGIN_COOKIE_NAMES = [
    '__Secure-next-auth.session-token',
    'next-auth.session-token'
  ]

  async function getAllCookiesForDomains(domains) {
    const results = []
    for (const d of domains) {
      try {
        const items = await chrome.cookies.getAll({ domain: d })
        if (Array.isArray(items)) results.push(...items)
      } catch (_) {
        // ignore
      }
    }
    return results
  }

  function inferLoggedInFromCookies(cookies) {
    if (!Array.isArray(cookies) || cookies.length === 0) return false

    // 1) Strong signal: known NextAuth session cookies
    if (cookies.some(c => LOGIN_COOKIE_NAMES.includes(c.name))) return true

    // 2) Fallback heuristic: any cookie that looks like a session
    const sessionLike = cookies.some(c => /session|next-auth/i.test(c.name))
    return !!sessionLike
  }

  async function checkLoginState() {
    const cookies = await getAllCookiesForDomains([
      'chatgpt.com', '.chatgpt.com',
      'openai.com', '.openai.com',
      'auth.openai.com'
    ])
    const isLoggedIn = inferLoggedInFromCookies(cookies)
    await chrome.storage.local.set({ isLoggedIn, isLoggedInUpdatedAt: Date.now() })
    return isLoggedIn
  }

  // Initialize state on startup
  chrome.runtime.onStartup.addListener(() => {
    checkLoginState().catch(() => {})
  })

  // Also on install/update
  chrome.runtime.onInstalled.addListener(() => {
    checkLoginState().catch(() => {})
  })

  // Keep state in sync when cookies change
  chrome.cookies.onChanged.addListener(changeInfo => {
    try {
      const c = changeInfo.cookie
      if (!c || !c.domain) return
      if (/chatgpt\.com$|openai\.com$/.test(c.domain.replace(/^\./, ''))) {
        checkLoginState().catch(() => {})
      }
    } catch (_) {}
  })

  // Respond to queries from content scripts
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || message.type !== 'GET_LOGIN_STATE') return

    ;(async () => {
      try {
        // Use cached value if recent; otherwise refresh
        const { isLoggedIn, isLoggedInUpdatedAt } = await chrome.storage.local.get([
          'isLoggedIn', 'isLoggedInUpdatedAt'
        ])
        const fresh = typeof isLoggedInUpdatedAt === 'number' && (Date.now() - isLoggedInUpdatedAt) < 5000
        const value = fresh ? !!isLoggedIn : await checkLoginState()
        sendResponse({ ok: true, isLoggedIn: !!value })
      } catch (e) {
        sendResponse({ ok: false, error: String(e) })
      }
    })()

    // Keep the message channel open for async response
    return true
  })
})()

