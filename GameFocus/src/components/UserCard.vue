<template>
  <div class="search-page d-flex flex-column">
    <!-- Center-aligned heading -->

    <!-- Full-width banner image -->
    <!--<img src="@/assets/banner.png" alt="Banner" class="banner-image" />-->
    <h1> Your Bookmarks</h1>

    <!-- Bookmarks grid -->
    <v-container>
      <v-row dense justify="center">
        <v-col
          v-for="(item, index) in bookmarks"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <GameCard
            :gameId="item.gameId"
            :priceInfo="item.priceInfo"
            :platforms="item.platforms"
            :url="item.url"
            :drm="item.drm"
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
      gameIds: [],
    };
  },
  beforeMount() {
    if (localStorage.token != null) {
      this.fetchBookmarks();
    }
  },
  methods: {
    async fetchBookmarks() {
      await axios
        .get(
          "http://" +
          import.meta.env.VITE_SERVER_IP +
          ":" +
          import.meta.env.VITE_SERVER_PORT +
          "/bookmark/userbookmarks/" +
          localStorage.token
        )
        .then((response) => {
          this.gameIds = response.data.bookmarks;
          this.bookmarks = this.gameIds.map((id) => {
            return {
              gameId: id,
            };
          });
        })
        .catch((error) => {
          console.error("Error with getting bookmarks:", error);
        });
      const prices = await GetPrices(this.gameIds, this.bookmarks, this.bookmarks);
      console.log("Preise geladen:", prices);
      this.bookmarks = prices.map((item) => {
        const platforms = item.priceInfo.deals.map((deal) => deal.shop.name);
        return { ...item, platforms };
      });
    },
  },
};
</script>

<style>
.search-page {
  min-height: 100vh; /* Full-page height */
  padding: 2rem;
  color: white;
  text-align: center; /* Center all text */
}

h1 {
  margin-bottom: 1rem;
}
/* Banner styling */
.banner-image {
  width: 100%; /* Full width of the screen */
  height: auto; /* Maintain aspect ratio */
  margin-bottom: 2rem;
}

/* Card styling */
v-card {
  background-color: #1e1e1e;
  color: white;
  text-align: center; /* Center card content */
}

</style>
