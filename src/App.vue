<template>
  <div>
    <Navbar />
    <div class="contenido-principal">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from './components/Encabezado.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Rubik', sans-serif;
}

.container-fluid {
  max-width: 100% !important;
}

body {
  background-color: lavender;
  margin: 0;
  padding: 0;
}

.contenido-principal {
  background-color: lavender;
  min-height: 100vh;
}
</style>