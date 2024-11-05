import { useStorage } from '#internal/nitro'

export function getCacheKey(prefix: string, params: Record<string, any>): string {
  const parts = [prefix]
  for (const [key, value] of Object.entries(params)) {
    parts.push(`${key}:${value}`)
  }
  return parts.join('-')
}

export async function getCache(key: string) {
  const storage = useStorage()
  return await storage.getItem(key)
}

export async function setCache(key: string, value: any, ttlSeconds: number) {
  const storage = useStorage()
  await storage.setItem(key, value, { ttl: ttlSeconds })
} 