import defaultSettings from '@/settings'

const title = defaultSettings.title || 'MiKiWaMe Point'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
