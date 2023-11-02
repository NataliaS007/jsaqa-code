const { clickElement, putText, getText } = require("./lib/commands.js");
const { generateName } = require("./lib/util.js");

let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
});

afterEach(() => {
  page.close();
});

describe("Netology.ru tests", () => {
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("https://netology.ru");
  });

  test("The first test'", async () => {
    const title = await page.title();
    console.log("Page title: " + title);
    await clickElement(page, "header a + a");
    const title2 = await page.title();
    console.log("Page title: " + title2);
    const pageList = await browser.newPage();
    await pageList.goto("https://netology.ru/navigation");
    await pageList.waitForSelector("h1");
  });

  test("The first link text 'Медиа Нетологии'", async () => {
    const actual = await getText(page, "header a + a");
    expect(actual).toContain("Медиа Нетологии");
  });

  test("The first link leads on 'Медиа' page", async () => {
    await clickElement(page, "header a + a");
    const actual = await getText(page, ".logo__media");
    await expect(actual).toContain("Медиа");
  });
});

test("Should look for a course", async () => {
  await page.goto("https://netology.ru/navigation");
  await putText(page, "input", "тестировщик");
  const actualOriginal = await page.$eval("a[data-name]", (link) => link.textContent);
  const actual = actualOriginal.trim();
  const expected = "ПрофессияГрафический дизайнер: расширенный курс20 месяцевстарт 18 октября";
  expect(actual).toContain(expected);
});

test("Should show warning if login is not email", async () => {
  await page.goto("https://netology.ru/?modal=sign_in");
  await putText(page, 'input[type="email"]', generateName(5));
});

describe.only("Go to movies tests", () => {
  beforeEach(async () => {
    await page.goto("https://qamid.tmweb.ru/");
  });

  test("Go to Zveropolis on next day", async () => {
    await clickElement(page, "a:nth-child(2)");
    await clickElement(page, ".movie-seances__hall a");
    const byuingSchema = "div.buying-scheme";
    await page.waitForSelector(byuingSchema);
    const place = ".buying-scheme__wrapper > :nth-child(3) > :nth-child(6)";
    await clickElement(page, place);
    await clickElement(page, "button");
    const result = "h2";
    await page.waitForSelector(result);
    await getText(page, `div > p:nth-child(1) > span`);
    const numberOfparagraph = 6;
    let resultText = [];
    for (let i = 1; i < numberOfparagraph; i++) {
      try {
        let text = await getText(page, `div > p:nth-child(${i}) > span`);
        resultText.push(text);
      } catch (e) {
        console.error(`Error while getting text for paragraph ${i}`, e);
      }
    }
    const actual = resultText;
    const expected = ["Зверополис", "3/6", "Зал 2", "20-10-2023", "11:00"];
    expect(actual).toEqual(expected);
  }, 50000);

  test("ElectroTicket title", async () => {
    await clickElement(page, "a:nth-child(3)");
    await clickElement(page, "div:nth-child(3) a");
    const byuingSchema = "div.buying-scheme";
    await page.waitForSelector(byuingSchema);
    const place = ".buying-scheme__wrapper > :nth-child(2) > :nth-child(4)";
    await clickElement(page, place);
    await clickElement(page, "button");
    const result = "h2";
    await page.waitForSelector(result);
    await clickElement(page, "button");
    const electroTicket = "h2";
    await page.waitForSelector(electroTicket);
    await page.waitForTimeout(1000);
    const actual = await getText(page, electroTicket);
    const expected = "Электронный билет";
    expect(actual).toEqual(expected);
  }, 50000);

  test("Reservation of unavailable space", async () => {
    await clickElement(page, "a:nth-child(4)");
    await clickElement(page, "div:nth-child(3) a");
    const byuingSchema = "div.buying-scheme";
    await page.waitForSelector(byuingSchema);
    const place = ".buying-scheme__wrapper > :nth-child(8) > :nth-child(3)";
    await clickElement(page, place);
    await clickElement(page, "button");
    const result = "h2";
    await page.waitForSelector(result);
    await clickElement(page, "button");
    const electroTicket = "h2";
    await page.waitForSelector(electroTicket);
    await page.goto("https://qamid.tmweb.ru/");
    await clickElement(page, "a:nth-child(4)");
    await clickElement(page, "div:nth-child(3) a");
    await page.waitForSelector(byuingSchema);
    const isTaken = await page.$eval(place, (el) =>
      el.classList.contains("buying-scheme__chair_taken")
    );
    let actual;
    if (isTaken) {
      actual = await getText(page, "div:nth-child(2) > p:nth-child(1)");
    } else {
      await clickElement(page, place);
    }
    const actualTrim = actual.trim();
    const expected = "Занято";
    expect(actualTrim).toEqual(expected);
  }, 60000);
});