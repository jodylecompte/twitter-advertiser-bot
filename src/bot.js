require('dotenv').config();

const puppeteer = require('puppeteer');
const fs = require('fs');

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
  await page.waitForTimeout(5000);
  const advertisers = new Set();

  while (advertisers.size < 10) {
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
              urls.push(url.replace('/', ''));
            }
          });
        }
      });

      return urls;
    });

    tweetUrls.forEach(url => {
      advertisers.add(url);
    });
  }

  console.log(advertisers);
}

loginTwitter();
