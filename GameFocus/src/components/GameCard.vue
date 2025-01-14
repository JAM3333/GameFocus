<template>
  <v-card outlined class="game-card">
    <v-img
      width="15vw"
      height="25vh"
      cover
      v-if="image === ''"
      :src="defaultImage"
    ></v-img>
    <v-img
      :src="image"
      aspect-ratio="16/9"
      class="mb-image"
    ></v-img>

    <v-card-title class="text-h6">{{ title }}</v-card-title>

    <v-card-subtitle>
      <div class="price-section">
        <!-- Check if price is available and not equal to 'no price found' -->
        <span v-if="priceInfo?.deals?.length > 0 && priceInfo.deals[0]?.price?.amount !== 'no price found'" class="price">
          {{ priceInfo.deals[0]?.price?.amount }}
          <!-- Check for the currency symbol, default to € if not found -->
          {{ priceInfo.deals[0]?.price?.currency || '€' }}
        </span>
        <!-- Fallback message if no valid price is found -->
        <span v-else class="price">{{ dealPrice || 'Price not available' }}</span>
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
      required: true,
    },
    dealPrice: {
      type: String,
      required: false,
      default: "Price not found",
    },
    priceInfo: {
      type: Object,
      required: false,
      default: () => ({
        deals: [{ price: { amount: "no price found", currency: "€" } }],
      }),
    },
    url: {
      type: String,
      required: false,
      default: "abc",
    },
    drm: {
      type: String,
      required: false,
      default: "Steam",
    },
  },
  data() {
    return {
      image: "",
      platforms: [],
      defaultImage: "https://www.freeiconspng.com/uploads/no-image-icon-11.PNG",
    };
  },
  methods: {
    fetchGameInfo() {
      axios
        .get(
          `https://api.isthereanydeal.com/games/info/v2?key=${import.meta.env.VITE_API_KEY}&id=${this.gameId}`
        )
        .then((response) => {
          const gameInfo = response.data;
          console.log(gameInfo);  // Debug to check if currency data is present
          if (gameInfo) {
            this.image = gameInfo.assets["banner400"] || this.defaultImage;
            // Check if drm exists and is an array before using map
            if (Array.isArray(gameInfo.drm)) {
              this.platforms = gameInfo.drm.map((drm) => this.getPlatformLogo(drm));
            } else {
              this.platforms = [];  // Fallback if drm is not an array
            }
          }
        })
        .catch((error) => {
          console.error(`Error fetching game info: ${this.gameId}`, error);
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

.mb-image {
  object-fit: contain;
  width: 100%;
  height: 140px;
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
