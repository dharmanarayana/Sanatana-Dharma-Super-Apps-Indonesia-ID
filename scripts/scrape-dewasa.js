import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const yearsToScrape = [2025, 2026];
const outputDir = path.resolve('public/data');

const COOKIES = `_ga=GA1.1.1682399883.1773201421; PHPSESSID=82a31c9b643acedddac457417e113071; wssplashuid=7602c13443352d233a8e86517b6befadd98ac058.1774097310.1; setkoki=installkoki; _ga_P2QCCZCXHC=GS2.1.s1774092720$o3$g1$t1774094137$j12$l0$h0; FCCDCF=%5Bnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%22009e66f0-ff84-4157-9a5e-23bcf13adfac%5C%22%2C%5B1774092721%2C526000000%5D%5D%22%5D%5D%5D; FCNEC=%5B%5B%22AKsRol-PRmcdUKVCnh8Guj_9pX5ZGzufp-Ze1jo9dyUdJKdCaz6VAxt0jHOQRMotWxQOtrMAXx3Uw6aSMLk5bisxLOuCjKa8j64feYXKn8PSGoV9CsILfeNMBCm7V6A1U7Gy6fhi87nHWwT00GD7en6Y8otE908nGQ%3D%3D%22%5D%5D`;
const USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36`;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get number of days in month
function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

async function scrapeDay(d, m, y) {
  const url = `https://kalenderbali.org/alaayu.php?bulan=${m}&tanggal=${d}&tahun=${y}`;
  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': USER_AGENT,
        'Cookie': COOKIES,
        'Referer': 'https://kalenderbali.org/'
      }
    });

    if (typeof data === 'object' && data.message && data.message.includes('Access denied')) {
        console.error(`Access denied for ${d}/${m}/${y}. Cookies might be stale.`);
        return null;
    }

    const $ = cheerio.load(data);
    const items = [];

    $('li').each((i, el) => {
        const html = $(el).html();
        if (html && html.includes('<b>')) {
            const nameNode = $(el).find('b');
            if (nameNode.length) {
                let name = nameNode.first().text().trim();
                const clone = $(el).clone();
                clone.find('b').remove();
                let desc = clone.text().trim();
                if (desc.startsWith('.')) desc = desc.substring(1).trim();
                if (name) {
                    items.push({ name, description: desc });
                }
            }
        }
    });

    return items;
  } catch (error) {
    console.error(`Error scraping ${d}/${m}/${y}:`, error.message);
    return null;
  }
}

async function main() {
  for (const year of yearsToScrape) {
    const yearData = {}; // Format: "YYYY-MM-DD": [ ...items ]
    console.log(`Starting to scrape Dewasa Ayu for year ${year}...`);

    for (let month = 1; month <= 12; month++) {
      const days = getDaysInMonth(month, year);
      console.log(`Scraping ${year}-${month} (${days} days)`);
      
      for (let day = 1; day <= days; day++) {
        const items = await scrapeDay(day, month, year);
        if (items) {
          const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          yearData[key] = items;
        }
        // Be nice to the server + avoid blocks
        await new Promise(r => setTimeout(r, 400));
      }
    }

    const outputFile = path.join(outputDir, `dewasa-${year}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(yearData, null, 2));
    console.log(`Saved Dewasa Ayu for ${year} to ${outputFile}`);
  }
  console.log('All years scraped successfully!');
}

main();
