import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const year = process.argv[2] || new Date().getFullYear();
const outputDir = path.resolve('public/data');
const outputFile = path.join(outputDir, `calendar-${year}.json`);

const COOKIES = `_ga=GA1.1.1682399883.1773201421; PHPSESSID=82a31c9b643acedddac457417e113071; wssplashuid=7602c13443352d233a8e86517b6befadd98ac058.1774097310.1; setkoki=installkoki; _ga_P2QCCZCXHC=GS2.1.s1774092720$o3$g1$t1774094137$j12$l0$h0; FCCDCF=%5Bnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%22009e66f0-ff84-4157-9a5e-23bcf13adfac%5C%22%2C%5B1774092721%2C526000000%5D%5D%22%5D%5D%5D; FCNEC=%5B%5B%22AKsRol-PRmcdUKVCnh8Guj_9pX5ZGzufp-Ze1jo9dyUdJKdCaz6VAxt0jHOQRMotWxQOtrMAXx3Uw6aSMLk5bisxLOuCjKa8j64feYXKn8PSGoV9CsILfeNMBCm7V6A1U7Gy6fhi87nHWwT00GD7en6Y8otE908nGQ%3D%3D%22%5D%5D`;
const USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36`;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function scrapeMonth(month, year) {
  const url = `https://kalenderbali.org/?tanggal=1&bulan=${month}&tahun=${year}&pilih=OK`;
  console.log(`Scraping: ${url}`);
  
  try {
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': USER_AGENT,
        'Cookie': COOKIES,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Referer': 'https://kalenderbali.org/'
      }
    });
    
    if (typeof data === 'object' && data.message && data.message.includes('Access denied')) {
        console.error(`Access denied for month ${month}. Cookies might be stale.`);
        return null;
    }

    const $ = cheerio.load(data);
    const currentMonthDays = [];
    const events = [];

    // 1. Grid Extraction
    $('table td a[title]').each((i, el) => {
        const text = $(el).text().trim();
        const title = $(el).attr('title');
        const d = parseInt(text);
        
        // Ignore if parent td has class 'takaktif' (previous or next month)
        const td = $(el).closest('td');
        if (!isNaN(d) && !td.hasClass('takaktif')) {
            currentMonthDays.push({ date: d, sakaInfo: title });
        }
    });

    // Sort and Deduplicate by date (safety)
    const uniqueDays = [];
    const seenDates = new Set();
    // Sort before dedup
    currentMonthDays.sort((a,b) => a.date - b.date);
    
    currentMonthDays.forEach(d => {
        if (!seenDates.has(d.date)) {
            uniqueDays.push(d);
            seenDates.add(d.date);
        }
    });

    // 2. Events Extraction
    $('li').each((i, el) => {
        const text = $(el).text().trim();
        // Match 08-01-2025. name
        const match = text.match(/^(\d{2})-(\d{2})-(\d{4})\.\s*(.*)$/);
        if (match) {
            const [_, d, m, y, name] = match;
            if (parseInt(m) === parseInt(month) && parseInt(y) === parseInt(year)) {
                events.push({
                    date: parseInt(d),
                    name: name.trim()
                });
            }
        }
    });

    const holidays = events.filter(e => {
        const n = e.name.toLowerCase();
        return n.includes('hari') || n.includes('hut') || n.includes('tahun baru') || n.includes('isra') || n.includes('imlek') || n.includes('lh') || n.includes('waisak') || n.includes('nyepi') || n.includes('nasional');
    });
    const religiousDays = events.filter(e => !holidays.some(h => h.name === e.name));

    return {
      month: parseInt(month),
      year: parseInt(year),
      days: uniqueDays,
      religiousDays: [ ...new Map(religiousDays.map(item => [item.name, item])).values() ],
      holidays: [ ...new Map(holidays.map(item => [item.name, item])).values() ]
    };
  } catch (error) {
    console.error(`Error scraping month ${month}:`, error.message);
    return null;
  }
}

async function main() {
  const fullYearData = [];
  for (let m = 1; m <= 12; m++) {
    const monthData = await scrapeMonth(m, year);
    if (monthData) {
      fullYearData.push(monthData);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  
  if (fullYearData.length > 0) {
    fs.writeFileSync(outputFile, JSON.stringify(fullYearData, null, 2));
    console.log(`Saved ${fullYearData.length} months to ${outputFile}`);
  }
}

main();
