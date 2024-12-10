<template>
  <div class="search-page">
    <h1>Results for "{{ $route.query.q }}"</h1>
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
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import GameCard from "@/components/GameCard.vue";

export default {
  components: {GameCard},
  data() {
    return {
      games: [],
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
    async fetchGames(query) {
      try {
        const response = await fetch(`https://api.isthereanydeal.com/games/search/v1?key=${import.meta.env.VITE_API_KEY}&title=${query}`);
        const data = await response.json();
        console.log(data)

        // Map API response to games array
        this.games = data.map(game => ({
          title: game.title || 'Unknown Title',
          gameId: game.id,
        }));
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
</style>
