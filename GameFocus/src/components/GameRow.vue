<template>
    <v-container>
      <h2 class="my-4 text-center">On Sale</h2>
      <v-row dense>
        <v-col
          v-for="(item, index) in saleItems"
          :key="index"
          cols="4"
          md="3"
        >
        <GameCard
        :title="item.title"
        :gameId="item.gameId"
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
  import { FetchDeals } from "../javascript/GameFunctions.js"; // Import the function

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
      async loadSaleItems() {
        try {
          this.saleItems = await FetchDeals(16);
          console.log(this.saleItems);
        } catch (error) {
          console.error("Failed to load sale items:", error);
        }
      },
    },
    mounted() {
      this.loadSaleItems();
    },
  };
  </script>
