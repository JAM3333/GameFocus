# GameFocus
## Overview
GameFocus is a dynamic web application designed to compare game data, such as prices and player count, across multiple gaming platforms like Steam, Epic Games, GOG, EA Games, and Microsoft/Xbox. The platform allows users to track prices, discover discounts, and save their favorite games as bookmarks. Users can receive email notifications when their bookmarked games go on sale. The application features a backend API for user login, bookmark management, and notifications.

## Features
- **Game Data Comparison:** Compare game prices, player counts, and other data across multiple stores (Steam, Epic Games, GOG, Microsoft/Xbox, EA Games).
- **Price Comparison:** View and compare prices of games across various platforms.
- **Discount Overview:** Track major discount events like Summer Sales and Black Friday deals.
- **Bookmarking System:** Save favorite games and receive email notifications when they are on sale.
- **User Login:** Secure user authentication using email/username and password. Access and manage bookmarked games.

## Technologies Used
- **Frontend:** Vuetify, JavaScript, HTML
- **Backend:** Node.js, MySQL, API for user login and bookmark saving

## Getting Started

### Prerequisites

- Node.js
- MySQL

### Installation

1. Clone the repository: `git clone https://github.com/yourusername/GameFocus.git`
2. Install dependencies: `npm install`
3. Set up MySQL database and configure the schema
4. Configure environment variables (see `.env.example` for a template)
5. Run the application: `npm run dev`

### Backend API Setup

1. Set up the backend API to handle user logins and bookmark management.
2. Ensure you have the correct API keys and permissions for accessing game store data (e.g., Steam API).

## Usage

1. Create an account and log in to the platform.
2. Browse and compare game prices from different stores (Steam, Epic, GOG, etc.).
3. Add games to your bookmarks and get notified via email when they go on sale.
4. Track discounts and major sale events.
5. Customize your notifications and game preferences.

## Contributing

We welcome contributions to improve GameFocus! If you'd like to contribute, please feel free to fork the repo, make improvements, and submit a pull request.

### How to Contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch to your forked repository.
5. Open a pull request to the main repository.

Please adhere to the existing code style and write tests for your contributions where applicable.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
