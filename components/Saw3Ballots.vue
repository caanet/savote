<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Santa Ana Ward 3</h2>
    <div v-if="loading" class="text-gray-600">Loading...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="formattedData.length" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ballots Returned</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ballots Issued</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Rate</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in formattedData.slice(0, -1)" :key="item.label" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.label }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.returned }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.issued }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative">
              <div 
                class="absolute inset-0 bg-gradient-to-r from-green-100 to-green-200 opacity-50" 
                :style="{ width: `${item.percentage}%` }"
              ></div>
              <span class="relative z-10">{{ item.percentage }}%</span>
            </td>
          </tr>
          <tr class="bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ formattedData[formattedData.length - 1].label }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ formattedData[formattedData.length - 1].returned }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ formattedData[formattedData.length - 1].issued }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 relative">
              <div 
                class="absolute inset-0 bg-gradient-to-r from-green-100 to-green-200 opacity-50" 
                :style="{ width: `${formattedData[formattedData.length - 1].percentage}%` }"
              ></div>
              <span class="relative z-10">{{ formattedData[formattedData.length - 1].percentage }}%</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Define all reactive variables
const returnedData = ref(null)
const issuedData = ref(null)
const loading = ref(true)
const error = ref(null)

const formattedData = computed(() => {
  if (!returnedData.value?.data || !issuedData.value?.data) return []
  
  return returnedData.value.data.map(returned => {
    const issued = issuedData.value.data.find(i => i.label === returned.label)
    const returnedNum = parseInt(returned.value.replace(',', ''))
    const issuedNum = parseInt(issued?.value.replace(',', '') || '0')
    
    return {
      label: returned.label,
      returned: returned.value,
      issued: issued?.value || '0',
      percentage: issuedNum ? ((returnedNum / issuedNum) * 100).toFixed(1) : '0.0'
    }
  })
})

const fetchData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const [returnedResponse, issuedResponse] = await Promise.all([
      $fetch('/api/ballot-data/ward3/returned'),
      $fetch('/api/ballot-data/ward3/issued')
    ])
    
    returnedData.value = returnedResponse
    issuedData.value = issuedResponse
  } catch (err) {
    error.value = `Failed to load ballot data: ${err.message}`
    console.error('Error fetching ballot data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.ballot-returns {
  padding: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.total-row {
  background-color: #f8f8f8;
}

.total-row td {
  border-top: 2px solid #ddd;
}

.bold {
  font-weight: bold;
}
</style>