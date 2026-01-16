import axios from "axios";
import 'dotenv/config';

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK

const sendAD = async (details) => {
  const sideColors = {
    OLX: parseInt("6e0ad6", 16),
    Webmotors: parseInt("f3123c", 16)
  }

  await axios.post(WEBHOOK_URL, {
      "username": "OLX Carros",
      "avatar_url": "https://i.imgur.com/6RLbJ5f.png",
      "embeds": [
        {
          "title": `[${details.site}] ${details.title}`,
          "url": details.link,
          "color": sideColors[details.site],
          "image": {
            "url": details.imageUrl
          },
          "fields": [
            {
              "name": "🛣️ Quilometragem",
              "value": details.km,
            },
            {
              "name": "💰 Preço",
              "value": details.price,
            },
            {
              "name": "📍 Localização",
              "value": details.location,
            },
          ],
          "timestamp": new Date().toISOString()
        }
      ]
    }
  );
};

export const discordService = {
  sendAD
};
