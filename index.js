// https://codequiz.azurewebsites.net/

// var arg = process.argv.slice(2);
// if (arg[0]) {
//   switch (arg[0]) {
//     case "B-INCOMESSF":
//       console.log("10.0548");
//       break;
//     case "BM70SSF":
//       console.log("9.9774");
//       break;
//     case "BEQSSF":
//       console.log("11.247");
//       break;
//     case "B-FUTURESSF":
//       console.log("11.443");
//       break;
//     default:
//       console.log("input not found");
//       break;
//   }
// }

const puppeteer = require("puppeteer");

async function scrape() {
  const arg = process.argv.slice(2);
  if (arg[0]) {
    let result = [];
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    const tableSelector = "table > tbody";
    await page.goto("https://codequiz.azurewebsites.net/");
    var btn = await page.$("[value='Accept']");
    if (btn) {
      await btn.evaluate((btn) => btn.click());
      await page.waitForNavigation();
      const countriesLength = await page.$$eval(
        `${tableSelector} > tr`,
        (el) => el.length
      );
      // format data to object
      for (let i = 1; i < countriesLength + 1; i++) {
        const name = await page.evaluate(
          (el) => (el ? el.innerText : ""),
          await page.$(
            `${tableSelector} > tr:nth-child(${i}) > td:nth-child(1)`
          )
        );
        const nav = await page.evaluate(
          (el) => (el ? el.innerText : ""),
          await page.$(
            `${tableSelector} > tr:nth-child(${i}) > td:nth-child(2)`
          )
        );
        const bid = await page.evaluate(
          (el) => (el ? el.innerText : ""),
          await page.$(
            `${tableSelector} > tr:nth-child(${i}) > td:nth-child(3)`
          )
        );
        const offer = await page.evaluate(
          (el) => (el ? el.innerText : ""),
          await page.$(
            `${tableSelector} > tr:nth-child(${i}) > td:nth-child(4)`
          )
        );
        const charge = await page.evaluate(
          (el) => (el ? el.innerText : ""),
          await page.$(
            `${tableSelector} > tr:nth-child(${i}) > td:nth-child(5)`
          )
        );

        // filter no unqiname and push object
        if (name) {
          result.push({
            name: name,
            nav: nav,
            bid: bid,
            offer: offer,
            charge: charge,
          });
        }
      }

      const output_valuer = result.find((item) => {
          return item.name.toLowerCase() === arg[0].toLowerCase();
        })

      console.log(`RESULT ${arg[0]} = `, output_valuer ? output_valuer.nav : 'NOT FOUND VALUE DATA');
    }

    browser.close();
  } else {
    console.error("PLEASE INPUT ARGUMENT : node index.js <arg_name>");
  }
}

scrape();
