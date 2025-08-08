document.addEventListener('DOMContentLoaded', function() {
    const modelSelect = document.getElementById('modelSelect');
    const saveBtn = document.getElementById('saveBtn');
    const status = document.getElementById('status');

    // Populate select from shared definition
    if (Array.isArray(window.SUPPORTED_MODELS)) {
        modelSelect.innerHTML = window.SUPPORTED_MODELS
          .map(m => `<option value="${m}">${window.MODEL_LABELS[m] || m}</option>`) 
          .join('');
    }

    chrome.storage.sync.get(['selectedModel'], function(result) {
        if (result.selectedModel) {
            modelSelect.value = result.selectedModel;
        } else {
            // 未設定の場合は共有の既定値を使用
            modelSelect.value = window.DEFAULT_MODEL || 'gpt-5-thinking';
        }
    });

    saveBtn.addEventListener('click', function() {
        const selectedModel = modelSelect.value;
        
        chrome.storage.sync.set({
            selectedModel: selectedModel
        }, function() {
            showStatus('設定が保存されました！', 'success');
        });
    });

    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        status.style.display = 'block';
        
        setTimeout(function() {
            status.style.display = 'none';
        }, 3000);
    }
});