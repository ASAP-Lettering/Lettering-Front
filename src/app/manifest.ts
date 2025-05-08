import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: '#444d9b',
    background_color: '#060811',
    icons: [
      {
        purpose: 'maskable',
        sizes: '512x512',
        src: '/icon_512_maskable.png',
        type: 'image/png'
      },
      {
        purpose: 'any',
        sizes: '512x512',
        src: '/icon_512_rounded.png',
        type: 'image/png'
      }
    ],
    orientation: 'any',
    display: 'standalone',
    dir: 'auto',
    lang: 'ko',
    name: '레터링',
    short_name: '레터링',
    description: '편지로 수놓는 나의 스페이스',
    start_url: 'https://www.lettering.world',
    scope: 'https://www.lettering.world',
    id: 'https://www.lettering.world'
  };
}
