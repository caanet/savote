import { defineEventHandler, createError } from 'h3'

async function fetchBallotData(url: string) {
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
}

export default defineEventHandler(async (event) => {
  try {
    const url = 'https://www.ocvote.gov/datacentral/bin/get.php?q=vbm-counts-issued&p=*568-1'
    return await fetchBallotData(url)
  } catch (error) {
    console.error('Error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch issued ballot data'
    })
  }
}) 