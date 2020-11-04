<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" :color="color" icon @click="$emit('click', $event)">
        <v-icon :class="iconClass" v-text="icon"></v-icon>
      </v-btn>
    </template>
    <span v-text="tooltip"></span>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  name: "IconButtonWithTooltip",
  props: ["icon", "tooltip", "color", "iconClass"],
};
</script>

<style lang="scss" scoped>
@import "~bootstrap/scss/bootstrap";
</style>