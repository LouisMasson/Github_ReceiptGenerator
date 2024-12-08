import os
from flask import Flask, render_template, jsonify, request, send_file
from github_api import get_github_metrics
import requests_cache
from weasyprint import HTML
from io import BytesIO

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "github-receipt-secret")

# Setup request caching
requests_cache.install_cache('github_cache', expire_after=180)

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

@app.route('/api/export-pdf/<username>')
def export_pdf(username):
    try:
        metrics = get_github_metrics(username)
        html_content = render_template('pdf_receipt.html', data=metrics)
        pdf = HTML(string=html_content).write_pdf()
        
        # Create BytesIO object
        pdf_buffer = BytesIO(pdf)
        pdf_buffer.seek(0)
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'github-receipt-{username}.pdf'
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
