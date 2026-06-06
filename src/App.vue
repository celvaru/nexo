<template>
  <div>
    <nav class="navbar navbar-expand-lg" style="background-color: mediumorchid;">
      <div class="container-fluid">
        <router-link class="navbar-brand text-white" to="/">Nexo Inmobiliario</router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNavegacion">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="menuNavegacion">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/">Crear cuenta</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/propiedades">Iniciar sesión</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="contenido-principal">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

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