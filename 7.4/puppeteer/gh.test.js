let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto("https://github.com/team");
});

afterEach(() => {
  page.close();
});

describe("Github page tests", () => {
  test("The h1 header content", async () => {
    const firstLink = await page.$("header div div a");
    await firstLink.click();
    await page.waitForSelector('h1');
    const title2 = await page.title();
    expect(title2).toEqual('GitHub for teams · Build like the best teams on the planet · GitHub', {timeout: 60000});
  });

  test("The first link attribute", async () => {
    const actual = await page.$eval("a", link => link.getAttribute('href') );
    expect(actual).toEqual("#start-of-content", {timeout: 6000});
  });

  test("The page contains Sign in button", async () => {
    const btnSelector = ".btn-large-mktg.btn-mktg";
    await page.waitForSelector(btnSelector, {
      visible: true,
    });
    const actual = await page.$eval(btnSelector, link => link.textContent);
    expect(actual).toContain("Get started with Team", {timeout: 6000});
  });
});

  describe("Should check titles for GitHub pages", () => {
    test("Should check Pricing page", async () => {
      await page.goto("https://github.com/pricing");
      const title = await page.title();
      expect(title).toContain("Pricing · Plans for every developer · GitHub")
    }, 6000);

    test("Should check Enterprise page", async () => {
      await page.goto("https://github.com/enterprise");
      const title = await page.title();
      expect(title).toContain("Enterprise · A smarter way to work together · GitHub")
    }, 6000);

    test("Should check Features page", async () => {
      await page.goto("https://github.com");
      const featSel = "body > div.logged-out.env-production.page-responsive > footer > div.container-xl.p-responsive > div > div.col-6.col-sm-3.col-lg-2.mb-6.mb-md-2.pr-3.pr-lg-0.pl-lg-4 > ul > li:nth-child(1) > a";
      await page.waitForSelector(featSel);
      await page.click(featSel);
      await page.waitForTimeout(6000);
      const title = await page.title();
      expect(title).toContain("Features | GitHub · GitHub");
  }, 60000);

    test("Should chek Features page title text", async() => {
      await page.goto("https://github.com");
      const featSel = "body > div.logged-out.env-production.page-responsive > footer > div.container-xl.p-responsive > div > div.col-6.col-sm-3.col-lg-2.mb-6.mb-md-2.pr-3.pr-lg-0.pl-lg-4 > ul > li:nth-child(1) > a";
      await page.waitForSelector(featSel);
      await page.click(featSel);
      await page.waitForTimeout(6000);
      const title1 = await page.$eval(`h1.h1-mktg`,link => link.textContent);
      expect(title1).toEqual("The tools you need to build what you want.");
    }, 60000);
  })
