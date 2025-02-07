<template>
  <v-container fluid style="background-color: #181818; padding:50px; overflow: hidden;">
    <v-row
      justify="center"
      align="center"
      style="max-width: 1200px; margin: 0 auto;"
      class="image-slider"
    >
      <v-col class="slider-wrapper">
        <div
          class="image-wrapper"
          v-for="(item, index) in items"
          :key="index"
          v-show="currentIndex === index"
          @mouseover="pauseCycle"
          @mouseleave="resumeCycle"
          @click="openPopup(item)"
        >
        <div class="image-gradient"></div>
          <img :src="item.src" alt="slider image" class="slider-image" />
          <div
            class="description"
          >
            <h1>{{ item.title }}</h1>
            <p class="extended-description">Available on: {{ item.description }}</p>
            <p class="price">
              <span class="discount">{{ item.discount }}</span>
              <span class="original-price">{{ item.originalPrice }}</span>
              <span class="reduced-price">{{ item.reducedPrice }}</span>
            </p>
            <a
          target="_blank"
          :href="item.storeLink"
          @click.stop
          class="buy-btn"
          title="Redirect to Store Page"
        >
          Buy Now
        </a>
          </div>
        </div>
        <div class="progress-bars">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="progress-bar"
            :class="{ active: index === currentIndex }"
            @click="jumpTo(index)"
          >
            <div
              class="progress-fill"
              :style="{ width: index === currentIndex ? progress + '%' : '0%' }"
            ></div>
          </div>
        </div>
      </v-col>
    </v-row>
    <GamePopup
      v-if="popupVisible"
      :game="selectedGame"
      @close="popupVisible = false, resumeCycle()"
    />
  </v-container>
</template>

<script>
import { FetchDeals, FetchGameInfo, GetPrices } from "../javascript/GameFunctions.js";
import GamePopup from "./GamePopup.vue";
export default {
  data() {
    return {
      items: [],
      currentIndex: 0,
      progress: 0,
      cycleInterval: null,
      popupVisible: false,
      isHovering: false,
      scrollY: 0,
    };
  },
  methods: {
    async loadSpotlightGames() {
  try {
    const allGames = await FetchDeals(5);

    const spotlightGames = await Promise.all(
      allGames.map(async (game) => {
        const gameInfo = await FetchGameInfo(game.gameId);
        const imageSrc = gameInfo?.assets?.banner400 || "https://www.freeiconspng.com/uploads/no-image-icon-11.PNG";
        const gameId = gameInfo?.id || game.gameId;
        const prices = await GetPrices([game.gameId], [game], [game]);

        this.saleItems = prices.map((item) => {
          const platforms = item.priceInfo.deals.map((deal) => deal.shop.name);
          return { ...item, platforms };
        });

        let formattedPlatforms = "";
        if (this.saleItems.length > 0 && Array.isArray(this.saleItems[0].platforms)) {
          formattedPlatforms = this.saleItems[0].platforms.join(" | ");
        }
        return {
          src: imageSrc,
          title: game.title,
          description: formattedPlatforms,
          discount: `-${game.discount}%`,
          originalPrice: `€${game.regularPrice}`,
          reducedPrice: `€${game.dealPrice}`,
          storeLink: game.url,
          gameId: gameId,
        }; 
      })
    );

    this.items = spotlightGames;
  } catch (error) {
    console.error("Failed to load spotlight games:", error);
  }
},
    startCycle() {
      this.cycleInterval = setInterval(() => {
        if (this.progress < 100) {
          this.progress += 0.5; // Adjust the increment for desired animation speed
        } else {
          this.nextItem();
        }
      }, 25); // Smaller intervals for smoother animation
    },
    pauseCycle() {
      this.isHovering = true;
      clearInterval(this.cycleInterval);
    },
    resumeCycle() {
      this.isHovering = false;
      this.popupVisible ? "" : this.startCycle(); 
    },
    nextItem() {
      this.progress = 0;
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
    },
    jumpTo(index) {
      this.progress = 0;
      this.currentIndex = index;
    },
    openPopup(game) {
      this.selectedGame = game;
      this.popupVisible = true;
    },
  },
  computed: {
  },
  mounted() {
    this.loadSpotlightGames();
    this.startCycle();
  },
  beforeDestroy() {
    clearInterval(this.cycleInterval);
  },
  watch: {
  popupVisible(newValue) {
    if (newValue) {
      this.scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.overflow = "hidden";
      document.body.style.width = "100%";
      document.body.style.top = `-${this.scrollY}px`;
    } else {
      document.body.style.position = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
      document.body.style.top = "";

      window.scrollTo(0, this.scrollY);
    }
  }
},
  beforeDestroy() {
    document.body.style.overflow = "";
  }
};

</script>

<style scoped>
.image-slider {
  position: relative;
}

.slider-wrapper {
  position: relative;
  overflow: hidden;
}

.image-wrapper::after {
  content: "";
  position: absolute;
  overflow: hidden;
  bottom: 0;
  left: 0;
  border-radius: 12px;
  width: 100%; /* Covers the entire card */
  height: 100%; /* Covers the entire card */
  background: radial-gradient(
    circle at bottom left,
    rgb(24, 24, 24),
    rgba(0, 0, 0, 0) 70%
  );
  z-index: 0;
  pointer-events: none;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.slider-image {
  width: 100%;
  height: 60vh;
  object-fit: cover;
  border-radius: 12px;
}
.image-wrapper:hover ~ .progress-bar.active {
  animation: none;
}
.image-gradient {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(to top, #181818, transparent);
}


.description {
  position: absolute;
  bottom: 30px;
  left: 30px;
  z-index: 3;
  color: white;
  transition: transform 0.3s ease-in-out;
}

.description h3 {
  margin: 0;
}

.description p {
  margin: 5px 0;
  max-width: 400px;
}

.buy-btn {
  background-color: #fff;
  padding: 10px 50px;
  margin-top: 3px;
  border-radius: 5px;
  color: black;
  text-decoration: none;
  display: inline-block;
}



.original-price {
  text-decoration: line-through;
  color: #fff;
  margin-left: 10px;
}

.reduced-price {
  color: #f00;
  font-weight: bold;
  margin-left: 10px;
}

.discount {
  background-color: red;
  padding: 4px 10px 4px 10px;
  border-radius: 7px;
  color: #fff;
  font-size: 16px;
}

.extended-description {
  margin-top: 10px;
  font-size: 14px;
}

.progress-bars {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.progress-bar {
  width: 70px;
  height: 7px;
  border-radius: 5px;
  background: #666;
  margin: 0 5px;
  position: relative;
  cursor: pointer;
}

.progress-fill {
  height: 100%;
  background: #fff;
  border-radius: 5px;
  transition: width 0.05s linear;
}

.progress-fill {
  height: 100%;
  background: #fff;
  border-radius: 5px;
  transition: width 0.1s linear;
}
</style>
