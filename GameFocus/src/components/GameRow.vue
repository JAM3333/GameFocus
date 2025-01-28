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
import { FetchDeals } from "../javascript/GameFunctions.js";
import { GetPrices } from "../javascript/GameFunctions.js";

export default {
  components: {
    GameCard,
  },
  data() {
    return {
      saleItems: [],
      loading: false,
      error: null,
      gameIds: [],
      currentPage: 1,
      allGamesLoaded: false,
    };
  },
  methods: {
    // Method to fetch sale items
    async loadSaleItems() {
      if (this.loading || this.allGamesLoaded) return;

      console.log("Lade Angebote...");
      this.loading = true;
      this.error = null;

      try {
        const deals = await FetchDeals(16, this.currentPage);
        console.log("Geladene Spiele von FetchDeals:", deals);

        if (Array.isArray(deals) && deals.length > 0) {
          // Append new deals to the existing sale items
          this.saleItems = [...this.saleItems, ...deals];
          this.gameIds = this.saleItems.map((item) => item.gameId);

          await this.loadPricesForSaleItems();

          this.currentPage++;
        } else {
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

    async loadPricesForSaleItems() {
      try {
        const prices = await GetPrices(this.gameIds, this.saleItems, this.saleItems);
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
