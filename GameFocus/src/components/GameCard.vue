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
          {{ priceInfo.deals[0]?.price?.amount + "€"}}
          <!-- Check for the currency symbol, default to € if not found -->
        </span>
        <!-- Fallback message if no valid price is found -->
        <span v-else class="price">{{ dealPrice + "€" || 'Price not available' }} </span>
      </div>
    </v-card-subtitle>

    <v-card-actions class="platform-section">
      <div v-for="(platformLogo, index) in platforms" :key="index" class="platform-item">
        <v-img
          :src="platformLogo.logo"
          class="platform-logo"
          contain
        ></v-img>
        <span class="platform-name">{{ platformLogo.name }}</span>
      </div>
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
        deals: [{ price: { amount: "no price found"} }],
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
          // Check if the response has the expected data structure
          console.log("API Response:", response);
          const gameInfo = response?.data;  // Ensure response.data exists

          if (gameInfo && gameInfo.assets) {
            this.image = gameInfo.assets["banner400"] || this.defaultImage;
            console.log("Game Info:", gameInfo);

            // Check if drm exists and is an array before using map
            if (Array.isArray(gameInfo.drm)) {
              this.platforms = gameInfo.drm.map((drm) => this.getPlatformInfo(drm));
            } else {
              this.platforms = [];  // Fallback if drm is not an array
            }
          } else {
            console.error("No game info found in the response.");
          }
        })
        .catch((error) => {
          console.error(`Error fetching game info: ${this.gameId}`, error);
        });
    },
    getPlatformInfo(platformName) {
      const platformDetails = {
        Steam: {
          logo: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
          name: "Steam",
        },
        Epic: {
          logo: "https://upload.wikimedia.org/wikipedia/commons/6/63/Epic_Games_logo.svg",
          name: "Epic Games",
        },
        // Add more platforms if needed
      };
      return platformDetails[platformName] || { logo: "https://via.placeholder.com/24", name: "Unknown Platform" };
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
  flex-wrap: wrap;
  gap: 10px;
}

.platform-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.platform-logo {
  width: 24px;
  height: 24px;
}

.platform-name {
  font-size: 0.9rem;
  font-weight: bold;
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
