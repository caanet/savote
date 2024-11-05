<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-2">Santa Ana Ballot Returns</h1>
    <p class="text-center text-gray-600 mb-8">
      Data updates hourly after 7:00 AM on November 5, 2024
      <br>
      <span class="text-sm">Next update in: {{ timeUntilNextUpdate }}</span>
    </p>
    <SaMayor class="mb-12" />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Saw1Ballots class="w-full" />
      <Saw3Ballots class="w-full" />
      <Saw5Ballots class="w-full" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const timeUntilNextUpdate = ref('')
let timer

const updateCountdown = () => {
  const now = new Date()
  const startDate = new Date('2024-11-05T07:00:00-08:00') // 7 AM PST on Nov 5, 2024
  
  // If we haven't reached the start date yet
  if (now < startDate) {
    timeUntilNextUpdate.value = 'Updates begin November 5, 2024 at 7:00 AM PST'
    return
  }

  const nextUpdate = new Date(now)
  nextUpdate.setHours(nextUpdate.getHours() + 1, 0, 0, 0)
  
  const diff = nextUpdate - now
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  timeUntilNextUpdate.value = `${minutes}m ${seconds}s`
}

onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
