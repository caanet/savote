import { defineEventHandler, createError } from 'h3'
import { getCacheKey, getCache, setCache } from '~/server/utils/cache'

export default defineEventHandler(async (event) => {
  try {
    const startDate = new Date('2024-11-05T07:00:00-08:00') // 7 AM PST on Nov 5, 2024
    const now = new Date()
    
    // Before start date, don't cache
    if (now < startDate) {
      const response = await fetch('https://www.ocvote.gov/datacentral/bin/get.php?q=vbm-counts-issued&p=*568-1')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    }

    // After start date, cache hourly
    const cacheKey = getCacheKey('ward1-issued-ballots', {
      hour: now.getHours(),
      day: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear()
    })

    // Try to get cached data first
    const cachedData = await getCache(cacheKey)
    if (cachedData) {
      return cachedData
    }

    // If no cache, fetch new data
    const response = await fetch('https://www.ocvote.gov/datacentral/bin/get.php?q=vbm-counts-issued&p=*568-1')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    // Cache the data for 1 hour
    await setCache(cacheKey, data, 60 * 60) // 3600 seconds = 1 hour

    return data
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch issued ballot data'
    })
  }
}) 