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

    <v-card-title v-if="title!==''" class="text-h6">{{ title }}</v-card-title>
    <v-card-title v-else class="text-h6">{{ cardTitle }}</v-card-title>

    <v-card-subtitle>
      <div class="price-section d-flex justify-space-between">
        <span
          v-if="priceInfo?.deals?.length > 0 && priceInfo.deals[0]?.price?.amount !== 'no price found'"
          class="price"
        >
          {{ priceInfo.deals[0]?.price?.amount + "€" }}
        </span>
        <span v-else class="price">
          {{ dealPrice + "€" || "Price not available" }}
        </span>
        <span class="d-flex">
        <div
          v-for="(platformLogo, index) in platforms"
          :key="index"
          class="platform-item"
        >
          <v-img
                :src="platformLogo"
                class="platform-logo ml-2"
                contain
              ></v-img>
            </div>
        </span>
      </div>
    </v-card-subtitle>

    <v-card-actions class="platform-section">

    </v-card-actions>

    <v-btn
      icon
      class="bookmark-btn"
      :class="bookmarked ? 'bookmark-remove' : 'bookmark-add'"
      @click="changeBookmark"
    >
      <v-icon>
        {{ bookmarked ? 'mdi-minus' : 'mdi-plus' }}
      </v-icon>
    </v-btn>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  props: {
    title: {
      type: String,
      required: false,
      default: "",
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
      bookmarked: false,
      cardTitle: "",
      platforms: ["https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg"],
      defaultImage: "https://www.freeiconspng.com/uploads/no-image-icon-11.PNG",
    };
  },
  emits: ["update:title"],
  methods: {
    fetchGameInfo() {
      axios
        .get(
          `https://api.isthereanydeal.com/games/info/v2?key=${import.meta.env.VITE_API_KEY}&id=${this.gameId}`
        )
        .then((response) => {
          const gameInfo = response?.data;  // Ensure response.data exists

          if (gameInfo && gameInfo.assets) {
            this.image = gameInfo.assets["banner400"] || this.defaultImage;
            this.cardTitle = gameInfo.title;
            if (Array.isArray(gameInfo.drm)) {
              this.platforms = gameInfo.drm.map((drm) => this.getPlatformInfo(drm));
            } else {
              this.platforms = ["https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg","https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg"];  // Fallback if drm is not an array
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
    async changeBookmark() {
      try {
        const response = await axios.post(
          `http://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/bookmark/changebookmark`,
          { game: this.gameId, token: localStorage.getItem("token") }
        );
        this.bookmarked = !this.bookmarked;
      } catch (error) {
        console.error("Error with the POST request:", error);
      }
    },
    async isBookmarked() {
        if(localStorage.getItem("token") !== null){
          try {
          const response = await axios.post(
            `http://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/bookmark/isBookmarked`,
            { game: this.gameId, token: localStorage.getItem("token") }
          );
          this.bookmarked = response?.data.bookmarked;
        } catch (error) {
          console.error("Error with the POST request:", error);
        }
      }
    },
  },
  mounted() {
    this.fetchGameInfo();
    this.isBookmarked();
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

.bookmark-add {
  background-color: #085772;
}

.bookmark-remove {
  background-color: #c16868;
}


.game-card {
  position: relative;
  overflow: hidden; /* Ensures gradient stays within the card boundaries */
}

.game-card::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%; /* Covers the entire card */
  height: 100%; /* Covers the entire card */
  background: radial-gradient(
    circle at bottom right,
    rgba(14, 14, 14, 0.8),
    rgba(0, 0, 0, 0) 70%
  );
  z-index: 0; /* Places it below the content */
  pointer-events: none; /* Ensures it doesn’t interfere with interactions */
}

.game-card > * {
  position: relative;
  z-index: 1;
}
.bookmark-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
