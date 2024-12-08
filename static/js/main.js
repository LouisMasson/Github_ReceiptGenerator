document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate');
    const usernameInput = document.getElementById('username');
    const receiptElement = document.getElementById('receipt');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Theme management
    const getTheme = () => localStorage.getItem('theme') || 'light';
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.innerHTML = theme === 'dark' ? '<i class="fa fa-sun-o"></i>' : '<i class="fa fa-moon-o"></i>';
    };

    // Initialize theme
    setTheme(getTheme());

    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = getTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    // Receipt generation
    generateBtn.addEventListener('click', generateReceipt);
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateReceipt();
        }
    });

    async function generateReceipt() {
        const username = usernameInput.value.trim();
        if (!username) {
            showNotification('Please enter a GitHub username');
            return;
        }

        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Loading...';

        try {
            const response = await fetch(`/api/metrics/${username}`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            updateReceipt(data);
            receiptElement.classList.remove('d-none');
            
            // Smooth scroll to receipt
            receiptElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = 'Generate';
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function updateReceipt(data) {
        // Add a transition class for smooth updates
        receiptElement.classList.add('updating');
        
        setTimeout(() => {
            document.getElementById('receipt-date').textContent = data.generated_at;
            document.getElementById('gh-username').textContent = data.username;
            document.getElementById('repos-count').textContent = data.repos_count;
            document.getElementById('total-stars').textContent = data.total_stars;
            document.getElementById('total-forks').textContent = data.total_forks;
            document.getElementById('followers').textContent = data.followers;
            document.getElementById('following').textContent = data.following;
            
            // Update languages with better formatting
            const languagesHtml = Object.entries(data.top_languages)
                .map(([lang, count]) => `${lang.padEnd(15, '.')} ${count}`)
                .join('\n');
            document.getElementById('top-languages').textContent = languagesHtml;
            
            document.getElementById('active-day').textContent = data.most_active_day;
            document.getElementById('commits').textContent = data.thirty_day_commits;
            document.getElementById('score').textContent = data.contribution_score;
            
            // Remove transition class
            receiptElement.classList.remove('updating');
        }, 300);
    }
});
