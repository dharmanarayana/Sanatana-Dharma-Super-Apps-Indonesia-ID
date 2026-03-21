import axios from 'axios';

async function debug() {
    const url = 'https://kalenderbali.org/?tanggal=1&bulan=1&tahun=2025&pilih=OK';
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1'
            }
        });
        console.log('Status:', response.status);
        console.log('Type of data:', typeof response.data);
        if (typeof response.data === 'string') {
            console.log('HTML Head:', response.data.substring(0, 500));
        } else {
            console.log('Data:', response.data);
        }
    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) {
            console.log('Response Status:', e.response.status);
            console.log('Response Data:', e.response.data);
        }
    }
}

debug();
