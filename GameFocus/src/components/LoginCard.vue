<template>
  <v-app>
    <v-main>
      <!-- General Error Alert -->
      <v-alert id="error" v-if="generalError" type="error">{{ generalError }}</v-alert>

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
              </span>&nbsp;
              <span @click="togglePage" class="toggle-link">
                {{ currentPageIsSignup ? "Login" : "Signup" }}
              </span>
            </p>
          </v-col>

          <v-col class="right-panel" cols="6">
            <v-card class="form-container" elevation="10">
              <h2 class="text-center mb-4">{{ currentPageText.page }}</h2>

              <!-- Signup Form -->
              <form v-if="currentCardContent === 'signup'">
                <v-text-field
                  class="field"
                  v-model="formSignup.username"
                  label="Username"
                  :error-messages="signupErrors.username"
                  required
                  @keyup.enter="validateSignup"
                ></v-text-field>
                <v-text-field
                  class="field"
                  v-model="formSignup.email"
                  label="Email"
                  type="email"
                  :error-messages="signupErrors.email"
                  required
                  @keyup.enter="validateSignup"
                ></v-text-field>
                <v-text-field
                  class="field"
                  v-model="formSignup.password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  :error-messages="signupErrors.password"
                  required
                  @keyup.enter="validateSignup"
                >
                  <template v-slot:append-inner>
                    <v-icon @mousedown.prevent="showPassword = !showPassword">
                      {{ showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
                    </v-icon>
                  </template>
                </v-text-field>

                <v-btn
                  class="custom-button mt-4"
                  :loading="isLoading"
                  @click="validateSignup"
                >
                  Sign Up
                </v-btn>
              </form>

              <!-- Login Form -->
              <form v-else>
                <v-text-field
                  class="field"
                  v-model="formLogin.username"
                  label="Username"
                  :error-messages="loginErrors.username"
                  required
                  @keyup.enter="validateLogin"
                ></v-text-field>
                <v-text-field
                  class="field"
                  v-model="formLogin.password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  :error-messages="loginErrors.password"
                  required
                  @keyup.enter="validateLogin"
                >
                  <template v-slot:append-inner>
                    <v-icon @mousedown.prevent="showPassword = !showPassword">
                      {{ showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
                    </v-icon>
                  </template>
                </v-text-field>


                <v-btn
                  class="custom-button mt-4"
                  :loading="isLoading"
                  @click="validateLogin"
                >
                  Login
                </v-btn>
              </form>

              <!-- Switch between Login/Signup -->
              <p class="text-center mt-2">
                Switch to
                <span @click="togglePage" class="toggle-link">
                  {{ currentPageIsSignup ? "Login" : "Signup" }}
                </span>
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-dialog v-model="dialog" max-width="400px">
        <v-card>
          <v-card-title class="text-h6">
            Registration Successful
          </v-card-title>
          <v-card-text>
            Your registration was successful! Please verify your email to complete the process.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      showPassword: false,
      isLoading: false,
      generalError: "",
      dialog: false,
      signupErrors: { username: "", email: "", password: "" },
      loginErrors: { username: "", password: "" },
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
      const container = this.$el.querySelector(".login-card");

      container.classList.remove("show-signup", "show-login");

      if (this.currentPageIsSignup) {
        container.classList.add("show-signup");
      } else {
        container.classList.add("show-login");
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
            description:
              "Hello again! Log in to access your personalized experience.",
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

    validateSignup() {
      this.signupErrors = { username: "", email: "", password: "" };

      if (!this.formSignup.username) {
        this.signupErrors.username = "Username is required.";
      }
      if (!this.formSignup.email) {
        this.signupErrors.email = "Email is required.";
      } else if (!this.validateEmail(this.formSignup.email)) {
        this.signupErrors.email = "Enter a valid email address.";
      }
      if (!this.formSignup.password) {
        this.signupErrors.password = "Password is required.";
      }

      if (
        !this.signupErrors.username &&
        !this.signupErrors.email &&
        !this.signupErrors.password
      ) {
        this.signup();
      }
    },

    validateLogin() {
      this.loginErrors = { username: "", password: "" };

      if (!this.formLogin.username) {
        this.loginErrors.username = "Username is required.";
      }
      if (!this.formLogin.password) {
        this.loginErrors.password = "Password is required.";
      }

      if (!this.loginErrors.username && !this.loginErrors.password) {
        this.login();
      }
    },

    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
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
        this.generalError = error.response.data.message;
        this.isLoading = false;
        setTimeout(() => {
          this.generalError = "";
        }, 3000);
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
          this.togglePage();
        }
      } catch (error) {
        this.generalError = error.response.data.message;
        this.isLoading = false;
        setTimeout(() => {
          this.generalError = "";
        }, 3000);
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
#error{
  z-index: 2;
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
  z-index: 1;
}

.v-main::after {
  content: "";
  position: absolute;
  z-index: -1;
  bottom: 0;
  right: 0;
  width: 100%; /* Covers the entire card */
  height: 100%; /* Covers the entire card */
  background: radial-gradient(
    circle at bottom right,
    rgba(27, 27, 27, 0.8),
    rgba(0, 0, 0, 0) 70%
  );
  z-index: 0; /* Places it below the content */
  pointer-events: none; /* Ensures it doesn’t interfere with interactions */
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
@keyframes slide-in-left {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out-right {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.v-alert {
  position: absolute;
  width: 100%;
  animation: slide-in-left 0.5s ease forwards;
}

.v-alert.hide {
  animation: slide-out-right 0.5s ease forwards;
}

.custom-button {
  border-radius: 15px;
  cursor: pointer;
  background-color: #007bff;
  font-weight: 500;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s;
}

.v-alert {
  position: absolute;
  width: 100%;
}
.custom-button:hover {
  background-color: #005A89; /* Optionaler Hover-Effekt */
}
</style>

