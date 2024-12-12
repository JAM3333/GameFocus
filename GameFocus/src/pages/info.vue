<template>
  <v-app>
    <v-container class="py-10" style="color: white; position: relative;">
      <!-- Title Section -->
      <div class="top_section">
        <v-row class="text-center mb-10" justify="center">
          <v-col class="logo_name_description" cols="12" sm="8" md="6">
            <div class="name_logo">
              <v-img
                src="@/assets/logo.png"
                alt="logo"
                aspect-ratio="16/9"
                class="logo"
              ></v-img>
              <h1 class="title">GameFocus</h1>
            </div>
            <div class="p-5">
              <p id="description" style="font-size: 1.2rem;">
                Game Focus ist die ultimative Plattform, um Spielpreise von verschiedenen Anbietern zu vergleichen.
              </p>
            </div>
          </v-col>
          <v-col cols="12" sm="4" class="text-right">
            <v-img
              src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg?t=1729703045"
              alt="Far Cry 6"
              aspect-ratio="16/9"
              class="featured-image"
            ></v-img>
          </v-col>
        </v-row>
      </div>

      <!-- Row of Images -->
      <v-row class="mb-10 justify-center">
        <v-col cols="6" sm="3">
          <v-img
            src="https://pics.computerbase.de/1/0/2/4/3/2-68dc258ba21a0ba6/article-1280x720.6e40d942.jpg"
            alt="Bild 1"
            aspect-ratio="16/9"
            class="inline-image"
          ></v-img>
        </v-col>
        <v-col cols="6" sm="3">
          <v-img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJANR1OZtB3WTef1I80MZGu8t93BEfj5BfXg&s"
            alt="Bild 2"
            aspect-ratio="16/9"
            class="inline-image"
          ></v-img>
        </v-col>
        <v-col cols="6" sm="3">
          <v-img
            src="https://www.riotgames.com/darkroom/1440/8d5c497da1c2eeec8cffa99b01abc64b:5329ca773963a5b739e98e715957ab39/ps-f2p-val-console-launch-16x9.jpg"
            alt="Bild 3"
            aspect-ratio="16/9"
            class="inline-image"
          ></v-img>
        </v-col>
        <v-col cols="6" sm="3">
          <v-img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIpunWoYZ5Z74E8-TyuYa_WF8bNRASsRcZPg&s"
            alt="Bild 4"
            aspect-ratio="16/9"
            class="inline-image"
          ></v-img>
        </v-col>
      </v-row>

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
          :src="img.src"
          alt="Spielbild"
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
      images: [
        { src: "https://pics.computerbase.de/1/0/2/4/3/2-68dc258ba21a0ba6/article-1280x720.6e40d942.jpg", style: "top: 10%; left: 10%; width: 150px;" },
        { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJANR1OZtB3WTef1I80MZGu8t93BEfj5BfXg&s", style: "top: 5%; left: 30%; width: 150px;" },
        { src: "https://www.riotgames.com/darkroom/1440/8d5c497da1c2eeec8cffa99b01abc64b:5329ca773963a5b739e98e715957ab39/ps-f2p-val-console-launch-16x9.jpg", style: "top: 10%; right: 10%; width: 100px;" },
        { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIpunWoYZ5Z74E8-TyuYa_WF8bNRASsRcZPg&s", style: "bottom: 50%; left: 20%; width: 120px;" },
        { src: "https://assets.nintendo.com/image/upload/q_auto/f_auto/ncom/software/switch/70010000012332/ac4d1fc9824876ce756406f0525d50c57ded4b2a666f6dfe40a6ac5c3563fad9", style: "bottom: 40%; right: 20%; width: 120px;" },
        { src: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/capsule_616x353.jpg?t=1720558643", style: "bottom: 80%; right: 30%; width: 120px;" },
        { src: "https://cerealkillerz.org/wp-content/uploads/2018/06/the-crew-2-listing-thumb-01-ps4-us-13mar18_1525774315.png", style: "bottom: 50%; left: 40%; width: 150px;" },
      ],
    };
  },
};
</script>

<style scoped>
.name_logo {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center; /* Zentriert die Elemente */
  gap: 10px; /* Abstand zwischen Logo und Text */
}

.logo {
  max-width: 50px; /* Maximalgröße des Logos */
  height: auto; /* Beibehaltung des Seitenverhältnisses */
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}

.top_section {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.p-5 {
  display: flex;
  justify-content: center;
  align-content: center;
}

.text-center {
  text-align: center;
}

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
</style>
