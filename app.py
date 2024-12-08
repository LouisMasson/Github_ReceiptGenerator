import os
import uuid
from flask import Flask, render_template, jsonify, request, send_file, redirect, url_for
from github_api import get_github_metrics
import requests_cache
from weasyprint import HTML
from io import BytesIO

# Store shared receipts in memory with timestamps (in production this should be in a database)
from datetime import datetime, timedelta

shared_receipts = {}  # Format: {share_id: {'data': metrics, 'created_at': timestamp}}
SHARE_LINK_EXPIRY = timedelta(hours=24)  # Links expire after 24 hours

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
        # Get GitHub metrics
        metrics = get_github_metrics(username)
        
        # Render HTML template
        html_content = render_template('pdf_receipt.html', data=metrics)
        
        try:
            # Generate PDF
            pdf = HTML(string=html_content, base_url=request.host_url).write_pdf()
        except Exception as pdf_error:
            app.logger.error(f"PDF generation error: {str(pdf_error)}")
            return jsonify({"error": "Failed to generate PDF. Please try again."}), 500
        
        # Create BytesIO object
        pdf_buffer = BytesIO(pdf)
        pdf_buffer.seek(0)
        
        # Set response headers
        headers = {
            'Content-Type': 'application/pdf',
            'Content-Disposition': f'attachment; filename=github-receipt-{username}.pdf'
        }
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'github-receipt-{username}.pdf',
            max_age=300  # Cache for 5 minutes
        )
    except Exception as e:
        app.logger.error(f"Export PDF error for user {username}: {str(e)}")
        return jsonify({"error": str(e)}), 400

@app.route('/share/<username>')
def create_share(username):
    try:
        # Clean expired shares
        current_time = datetime.now()
        expired_shares = [sid for sid, data in shared_receipts.items() 
                         if current_time - data['created_at'] > SHARE_LINK_EXPIRY]
        for sid in expired_shares:
            del shared_receipts[sid]

        # Get GitHub metrics
        metrics = get_github_metrics(username)
        # Generate unique share ID
        share_id = str(uuid.uuid4())
        # Store metrics with timestamp
        shared_receipts[share_id] = {
            'data': metrics,
            'created_at': current_time
        }
        return jsonify({
            "share_url": f"/s/{share_id}",
            "expires_in": "24 hours"
        })
    except Exception as e:
        error_message = str(e)
        if "User not found" in error_message:
            return jsonify({"error": f"GitHub user '{username}' not found"}), 404
        return jsonify({"error": error_message}), 400

@app.route('/s/<share_id>')
def view_shared(share_id):
    # Check if share exists and hasn't expired
    current_time = datetime.now()
    if share_id not in shared_receipts:
        return render_template('index.html', error_message="This share link is invalid or has expired.")
    
    share_data = shared_receipts[share_id]
    if current_time - share_data['created_at'] > SHARE_LINK_EXPIRY:
        del shared_receipts[share_id]
        return render_template('index.html', error_message="This share link has expired.")
    
    return render_template('index.html', shared_data=share_data['data'])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
