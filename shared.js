// Shared constants for model selection (used by content.js and options.js)
;(function(global) {
  'use strict'

  const SUPPORTED_MODELS = [
    'gpt-5-thinking',
    'gpt-5-pro',
    'gpt-5'
  ]

  const MODEL_LABELS = {
    'gpt-5-thinking': 'GPT-5 Thinking',
    'gpt-5-pro': 'GPT-5 Pro',
    'gpt-5': 'GPT-5'
  }

  const DEFAULT_MODEL = 'gpt-5-thinking'

  // Expose to global scope for both content script and options page
  global.SUPPORTED_MODELS = SUPPORTED_MODELS
  global.MODEL_LABELS = MODEL_LABELS
  global.DEFAULT_MODEL = DEFAULT_MODEL
})(typeof window !== 'undefined' ? window : this)


