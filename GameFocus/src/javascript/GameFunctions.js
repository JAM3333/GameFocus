import axios from "axios";

export async function GetPrices(gameIds,games,tempgames) {
  try {

    const response = await axios.post(
      `https://api.isthereanydeal.com/games/prices/v3?key=${import.meta.env.VITE_API_KEY}&country=de`,
      JSON.stringify(gameIds),
    );

    const prices = response.data;

    tempgames = tempgames.map(game => {
      const priceInfo = prices.find(item => item.id === game.gameId); // Finde das passende Objekt
      game.priceInfo = priceInfo || { historyLow: {}, deals: [], id: game.gameId } // Füge das ganze Objekt hinzu
      return game;
    });
    // Update the games array reactively by setting it to tempgames
    games = [...tempgames]; // This triggers a reactivity update
    return games;
  } catch (error) {
    console.error("Error fetching prices:", error);
    return [];
  }
}
export async function FetchDeals(limit) {
  try {
    const response = await axios.get(
      `https://api.isthereanydeal.com/deals/v2?key=${import.meta.env.VITE_API_KEY}&limit=${limit}`
    );

    // Verarbeiten der Daten
    const items = response.data.list;
    const saleItems = items.map((item) => ({
      title: item.title,
      gameId: item.id,
      dealPrice: item.deal.price.amount.toFixed(2),
      regularPrice: item.deal.regular.amount.toFixed(2),
      discount: item.deal.cut,
      shop: item.deal.shop.name,
      url: item.deal.url,
      drm: item.deal.drm.map((drm) => drm.name).join(", "),
      platform: item.deal.platforms.map((platform) => platform.name).join(", "),
    }));

    console.log("Verarbeitete Daten:", saleItems);
    return saleItems;
  } catch (error) {
    console.error("Failed to fetch sale items:", error);
    return [];
  }
}

