<template>
  <div class="search-page">
    <h1>Results for "{{ $route.query.q }}"</h1>
    <v-container>
      <v-text-field
        class="searchonpage"
        label="Search for Games"
        outlined
        v-model="searchQuery"
        @keyup.enter="performSearch"
      ></v-text-field>
    </v-container>
    <v-container>
      <v-row dense>
        <v-col
          v-for="(item, index) in games"
          :key="index"
          cols="4"
          md="3"
        >
          <GameCard
            :title="item.title"
            :gameId="item.gameId"
            :priceInfo="item.priceInfo"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import GameCard from "@/components/GameCard.vue";
import axios from "axios";

export default {
  components: { GameCard },
  data() {
    return {
      searchQuery: this.$route.query.q || "",
      games: [],
      gameIds: [],
      tempgames: [],
    };
  },
  watch: {
    '$route.query.q': {
      immediate: true,
      handler(query) {
        this.fetchGames(query);
      },
    },
  },
  methods: {
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({ path: '/search-page', query: { q: this.searchQuery } });
        this.searchQuery = "";
      }
    },
    async fetchGames(query) {
      try {
        this.games = [];
        this.gameIds = [];

        const response = await fetch(`https://api.isthereanydeal.com/games/search/v1?key=${import.meta.env.VITE_API_KEY}&title=${query}`);
        const data = await response.json();


        // Map API response to games array
        this.tempgames = data.map(game => ({
          title: game.title || 'Unknown Title',
          gameId: game.id,
          priceInfo: null,
        }));

        // Game IDs in array schreiben
        this.gameIds = this.tempgames.map(game => game.gameId);

        // Preise für die Spiele abrufen
        await this.GetPrices(this.gameIds);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    },

    async GetPrices(gameIds) {
      try {
        const response = await axios.post(
          `https://api.isthereanydeal.com/games/prices/v3?key=${import.meta.env.VITE_API_KEY}&country=de`,
          JSON.stringify(this.gameIds),
        );

        const prices = response.data;
        console.log(this.tempgames);

        this.tempgames = this.tempgames.map(game => {
          const priceInfo = prices.find(item => item.id === game.gameId); // Finde das passende Objekt
          game.priceInfo = priceInfo || { historyLow: {}, deals: [], id: game.gameId } // Füge das ganze Objekt hinzu
          return game;
        });
        // Update the games array reactively by setting it to tempgames
        this.games = [...this.tempgames]; // This triggers a reactivity update
        console.log(this.tempgames)
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    },
  },
};
</script>

<style>
.search-page {
  padding: 2rem;
  color: white;
}

h1 {
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

.searchonpage{
  margin-top: -2rem;
}
</style>
