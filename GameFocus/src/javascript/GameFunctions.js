import axios from "axios";

export default async function GetPrices(gameIds,games,tempgames) {
  try {
    const response = await axios.post(
      `https://api.isthereanydeal.com/games/prices/v3?key=${import.meta.env.VITE_API_KEY}&country=de`,
      JSON.stringify(this.gameIds),
    );

    const prices = response.data;

    tempgames = tempgames.map(game => {
      const priceInfo = prices.find(item => item.id === game.gameId); // Finde das passende Objekt
      game.priceInfo = priceInfo || { historyLow: {}, deals: [], id: game.gameId } // Füge das ganze Objekt hinzu
      return game;
    });
    // Update the games array reactively by setting it to tempgames
    games = [...tempgames]; // This triggers a reactivity update
    console.log(tempgames)
  } catch (error) {
    console.error("Error fetching prices:", error);
  }
},

}
