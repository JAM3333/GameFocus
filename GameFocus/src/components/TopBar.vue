<template>
  <v-app-bar app color="black" dark>
    <!-- Logo Section -->
    <v-btn icon>
      <img src="@/assets/logo.png" alt="Logo" style="max-width: 40px;">
    </v-btn>

    <!-- Navigation Links -->
    <v-btn text>Home</v-btn>
    <v-btn text>About Us</v-btn>
    <v-btn text>Info</v-btn>

    <!-- Alternative Dropdown Menu with v-hover -->
    <v-hover v-slot:default="{ isHovering }">
      <div>
        <v-btn text @click="toggleGenresMenu">
          Genres
          <v-icon right>mdi-menu-down</v-icon>
        </v-btn>

        <v-list
          v-if="isHovering || genresMenuOpen"
          style="position: absolute; background-color: #333; margin-top: 5px; z-index: 1000;"
        >
          <v-list-item v-for="(genre, index) in genres" :key="index" @click="closeGenresMenu">
            <v-list-item-title>{{ genre }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-hover>

    <!-- Spacer to Push Search to the Right -->
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>

    <!-- Search Input and Profile Icon -->
    <v-text-field
      flat
      hide-details
      placeholder="Search"
      append-icon="mdi-magnify"
      dense
    ></v-text-field>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      genres: ['Action', 'Comedy', 'Drama', 'Fantasy'], // Sample genres
      genresMenuOpen: false
    };
  },
  methods: {
    toggleGenresMenu() {
      this.genresMenuOpen = !this.genresMenuOpen;
    },
    closeGenresMenu() {
      this.genresMenuOpen = false;
    }
  }
}
</script>

<style>
.v-application .v-app-bar {
  background-color: #000000; /* Black background */
}
.v-btn {
  color: white; /* White text for buttons */
}
</style>
