<template>
  <div class="search-page d-flex flex-column">
    <!-- Center-aligned heading -->

    <!-- Full-width banner image -->
    <!--<img src="@/assets/banner.png" alt="Banner" class="banner-image" />-->
    <p>Welcome back {{username}}</p>
    <h1>Your Bookmarks</h1>

    <!-- Bookmarks grid -->
    <v-container class="container">
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
  props: {
    username: {
      type: String,
      required: false,
      default: "",
    },
  },
  components: { GameCard },
  data() {
    return {
      bookmarks: [],
      gameIds: [],
    };
  },
  beforeMount() {
    if (localStorage.token != null) {
      console.log(this.username);
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

<style :scoped>
.search-page {
  min-height: 100vh; /* Full-page height */
  padding: 2rem;
  color: white;
  text-align: center; /* Center all text */
}

.search-page::after {
  content: "";
  position: absolute;
  z-index: -1;
  bottom: 0;
  right: 0;
  width: 100%; /* Covers the entire card */
  height: 100%; /* Covers the entire card */
  background: radial-gradient(
    circle at bottom right,
    rgba(41, 41, 41, 0.8),
    rgba(0, 0, 0, 0) 70%
  );
  z-index: 0; /* Places it below the content */
  pointer-events: none; /* Ensures it doesn’t interfere with interactions */
}


.container {
  border-top: solid 1px grey;
  padding: 10px;
  z-index: 2;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%; /* Adjust as needed for your card's layout */
  font-size: 0.9rem;
  font-weight: bold;
  color: #757575; /* Optional: Customize the color */
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
