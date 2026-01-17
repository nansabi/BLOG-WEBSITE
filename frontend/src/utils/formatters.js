import { formatDistanceToNow } from 'date-fns'

export const formatDate = (date) => formatDistanceToNow(new Date(date), { addSuffix: true })

export const truncateText = (text, length) =>
  text.length > length ? text.substring(0, length) + '...' : text

export const stripHtml = (html) => {
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}
