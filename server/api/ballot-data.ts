export default defineEventHandler(async (event) => {
  try {
    const response = await fetch('https://www.ocvote.gov/datacentral/bin/get.php?q=vbm-counts-returned&p=*568-1')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  } catch (error) {
    console.error('Server API error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch ballot data'
    })
  }
}) 