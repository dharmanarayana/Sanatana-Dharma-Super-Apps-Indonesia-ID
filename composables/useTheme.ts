export const useTheme = () => {
  const colorMode = useColorMode()
  
  const accentColors = [
    { id: 'saffron', label: 'Saffron', light: '#FF6B00', dark: '#FF7D1A', secondary: '#F5A623' },
    { id: 'ocean',   label: 'Ocean',   light: '#007AFF', dark: '#409CFF', secondary: '#5AC8FA' },
    { id: 'lotus',   label: 'Lotus',   light: '#D81B60', dark: '#F06292', secondary: '#EC407A' },
    { id: 'leaf',    label: 'Leaf',    light: '#2E7D32', dark: '#66BB6A', secondary: '#81C784' },
    { id: 'temple',  label: 'Temple',  light: '#6A1B9A', dark: '#BA68C8', secondary: '#CE93D8' },
    { id: 'charcoal',label: 'Charcoal',light: '#333333', dark: '#A0A0A0', secondary: '#555555' },
  ]

  const selectedColorId = useCookie('sdd-accent-color', { default: () => 'saffron' })

  const applyTheme = (colorId?: string) => {
    const id = colorId || selectedColorId.value
    const color = accentColors.find(c => c.id === id) || accentColors[0]
    
    if (import.meta.client) {
      const isDark = colorMode.value === 'dark'
      const primary = isDark ? color.dark : color.light
      const secondary = color.secondary
      
      document.documentElement.style.setProperty('--brand-primary', primary)
      document.documentElement.style.setProperty('--brand-secondary', secondary)
      document.documentElement.style.setProperty('--text-brand', primary)
      document.documentElement.style.setProperty('--border-brand', primary)
      
      // Update state-hover/active with very low opacity
      document.documentElement.style.setProperty('--state-hover', `${primary}10`) // 10% opacity in hex
      document.documentElement.style.setProperty('--state-active', `${primary}20`) // 20% opacity
    }
    
    if (colorId) selectedColorId.value = colorId
  }

  // Watch for theme changes to re-apply the correct contrast
  watch(() => colorMode.value, () => {
    applyTheme()
  })

  return { accentColors, selectedColorId, applyTheme }
}
