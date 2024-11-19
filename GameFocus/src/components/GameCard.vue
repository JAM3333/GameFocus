<template>
    <v-card outlined class="game-card">
      <!-- Game Image -->
      <v-img
        :src="image"
        aspect-ratio="16/9"
        class="mb-2"
      ></v-img>
  
      <!-- Game Title -->
      <v-card-title class="text-h6">{{ title }}</v-card-title>
  
      <!-- Price and DRM Details -->
      <v-card-subtitle>
        <div class="price-section">
          <span class="price">{{ dealPrice === 0 ? "FREE" : `$${dealPrice}` }}</span>
        </div>
      </v-card-subtitle>
  
      <!-- Platform Logos -->
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
        image: "https://via.placeholder.com/300x169.png?text=Game+Image",
        platforms: [],
      };
    },
    methods: {
      fetchGameInfo() {
        axios
          .get(`https://api.isthereanydeal.com/games/info/v2?key=${import.meta.env.VITE_API_KEY}&ids=${this.title}`)
          .then((response) => {
            const gameInfo = response.data.data[this.title];
            if (gameInfo) {
              this.image = gameInfo.image || this.image;
  
              this.platforms = gameInfo.drm.map((drm) => this.getPlatformLogo(drm));
            }
          })
          .catch((error) => {
            console.error("Error fetching game info:", error);
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
  