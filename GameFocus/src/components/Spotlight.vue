<template>
  <v-container fluid style="background-color: #181818; width:100%; height:auto; padding:50px; overflow: hidden;">
    <v-row justify="center" align="center" class="image-slider">
      <v-col cols="12" md="8" class="slider-wrapper">
        <div
          class="image-wrapper"
          v-for="(item, index) in items"
          :key="index"
          v-show="currentIndex === index"
          @mouseover="pauseCycle"
          @mouseleave="resumeCycle"
        >
        <div class="image-gradient"></div>
          <img :src="item.src" alt="slider image" class="slider-image" />
          <div
            class="description"
          >
            <h1>{{ item.title }}</h1>
            <p class="extended-description">{{ item.description }}</p>
            <p class="price">
              <span class="discount">{{ item.discount }}</span>
              <span class="original-price">{{ item.originalPrice }}</span>
              <span class="reduced-price">{{ item.reducedPrice }}</span>
            </p>
            <a
              :href="item.storeLink"
              target="_blank"
              rel="noopener noreferrer"
              class="buy-btn"
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
  </v-container>
</template>

<script>
import { FetchDeals, FetchGameInfo } from "../javascript/GameFunctions.js";
export default {
  data() {
    return {
      items: [], // Spotlight items
      currentIndex: 0,
      progress: 0,
      cycleInterval: null,
      isHovering: false,
    };
  },
  methods: {
    async loadSpotlightGames() {
      try {
        const allGames = await FetchDeals(5); // Fetch the list of spotlight games
        console.log(allGames);

        const spotlightGames = await Promise.all(
          allGames.map(async (game) => {
            const gameInfo = await FetchGameInfo(game.gameId); // Fetch detailed game info
            const imageSrc = gameInfo?.assets?.banner400 || `https://cdn.example.com/games/${game.gameId}.jpg`; // Fallback to default image
            return {
              src: imageSrc,
              title: game.title,
              description: `Available on: ${game.platform}, DRM: ${game.drm}`,
              discount: `-${game.discount}%`,
              originalPrice: `$${game.regularPrice}`,
              reducedPrice: `$${game.dealPrice}`,
              storeLink: game.url,
            };
          })
        );
        console.log(spotlightGames);
        this.items = spotlightGames;
      } catch (error) {
        console.error("Failed to load spotlight games:", error);
      }
    }
    ,
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
      this.startCycle();
    },
    nextItem() {
      this.progress = 0;
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
    },
    jumpTo(index) {
      this.progress = 0;
      this.currentIndex = index;
    },
  },
  mounted() {
    this.loadSpotlightGames();
    this.startCycle();
  },
  beforeDestroy() {
    clearInterval(this.cycleInterval);
  },
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
