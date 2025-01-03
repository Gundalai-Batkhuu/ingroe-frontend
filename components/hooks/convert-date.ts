export function convertDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  
  if (minutes < 60) return `${minutes}min ago`
  if (hours < 24) return `${hours}hr ago`
  if (days < 7) return `${days}d ago`
  if (weeks < 4) return `${weeks}wk ago`
  return `${months}mon ago`
}

