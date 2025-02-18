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
          cols="5"
          md="3"
        >
          <GameCard
            :title="item.title"
            :gameId="item.gameId"
            :priceInfo="item.priceInfo"
            :platforms="item.platforms"
            :url="item.priceInfo?.deals?.[0]?.url || 'none'"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import GameCard from "@/components/GameCard.vue";
import { FetchGames } from "../javascript/GameFunctions.js";

export default {
  components: { GameCard },
  data() {
    return {
      searchQuery: this.$route.query.q || "",
      games: [],
    };
  },
  watch: {
    '$route.query.q': {
      immediate: true,
      handler(query) {
        this.searchQuery = query || "";
        this.fetchGames(query);
      },
    },
  },
  methods: {
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          path: '/search-page',
          query: { q: this.searchQuery }
        }).then(() => {
          window.location.reload();
        });
        this.searchQuery = "";
      }
    },
    async fetchGames(query) {
      if (!query) {
        this.games = [];
        return;
      }
      try {
        this.games = await FetchGames(query);
        console.log("Spiele abgerufen:", this.games);
        // Mapping der Plattformen aus den priceInfo.deals
        this.games = this.games.map((item) => {
          const platforms = item.priceInfo.deals.map((deal) => deal.shop.name);
          return { ...item, platforms };
        });
      } catch (error) {
        console.error("Error fetching games:", error);
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

.searchonpage {
  margin-top: -2rem;
}
</style>
