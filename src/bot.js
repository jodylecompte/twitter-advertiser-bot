require('dotenv').config();

const puppeteer = require('puppeteer');

async function loginTwitter() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://twitter.com/login');

  await page.waitForSelector('input[autocomplete="username"]');
  await page.type('input[autocomplete="username"]', process.env.TWITTER_USERNAME);

  await page.waitForTimeout(2000);

  await page.evaluate(() => {
    const nextButton = Array.from(document.querySelectorAll('span')).find(element => element.textContent === 'Next');
    if (nextButton) {
      nextButton.click();
    }
  });

  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="password"]', process.env.TWITTER_PASSWORD);

  await page.waitForTimeout(2000);

  await page.evaluate(() => {
    const loginButton = Array.from(document.querySelectorAll('span')).find(element => element.textContent === 'Log in');
    if (loginButton) {
      loginButton.click();
    }
  });

  await page.waitForNavigation();
}

loginTwitter();