<template>
    <v-card outlined class="game-card">
      <v-img
        :src="image"
        aspect-ratio="16/9"
        class="mb-2"
        height=""
      ></v-img>
  
      <v-card-title class="text-h6">{{ title }}</v-card-title>
  
      <v-card-subtitle>
        <div class="price-section">
          <span class="price">{{ dealPrice === 0 ? "FREE" : `$${dealPrice}` }}</span>
        </div>
      </v-card-subtitle>
  
      <v-card-actions class="platform-section">
        <v-img
          v-for="(platformLogo, index) in platforms"
          :key="index"
          :src="platformLogo"
          class="platform-logo"
          contain
        ></v-img>
      </v-card-actions>
  
      <!-- Bookmark Icon -->
      <v-btn icon class="bookmark-btn">
        <v-icon>mdi-bookmark</v-icon>
      </v-btn>
    </v-card>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
      gameId: {
        type: String,
        requirded: true,
      },
      dealPrice: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      drm: {
        type: String,
        required: false,
        default: "Steam",
      },
    },
    data() {
      return {
        image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/ss_796601d9d67faf53486eeb26d0724347cea67ddc.600x338.jpg?t=1729703045",
        platforms: [],
      };
    },
    methods: {
      fetchGameInfo() {
        axios
          .get(`https://api.isthereanydeal.com/games/info/v2?key=${import.meta.env.VITE_API_KEY}&id=${this.gameId}`)
          .then((response) => {
            const gameInfo = response.data;
            if (gameInfo) {
              console.log(gameInfo.drm)
              this.image = gameInfo.assets["banner400"] || this.image;
              this.platforms = gameInfo.drm.map((drm) => this.getPlatformLogo(drm));
            }
          })
          .catch((error) => {
            console.error(`Error fetching game info: https://api.isthereanydeal.com/games/info/v2?key=${import.meta.env.VITE_API_KEY}&id=${this.gameId}`, error);
          });
      },
      getPlatformLogo(platformName) {
        const platformLogos = {
          Steam: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
          Epic: "https://upload.wikimedia.org/wikipedia/commons/6/63/Epic_Games_logo.svg",
        };
        return platformLogos[platformName] || "https://via.placeholder.com/24";
      },
    },
    mounted() {
      this.fetchGameInfo();
    },
  };
  </script>
  
  <style scoped>
  .game-card {
    position: relative;
  }
  
  .platform-section {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
  }
  
  .platform-logo {
    width: 24px;
    height: 24px;
  }
  
  .price {
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  .bookmark-btn {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  </style>
  