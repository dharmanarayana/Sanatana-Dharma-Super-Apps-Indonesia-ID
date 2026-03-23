import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const yearsToScrape = [2025, 2026];
const outputDir = path.resolve('public/data');

const USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36`;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get number of days in month
function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

async function scrapeDay(d, m, y) {
  const url = `https://kalenderbali.com/ala-ayuning-dewasa/?tg=${d}&bl=${m}&th=${y}`;
  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': USER_AGENT,
        'Referer': 'https://kalenderbali.com/'
      }
    });

    const $ = cheerio.load(data);
    const items = [];

    $('div.isi ul li').each((i, el) => {
        const html = $(el).html();
        if (html && html.includes('<b>')) {
            const nameNode = $(el).find('b');
            if (nameNode.length) {
                let name = nameNode.first().text().trim();
                const clone = $(el).clone();
                clone.find('b').remove();
                let desc = clone.text().trim();
                if (desc.startsWith(':')) desc = desc.substring(1).trim();
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
