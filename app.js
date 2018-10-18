const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
    const urls = fs.readFileSync('./data/urls.txt', 'utf8').split('\r\n');

    const viewport = {
        width: 1115,
        height: 1024
    };
  
    const browser = await puppeteer.launch();
    console.log("\n\nCreating files for disabled JS.\n")
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

        //printing links to .txt file
        const hrefs = await page.$$eval('a', as => as.map(a => a.href + "\r\n"));
        await fs.writeFile(`./jsdisabled/${urls[i]}.txt`, hrefs, (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log(`${urls[i]}.txt created. Lines: ${hrefs.length}`)
        });

        await page.setViewport(viewport);
        await page.screenshot({path: `./jsdisabled/${urls[i]}.png`});
        console.log(`${urls[i]}.png created.`);
        await page.close();
    };

    //creating photos with enabled js
    console.log("\n\nCreating files for enabled JS.\n")

    for (let i=0; i<urls.length; i++) {
        const page = await browser.newPage();
        await page.goto(`https://${urls[i]}`);

        //printing links to .txt file
        const hrefs = await page.$$eval('a', as => as.map(a => a.href + "\r\n"));
        await fs.writeFile(`./jsenabled/${urls[i]}.txt`, hrefs, (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log(`${urls[i]}.txt created. Lines: ${hrefs.length}`)
        });

        await page.setViewport(viewport);
        await page.screenshot({path: `./jsenabled/${urls[i]}.png`});
        console.log(`${urls[i]}.png created.`);
        await page.close();
    };

    await browser.close();
})();
