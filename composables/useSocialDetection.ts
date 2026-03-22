export const useSocialDetection = () => {
  const isSocialReferrer = ref(false)
  const platform = ref<'facebook' | 'instagram' | 'tiktok' | null>(null)

  onMounted(() => {
    const ua = navigator.userAgent || ''
    const ref = document.referrer || ''
    const urlParams = new URLSearchParams(window.location.search)

    const isFB = ua.match(/FBAN|FBAV/i) || ref.includes('facebook.com') || urlParams.has('fbclid') || urlParams.get('utm_source') === 'facebook'
    const isIG = ua.match(/Instagram/i) || ref.includes('instagram.com') || urlParams.has('igshid') || urlParams.get('utm_source') === 'instagram'
    const isTT = ua.match(/TikTok/i) || ref.includes('tiktok.com') || urlParams.has('ttclid') || urlParams.get('utm_source') === 'tiktok' || urlParams.get('utm_medium') === 'tiktok'

    if (isFB) {
      platform.value = 'facebook'
      isSocialReferrer.value = true
    } else if (isIG) {
      platform.value = 'instagram'
      isSocialReferrer.value = true
    } else if (isTT) {
      platform.value = 'tiktok'
      isSocialReferrer.value = true
    }
  })

  return { isSocialReferrer, platform }
}
