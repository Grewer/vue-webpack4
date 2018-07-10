<template>
  <div class="test">bar

    <router-link :to="'/page'">next</router-link>
  </div>
</template>

<script>
  export default {
    name: "bar"
  }
</script>

<style scoped>
  .test {
    width: 500px;
    background-color: red;
  }
</style>
