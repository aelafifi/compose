<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on" @click="$emit('click', $event)" :color="color">
        <v-icon v-text="icon"></v-icon>
      </v-btn>
    </template>
    <span v-text="tooltip"></span>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  name: "IconButtonWithTooltip",
  props: ["icon", "tooltip", "color"],
};
</script>
