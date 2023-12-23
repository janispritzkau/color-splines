<script setup lang="ts">
import { useDark, useLocalStorage } from "@vueuse/core";
import HuePlot from "./HuePlot.vue";

const dark = useDark();
const colorSpace = useLocalStorage<"srgb" | "display-p3">("colorSpace", "srgb");
const showFalloff = useLocalStorage<boolean>("falloff", false);
const falloffLines = useLocalStorage<boolean>("falloffLines", false);
</script>

<template>
  <div class="container mx-auto my-8 px-4">
    <button class="btn float-right" @click="dark = !dark">
      {{ dark ? "Light" : "Dark" }}
    </button>

    <h1
      class="mx-auto mb-8 max-w-fit bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 bg-clip-text text-2xl font-semibold text-transparent dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-400">
      Color Splines
    </h1>

    <HuePlot
      class="overflow-clip rounded-lg outline outline-1 -outline-offset-1 outline-black/20 dark:outline-white/15"
      :color-space="colorSpace"
      :show-falloff="showFalloff"
      :falloff-lines="falloffLines" />

    <div class="my-4 flex justify-center gap-4">
      <select v-model="colorSpace" class="input">
        <option value="srgb">sRGB</option>
        <option value="display-p3">Display P3</option>
      </select>
      <select v-model="showFalloff" class="input">
        <option :value="false">Lightness</option>
        <option :value="true">Chroma Falloff</option>
      </select>
      <select v-model="falloffLines" class="input">
        <option :value="false">Hide Lines</option>
        <option :value="true">Show Lines</option>
      </select>
    </div>
  </div>
</template>
