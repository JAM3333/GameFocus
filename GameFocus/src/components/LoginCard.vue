<template>
  <v-app>
    <v-main>
      <v-container class="d-flex justify-center align-center" id="Background">
        <v-row class="login-card">
          <!-- Left Panel: Conditional Text -->
          <v-col class="left-panel" cols="6">
            <h1>{{ currentPageText.title }}</h1>
            <p>{{ currentPageText.description }}</p>
            <p>
              <span v-if="!currentPageIsSignup">
                {{ currentPageText.toggle }}
              </span>
              <span v-if="currentPageIsSignup">
                {{ currentPageText.toggle }}
              </span>&nbsp
              <span @click="togglePage" class="toggle-link">
                {{ currentPageIsSignup ? 'Login' : 'Signup' }}
              </span>
            </p>
          </v-col>

          <v-col class="right-panel" cols="6">
            <v-card class="form-container" elevation="10">
              <h2 class="text-center mb-4">{{ currentPageText.page }}</h2>

              <!-- Signup Form -->
              <form v-if="currentCardContent === 'signup'">
                <v-text-field class="field" v-model="formSignup.username" label="Username" required></v-text-field>
                <v-text-field class="field" v-model="formSignup.email" label="Email" type="email" required></v-text-field>
                <v-text-field class="field" v-model="formSignup.password" label="Password" type="password" required></v-text-field>
                <v-btn color="primary" class="mt-4" :loading="isLoading" @click="signup">Sign Up</v-btn>
              </form>

              <!-- Login Form -->
              <form v-else>
                <v-text-field class="field" v-model="formLogin.username" label="Username" required></v-text-field>
                <v-text-field class="field" v-model="formLogin.password" label="Password" type="password" required></v-text-field>
                <v-btn color="primary" class="mt-4" :loading="isLoading" @click="login">Login</v-btn>
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
      currentPageText: {
        title: "WELCOME BACK!",
        description: "Hello again! Log in to access your personalized experience.",
        toggle: "Don't have an account yet?",
        page: "Login",
      },
      currentCardContent: "login",
    };
  },
  methods: {
    togglePage() {
      this.currentPageIsSignup = !this.currentPageIsSignup;
      this.animateTransition();
      this.changeText();
      this.changeCardContent();
    },

    animateTransition() {
      const container = this.$el.querySelector('.login-card');

      // Remove previous transition classes
      container.classList.remove('show-signup', 'show-login');

      // Add the transition class based on the current page
      if (this.currentPageIsSignup) {
        container.classList.add('show-signup'); // Class for Signup
      } else {
        container.classList.add('show-login'); // Class for Login
      }
    },

    changeText() {
      setTimeout(() => {
        if (this.currentPageIsSignup) {
          this.currentPageText = {
            title: "WELCOME!",
            description: "Create an account to get personalized experience",
            toggle: "Already have an account?",
            page: "Sign Up",
          };
        } else {
          this.currentPageText = {
            title: "WELCOME BACK!",
            description: "Hello again! Log in to access your personalized experience.",
            toggle: "Don't have an account yet?",
            page: "Login",
          };
        }
      }, 300);
    },

    changeCardContent() {
      setTimeout(() => {
        this.currentCardContent = this.currentPageIsSignup ? "signup" : "login";
      }, 300);
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
  transition: transform 0.5s ease;
  margin-top: -5rem;
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
  background-color: #232121;
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 1s ease;
  z-index: -1;
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
  transform: translateX(100%);
}

.switching-animation .right-panel {
  transform: translateX(-100%);
}

/* Standard view: Login */
.login-card {
  transform: translateX(0);
  transition: transform 0.5s ease-in-out;
}

/* Class when Signup is active */
.show-signup .left-panel {
  transform: translateX(100%);
}

.show-signup .right-panel {
  transform: translateX(-100%);
}

/* Class when Login is active */
.show-login .left-panel {
  transform: translateX(0);
}

.show-login .right-panel {
  transform: translateX(0);
}
</style>
