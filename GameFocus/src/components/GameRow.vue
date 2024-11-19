<template>
    <v-container>
      <h2 class="my-4 text-center">On Sale</h2>
      <v-row dense>
        <v-col
          v-for="(item, index) in saleItems"
          :key="index"
          cols="12"
          md="3"
        >
        <GameCard
        :title="item.title"
        :dealPrice="item.dealPrice"
        :url="item.url"
        :drm="item.drm"
        />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from "axios";
  import GameCard from "./GameCard.vue"; 
  
  export default {
    components: {
      GameCard, 
    },
    data() {
      return {
        saleItems: [],
      };
    },
    methods: {
      fetchDeals() {
        axios
          .get(
            `https://api.isthereanydeal.com/deals/v2?key=${import.meta.env.VITE_API_KEY}`
          )
          .then((response) => {
            const items = response.data.list;
            this.saleItems = items.map((item) => ({
              title: item.title,
              dealPrice: item.deal.price.amount.toFixed(2), 
              regularPrice: item.deal.regular.amount.toFixed(2), 
              discount: item.deal.cut, 
              shop: item.deal.shop.name, 
              url: item.deal.url, 
              drm: item.deal.drm.map((drm) => drm.name).join(", "),
              platform: item.deal.platforms.map((platform) => platform.name).join(", "), 
            }));
          })
          .catch((error) => {
            console.error("Failed to fetch sale items:", error);
          });
      },
    },
    mounted() {
      this.fetchDeals();
    },
  };
  </script>
  