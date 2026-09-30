// Add only verified developer details. Empty values never produce public links.
export const developer = {
  name: 'LAVEN RAJ A/L SAHADEVAN',
  email: 's.lavenraj2002@gmail.com',
  whatsapp: '60167938894',
  whatsappMessage: 'Hi, I came across your Havenza real-estate website project and would like to enquire about a website.',
  portfolio: '',
  github: 'https://github.com/Laven7360',
}

export function developerActions(config = developer) {
  const actions = []
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email || '') && !/[\r\n]/.test(config.email)) actions.push({ label: 'Email the developer', href: `mailto:${encodeURIComponent(config.email).replace('%40', '@')}`, external: false })
  if (/^\+?[1-9]\d{7,14}$/.test(config.whatsapp || '')) actions.push({ label: 'WhatsApp the developer', href: `https://wa.me/${config.whatsapp.replace('+', '')}${config.whatsappMessage ? `?text=${encodeURIComponent(config.whatsappMessage)}` : ''}`, external: true })
  for (const [key, label] of [['portfolio', 'View portfolio'], ['github', 'Developer GitHub profile']]) {
    try {
      const url = new URL(config[key])
      if (url.protocol === 'https:' && !url.username && !url.password) actions.push({ label, href: url.href, external: true })
    } catch { /* Unconfigured or invalid URLs are not rendered. */ }
  }
  return actions
}
