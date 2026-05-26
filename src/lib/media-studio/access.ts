export function isMediaStudioAuthorized(request: Request) {
  const configuredToken = process.env.MEDIA_STUDIO_TOKEN?.trim()

  if (!configuredToken) {
    return process.env.NODE_ENV !== 'production'
  }

  const url = new URL(request.url)
  const suppliedToken =
    request.headers.get('x-media-studio-token') ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    url.searchParams.get('token')

  return suppliedToken === configuredToken
}

export function getMediaStudioAuthMessage() {
  if (!process.env.MEDIA_STUDIO_TOKEN && process.env.NODE_ENV === 'production') {
    return 'MEDIA_STUDIO_TOKEN must be configured in production.'
  }

  return 'Media Studio access token required.'
}

