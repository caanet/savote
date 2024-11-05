<template>
  <div class="ballot-returns">
    <h2>Santa Ana Ward 3</h2>
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
            <td>{{ item.percentage }}%</td>
          </tr>
          <tr class="total-row">
            <td class="bold">{{ formattedData[formattedData.length - 1].label }}</td>
            <td class="bold">{{ formattedData[formattedData.length - 1].returned }}</td>
            <td class="bold">{{ formattedData[formattedData.length - 1].issued }}</td>
            <td class="bold">{{ formattedData[formattedData.length - 1].percentage }}%</td>
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