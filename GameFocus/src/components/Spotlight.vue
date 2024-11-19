<template>
    <v-container fluid style="background-color: #262626; height: 100vh; overflow: hidden;">
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
            <div class="gradient-border"></div>
            <div class="image-gradient"></div>
            <img :src="image.src" alt="slider image" class="slider-image" />
            <div
              class="description"
              :class="{ 'description-expanded': isHovering }"
              @mouseover="isHovering = true"
              @mouseleave="isHovering = false"
            >
              <h3>{{ image.title }}</h3>
              <p>
                <span class="original-price">{{ image.originalPrice }}</span>
                <span class="reduced-price">{{ image.reducedPrice }}</span>
              </p>
              <p class="discount">{{ image.discount }}</p>
              <p v-if="isHovering" class="extended-description">{{ image.description }}</p>
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
            src: "image1.png", // Replace with actual image URLs
            title: "Far Cry 6",
            originalPrice: "$59.99",
            reducedPrice: "$14.99",
            discount: "-75%",
            description:
              "Experience a modern guerrilla revolution with stunning landscapes, instinctive shooting, and endless gameplay options.",
          },
          {
            src: "image2.png",
            title: "Game 2",
            originalPrice: "$49.99",
            reducedPrice: "$24.99",
            discount: "-50%",
            description: "An exciting adventure game with captivating visuals and storylines.",
          },
          // Add more images here
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
            this.progress += 2; // Progress bar speed
          } else {
            this.nextImage();
          }
        }, 100); // Adjust speed of fill (100ms -> 10 updates per second)
      },
      pauseCycle() {
        clearInterval(this.cycleInterval);
      },
      resumeCycle() {
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
    height: 500px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  
  .slider-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .image-gradient {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30%;
    background: linear-gradient(to top, #262626, transparent);
  }
  
  .gradient-border {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 5%;
    background: linear-gradient(to right, #262626, transparent);
    z-index: 2;
  }
  
  .description {
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 3;
    color: white;
    transition: transform 0.3s ease-in-out;
  }
  
  .description-expanded {
    transform: translateY(-50px);
  }
  
  .description h3 {
    margin: 0;
  }
  
  .description p {
    margin: 5px 0;
  }
  
  .original-price {
    text-decoration: line-through;
    color: #ccc;
  }
  
  .reduced-price {
    color: #f00;
    font-weight: bold;
    margin-left: 10px;
  }
  
  .discount {
    color: #ff0000;
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
    width: 40px;
    height: 5px;
    background: #666;
    margin: 0 5px;
    position: relative;
    cursor: pointer;
  }
  
  .progress-bar.active {
    background: #fff;
  }
  
  .progress-fill {
    height: 100%;
    background: #fff;
    transition: width 0.1s linear;
  }
  </style>
  