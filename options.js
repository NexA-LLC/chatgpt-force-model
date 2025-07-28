document.addEventListener('DOMContentLoaded', function() {
    const modelSelect = document.getElementById('modelSelect');
    const saveBtn = document.getElementById('saveBtn');
    const status = document.getElementById('status');

    chrome.storage.sync.get(['selectedModel'], function(result) {
        if (result.selectedModel) {
            modelSelect.value = result.selectedModel;
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