<template>
  <v-container fluid style="background-color: #181818; height:auto; padding:50px; overflow: hidden;">
    <v-row justify="center" align="center" class="image-slider">
      <v-col cols="12" md="8" class="slider-wrapper">
        <div
          class="image-wrapper"
          v-for="(image, index) in images"
          :key="index"
          v-show="currentIndex === index"
          @mouseover="pauseCycle"
          @mouseleave="resumeCycle"
        >
        <div class="image-gradient"></div>
          <img :src="image.src" alt="slider image" class="slider-image" />
          <div
            class="description"
          >
            <h1>{{ image.title }}</h1>
            <p class="extended-description">{{ image.description }}</p>
            <p class="price">
              <span class="discount">{{ image.discount }}</span>
              <span class="original-price">{{ image.originalPrice }}</span>
              <span class="reduced-price">{{ image.reducedPrice }}</span>
            </p>
            <a
              :href="image.storeLink"
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
            v-for="(image, index) in images"
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
export default {
  data() {
    return {
      images: [
        {
          src: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg?t=1729703045",
          title: "Counter Strike 2",
          storeLink: "https://store.steampowered.com/app/730/CounterStrike_2/",
          originalPrice: "$59.99",
          reducedPrice: "$14.99",
          discount: "-75%",
          description:
            "Experience a modern guerrilla revolution with stunning landscapes, instinctive shooting, and endless gameplay options.",
        },
        {
          src: "https://assets.isthereanydeal.com/018d937e-e9b6-713b-83f6-4f060b9ca19e/banner400.jpg?t=1731994281",
          title: "Game 2",
          originalPrice: "$49.99",
          reducedPrice: "$24.99",
          discount: "-50%",
          description: "An exciting adventure game with captivating visuals and storylines.",
        },
        {
          src: "https://assets.isthereanydeal.com/018d937e-e9b8-7125-9c92-5794c0e0e29c/banner400.jpg?t=1732878634",
          title: "Game 3",
          originalPrice: "$49.99",
          reducedPrice: "$24.99",
          discount: "-50%",
          description: "An exciting adventure game with captivating visuals and storylines.",
        },
        {
          src: "https://assets.isthereanydeal.com/018d937e-e9ad-72bf-8d8b-27d5f2b28cb5/banner400.jpg?t=1732950646",
          title: "Game 4",
          originalPrice: "$49.99",
          reducedPrice: "$24.99",
          discount: "-50%",
          description: "An exciting adventure game with captivating visuals and storylines.",
        },
      ],
      currentIndex: 0,
      progress: 0,
      cycleInterval: null,
      isHovering: false,
    };
  },
  methods: {
    startCycle() {
      this.cycleInterval = setInterval(() => {
        if (this.progress < 100) {
          this.progress += 0.5; // Adjust the increment for desired animation speed
        } else {
          this.nextImage();
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
    nextImage() {
      this.progress = 0;
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    jumpTo(index) {
      this.progress = 0;
      this.currentIndex = index;
    },
  },
  mounted() {
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
