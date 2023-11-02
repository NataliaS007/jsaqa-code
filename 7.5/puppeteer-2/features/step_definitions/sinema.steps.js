const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("cucumber");
const { getText, clickElement } = require("../../lib/commands.js");

let browser;
let page;
let byuingSchema;
let place;

Before(async function () {
  browser = await puppeteer.launch({
    headless: false,
    // slowMo: 50,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("пользователь на странице {string}", async function (url) {
  try {
    await this.page.goto(url, { setTimeout: 50000 });
  } catch (error) {
    throw new Error(`Failed to navigate to ${url} with error: ${error}`);
  }
});

When("переходит на расписание следующего дня", async function () {
  return await clickElement(this.page, "a:nth-child(2)");
});

When("выбирает время сеанса фильма Зверополис на 11-00", async function () {
  await this.page.waitForTimeout(1000);
  return await clickElement(this.page, ".movie-seances__hall a");
});

When("выбирает место в зале кинотеатра 3 ряд 8 место", async function () {
  byuingSchema = "div.buying-scheme";
  await this.page.waitForSelector(byuingSchema);
  await this.page.waitForTimeout(500);
  place = ".buying-scheme__wrapper > :nth-child(3) > :nth-child(8)";
  await clickElement(this.page, place);
  await clickElement(this.page, "button");
});

Then("получает результат выбранного места до покупки", async function () {
  await this.page.waitForTimeout(1000);
  const result = "h2";
  await this.page.waitForSelector(result);
  await getText(this.page, `div > p:nth-child(1) > span`);
  const numberOfparagraph = 6;
  let resultText = [];
  for (let i = 1; i < numberOfparagraph; i++) {
    try {
      let text = await getText(this.page, `div > p:nth-child(${i}) > span`);
      resultText.push(text);
    } catch (e) {
      console.error(`Error while getting text for paragraph ${i}`, e);
    }
  }
  const actual = resultText;
  const expected = await ["Зверополис", "3/8", "Зал 2", "21-10-2023", "11:00"];
  expect(actual).to.have.members(expected);
});

When(
  "выбирает места в зале кинотеатра 7 ряд 4,5,6,7,8 места",
  async function () {
    byuingSchema = "div.buying-scheme";
    await this.page.waitForSelector(byuingSchema);
    let place4 = ".buying-scheme__wrapper > :nth-child(7) > :nth-child(4)";
    let place5 = ".buying-scheme__wrapper > :nth-child(7) > :nth-child(5)";
    let place6 = ".buying-scheme__wrapper > :nth-child(7) > :nth-child(6)";
    let place7 = ".buying-scheme__wrapper > :nth-child(7) > :nth-child(7)";
    let place8 = ".buying-scheme__wrapper > :nth-child(7) > :nth-child(8)";
    await clickElement(this.page, place4);
    await this.page.waitForTimeout(500);
    await clickElement(this.page, place5);
    await this.page.waitForTimeout(500);
    await clickElement(this.page, place6);
    await this.page.waitForTimeout(500);
    await clickElement(this.page, place7);
    await this.page.waitForTimeout(500);
    await clickElement(this.page, place8);
    await clickElement(this.page, "button.acceptin-button");
  }
);

Then("получает результат выбранных мест до покупки", async function () {
  await this.page.waitForTimeout(1000);
  const result = "h2";
  await this.page.waitForSelector(result);
  await getText(this.page, `div > p:nth-child(1) > span`);
  const numberOfparagraph = 6;
  let resultText = [];
  for (let i = 1; i < numberOfparagraph; i++) {
    try {
      let text = await getText(this.page, `div > p:nth-child(${i}) > span`);
      resultText.push(text);
    } catch (e) {
      console.error(`Error while getting text for paragraph ${i}`, e);
    }
  }
  const actual = resultText;
  const expected = await [
    "Унесенные ветром",
    "7/4, 7/5, 7/6, 7/7, 7/8",
    "Зал 2",
    "22-10-2023",
    "16:00",
  ];
  expect(actual).to.have.members(expected);
});

When("переходит на расписание через 2 дня от текущей даты", async function () {
  return await clickElement(this.page, "a:nth-child(3)");
});

When(
  "выбирает время сеанса фильма Унесенные ветром на 16-00",
  async function () {
    await this.page.waitForTimeout(1000);
    return await clickElement(this.page, "div:nth-child(3) a");
  }
);

When("выбирает место в зале кинотеатра 2 ряд 4 место", async function () {
  byuingSchema = "div.buying-scheme";
  await this.page.waitForSelector(byuingSchema);
  place = ".buying-scheme__wrapper > :nth-child(2) > :nth-child(4)";
  await clickElement(this.page, place);
  await clickElement(this.page, "button");
});

Then("получает купленный билет", async function () {
  await this.page.waitForTimeout(1000);
  const result = "h2";
  await this.page.waitForSelector(result);
  await clickElement(this.page, "button");
  const electroTicket = "h2";
  await this.page.waitForSelector(electroTicket);
  await this.page.waitForTimeout(1000);
  const actual = await getText(this.page, electroTicket);
  const expected = "Электронный билет";
  expect(actual).to.equal(expected);
});

When("переходит на расписание выбора фильмов через неделю", async function () {
  return await clickElement(this.page, "a:nth-child(7)");
});

When("выбирает место в зале кинотеатра 5 ряд 3 место", async function () {
  byuingSchema = "div.buying-scheme";
  await this.page.waitForSelector(byuingSchema);
  place = ".buying-scheme__wrapper > :nth-child(5) > :nth-child(3)";
  await clickElement(this.page, place);
  await clickElement(this.page, "button");
});

When(
  "переходит снова на главную страницу кинотеатра {string}",
  async function (url) {
    try {
      await this.page.goto(url);
    } catch (error) {
      throw new Error(`Failed to navigate to ${url} with error: ${error}`);
    }
  }
);

Then(
  "пытается выбрать место, которое занято и получает результат",
  async function () {
    await this.page.waitForSelector(byuingSchema);
    const isTaken = await this.page.$eval(place, (el) =>
      el.classList.contains("buying-scheme__chair_taken")
    );
    let actual;
    if (isTaken) {
      actual = await getText(this.page, "div:nth-child(2) > p:nth-child(1)");
    } else {
      await clickElement(this.page, place);
    }
    const actualTrim = actual.trim();
    const expected = "Занято";
    expect(actualTrim).to.equal(expected);
  }
);