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
export async function FetchDeals(limit, offset=0, shop) {
  try {
    let url = `https://api.isthereanydeal.com/deals/v2?key=${import.meta.env.VITE_API_KEY}&limit=${limit}&offset=${offset}&sort=trending&mature=false`;

    if (shop !== undefined) {
      url += `&shops=${shop}`;
    }

    const response = await axios.get(url);

    // Process the data
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
export async function FetchGameInfo(gameId) {
  try {
    const response = await axios.get(
      `https://api.isthereanydeal.com/games/info/v2?key=${import.meta.env.VITE_API_KEY}&id=${gameId}`
    );
    const gameInfo = response.data; // Access game-specific data
    return gameInfo || {};
  } catch (error) {
    console.error(`Error fetching game info for gameId: ${gameId}`, error);
    return {};
  }
}
export async function FetchGames(query) {
  try {
    let games = [];
    let gameIds = [];

    const response = await fetch(`https://api.isthereanydeal.com/games/search/v1?key=${import.meta.env.VITE_API_KEY}&title=${query}&results=64`);
    const data = await response.json();


    let tempgames = data.map(game => ({
      title: game.title || 'Unknown Title',
      gameId: game.id,
      priceInfo: null,
    }));

    gameIds = tempgames.map(game => game.gameId);


    games = await GetPrices(gameIds, games, tempgames);
    return games;
  } catch (error) {
    console.error("Error fetching games:", error);
  }
}

