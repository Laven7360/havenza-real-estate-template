import courtyard from '../assets/images/tropical-courtyard.webp'
import courtyardMobile from '../assets/images/tropical-courtyard-mobile.webp'
import garden from '../assets/images/garden-residence.webp'
import towers from '../assets/images/kl-residences.webp'
import retreat from '../assets/images/green-retreat.webp'
import interior from '../assets/images/open-interior.webp'
import lounge from '../assets/images/warm-interior.webp'
import doorway from '../assets/images/garden-door.webp'
import courtyardDetail from '../assets/images/courtyard-detail.webp'
import urbanResidence from '../assets/images/urban-residence.webp'
import closingGarden from '../assets/images/closing-garden.webp'
import botanicalDetail from '../assets/images/botanical-detail.webp'
import blueLiving from '../assets/images/blue-living-room.webp'

// Illustrative licensed photography, not images of the fictional listings.
// Replace these imports with final property photography after design approval.
export const photography = {
  courtyard: { src: courtyard, mobile: courtyardMobile, alt: 'White tropical courtyard home with timber screens, palms, and a blue pool in Bali', position: '58% 55%', credit: 'Iosi Pratama', source: 'https://unsplash.com/photos/ZIcRkI_cjWc' },
  garden: { src: garden, alt: 'Stone-clad tropical residence and pool framed by lush palms in Bali', position: '50% 55%', credit: 'Alexander Nrjwolf', source: 'https://unsplash.com/photos/VoHbPTldlsI' },
  towers: { src: towers, alt: 'Sculptural residential towers at The Fennel in Kuala Lumpur, viewed from below', position: '50% 58%', credit: 'Lovie Tey', source: 'https://unsplash.com/photos/8diz3L67REk' },
  retreat: { src: retreat, alt: 'Curved pool overlooking a lush tropical valley in Bali', position: '50% 65%', credit: 'Polina Kuzovkova', source: 'https://unsplash.com/photos/qZe97UhIfXw' },
  interior: { src: interior, alt: 'Bright open living space with white seating and natural timber furniture', position: '50% 55%', credit: 'Jakob Owens', source: 'https://unsplash.com/photos/nQBc6clG3X4' },
  lounge: { src: lounge, alt: 'Warm living room with a sofa and coffee table in an Ubud villa', position: '50% 55%', credit: 'Ahya Agawis', source: 'https://unsplash.com/photos/ABERsC7FzCM' },
  doorway: { src: doorway, alt: 'Tall stone-framed doorway leading to a palm-filled garden and pool in Ubud', position: '50% 50%', credit: 'Nerissa J', source: 'https://unsplash.com/photos/GcYjWF4yWAs' },
  courtyardDetail: { src: courtyardDetail, alt: 'Glazed courtyard residence with timber decking, black railings, and a small pool in Bali', position: '50% 50%', credit: 'Marvin Meyer', source: 'https://unsplash.com/photos/cjhuXRtRT0Y' },
  urbanResidence: { src: urbanResidence, alt: 'Elevated view over Kuala Lumpur residential towers and the distant city skyline', position: '50% 65%', credit: 'Abdul Muneeb Dar', source: 'https://unsplash.com/photos/n6nphcnEicU' },
  closingGarden: { src: closingGarden, alt: 'Poolside daybed looking out across palms and tropical greenery in Ubud', position: '50% 60%', credit: 'Nerissa J', source: 'https://unsplash.com/photos/qawgWgMATzQ' },
  botanicalDetail: { src: botanicalDetail, alt: 'Leafy branches beside textured wall panels and timber shelving in a Vietnamese apartment', position: '65% 55%', credit: 'eke interior', source: 'https://unsplash.com/photos/yQKDnmFm7AA' },
  blueLiving: { src: blueLiving, alt: 'Contemporary Ho Chi Minh City apartment with a blue sofa, timber dining furniture, and houseplants', position: '40% 55%', credit: 'Huy Phan', source: 'https://unsplash.com/photos/bDIpPnj8j34' },
}

export const propertyPhotography = {
  'hz-001': photography.interior,
  'hz-002': photography.courtyard,
  'hz-003': photography.towers,
  'hz-004': photography.lounge,
  'hz-005': photography.doorway,
  'hz-006': photography.garden,
  'hz-007': photography.retreat,
  'hz-008': photography.blueLiving,
}

// Separate illustrative views belong to one fictional residence only.
// These are visual pairings, not claims that the source images depict the same real building.
export const propertyDetailPhotography = {
  'hz-001': photography.urbanResidence,
  'hz-002': photography.courtyardDetail,
  'hz-006': photography.botanicalDetail,
}
