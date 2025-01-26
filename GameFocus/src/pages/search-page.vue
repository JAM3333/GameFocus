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
            :platforms="item.platforms"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import GameCard from "@/components/GameCard.vue";
import axios from "axios";
import { FetchGames } from "../javascript/GameFunctions.js"; // Import the function

export default {
  components: {GameCard},
  data() {
    return {
      searchQuery: this.$route.query.q || "",
      games: [],
      gameIds: [],
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
        this.$router.push({path: '/search-page', query: {q: this.searchQuery}});
        this.searchQuery = "";
      }
    },
    async fetchGames(query) {
      this.games = await FetchGames(query)
      this.games = this.games.map((item) => {
        const platforms = item.priceInfo.deals.map((deal) => deal.shop.name);
        return { ...item, platforms };
      });
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
