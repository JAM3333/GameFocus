<template>
  <LoginCard v-if="!loggedIn"></LoginCard>
  <UserCard v-else         :username="username"
  ></UserCard>
</template>

<script>
import axios from "axios";
import GameCard from "@/components/GameCard.vue";
export default {
  name: "User",
  components: {GameCard},
  data() {
    return {
      loggedIn: false,
      username: "",
    };
  },
  beforeMount() {
    if (localStorage.token != null) {
      this.getUser()
    }
  },
  methods: {
    async getUser() {
      await axios.get("http://" + import.meta.env.VITE_SERVER_IP + ":" + import.meta.env.VITE_SERVER_PORT + "/auth/user/" + localStorage.token)
        .then((response) => {
          console.log("answer from server:", response.data);
          this.username = response.data.username;
          this.loggedIn = true;
        })
        .catch((error) => {
          this.generalError = error.response.data.message;
          console.error("Error with the Login request:", error);
        });
    },
  },
};
</script>

<style>
.v-application--wrap {
  overflow: visible; /* Ändern Sie overflow auf visible */
}
</style>
