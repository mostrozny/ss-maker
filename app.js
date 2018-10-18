const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
    const urls = fs.readFileSync('./data/urls.txt', 'utf8').split('\r\n');

    const viewport = {
        width: 1115,
        height: 1024
    };
  
    const browser = await puppeteer.launch();

    //creating photos with disabled js
    for (let i=0; i<urls.length; i++) {
        const page = await browser.newPage();

        //disabling javascript on websites
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.resourceType() === 'script')
                request.abort();
            else
                request.continue();
        });

        await page.goto(`https://${urls[i]}`);
        await page.setJavaScriptEnabled(false);
        await page.setViewport(viewport);
        await page.screenshot({path: `./jsdisabled/${urls[i]}.png`});
        await page.close();
    };

    //creating photos with enabled js
    for (let i=0; i<urls.length; i++) {
        const page = await browser.newPage();
        await page.goto(`https://${urls[i]}`);
        await page.setJavaScriptEnabled(false);
        await page.setViewport(viewport);
        await page.screenshot({path: `./jsenabled/${urls[i]}.png`});
        await page.close();
    };

    await browser.close();
})();
