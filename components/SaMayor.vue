<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-6">Santa Ana Mayoral Race - All Wards</h2>
    <div v-if="loading" class="text-gray-600">Loading...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else class="overflow-x-auto shadow-lg rounded-lg">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Party</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Returned</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Issued</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Return Rate</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(total, party) in totals" :key="party" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-900">{{ party }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ formatNumber(total.returned) }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ formatNumber(total.issued) }}</td>
            <td class="px-6 py-4 text-sm text-gray-900 relative">
              <div 
                class="absolute inset-0 bg-gradient-to-r from-green-100 to-green-200 opacity-50" 
                :style="{ width: `${calculatePercentage(total.returned, total.issued)}%` }"
              ></div>
              <span class="relative">{{ calculatePercentage(total.returned, total.issued) }}%</span>
            </td>
          </tr>
          <tr class="bg-gray-50">
            <td class="px-6 py-4 text-sm font-bold text-gray-900">Total</td>
            <td class="px-6 py-4 text-sm font-bold text-gray-900">{{ formatNumber(grandTotal.returned) }}</td>
            <td class="px-6 py-4 text-sm font-bold text-gray-900">{{ formatNumber(grandTotal.issued) }}</td>
            <td class="px-6 py-4 text-sm font-bold text-gray-900 relative">
              <div 
                class="absolute inset-0 bg-gradient-to-r from-green-100 to-green-200 opacity-50" 
                :style="{ width: `${calculatePercentage(grandTotal.returned, grandTotal.issued)}%` }"
              ></div>
              <span class="relative">{{ calculatePercentage(grandTotal.returned, grandTotal.issued) }}%</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const loading = ref(true)
const error = ref(null)
const wardData = ref([])

const totals = computed(() => {
  const partyTotals = {}
  
  wardData.value.forEach(ward => {
    ward.returned.data.forEach(item => {
      if (item.label !== 'Total' && !partyTotals[item.label]) {
        partyTotals[item.label] = { returned: 0, issued: 0 }
      }
      if (item.label !== 'Total') {
        partyTotals[item.label].returned += parseInt(item.value.replace(',', ''))
      }
    })
    
    ward.issued.data.forEach(item => {
      if (item.label !== 'Total' && !partyTotals[item.label]) {
        partyTotals[item.label] = { returned: 0, issued: 0 }
      }
      if (item.label !== 'Total') {
        partyTotals[item.label].issued += parseInt(item.value.replace(',', ''))
      }
    })
  })
  
  return partyTotals
})

const grandTotal = computed(() => {
  return Object.values(totals.value).reduce(
    (acc, curr) => ({
      returned: acc.returned + curr.returned,
      issued: acc.issued + curr.issued
    }),
    { returned: 0, issued: 0 }
  )
})

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const calculatePercentage = (returned, issued) => {
  if (!issued) return '0.0'
  return ((returned / issued) * 100).toFixed(1)
}

const fetchAllWardData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const wards = [1, 2, 3, 4, 5, 6]
    const wardPromises = wards.map(async (ward) => {
      const [returned, issued] = await Promise.all([
        $fetch(`/api/ballot-data/ward${ward}/returned`),
        $fetch(`/api/ballot-data/ward${ward}/issued`)
      ])
      return { returned, issued }
    })
    
    wardData.value = await Promise.all(wardPromises)
  } catch (err) {
    error.value = `Failed to load ballot data: ${err.message}`
    console.error('Error fetching ballot data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAllWardData()
})
</script>

<style scoped>
.mayor-stats {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.total-row {
  background-color: #f8f8f8;
}

.total-row td {
  border-top: 2px solid #ddd;
}

@media (max-width: 600px) {
  .mayor-stats {
    padding: 1rem;
  }
  
  th, td {
    padding: 8px;
  }
}
</style> 