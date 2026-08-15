function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function now() {
  return new Date().toISOString()
}

function fullNameOf(person) {
  return `${person.firstName} ${person.lastName}`.trim()
}

function initialsFromName(name) {
  return String(name ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => (word[0] ?? '').toUpperCase())
    .join('')
}

function maskFullName(name) {
  const parts = String(name ?? '').trim().split(/\s+/)
  return parts.map((w, i) => (i === 0 ? w : `${w[0]}.`)).join(' ')
}

function formatTRY(value) {
  return `₺${Number(value).toLocaleString('tr-TR')}`
}

function budgetLabelOf(min, max) {
  return min === max ? formatTRY(min) : `${formatTRY(min)} – ${formatTRY(max)}`
}

function relativeTimeTR(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const sec = Math.floor(diffMs / 1000)
  const min = Math.floor(sec / 60)
  const hour = Math.floor(min / 60)
  const day = Math.floor(hour / 24)
  const week = Math.floor(day / 7)
  const month = Math.floor(day / 30)
  const year = Math.floor(day / 365)

  if (sec < 60) return 'şimdi'
  if (min < 60) return `${min} dakika önce`
  if (hour < 24) return `${hour} saat önce`
  if (day === 1) return 'dün'
  if (day < 7) return `${day} gün önce`
  if (week < 4) return `${week} hafta önce`
  if (month < 12) return `${month} ay önce`
  return `${year} yıl önce`
}

function listMeta(items, extra) {
  return { page: 1, total: items.length, perPage: 20, ...(extra ?? {}) }
}

function toArrayParam(value) {
  if (value == null || value === '') return []
  return Array.isArray(value) ? value : [value]
}

module.exports = {
  uuid,
  now,
  fullNameOf,
  initialsFromName,
  maskFullName,
  formatTRY,
  budgetLabelOf,
  relativeTimeTR,
  listMeta,
  toArrayParam,
}
