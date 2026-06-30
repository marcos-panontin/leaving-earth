const SPACECRAFT_IMAGES = [
  '/images/otherImages/nave1.png',
  '/images/otherImages/nave2.png',
  '/images/otherImages/nave3.png',
  '/images/otherImages/nave4.png',
  '/images/otherImages/nave5.png',
  '/images/otherImages/nave6.png',
  '/images/otherImages/nave7.png',
];

export function spacecraftImageForId(spacecraftId: string): string {
  const match = spacecraftId.match(/(\d+)$/);
  const sequence = match ? Number(match[1]) : 1;
  const index = Number.isFinite(sequence) && sequence > 0 ? (sequence - 1) % SPACECRAFT_IMAGES.length : 0;
  return SPACECRAFT_IMAGES[index];
}
