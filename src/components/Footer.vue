<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-white dark:bg-gray-800 shadow-lg mt-auto">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex justify-center items-center">
        <p class="text-gray-500 dark:text-gray-400">
          © {{ currentYear }} Portfolio. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>