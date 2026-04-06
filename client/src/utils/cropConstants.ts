export const CROPS = [
  { value: 'Paddy (Rice)',  emoji: '🌾', img: '/crops/paddy.png',  match: ['rice', 'paddy'],    bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-800' },
  { value: 'Cotton',        emoji: '🏵️', img: '/crops/cotton.png', match: ['cotton'],           bg: 'bg-sky-50',    border: 'border-sky-300',    text: 'text-sky-800' },
  { value: 'Chilli',        emoji: '🌶️', img: '/crops/chilli.png', match: ['chilli', 'mirchi'], bg: 'bg-red-50',    border: 'border-red-300',    text: 'text-red-800' },
  { value: 'Maize',         emoji: '🌽', img: '/crops/maize.png',  match: ['maize', 'corn'],    bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800' },
  { value: 'Tomato',        emoji: '🍅', img: '/crops/tomato.png', match: ['tomato'],           bg: 'bg-rose-50',   border: 'border-rose-300',   text: 'text-rose-800' },
  { value: 'Turmeric',      emoji: '🟡', img: null,                match: ['turmeric'],         bg: 'bg-amber-50',  border: 'border-amber-300',  text: 'text-amber-800' },
];

export const fallbackCrop = { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', emoji: '🌿', img: null };

export const getCrop = (name: string) => 
  CROPS.find(c => c.match.some(m => name.toLowerCase().includes(m))) || { ...fallbackCrop, value: name, match: [] };
