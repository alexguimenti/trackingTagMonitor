const puppeteer = require("puppeteer")
const cheerio = require("cheerio")
const clients = require("./ClientsController");
const nodemailer = require('nodemailer');

const sample = {
  CustomerId: '6c396631-4715-4310-9651-f9d3c059e71d',
  Url: 'https://www.kabum.com.br',
  Tag: true
}

const result = []
const error = []

async function scrapeClients() {
  const browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true });
  const page = await browser.newPage();
  for (i = 0; i < clients.length; i++) {
    try {
      await page.goto(clients[i].Url, {waitUntil: 'load', timeout: 0});
      await page.waitFor(10000);
      let bodyHTML = await page.evaluate(() => document.body.innerHTML);
      var count = i + 1
        var total = clients.length
        var percentage = (count / total) * 100
        console.log(percentage.toFixed(1) + '%')
      if (bodyHTML.includes('socl.start') || bodyHTML.includes('soclminer') || bodyHTML.includes('sm-tracking')) {
        clients[i].HasTag = true
        
      }
      //console.log(clients[i])
      await page.waitFor(2000);
    }
    catch (err) {
      clients[i].HasTag = 'Time Out Error'
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

  console.log("           --- Time Out Error ---")
  console.log("")
  for (i = 0; i < clients.length; i++) {
    if (clients[i].HasTag == 'Time Out Error')
    error.push(clients[i])
  }
  console.log(error)
  console.log("")
  console.log("")

  // async..await is not allowed in global scope, must use a wrapper
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "teste.ecommerce123@gmail.com", // generated ethereal user
        pass: "Xandigui89#" // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
});

  // send mail with defined transport object
  let info = await transporter.sendMail({
      from: '"Ghost Guard 👻" <foo@example.com>', // sender address
      to: 'alexandre.oliveira@socialminer.com', // list of receivers
      subject: 'Results ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: `<b>${JSON.stringify(result)}</b>` // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  process.exit()
}




scrapeClients();