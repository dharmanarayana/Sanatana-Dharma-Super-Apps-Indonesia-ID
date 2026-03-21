;(function () {
  try {
    var stored = localStorage.getItem('sdd-color-mode')
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    var theme = stored || 'system'
    if (theme === 'system') theme = prefersDark ? 'dark' : 'light'

    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  } catch (e) {}
})()
