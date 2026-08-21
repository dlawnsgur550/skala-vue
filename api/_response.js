export const getCoordinates = (request) => {
  const requestUrl = new URL(request.url)
  const latitude = Number(requestUrl.searchParams.get('lat'))
  const longitude = Number(requestUrl.searchParams.get('lon'))

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  return { latitude, longitude }
}

export const jsonResponse = (data, status = 200, cache = false) => {
  const headers = { 'Content-Type': 'application/json; charset=utf-8' }

  if (cache) {
    headers['Cache-Control'] = 's-maxage=600, stale-while-revalidate=60'
  }

  return new Response(JSON.stringify(data), { status, headers })
}
