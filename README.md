# GitHub Receipt Generator 🧾

A sleek web application that generates aesthetic, receipt-style summaries of GitHub profiles. Get a unique perspective on your GitHub activity with a thermal printer-inspired visualization.

![GitHub Receipt Preview](generated-icon.png)

## Features ✨

- **Profile Overview**: Displays comprehensive GitHub profile information
- **Repository Stats**: Shows total stars, forks, and repository counts
- **Activity Metrics**: 
  - 30-day commit history
  - Most active day of the week
  - Top programming languages
  - Contribution score
- **Latest & Popular Repos**: 
  - Most recently created repositories
  - Most starred repositories
- **Account Details**: 
  - Account creation date
  - Account age
  - Location and company info
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Export Options**: 
  - Download as PDF
  - Share via unique links (valid for 24 hours)

## Tech Stack 🛠️

- **Backend**: Flask (Python)
- **Frontend**: Vanilla JavaScript with modern CSS
- **UI Components**: Custom-styled components
- **PDF Generation**: WeasyPrint
- **Caching**: Request caching for GitHub API calls
- **Design**: Thermal receipt-inspired UI with responsive layout

## Live Demo 🌐

Visit [gitreceipt.patronusguardian.org](https://gitreceipt.patronusguardian.org) to try it out!

## Development 💻

### Prerequisites

- Python 3.11+
- GitHub API access

### Environment Variables

```env
FLASK_SECRET_KEY=your-secret-key
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   python app.py
   ```
4. Visit `http://localhost:5000` in your browser

## Features in Detail 📋

### Profile Analysis
- Comprehensive overview of GitHub activity
- Visual representation of programming language distribution
- Contribution metrics and activity patterns

### PDF Export
- High-quality PDF generation
- Thermal receipt styling
- Preserves formatting and emoji support

### Sharing
- Generate unique share links
- 24-hour validity period
- Instant clipboard copy

## Performance 🚀

- Request caching to minimize GitHub API calls
- Optimized PDF generation
- Responsive design for all devices

## Contributing 🤝

Feel free to submit issues and enhancement requests!

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 👏

- GitHub API for providing the data
- WeasyPrint for PDF generation
- The open-source community

Made with ❤️ by Louis
