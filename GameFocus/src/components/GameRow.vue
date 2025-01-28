<template>
  <v-container>
    <h2 class="my-4 text-center">On Sale</h2>
    <!-- Sale Items Loader and Error Handling -->
    <div v-if="error" class="text-center text-danger">{{ error }}</div>
    <div v-else-if="loading && saleItems.length === 0" class="text-center mt-4">Lade Angebote...</div>
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
          :discount="item.discount"
          :platforms="item.platforms"
          :url="item.url"
          :drm="item.drm"
        />
      </v-col>
    </v-row>

    <!-- Loader for infinite scroll -->
    <div v-if="loading && saleItems.length > 0" class="text-center mt-4">Lade weitere Angebote...</div>
  </v-container>
</template>

<script>
import axios from "axios";
import GameCard from "./GameCard.vue";
import { FetchDeals } from "../javascript/GameFunctions.js"; // Import the function
import { GetPrices } from "../javascript/GameFunctions.js"; // Import the function for prices

export default {
  components: {
    GameCard,
  },
  data() {
    return {
      saleItems: [], // Sale items state
      loading: false, // Loading state for sale items
      error: null, // Error state for sale items
      gameIds: [], // Game IDs to fetch prices
      currentPage: 1, // Current page for pagination
      allGamesLoaded: false, // Track if all games have been loaded
    };
  },
  methods: {
    // Method to fetch sale items
    async loadSaleItems() {
      if (this.loading || this.allGamesLoaded) return; // Prevent multiple requests if already loading or all games are loaded

      console.log("Lade Angebote...");
      this.loading = true;
      this.error = null;

      try {
        // Fetch sale items from API with pagination
        const deals = await FetchDeals(16, this.currentPage); // Fetch 16 items per page
        console.log("Geladene Spiele von FetchDeals:", deals);

        if (Array.isArray(deals) && deals.length > 0) {
          // Append new deals to the existing sale items
          this.saleItems = [...this.saleItems, ...deals];
          this.gameIds = this.saleItems.map((item) => item.gameId); // Collect gameIds from sale items

          // Fetch prices for the newly fetched sale items
          await this.loadPricesForSaleItems();

          // Increment the page number for the next fetch
          this.currentPage++;
        } else {
          // Mark all games as loaded if no more deals are returned
          this.allGamesLoaded = true;
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
          return {...item, platforms};
        });
        console.log("Preise geladen:", this.saleItems);
      } catch (error) {
        console.error("Fehler beim Laden der Preise:", error);
      }
    },

    onScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if ((scrollTop + clientHeight) / scrollHeight == 1) {
        this.loadSaleItems();
      }
    },
  },
  mounted() {
    this.loadSaleItems();
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
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
