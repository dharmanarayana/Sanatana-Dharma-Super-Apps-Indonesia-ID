import axios from 'axios';
import fs from 'fs';

const COOKIES = `_ga=GA1.1.1682399883.1773201421; PHPSESSID=82a31c9b643acedddac457417e113071; wssplashuid=7602c13443352d233a8e86517b6befadd98ac058.1774097310.1; setkoki=installkoki; _ga_P2QCCZCXHC=GS2.1.s1774092720$o3$g1$t1774094137$j12$l0$h0; FCCDCF=%5Bnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%22009e66f0-ff84-4157-9a5e-23bcf13adfac%5C%22%2C%5B1774092721%2C526000000%5D%5D%22%5D%5D%5D; FCNEC=%5B%5B%22AKsRol-PRmcdUKVCnh8Guj_9pX5ZGzufp-Ze1jo9dyUdJKdCaz6VAxt0jHOQRMotWxQOtrMAXx3Uw6aSMLk5bisxLOuCjKa8j64feYXKn8PSGoV9CsILfeNMBCm7V6A1U7Gy6fhi87nHWwT00GD7en6Y8otE908nGQ%3D%3D%22%5D%5D`;
const USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36`;

async function main() {
    const url = 'https://kalenderbali.org/?tanggal=1&bulan=1&tahun=2025&pilih=OK';
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Cookie': COOKIES,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Referer': 'https://kalenderbali.org/'
      }
    });
    fs.writeFileSync('tmp.html', data);
    console.log('Saved tmp.html');
}
main();
