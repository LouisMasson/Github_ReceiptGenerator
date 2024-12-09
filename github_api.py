import requests
from datetime import datetime, timedelta
from collections import Counter

def get_github_metrics(username):
    base_url = 'https://api.github.com'
    headers = {'Accept': 'application/vnd.github.v3+json'}
    
    # Get user data
    user_response = requests.get(f'{base_url}/users/{username}', headers=headers)
    if user_response.status_code != 200:
        raise Exception('User not found')
    
    user_data = user_response.json()
    
    # Get repositories
    repos_response = requests.get(f'{base_url}/users/{username}/repos', headers=headers)
    repos = repos_response.json()
    
    # Calculate metrics
    total_stars = sum(repo['stargazers_count'] for repo in repos)
    total_forks = sum(repo['forks_count'] for repo in repos)
    
    # Calculate languages
    languages = Counter()
    for repo in repos:
        if repo['language']:
            languages[repo['language']] += 1
    top_languages = dict(languages.most_common(3))
    
    # Get contribution data (last 30 days)
    events_url = f'{base_url}/users/{username}/events'
    events_response = requests.get(events_url, headers=headers)
    events = events_response.json()
    
    thirty_days_ago = datetime.now() - timedelta(days=30)
    recent_commits = sum(1 for event in events 
                        if event['type'] == 'PushEvent' 
                        and datetime.strptime(event['created_at'], '%Y-%m-%dT%H:%M:%SZ') > thirty_days_ago)
    
    # Calculate most active day
    day_activity = Counter(datetime.strptime(event['created_at'], '%Y-%m-%dT%H:%M:%SZ').strftime('%A')
                          for event in events)
    most_active_day = day_activity.most_common(1)[0][0] if day_activity else 'N/A'
    
    # Get latest repositories
    latest_repos = sorted(repos, key=lambda x: x['created_at'], reverse=True)[:3]
    latest_repos_info = [{'name': repo['name'], 'stars': repo['stargazers_count']} 
                        for repo in latest_repos]

    # Get most starred repositories
    starred_repos = sorted(repos, key=lambda x: x['stargazers_count'], reverse=True)[:3]
    starred_repos_info = [{'name': repo['name'], 'stars': repo['stargazers_count']} 
                         for repo in starred_repos]

    # Calculate account age
    created_at = datetime.strptime(user_data['created_at'], '%Y-%m-%dT%H:%M:%SZ')
    account_age = (datetime.now() - created_at).days

    return {
        'username': username,
        'name': user_data.get('name', 'N/A'),
        'bio': user_data.get('bio', 'N/A'),
        'location': user_data.get('location', 'N/A'),
        'company': user_data.get('company', 'N/A'),
        'repos_count': user_data['public_repos'],
        'followers': user_data['followers'],
        'following': user_data['following'],
        'total_stars': total_stars,
        'total_forks': total_forks,
        'top_languages': top_languages,
        'most_active_day': most_active_day,
        'thirty_day_commits': recent_commits,
        'contribution_score': total_stars + total_forks + recent_commits,
        'latest_repos': latest_repos_info,
        'most_starred_repos': starred_repos_info,
        'account_created': created_at.strftime('%Y-%m-%d'),
        'account_age_days': account_age,
        'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
