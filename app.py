import os
from flask import Flask, render_template, jsonify, request
from github_api import get_github_metrics
import requests_cache

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "github-receipt-secret")

# Setup request caching
requests_cache.install_cache('github_cache', expire_after=300)  # Cache for 5 minutes

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/metrics/<username>')
def get_metrics(username):
    try:
        metrics = get_github_metrics(username)
        return jsonify(metrics)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
