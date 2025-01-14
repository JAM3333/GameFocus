<template>
  <v-app-bar app color="black" dark>
    <!-- Logo Section -->
    <v-btn :to="{ path: '/' }" icon>
      <img src="@/assets/logo.png" alt="Logo" style="max-width: 40px;" />
    </v-btn>

    <!-- Navigation Links -->
    <v-btn text href="/">Home</v-btn>
    <v-btn text href="/info">Info</v-btn>

    <!-- Dropdown Menu -->
    <v-menu class="genres-list" v-model="menuVisible" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          text
          v-bind="attrs"
          v-on="on"
          @mouseenter="menuVisible = true"
        >
          Platform
          <v-icon right>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list @mouseleave="menuVisible = false">
        <v-list-item
          v-for="(genre, index) in genres"
          :key="index"
          @click="handleGenreClick(genre)"
        >
          <v-list-item-title>{{ genre }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Spacer and Search Input -->
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-text-field
      class="search"
      label="Search for Games"
      outlined
      v-model="searchQuery"
      @keyup.enter="performSearch"
    ></v-text-field>

    <!-- User Profile Section -->
    <v-btn icon @click="goToProfile">
      <v-icon class="mdi mdi-account-outline"></v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      genres: ["Epic Games", "Steam", "Ubisoft", "EA Store"],
      menuVisible: false,
    };
  },
  methods: {
    handleGenreClick(genre) {
      console.log(`Selected genre: ${genre}`);
      this.menuVisible = false;
    },
    goToProfile() {
      this.$router.push({
        path: "/user-page",
        query: { q: this.searchQuery },
      });
    },
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          path: "/search-page",
          query: { q: this.searchQuery },
        });
        this.searchQuery = "";
      }
    },
  },
};
</script>

<style>
/* Styling for v-app-bar */
.v-application .v-app-bar {
  background-color: #000000;
}
.v-btn {
  color: white;
}

.v-list-item:hover {
  background-color: #555;
}

.genres-list {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-width: 30rem;
  margin-top: 4rem;
  margin-left: 13rem;
}

/* User Profile Icon Style */
.profile-icon {
  transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
  color: #757474;
}

.profile-icon:hover {
  transform: scale(1.2);
  color: #ffffff; /* Highlight color on hover */
}

/* Styling for Search Input */
.v-text-field input {
  color: white;
}

.v-text-field input::placeholder {
  color: #bbb;
}

.search {
  margin-top: 20px;
}
</style>
