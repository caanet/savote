<template>
  <div class="ballot-returns">
    <h2>Santa Ana Ward 1</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="formattedData.length">
      <table>
        <thead>
          <tr>
            <th>Party</th>
            <th>Ballots Returned</th>
            <th>Ballots Issued</th>
            <th>Return Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in formattedData.slice(0, -1)" :key="item.label">
            <td>{{ item.label }}</td>
            <td>{{ item.returned }}</td>
            <td>{{ item.issued }}</td>
            <td class="px-6 py-4 text-sm text-gray-900 relative">
              <div 
                class="absolute inset-0 bg-gradient-to-r from-green-100 to-green-200 opacity-50" 
                :style="{ width: `${calculatePercentage(item.returned, item.issued)}%` }"
              ></div>
              <span class="relative">{{ calculatePercentage(item.returned, item.issued) }}%</span>
            </td>
          </tr>
          <tr class="total-row">
            <td class="bold">{{ formattedData[formattedData.length - 1].label }}</td>
            <td class="bold">{{ formattedData[formattedData.length - 1].returned }}</td>
            <td class="bold">{{ formattedData[formattedData.length - 1].issued }}</td>
            <td class="px-6 py-4 text-sm font-bold text-gray-900 relative">
              <div 
                class="absolute inset-0 bg-gradient-to-r from-green-100 to-green-200 opacity-50" 
                :style="{ width: `${calculatePercentage(formattedData[formattedData.length - 1].returned, formattedData[formattedData.length - 1].issued)}%` }"
              ></div>
              <span class="relative">{{ calculatePercentage(formattedData[formattedData.length - 1].returned, formattedData[formattedData.length - 1].issued) }}%</span>
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
      $fetch('/api/ballot-data/ward1/returned'),
      $fetch('/api/ballot-data/ward1/issued')
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