<template>

<v-app>
   <div class="d-flex ga-8 mt-20 flex-column" id="Background">
      <v-btn :to="{path: '/'}" density="comfortable" icon="mdi-arrow-left-bold-outline" size="x-large" style="margin: 10px 10px;"></v-btn>
   </div>
    <v-main id="Background" class="d-flex align-center justify-center ga-8 mt-20 flex-column">
 <v-alert id="error" v-if="generalError" type="error">{{ generalError }}</v-alert>
            <v-card width="34vw" color="secondary" height="400px" class="d-flex align-center flex-column mr-16" elevation="12">
                <v-btn-toggle v-model="toggle_one" mandatory width="34vw">
                    <v-btn @click="pageToLogin()" width="17vw">Login</v-btn>
                    <v-btn @click="pageToSignup()" width="17vw">Sign Up</v-btn>
                </v-btn-toggle>

                <!-- LOGIN -->
                <form v-if="currentPageIsLogin" ref="form" @submit.prevent="login()" style="margin-top: 60px">
                  <v-text-field
                  v-if="currentLoginMethodUsername"
                     v-model="formLogin.username"
                     name="username"
                     label="Username"
                     type="text"
                     placeholder="username"
                  hide-details="true"
                    required
                  ></v-text-field>
                  <v-text-field
                  v-if="!currentLoginMethodUsername"
                     v-model="formLogin.email"
                     name="email"
                     label="Email"
                     type="email"
                     placeholder="username"
                  hide-details="true"
                     required
                  ></v-text-field>
                  <p @click="toggleEmailLogin()" class="mb-4" v-if="currentLoginMethodUsername">login with email instead</p>
                  <p @click="toggleEmailLogin()" class="mb-4" v-if="!currentLoginMethodUsername">login with username instead</p>
                  <v-text-field
                     v-model="formLogin.password"
                     name="password"
                     label="Password"
                     type="password"
                     placeholder="password"
                     required
                  ></v-text-field>
                  <v-btn type="submit" class="mt-4" color="primary" :loading="isLoading" :disabled="isLoading" value="log in" width="20vw">Login</v-btn>
               </form>

               <!-- SIGNUP -->
               <form v-if="currentPageIsSignup" ref="form" @submit.prevent="signup()" style="margin-top: 35px;">
                  <v-text-field
                     v-model="formSignup.email"
                     name="email"
                     label="Email"
                     type="email"
                     placeholder="email"
                     required
                  ></v-text-field>

                  <v-text-field
                     v-model="formSignup.username"
                     name="username"
                     label="Username"
                     type="text"
                     placeholder="username"
                     required
                  ></v-text-field>

                  <v-text-field
                     v-model="formSignup.password"
                     name="password"
                     label="Password"
                     type="password"
                     placeholder="password"
                     required
                  ></v-text-field>
                  <v-btn type="submit" class="mt-4"  :loading="isLoading" :disabled="isLoading" color="primary" value="log in" width="20vw" >Sign Up</v-btn>
               </form>
            </v-card>
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

<style scoped>
   p:hover {
      color: #07B5FF;
      cursor: pointer;
   }
   p {
      margin-top: 0px;
   }

   #Background {
      background: url('../assets/bg_login_modified.jpg') no-repeat center center fixed !important;
   }
   #error {
      position: absolute;
      top: 1vh;
   }
</style>
 <script>
 import axios from "axios";
import { onBeforeMount } from "vue";
import { generateCodeFrame } from "vue/compiler-sfc";
 export default {
   name: "Login",
   data() {
     return {
       username: "",
       password: "",
       email: "",
       isLoading: false,
       currentPageIsLogin: true,
       currentPageIsSignup: false,
       currentLoginMethodUsername: true,
       toggle_one: 0,
       generalError: '',
       dialog: false,
       formLogin: {
         username: "",
         password: "",
         email: "",
       },
       formSignup: {

       }

     };
   },
   methods: {

      async login() {
            const loginData = {
              username: this.formLogin.username,
              email: this.formLogin.email,
              password: this.formLogin.password
            };
            this.isLoading = true;
            await axios.post("http://" + import.meta.env.VITE_SERVER_IP + ":" + import.meta.env.VITE_SERVER_PORT + "/auth/login", loginData)
            .then((response) => {
               console.log("answer from server:", response.data);
               let token = response.data.token;
               console.log(token);
               localStorage.setItem('token', token);
               this.isLoading = false;
              window.location.reload()
            })
            .catch((error) => {
              this.generalError = error.response.data.message;
              this.isLoading = false;
              console.error("Error with the Login request:", error);
            });
      },
      async signup() {
         const signupData = {
            email: this.formSignup.email,
            username: this.formSignup.username,
            password: this.formSignup.password
         };
        this.isLoading = true;
        await axios.post("http://" + import.meta.env.VITE_SERVER_IP + ":" + import.meta.env.VITE_SERVER_PORT + "/auth/register", signupData)
         .then((response) => {
            console.log("answer from server:", response.data);
           this.isLoading = false;
           if (response.status === 201) {
             this.dialog = true;
            this.pageToLogin();
            }
         })
         .catch((error) => {
            console.error("Error with the POST request:", error);
           this.isLoading = false;
           this.generalError = error.response.data.message;
         });
      },
      pageToSignup() {
         this.currentPageIsLogin = false;
         this.currentPageIsSignup = true;
      },
      pageBack(){
         this.$router.push({ name: 'Home'});
      },
     pageToLogin() {
       this.currentPageIsLogin = true;
       this.currentPageIsSignup = false;
     },
     toggleEmailLogin() {
          this.formLogin.username = "";
          this.formLogin.email = "";
         this.currentLoginMethodUsername = !this.currentLoginMethodUsername;
      }
   },
 };
 </script>
