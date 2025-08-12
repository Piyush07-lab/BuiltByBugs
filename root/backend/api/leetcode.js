require("dotenv").config({ path: __dirname + "/.env" });

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");


async function fetchLeetCodeStats() {

    console.log('[Debug] fetchLeetCodeStats() called')

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const { LEETCODE_USER, LEETCODE_PASS } = process.env;

    try {
        console.log('[Puppeteer] Logging into Leetcode...');

        await page.goto('https://leetcode.com/accounts/login/', { waitUntil: 'networkidle2' });

        await page.type('#id_login', LEETCODE_USER, { delay: 50 });
        await page.type('#id_password', LEETCODE_PASS, { delay: 50 });
        await page.click("button[type='submit']");

        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        console.log('[Puppeteer] Logged in! Navigating to profile...');

        await page.goto(`https://leetcode.com/${LEETCODE_USER}/`, { waitUntil: 'networkidle2' });

        await page.waitForSelector('.flex.items-center.space-x-4');

        const stats = await page.evaluate(() => {
            const getText = selector => {
                const el = document.querySelector(selector);
                return el ? el.textContent.trim() : 'N/A';
            };

            const allStats = document.querySelectorAll('.text-[24px]');
            const [solved, easy, medium, hard] = [...allStats].map(el => el.textContent.trim());

            const ranking = getText('.ttext-label-1');
            const stars = getText('[data-cy="star-rating"]');

            return {
                solved,
                easy,
                medium,
                hard,
                ranking,
                stars,
                timestamp: new Date().toISOString()
            };
        });

        const outputPath = path.join(__dirname, '../data/leetcode.json');
        fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2), 'utf-8');

        console.log('[Puppeteer] Stats saved:', stats);

        console.log('[SUCCESS] LeetCode stats scraping complete');


        await browser.close();
        return stats;

    } catch (err) {
        console.error('[Puppeteer] Error:', err.message);
        await browser.close();
        throw err;
    }
}

module.exports = { fetchLeetCodeStats };