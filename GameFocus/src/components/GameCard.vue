<template>
  <v-card outlined class="game-card" @mouseover="hovering = true" @mouseleave="hovering = false" @click="openPopup(title || cardTitle)" :ripple="false">
    <v-img
      :src="image || defaultImage"
      cover
      aspect-ratio="16/9"
      class="mb-image"
      :class="{ 'hover-scale': hovering }"
    ></v-img>

      <v-card-title class="text-h6" :title="title || cardTitle">
        {{ title || cardTitle }}
      </v-card-title>

    <v-card-subtitle>
      <div class="price-section d-flex justify-space-between">
        <div class="price-container">
      <span
        v-if="priceInfo?.deals?.length > 0 && priceInfo.deals[0]?.price?.amount !== 'no price found'"
        class="price"
      >
      {{ priceInfo.deals[0]?.price?.amount }}€
    </span>
          <span v-else class="price">
      {{ dealPrice !== "Price not found" ? dealPrice + "€" : "Price not found" }}
    </span>
          <span
            v-if="discount"
            class="discount"
          >
        -{{ discount }}%
        </span>
          <span
            v-if="priceInfo?.deals?.length > 0 && priceInfo.deals[0]?.regular?.amount && priceInfo.deals[0]?.regular?.amount != priceInfo.deals[0]?.price?.amount"
            class="discount"
          >
        -{{ 100-Math.round((100/priceInfo.deals[0]?.regular?.amount)*priceInfo.deals[0]?.price?.amount) }}%
        </span>
        </div>

        <span class="d-flex">
      <div>
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
     <span class="platforms-list" :title=formattedPlatforms>
        {{ formattedPlatforms }}
      </span>
    </v-card-actions>

    <v-btn
      icon
      class="bookmark-btn"
      :class="{ 'bookmark-remove': bookmarked, 'bookmark-add': !bookmarked, 'hover-scale': hovering || bookmarked }"
      @click.stop="changeBookmark"
    >
      <v-icon>{{ bookmarked ? 'mdi-minus' : 'mdi-bookmark' }}</v-icon>
    </v-btn>
  </v-card>
  <GamePopup
  v-if="popupVisible"
  :game="selectedGame"
  @close="popupVisible = false"
/>

</template>

<script>
import axios from "axios";
import GamePopup from "./GamePopup.vue";
import noShopImage from '@/assets/noShop.png';


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
    discount: {
      type: Number,
      required: false,
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
    platforms: {
      type: Object,
      required: false,
     },
    url: {
      type: String,
      required: false,
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
    hovering: false,
    platformLogo: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
    defaultImage: "https://www.freeiconspng.com/uploads/no-image-icon-11.PNG",
    popupVisible: false,
    selectedGame: {},
    scrolly: 0,
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
            this.platformLogo = this.getPlatformInfo(this.platforms[0])
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
        Steam: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
        "Epic Game Store": "https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg",
        GOG: "https://upload.wikimedia.org/wikipedia/commons/2/2e/GOG.com_logo.svg",
        GamePlanet: "https://img.wethrift.com/gamesplanet.jpg"
      };
      return platformDetails[platformName] || noShopImage;
    },
    async changeBookmark() {
      if (localStorage.getItem("token") !== null){
        try {
          const response = await axios.post(
            `http://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/bookmark/changebookmark`,
            { game: this.gameId, token: localStorage.getItem("token") }
          );
          this.bookmarked = !this.bookmarked;
        } catch (error) {
          console.error("Error with the POST request:", error);
        }
      } else {
        this.$router.push({
          path: "/user-page",
        });
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
        }
      }
    },



    //popup logic
    openPopup(game) {
      const discount = this.discount || 100-Math.round((100/this.priceInfo.deals[0]?.regular?.amount)*this.priceInfo.deals[0]?.price?.amount) || 0;
      const pricing = this.dealPrice === "Price not found" ? this.priceInfo.deals[0]?.price?.amount : this.dealPrice;
      const originalPrice = this.priceInfo.deals[0]?.regular?.amount ||Math.round(pricing / (1 - discount / 100)) || 0;
      this.selectedGame.src = this.image || this.defaultImage;
      this.selectedGame.title = game;
      this.selectedGame.description = this.platforms.join(" | ");
      this.selectedGame.originalPrice = originalPrice + "€";
      this.selectedGame.reducedPrice = pricing + "€";
      this.selectedGame.gameId = this.gameId;
      this.selectedGame.discount = "-"+  discount + "%";
      this.selectedGame.storeLink = this.url;
      this.popupVisible = true;
    },
  },
  computed: {
    formattedPlatforms() {
      if (Array.isArray(this.platforms)) {
        return this.platforms.join(" | ");
      }
      return "";
    },
  },
  watch: {
  popupVisible(newValue) {
    if (newValue) {
      // Store the current scroll position
      this.scrollY = window.scrollY;

      // Prevent scrolling while keeping the user at the same position
      document.body.style.position = "fixed";
      document.body.style.overflow = "hidden";
      document.body.style.width = "100%";
      document.body.style.top = `-${this.scrollY}px`; // Keeps the page in place
    } else {
      // Restore the original scroll position
      document.body.style.position = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
      document.body.style.top = "";

      // Scroll back to the saved position
      window.scrollTo(0, this.scrollY);
    }
  }
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

.text-h6 {
  text-align: left;
}

.mb-image {
  object-fit: cover;
  width: 100%;
  height: 140px;
  transition: transform 0.3s ease-in-out;
}

.mb-image::v-deep(img) {
  transition: transform 0.3s ease-in-out;
}

.mb-image.hover-scale::v-deep(img) {
  transform: scale(1.1);
}

.platform-section {
  display: flex;
  flex-wrap: wrap;
}
.platforms-list {
  border-top: solid 1px grey;
  padding: 10px;
  text-align: left;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  font-size: 0.9rem;
  font-weight: bold;
  color: #757575; /* Optional: Customize the color */
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

.price-container {
  display: flex;
  align-items: center;
  gap: 8px; /* Adjust spacing between price and discount */
}

.discount {
  background-color: #f44336; /* Red background for discount */
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
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
  top: -100px;
  right: 10px;
  transition: transform .2s ease-in-out;
}
.bookmark-btn.hover-scale {
  transform: translateY(110px);
}
</style>
