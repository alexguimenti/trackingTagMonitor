const puppeteer = require("puppeteer")
const cheerio = require("cheerio")
const clients = require("./ClientsController");

const sample = {
  CustomerId: '6c396631-4715-4310-9651-f9d3c059e71d',
  Url: 'https://www.kabum.com.br',
  Tag: true
}

const result = []


async function scrapeClients() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  for (i = 0; i < clients.length; i++) {
    try {
      await page.goto(clients[i].Url);
      await page.waitFor(7000);
      let bodyHTML = await page.evaluate(() => document.body.innerHTML);
      if (bodyHTML.includes('socl.start') || bodyHTML.includes('soclminer')) {
        clients[i].HasTag = true
        var count = i + 1
        var total = clients.length
        var percentage = (count / total) * 100
        console.log(percentage.toFixed(1) + '%')
      }
      //console.log(clients[i])
      await page.waitFor(2000);
    }
    catch (err) {
      console.log('Error on:')
      console.log(clients[i])
      console.error(err)
    }
  }

  console.log("")
  console.log("")
  console.log("           --- Resultado ---")
  console.log("")
  for (i = 0; i < clients.length; i++) {
    if (!clients[i].HasTag)
    result.push(clients[i])
  }
  console.log(result)
  console.log("")
  console.log("")
  process.exit()
}

scrapeClients();