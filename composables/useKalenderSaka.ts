export const useKalenderSaka = () => {
  const WUKU = [
    'Sinta', 'Landep', 'Ukir', 'Kulantir', 'Tolu', 'Gumbreg',
    'Wariga', 'Warigadean', 'Julungwangi', 'Sungsang', 'Dunggulan', 'Kuningan',
    'Langkir', 'Medangsia', 'Pujut', 'Pahang', 'Krulut', 'Merakih', 'Tambir',
    'Medangkungan', 'Matal', 'Uye', 'Menail', 'Prangbakat', 'Bala', 'Ugu',
    'Wayang', 'Kelawu', 'Dukut', 'Watugunung'
  ]

  const EPOCH_WUKU = new Date('2024-01-06') // Reference: Sinta, Day 1

  const getWuku = (tanggal: Date): string => {
    const diff = Math.floor((tanggal.getTime() - EPOCH_WUKU.getTime()) / 86400000)
    const hari = ((diff % 210) + 210) % 210
    return WUKU[Math.floor(hari / 7)]
  }

  const getMasehiToSaka = (tanggal: Date) => {
    // Selisih tahun Saka dengan Masehi = 78 tahun (simplified)
    const tahunSaka = tanggal.getFullYear() - 78
    return { tahunSaka, wuku: getWuku(tanggal) }
  }

  return { getWuku, getMasehiToSaka, WUKU }
}
