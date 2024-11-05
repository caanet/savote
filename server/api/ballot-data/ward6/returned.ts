export default defineEventHandler(async () => {
  try {
    const response = await fetch('https://www.ocvote.gov/datacentral/bin/get.php?q=vbm-counts-returned&p=*568-6')
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: 'Failed to fetch returned ballot data'
      })
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Server error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch returned ballot data'
    })
  }
}) 