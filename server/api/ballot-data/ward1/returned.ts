import { defineEventHandler, createError } from 'h3'

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

export default defineEventHandler(async (event) => {
  try {
    return await fetchBallotData()
  } catch (error) {
    console.error('Server error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch returned ballot data'
    })
  }
}) 