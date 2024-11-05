import { defineEventHandler, createError } from 'h3'
import { getCacheKey, getCache, setCache } from '~/server/utils/cache'

export default defineEventHandler(async (event) => {
  try {
    const startDate = new Date('2024-11-05T07:00:00-08:00') // 7 AM PST on Nov 5, 2024
    const now = new Date()
    
    const url = 'https://www.ocvote.gov/datacentral/bin/get.php?q=vbm-counts-issued&p=*568-1'
    
    // Before start date, don't cache
    if (now < startDate) {
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; SAVoteBot/1.0)'
          }
        })
        
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`)
          throw createError({
            statusCode: response.status,
            message: `Failed to fetch data: ${response.statusText}`
          })
        }
        
        return await response.json()
      } catch (fetchError) {
        console.error('Fetch error:', fetchError)
        throw createError({
          statusCode: 500,
          message: 'Failed to fetch ballot data: Network error'
        })
      }
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
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; SAVoteBot/1.0)'
        }
      })
      
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`)
        throw createError({
          statusCode: response.status,
          message: `Failed to fetch data: ${response.statusText}`
        })
      }

      const data = await response.json()
      
      // Cache the data for 1 hour
      await setCache(cacheKey, data, 60 * 60) // 3600 seconds = 1 hour

      return data
    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch ballot data: Network error'
      })
    }
  } catch (error) {
    console.error('General error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch issued ballot data'
    })
  }
}) 