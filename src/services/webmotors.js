import puppeteer from "puppeteer";
import { delay } from "../shared/utils/delay.js";

const getAds = async () => {
  console.warn("🌱 [Webmotors] Buscando novos anúncios...");

  const browser = await puppeteer.launch({
    userDataDir: './profile',
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.mouse.wheel({ deltaY: 500 });

  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel({ deltaY: 400 });
      await delay(500);
  }

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  const BASE_URL = "https://www.webmotors.com.br/carros/sp/mitsubishi/lancer/precoate.100000?autocomplete=lancer&autocompleteTerm=MITSUBISHI%20LANCER&lkid=1705&tipoveiculo=carros&estadocidade=S%C3%A3o%20Paulo&marca1=MITSUBISHI&modelo1=LANCER&kmde=5000&kmate=95000&anunciante=Pessoa%20F%C3%ADsica&media=com%20fotos&page=1&precoate=100000";

  let allAds = [];

  console.warn(`➡️ [Webmotors] Página ${1}`);

  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  await delay(5000);

  const hasAds = await page.$("div._Container_7gkc4_1");
  if (!hasAds) return [];

  const ads = await page.evaluate(() => {
    const mainList = document.querySelector("main.search-result_Container__zDYhq")
    if (!mainList) return [];

    const sections = document.querySelectorAll("._Container_7gkc4_1");
    const result = [];

    sections.forEach(section => {
      const link = section.querySelector("a")?.href;
      const imageUrl = section.querySelector("img")?.src;
      const title = section.querySelector("h2")?.textContent + " " + section.querySelector("h3")?.textContent;

      const priceElement = [...section.querySelectorAll('p')]
        .find(el => el.innerText.includes('R$'));

      const price = priceElement?.innerText;
      
      const kmAndLocation = section.querySelectorAll('p._body-regular-small_qtpsh_152');
      
      const km = kmAndLocation[1]?.innerText;
      const location = kmAndLocation[2]?.innerText;

      result.push({
        imageUrl,
        link,
        title,
        km,
        price,
        site: "Webmotors",
        location: location ?? "Não encontrado",
      });
    });

    return result;
  });

  if (ads.length == 0) {
    console.warn("❌ Acabaram os anúncios!")
  }

  console.warn(`📄 ${ads.length} anúncios encontrados`);

  allAds.push(...ads);

  console.warn(`✅ Total de anúncios coletados: ${allAds.length}`);

  await browser.close();

  return allAds
}

export const webmotorsService = {
  getAds
}
