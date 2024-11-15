<template>
  <v-app>
    <v-container>
      <v-card class="pa-5">
        <v-card-title>
          <v-text-field
            v-model="searchQuery"
            label="Search for a game"
            outlined
            dense
            class="mr-3"
          ></v-text-field>
          <v-btn color="primary" @click="fetchGames">Refresh Games</v-btn>
        </v-card-title>

        <v-card-text v-if="loading">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-card-text>

        <v-card-text v-if="games.length > 0 && !loading">
          <v-row>
            <v-col
              v-for="game in filteredGames"
              :key="game.appid"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card outlined>
                <v-card-title>{{ game.name }}</v-card-title>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text v-else-if="!loading">
          <p>No games found. Try refreshing or searching for a different game.</p>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      games: [],
      loading: false,
      searchQuery: "",
    };
  },
  computed: {
    filteredGames() {
      if (!this.searchQuery) {
        return this.games;
      }
      return this.games.filter((game) =>
        game.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchGames() {
      this.loading = true;
      try {
        const response = await axios.get("http://localhost:3001/steam-apps");
this.games = response.data.applist.apps || [];
      } catch (err) {
        console.error("Failed to fetch games:", err.message);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchGames();
  },
};
</script>

<style>
/* Optional: Add styles to enhance UI */
</style>
