document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const generateButton = document.getElementById('generate');
    const receiptElement = document.getElementById('receipt');
    const themeToggle = document.getElementById('theme-toggle');
    let currentUsername = null;

    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeToggle.innerHTML = `<i class="fa fa-${isDark ? 'moon-o' : 'sun-o'}"></i>`;
    });

    // Share button handler
    document.getElementById('share-receipt').addEventListener('click', async function() {
        if (!currentUsername) return;
        
        const button = this;
        const originalText = button.innerHTML;
        
        try {
            button.disabled = true;
            button.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Generating share link...';
            
            const response = await fetch(`/share/${currentUsername}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate share link');
            }
            
            const data = await response.json();
            const shareUrl = window.location.origin + data.share_url;
            
            // Copy to clipboard
            await navigator.clipboard.writeText(shareUrl);
            showNotification('Share link copied to clipboard!', 'success');
        } catch (error) {
            showNotification(`Error sharing receipt: ${error.message}`, 'error');
        } finally {
            button.disabled = false;
            button.innerHTML = originalText;
        }
    });

    // PDF download handler
    document.getElementById('download-pdf').addEventListener('click', async function() {
        if (!currentUsername) return;
        
        const button = this;
        const originalText = button.innerHTML;
        
        try {
            button.disabled = true;
            button.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Generating PDF...';
            
            const response = await fetch(`/api/export-pdf/${currentUsername}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate PDF');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `github-receipt-${currentUsername}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showNotification('PDF downloaded successfully!', 'success');
        } catch (error) {
            showNotification(`Error downloading PDF: ${error.message}`, 'error');
        } finally {
            button.disabled = false;
            button.innerHTML = originalText;
        }
    });

    function showNotification(message, type = '') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    function updateReceipt(data) {
        currentUsername = data.username;
        receiptElement.classList.remove('d-none');
        
        document.getElementById('gh-username').textContent = data.username;
        document.getElementById('repos-count').textContent = data.repos_count;
        document.getElementById('total-stars').textContent = data.total_stars;
        document.getElementById('total-forks').textContent = data.total_forks;
        document.getElementById('followers').textContent = data.followers;
        document.getElementById('following').textContent = data.following;
        
        const languagesHtml = Object.entries(data.top_languages)
            .map(([lang, count]) => `<p>${lang.padEnd(15, '.')} ${count}</p>`)
            .join('');
        document.getElementById('top-languages').innerHTML = languagesHtml;
        
        document.getElementById('active-day').textContent = data.most_active_day;
        document.getElementById('commits').textContent = data.thirty_day_commits;
        document.getElementById('score').textContent = data.contribution_score;
        document.getElementById('receipt-date').textContent = data.generated_at;
    }

    // Handle generate button click
    generateButton.addEventListener('click', async function() {
        const username = usernameInput.value.trim();
        if (!username) return;
        
        const receiptContainer = document.querySelector('.receipt-container');
        receiptContainer.classList.add('updating');
        
        try {
            const response = await fetch(`/api/metrics/${username}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch metrics');
            }
            
            const data = await response.json();
            updateReceipt(data);
            showNotification('Receipt generated successfully!', 'success');
        } catch (error) {
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            receiptContainer.classList.remove('updating');
        }
    });

    // Handle shared data if available
    if (window.sharedData) {
        updateReceipt(window.sharedData);
    }
});
