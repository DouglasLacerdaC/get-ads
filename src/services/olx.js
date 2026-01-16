import puppeteer from "puppeteer";
import { delay } from "../shared/utils/delay.js";

const getAds = async () => {
  console.warn("🌱 [OLX] Buscando novos anúncios...");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36");

  const BASE_URL = "https://www.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios/mitsubishi/lancer/estado-sp?f=p&me=120000";

  let pageNumber = 1;
  let allAds = [];

  while (true) {
    const url = `${BASE_URL}&o=${pageNumber}`;
    console.warn(`➡️ [OLX] Página ${pageNumber}`);

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await delay(5000);

    // tenta aguardar anúncios, se não aparecer, acaba
    const hasAds = await page.$("section.olx-adcard");
    if (!hasAds) break;

    const ads = await page.evaluate(() => {
      const mainList = document.querySelector(".AdListing_adListContainer__ALQla")
      if (!mainList) return [];

      const sections = mainList.querySelectorAll("section.olx-adcard");
      const result = [];

      sections.forEach(section => {
        const link = section.querySelector("a.olx-adcard__link")?.href;
        const imageUrl = section.querySelector("picture source")?.srcset;
        const title = section.querySelector("h2.olx-adcard__title")?.innerText;
        const km = section.querySelector('[aria-label*="quilômetro"]')?.innerText;
        const price = section.querySelector("h3.olx-adcard__price")?.innerText;
        const location = section.querySelector(".olx-adcard__bottombody p.olx-adcard__location")?.innerText;

        result.push({
          imageUrl,
          link,
          title,
          km,
          price,
          site: "OLX",
          location: location ?? "Não encontrado",
        });
      });

      return result;
    });

    if (ads.length == 0) {
      console.warn("❌ Acabaram os anúncios!")
      break
    }

    console.warn(`📄 ${ads.length} anúncios encontrados`);

    allAds.push(...ads);

    pageNumber++;
    await delay(3000);
  }

  console.warn(`✅ Total de anúncios coletados: ${allAds.length}`);

  await browser.close();

  return allAds
}

export const olxService = {
  getAds
}
