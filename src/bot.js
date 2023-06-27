require('dotenv').config();

const puppeteer = require('puppeteer');

const HANDLES_PER_RUN = 10; // How many users to find before proceeding with block phase
const DELAY_LOGIN = 2000; // Delay before pressing login button after each step


const execute = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await twitterLogin(page);

  while (true) {
    const advertisers = new Set();
    await findAdvertisers(page, advertisers);
    console.log(advertisers);
    await blockAdvertisers(page, advertisers);

    await page.waitForTimeout(3000);
    await page.goto('https://twitter.com/home');
  }
}

const twitterLogin = async (page) => {
  await page.goto('https://twitter.com/login');

  await page.waitForSelector('input[autocomplete="username"]');
  await page.type('input[autocomplete="username"]', process.env.TWITTER_USERNAME);

  await page.waitForTimeout(DELAY_LOGIN);

  await page.evaluate(() => {
    const nextButton = Array.from(document.querySelectorAll('span')).find(element => element.textContent === 'Next');
    if (nextButton) {
      nextButton.click();
    }
  });

  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="password"]', process.env.TWITTER_PASSWORD);

  await page.waitForTimeout(DELAY_LOGIN);

  await page.evaluate(() => {
    const loginButton = Array.from(document.querySelectorAll('span')).find(element => element.textContent === 'Log in');
    if (loginButton) {
      loginButton.click();
    }
  });
}

const findAdvertisers = async (page, advertisers) => {
  await page.waitForTimeout(5000);
  while (advertisers.size < HANDLES_PER_RUN) {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });

    const tweetUrls = await page.evaluate(() => {
      const tweetNodes = Array.from(document.querySelectorAll('article'));
      const urls = [];

      tweetNodes.forEach(node => {
        if (node.innerHTML.includes('Promoted')) {
          const anchorTags = node.querySelectorAll('a');
          anchorTags.forEach(anchor => {
            const url = anchor.getAttribute('href');
            if (url && url.match(/^\/[a-zA-Z0-9_]+$/)) {
              const handle = url.replace('/', '');
              if (!urls.includes(handle)) {
                urls.push(handle);
              }
            }
          });
        }
      });

      return urls;
    });

    tweetUrls.forEach(url => {
      if (!advertisers.has(url)) {
        advertisers.add(url);
        console.log('Advertiser Identified: ', `@${url}`)
      }
    });
  }
}

const blockAdvertiser = async (page, advertiser) => {
  const menuSelector = 'div[data-testid="userActions"]';

  try {
    page.goto(`https://twitter.com/${advertiser}`);
  } catch (e) {
    console.log(e)
  }
  await page.waitForNavigation();
  await page.waitForSelector(menuSelector);

  await page.evaluate((advertiser) => {
    // Main user actions menu
    document.querySelector('div[data-testid="userActions"]').click();
    // Block Button
    Array.from(document.querySelectorAll('span')).find(element => element.textContent === `Block @${advertiser}`).click();
    // Block confirmation button
    Array.from(document.querySelectorAll('span')).find(element => element.textContent === 'Block').click();
  }, advertiser);

  console.log(`Blocked: @${advertiser}`)

  await page.waitForTimeout(3000);
}

const blockAdvertisers = async (page, advertisers) => {
  for (const advertiser of advertisers) {
    await blockAdvertiser(page, advertiser);
  }
};

execute();