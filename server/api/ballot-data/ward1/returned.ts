import { defineCachedEventHandler } from '#internal/nitro'

export default defineCachedEventHandler(async (event) => {
  try {
    const startDate = new Date('2025-11-05T07:00:00-08:00') // PST start time
    const now = new Date()
    
    // If we haven't reached the start date, don't cache
    if (now < startDate) {
      return await fetchBallotData()
    }

    // Cache for 1 hour if we're past the start date
    event.context.cache = {
      maxAge: 3600 // 1 hour in seconds
    }

    return await fetchBallotData()
  } catch (error) {
    console.error('Server error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch returned ballot data'
    })
  }
})

// Separate function for fetching data
async function fetchBallotData() {
  const response = await fetch('https://www.ocvote.gov/datacentral/bin/get.php?q=vbm-counts-returned&p=*568-1')
  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      message: 'Failed to fetch returned ballot data'
    })
  }
  return await response.json()
} 