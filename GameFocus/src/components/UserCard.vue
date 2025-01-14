<template>
  <div class="search-page">
    <h1>Welcome to GameFocus {{ username }}</h1>
    <v-container>
    </v-container>
    <v-container>
      <v-row dense>

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
      username: "",
      bookmarks: [],
    };
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
