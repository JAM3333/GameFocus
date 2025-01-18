<template>
  <v-app>
    <v-main>
      <v-container class="d-flex justify-center align-center" id="Background">
        <v-row class="login-card">
          <!-- Left Panel: Conditional Text -->
          <v-col class="left-panel" cols="6">
            <h1>{{ currentPageIsSignup ? 'WELCOME!' : 'WELCOME BACK!' }}</h1>
            <p>{{ currentPageIsSignup ? 'Create an account to get personalized experience.' : 'Hello again! Log in to access your personalized experience.' }}</p>
            <p>
              <span v-if="!currentPageIsSignup">
                Don't have an account yet?
                <span @click="switchToSignup" class="toggle-link">Signup</span>
              </span>
              <span v-if="currentPageIsSignup">
                Already have an account?
                <span @click="switchToLogin" class="toggle-link">Login</span>
              </span>
            </p>
          </v-col>

          <!-- Right Panel: Login/Signup -->
          <v-col class="right-panel" cols="6">
            <v-card class="form-container" elevation="10">
              <!-- Dynamic Title for Signup/Login -->
              <h2 class="text-center mb-4">{{ currentPageIsSignup ? 'Sign Up' : 'Login' }}</h2>

              <!-- Signup Form -->
              <form v-if="currentPageIsSignup" @submit.prevent="signup">
                <v-text-field class="field" v-model="formSignup.username" label="Username" required></v-text-field>
                <v-text-field class="field" v-model="formSignup.email" label="Email" type="email" required></v-text-field>
                <v-text-field class="field" v-model="formSignup.password" label="Password" type="password" required></v-text-field>
                <v-btn color="primary" type="submit" class="mt-4" :loading="isLoading">Sign Up</v-btn>
              </form>

              <!-- Login Form -->
              <form v-else @submit.prevent="login">
                <v-text-field class="field" v-model="formLogin.username" label="Username" required></v-text-field>
                <v-text-field class="field" v-model="formLogin.password" label="Password" type="password" required></v-text-field>
                <v-btn color="primary" type="submit" class="mt-4" :loading="isLoading">Login</v-btn>
              </form>

              <!-- Switch between Login/Signup -->
              <p class="text-center mt-2">
                Switch to
                <span @click="togglePage" class="toggle-link">
                  {{ currentPageIsSignup ? 'Login' : 'Signup' }}
                </span>
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      currentPageIsSignup: false, // Start with Login
      formSignup: { username: "", email: "", password: "" },
      formLogin: { username: "", password: "" },
      isLoading: false,
      generalError: "",
      dialog: false,
    };
  },
  methods: {
    togglePage() {
      this.currentPageIsSignup = !this.currentPageIsSignup;
      this.animateTransition();
    },

    switchToSignup() {
      this.currentPageIsSignup = true;
      this.animateTransition();
    },

    switchToLogin() {
      this.currentPageIsSignup = false;
      this.animateTransition();
    },

    animateTransition() {
      const container = this.$el.querySelector('.login-card');
      container.classList.add('switching-animation');

      setTimeout(() => {
        container.classList.remove('switching-animation');
      }, 500);

      const leftPanelText = this.$el.querySelector('.left-panel h1');
      const rightPanelText = this.$el.querySelector('.right-panel h2');

      if (this.currentPageIsSignup) {
        leftPanelText.classList.add('fade-out-text');
        rightPanelText.classList.add('fade-in-text');
      } else {
        leftPanelText.classList.remove('fade-out-text');
        rightPanelText.classList.remove('fade-in-text');
      }
    },

    async login() {
      const loginData = {
        username: this.formLogin.username,
        password: this.formLogin.password,
      };
      this.isLoading = true;
      try {
        const response = await axios.post(
          `http://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/auth/login`,
          loginData
        );
        console.log("Login successful:", response.data);
        localStorage.setItem("token", response.data.token);
        this.isLoading = false;
        window.location.reload();
      } catch (error) {
        console.error("Login error:", error);
        this.generalError = error.response.data.message;
        this.isLoading = false;
      }
    },

    async signup() {
      const signupData = {
        username: this.formSignup.username,
        email: this.formSignup.email,
        password: this.formSignup.password,
      };
      this.isLoading = true;
      try {
        const response = await axios.post(
          `http://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/auth/register`,
          signupData
        );
        console.log("Signup successful:", response.data);
        this.isLoading = false;
        if (response.status === 201) {
          this.dialog = true;
          this.switchToLogin();
        }
      } catch (error) {
        console.error("Signup error:", error);
        this.generalError = error.response.data.message;
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
#Background {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-card {
  width: 70%;
  height: 80%;
  display: flex;
  overflow: hidden;
  border-radius: 16px;
  position: relative;
  transition: transform 0.5s ease-in-out;
}

.left-panel {
  background-color: black;
  color: white;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 1s ease;
}

.left-panel::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: skewY(-15deg);
  transform-origin: top left;
  z-index: -1;
}

.right-panel {
  background-color: #bbbaba;
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 1s ease;
}

.field {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.mt-4 {
  margin: 0.5rem;
  display: block;
  width: 97%;
  border-radius: 0.5rem;
}

.form-container {
  width: 100%;
  border-radius: 16px;
}

.toggle-link {
  color: #07b5ff;
  cursor: pointer;
  text-decoration: underline;
}

.toggle-link:hover {
  color: #005a99;
}

.switching-animation .left-panel {
  transform: translateX(-100%) rotate(260deg);
}

.switching-animation .right-panel {
  transform: translateX(100%) rotate(-260deg);
}

.fade-out-text {
  animation: fadeOut 0.5s ease-out;
}

.fade-in-text {
  animation: fadeIn 0.5s ease-in;
}
</style>
