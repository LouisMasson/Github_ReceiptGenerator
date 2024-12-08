document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate');
    const usernameInput = document.getElementById('username');
    const receiptElement = document.getElementById('receipt');

    generateBtn.addEventListener('click', generateReceipt);
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateReceipt();
        }
    });

    async function generateReceipt() {
        const username = usernameInput.value.trim();
        if (!username) {
            alert('Please enter a GitHub username');
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
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = 'Generate';
        }
    }

    function updateReceipt(data) {
        document.getElementById('receipt-date').textContent = data.generated_at;
        document.getElementById('gh-username').textContent = data.username;
        document.getElementById('repos-count').textContent = data.repos_count;
        document.getElementById('total-stars').textContent = data.total_stars;
        document.getElementById('total-forks').textContent = data.total_forks;
        document.getElementById('followers').textContent = data.followers;
        document.getElementById('following').textContent = data.following;
        
        // Update languages
        const languagesHtml = Object.entries(data.top_languages)
            .map(([lang, count]) => `${lang}: ${count}`)
            .join('\n');
        document.getElementById('top-languages').textContent = languagesHtml;
        
        document.getElementById('active-day').textContent = data.most_active_day;
        document.getElementById('commits').textContent = data.thirty_day_commits;
        document.getElementById('score').textContent = data.contribution_score;
    }
});
