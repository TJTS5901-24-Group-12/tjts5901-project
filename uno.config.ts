import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer !outline-none hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['bid-btn', 'px-12 py-2 rounded inline-block bg-blue-700 text-white cursor-pointer !outline-none hover:bg-blue-800 disabled:cursor-default disabled:bg-blue-600 disabled:opacity-70'],
    ['offer-btn', 'px-10 py-2 rounded inline-block bg-red-700 text-white cursor-pointer !outline-none hover:bg-red-800 disabled:cursor-default disabled:bg-red-600 disabled:opacity-70'],
    ['btn-default', 'px-12 py-2 rounded inline-block bg-gray-400 text-white cursor-pointer !outline-none hover:bg-gray-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-70'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose m-auto text-left'.split(' '),
})
