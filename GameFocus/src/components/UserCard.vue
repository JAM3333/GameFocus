<template>
  <div class="search-page">
    <h1>Welcome to GameFocus {{ username }}</h1>
    <a
      target="_blank"
      rel="noopener noreferrer"
      class="buy-btn"
    >
      Buy Now
    </a>
    <v-container>
    </v-container>
    <v-container>
      <v-row dense>
        <v-col
          v-for="(item, index) in bookmarks"
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
import {GetPrices} from "@/javascript/GameFunctions";

export default {
  components: { GameCard },
  data() {
    return {
      username: "",
      bookmarks: [],
    };
  },
  beforeMount() {
    if (localStorage.token != null) {
      this.fetchBookmarks()
    }
  },
  methods: {
    async fetchBookmarks(query) {
      await axios.get("http://" + import.meta.env.VITE_SERVER_IP + ":" + import.meta.env.VITE_SERVER_PORT + "/bookmark/userbookmarks/" + localStorage.token)
        .then((response) => {
          console.log("answer from server:", response.data);
          this.bookmarks = response.data.bookmarks;
        })
        .catch((error) => {
          this.generalError = error.response.data.message;
          console.error("Error with getting bookmarks:", error);
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
