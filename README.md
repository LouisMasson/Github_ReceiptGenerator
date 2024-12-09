# GitHub Receipt Generator 🧾

[![Python Version](https://img.shields.io/badge/python-3.11%2B-blue)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub API](https://img.shields.io/badge/GitHub-API-green.svg)](https://docs.github.com/en/rest)

A sleek web application that generates aesthetic, receipt-style summaries of GitHub profiles. Transform your GitHub activity into a beautifully formatted receipt, complete with comprehensive metrics and a unique thermal printer-inspired design.

![GitHub Receipt Preview](generated-icon.png)

## ✨ Features 

### 📊 Profile Analytics
- **Comprehensive Profile Overview**
  - User information and statistics
  - Repository counts and engagement metrics
  - Account age and creation date
  - Location and company details

### 📈 Activity Metrics
- **30-Day Analysis**
  - Recent commit history
  - Most active day detection
  - Contribution scoring
  - Language distribution

### 📚 Repository Insights
- **Latest Repositories**
  - Most recent creations
  - Star counts and activity
- **Popular Projects**
  - Most starred repositories
  - Fork statistics

### 🎨 User Experience
- **Theme Options**
  - Dark/Light mode toggle
  - Thermal receipt styling
  - Responsive design
  
### 🔄 Sharing & Export
- **Multiple Formats**
  - High-quality PDF export
  - Shareable links (24-hour validity)
  - Instant clipboard copy

## 🛠️ Architecture

### Backend Infrastructure
- **Flask Framework**
  - RESTful API design
  - Modular route handling
  - Error middleware
  - Rate limiting protection

### Frontend Implementation
- **Modern JavaScript**
  - Vanilla JS for performance
  - Dynamic content rendering
  - Responsive interactions
  - Theme management

### Performance Optimizations
- **Caching System**
  - GitHub API request caching
  - Response optimization
  - Rate limit management
  
### Data Processing
- **GitHub API Integration**
  - Efficient data fetching
  - Comprehensive metrics calculation
  - Error handling
  
### Export Systems
- **WeasyPrint Integration**
  - Custom PDF templates
  - Thermal receipt styling
  - High-fidelity exports

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- GitHub API access token (for higher rate limits)

### Environment Setup
```env
FLASK_SECRET_KEY=your-secret-key
GITHUB_TOKEN=your-github-token  # Optional, for higher rate limits
```

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/github-receipt.git
   cd github-receipt
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the server:
   ```bash
   python app.py
   ```

4. Visit `http://localhost:5000`

## 🔧 Development

### Local Development
1. Fork the repository
2. Create a feature branch
3. Install development dependencies
4. Run tests before submitting PR

### Code Style
- Follow PEP 8 guidelines
- Use meaningful variable names
- Add comments for complex logic
- Include docstrings for functions

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Check the issues page for open tasks
2. Fork the repository
3. Create a feature branch
4. Write clear commit messages
5. Submit a pull request

### Development Guidelines
- Write clean, documented code
- Add tests for new features
- Update documentation
- Follow the code style guide

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- GitHub API for comprehensive data access
- WeasyPrint for reliable PDF generation
- The open-source community for inspiration
- All contributors and users

## 🌐 Live Demo

Experience the GitHub Receipt Generator at [gitreceipt.patronusguardian.org](https://gitreceipt.patronusguardian.org)

---

Made with ❤️ by Louis

⭐ If you find this project useful, please consider giving it a star!
