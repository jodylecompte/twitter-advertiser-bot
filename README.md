# Twitter Advertiser Bot

The Twitter Advertiser Bot is an automation tool built to identify and delete promoted posts from your Twitter timeline. It uses Puppeteer, a Node.js library, to emulate user behavior in a headless Chrome or Chromium browser. The bot logs in using your provided credentials and scrolls through Twitter to find promoted posts and delete them.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Customization](#customization)
6. [Contributing](#contributing)
7. [License](#license)

## Getting Started

These instructions will guide you on how to run the Twitter Advertiser Bot.

## Prerequisites

- Node.js
- Yarn, npm or pnpm
- A Twitter account

## Installation

First, clone the repository.

You need to setup environment variables for your Twitter account. The username and password are stored in a `.env` file in the root directory of the project:

```
TWITTER_USERNAME=your_username_here
TWITTER_PASSWORD=your_password_here
```

Install the dependencies. We recommend using pnpm for a faster and more efficient dependency tree, but you can use npm or yarn as well:

## Customization

The default behavior is to process 10 advertisers per batch. You can customize this by modifying the `HANDLES_PER_RUN` constant in the code.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License

[MPL](https://www.mozilla.org/en-US/MPL/)

This project is open source and available under the [Mozilla Public License 2.0](LICENSE).
