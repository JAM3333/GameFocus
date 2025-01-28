<template>
  <v-container>
    <!-- Displaying the text dynamically based on the selected shopId -->
    <h2 class="my-4 text-center">Game Deals for {{ storeName }}</h2>

    <!-- Sale Items Loader and Error Handling -->
    <div v-if="error" class="text-center text-danger">{{ error }}</div>
    <div v-else-if="loading" class="text-center mt-4">Lade Angebote...</div>
    <div v-else-if="saleItems.length === 0" class="text-center mt-4">Keine Angebote verfügbar.</div>

    <v-row dense v-else>
      <v-col
        v-for="(item, index) in saleItems"
        :key="index"
        cols="4"
        md="3"
      >
        <GameCard
          :title="item.title"
          :gameId="item.gameId"
          :dealPrice="item.dealPrice"
          :url="item.url"
          :drm="item.drm"
          :discount="item.discount"
          :platforms="item.platforms"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import GameCard from "../components/GameCard.vue";
import {FetchDeals, GetPrices} from "../javascript/GameFunctions.js"; // Importiere die Funktion

export default {
  components: {
    GameCard,
  },
  data() {
    return {
      shopId: this.$route.query.shopId || 61,  // Default to Steam if no shopId is provided
      saleItems: [],  // Sale items state
      loading: false, // Loading state for sale items
      error: null,    // Error state for sale items
      storeName: "",  // Store name to display
      gameIds: [], // Game IDs to fetch prices
    };
  },
  watch: {
    // Watch for changes in the route's query parameters (shopId)
    "$route.query.shopId"(newShopId) {
      this.shopId = newShopId;  // Update the shopId dynamically
      this.loadSaleItems();  // Reload the data for the new store
      this.setStoreName(newShopId); // Update the store name based on the selected shopId
    },
  },
  methods: {
    // Method to fetch sale items
    async loadSaleItems() {
      console.log("Lade Angebote...");
      this.loading = true;
      this.error = null;

      try {
        const deals = await FetchDeals(32,undefined, this.shopId);  // Fetch deals from the selected store
        if (Array.isArray(deals) && deals.length > 0) {
          this.saleItems = deals;
          this.gameIds = this.saleItems.map(item => item.gameId); // Collect gameIds from sale items
          await this.loadPricesForSaleItems();
        } else {
          this.saleItems = [];
          this.error = "Keine Angebote gefunden.";
        }
      } catch (err) {
        this.error = "Fehler beim Laden der Angebote.";
        console.error("Fehler in loadSaleItems:", err);
      } finally {
        this.loading = false;
        console.log("Ladevorgang abgeschlossen.");
      }
    },

    // Method to load prices for sale items
    async loadPricesForSaleItems() {
      try {
        const prices = await GetPrices(this.gameIds, this.saleItems, this.saleItems);
        // Update the sale items with price info
        this.saleItems = prices.map((item) => {
          const platforms = item.priceInfo.deals.map((deal) => deal.shop.name);
          return { ...item, platforms };
        });
        console.log("Preise geladen:", this.saleItems);
      } catch (error) {
        console.error("Fehler beim Laden der Preise:", error);
      }
    },

    // Method to set the store name based on the shopId
    setStoreName(shopId) {
      const storeNames = {
        "16": "Epic Games",
        "35": "GOG",
        "27": "Game Planet",
        "61": "Steam",  // Default to Steam if no store is selected
      };
      this.storeName = storeNames[shopId] || "Unbekannter Shop";
    },
  },
  mounted() {
    this.loadSaleItems();  // Fetch initial sale items when the component mounts
    this.setStoreName(this.shopId);  // Set the store name initially based on the shopId
  },
};
</script>

<style>
/* Styles for the page */
.v-container {
  padding: 2rem;
  color: white;
}

h2 {
  margin-bottom: 2rem;
}

.game-image {
  max-height: 200px;
  object-fit: cover;
}

v-card {
  background-color: #1e1e1e;
  color: white;
}
</style>
