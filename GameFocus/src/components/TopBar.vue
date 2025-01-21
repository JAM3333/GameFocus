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
          <v-list-item-title>{{ genre.name }}</v-list-item-title>
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
    <v-menu class="users-list" v-model="userVisible" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          text
          v-bind="attrs"
          v-on="on"
          @mouseenter="userVisible = true"
          @click="goToProfile"
        >
          <v-icon right class="profile-icon"
          >{{ userIcon }}</v-icon>
        </v-btn>
      </template>
      <v-list v-if="loggedIn" @mouseleave="userVisible = false">
        <v-list-item
          @click="goToProfile"
        >
          <div style="display: flex; align-items: center; justify-content: center; flex-direction: row;">
          <v-icon class="mr-2">mdi-book</v-icon>
          <v-list-item-title>Bookmarks</v-list-item-title>
          </div>
        </v-list-item>

        <v-list-item
          @click="logout()"
          class="d-flex align-center"
        >
          <div style="display: flex; align-items: center; justify-content: center; flex-direction: row;">
          <v-icon class="mr-2">mdi-logout</v-icon>
          <v-list-item-title>Logout</v-list-item-title>
          </div>
        </v-list-item>
      </v-list>
    </v-menu>

  </v-app-bar>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: "",
      genres: [
        { name: "Epic Games", url: "16" },
        { name: "Steam", url: "61" },
        { name: "GOG", url: "35" },
        { name: "Game Planet", url: "27" },
      ],
      menuVisible: false,
      userVisible: false,
      userIcon: "mdi-login",
      loggedIn: false,
    };
  },
  methods: {
    handleGenreClick(genre) {
      console.log(`Selected store: ${genre.name}`);
      this.menuVisible = false;
      // Navigate to the "GamesStore" page with the new shopId as a query parameter
      this.$router.push({
        path: '/games-store',
        query: { shopId: genre.url }
      });
    },
    goToProfile() {
      this.$router.push({
        path: "/user-page",
        query: {q: this.searchQuery},
      });
    },
    async logout(){
      const response = await axios.post(
        `http://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/auth/logout`,
        localStorage.getItem("token")
      );
      if (response.status === 200) {
        localStorage.removeItem("token");
        window.location.reload();
      }
    },
    fetchUser(){
      if(localStorage.getItem("token") !== null) {
        this.loggedIn = true;
        this.userIcon = "mdi mdi-account";
      }
    },
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          path: "/search-page",
          query: {q: this.searchQuery},
        });
        this.searchQuery = "";
      }
    },
  },
  mounted() {
    this.fetchUser();
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

.users-list {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-width: 30rem;
  margin-top: 4rem;
  margin-right: -20rem;
  margin-left: auto;
}


/* User Profile Icon Style */
.profile-icon {
  transition: transform 0.3s ease-in-out;
}

.profile-icon:hover {
  transform: scale(1.4);
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
