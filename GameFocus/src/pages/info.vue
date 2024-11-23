<template>
  <v-app>
    <v-container class="py-10" style="color: white; position: relative;">
      <!-- Title Section -->
      <div class="top_section">
      <v-row class="text-center mb-10">
        <v-col>
          <div class="name_logo">
          <v-img src="@/assets/logo.png"
                 alt="logo"
                 aspect-ratio="16/9"
                 class="logo"
          ></v-img>
            <h1 style="font-size: 2.5rem; font-weight: bold;">GameFocus</h1></div>
          <div class="p-5">
          <p id="description" style="font-size: 1.2rem;">
            Game Focus ist die ultimative Plattform, um Spielepreise von verschiedenen Anbietern zu vergleichen.
          </p></div>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="text-right" style="margin-right: 5vw;">
          <v-img
            src="https://via.placeholder.com/300x169.png?text=Game+Image"
            alt="Far Cry 6"
            aspect-ratio="16/9"
            class="featured-image"
          ></v-img>
        </v-col>
      </v-row>
      </div>



      <!-- Description Section -->
      <v-row class="text-center mb-10">
        <v-col>
          <h2 style="font-size: 2rem; font-weight: bold;">Sofort Preise von Spielen vergleichen</h2>
          <p style="font-size: 1.2rem;">
            Spielpreise von vielen verschiedenen Spielanbietern vergleichen. Erfreuen Sie sich an exklusiven Angeboten und anderen großartigen Vorteilen.
          </p>
        </v-col>
      </v-row>


      <!-- Game Images (Random Layout) -->
      <div class="game-images">
        <v-img
          v-for="(img, index) in images"
          :key="index"
          src="https://via.placeholder.com/300x169.png?text=Game+Image"
          alt="Far Cry 6"
          class="game-image"
          :style="img.style"
        ></v-img>
      </div>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "GameFocusPage",
  data() {
    return {
      // Coordinates and sizes for the overlapping images
      images: [
        { style: "top: 50%; left: 10%; width: 150px;" },
        { style: "top: 50%; right: 10%; width: 100px;" },
        { style: "bottom: 10%; left: 20%; width: 120px;" },
        { style: "bottom: 10%; right: 20%; width: 120px;" },
        { style: "bottom: 0; left: 40%; width: 150px;" },
      ],
    };
  },
};
</script>

<style scoped>
/* Styling for general text and layout */
h1 {
  font-size: 2.5rem;
  font-weight: bold;
}
h2 {
  font-size: 2rem;
  font-weight: bold;
}
p {
  font-size: 1.2rem;
}

/* Featured game image (right-aligned) */
.featured-image {
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
}

/* Game images with absolute positioning for random layout */
.game-images {
  position: relative;
  height: 400px;
  width: 100%;
}
.game-image {
  position: absolute;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
}

.logo{
  max-width: 50px;
}

.name_logo{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.top_section{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

#description{
  text-align: center;
  text-wrap: wrap;
  width: 40%;
}

.p-5{
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>
