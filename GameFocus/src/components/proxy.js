const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// Proxy route
app.get("/api/game-info", async (req, res) => {
  const { ids } = req.query;
  const apiUrl = `https://api.isthereanydeal.com/games/info/v2?key=dd75473a9cfd957ec7b3a9f623e67a844a4348f5&ids=${ids}`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data); // Forward the API response to the client
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Start the server
app.listen(5000, () => console.log("Proxy server running on port 5000"));
