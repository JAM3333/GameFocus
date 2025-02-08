<template>
  <v-container
    :class="{ 'popup-container': true, 'active': showPopup, 'enter': entering }"
    @click="closePopup"
  >
    <div class="popup-card no-padding" @click.stop>
      <div class="image-container">
        <img :src="game.src" alt="Game image" class="games-image" ref="gameImage" />
        <div class="gradient"></div>
        <h3 class="game-title">{{ game.title }}</h3>
      </div>
      <div class="content-wrapper">
        <p class="description">Available on: {{ game.description }}</p>
        <p class="price">
          <span class="discount" v-if="game.discount != '-0%'">{{ game.discount }}</span>
          <span class="original-price">{{ game.originalPrice }}</span>
          <span class="reduced-price">{{ game.reducedPrice }}</span>
        </p>
        <a target="_blank" :href="game.storeLink" class="buy-btn" title="Redirect to Store Page">
          Buy Now
        </a>
      </div>
      <div class="content-wrapper">
        <h2 class="price-history">Price History:</h2>
        <canvas ref="priceChart"></canvas>
      </div>
    </div>
  </v-container>
</template>

<script>
//import Chart from "chart.js/auto";
import axios from "axios";

export default {
  props: {
    game: Object,
  },
  data() {
    return {
      priceHistory: [],
      showPopup: false,
      entering: false,
    };
  },
  methods: {
    async fetchPriceHistory() {
      try {
        const response = await axios.get(
          `https://api.isthereanydeal.com/games/history/v2?key=${import.meta.env.VITE_API_KEY}&id=${this.game.gameId}`
        );
        const prices = response.data;
        this.priceHistory = prices.map((price) => ({
          timestamp: price.timestamp,
          bestPrice: price.deal.price,
          avgPrice: price.deal.regular,
          shop: price.shop,
        }));
        this.renderChart();
      } catch (error) {
        console.error("Error fetching price history:", error);
      }
    },
    renderChart() {
      const ctx = this.$refs.priceChart.getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: this.priceHistory.map((entry) => {
            const date = new Date(entry.timestamp);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "2-digit",
            });
          }),
          datasets: [
            {
              label: "Price (€)",
              data: this.priceHistory.map((entry) => entry.bestPrice.amount),
              borderColor: "rgba(75, 192, 192, 1)",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const price = tooltipItem.raw;
                  const vendor = this.priceHistory[tooltipItem.dataIndex].shop.name;
                  return [`Price: €${price}`, `Vendor: ${vendor}`];
                },
              },
            },
          },
        },
      });
    },
    closePopup() {
      this.entering = false;
      setTimeout(() => {
        this.showPopup = false;
        this.$emit("close");
      }, 400);
    },
  },
  mounted() {
    this.fetchPriceHistory();
    this.showPopup = true;
    this.$nextTick(() => {
      setTimeout(() => {
        this.entering = true;
      }, 10);
    });
  },
};
</script>

<style scoped>
.popup-container {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  transition: background 0.4s ease, opacity 0.4s ease;
}

.popup-card {
  width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 12px;
  background-color: #181818;
  transform: translateY(100%);
  transition: transform 0.4s ease-out;
}

.popup-container.active {
  opacity: 1;
  background: rgba(0, 0, 0, 0.8);
}

.popup-container.enter .popup-card {
  transform: translateY(0);
}

.popup-container:not(.enter) {
  opacity: 0;
  background: rgba(0, 0, 0, 0);
}


.image-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.games-image {
  width: 100%;
  height: auto;
  display: block;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.gradient {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #181818, transparent);
}

.game-title {
  position: absolute;
  left: 15px;
  font-size: 2rem;
  font-weight: bold;
  z-index: 10;
  bottom: 0;
}

.content-wrapper {
  padding: 20px;
  padding-top: 0;
  position: relative;
  width: 100%;
  overflow: hidden;
}

.description {
  margin-top: 10px;
  margin-bottom: 40px;
  font-size: 1rem;
  line-height: 1.5;
}

.price {
  position: absolute;
  bottom: 20px;
  display: flex;
  align-items: center;
}

.discount {
  background-color: red;
  padding: 4px 10px;
  border-radius: 7px;
  color: white;
  font-size: 16px;
}

.original-price {
  text-decoration: line-through;
  color: grey;
  margin-left: 10px;
}

.reduced-price {
  color: #ff4444;
  font-weight: bold;
  margin-left: 10px;
}

.price-history {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid grey;
  font-size: 1.2rem;
  font-weight: bold;
}

.buy-btn {
  position: absolute;
  background-color: #fff;
  padding: 10px 50px;
  bottom: 10px;
  right: 30px;
  border-radius: 5px;
  color: black;
  text-decoration: none;
  display: inline-block;
}

canvas {
  max-width: 100%;
  min-height: 300px;
  min-width: 600px;
  display: block;
  margin: auto;
}
</style>
