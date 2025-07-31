import { Manrope, Poppins, Libre_Baskerville, Almarai, Young_Serif, Bitter, Sansita, Nunito_Sans, Inter, Roboto, Open_Sans, Montserrat } from "next/font/google";

// Font instances
export const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
export const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
export const libreBaskerville = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"] });
export const almarai = Almarai({ subsets: ["arabic"], weight: ["300", "400", "700", "800"] });
export const youngSerif = Young_Serif({ subsets: ["latin"], weight: ["400"] });
export const bitter = Bitter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
export const sansita = Sansita({ subsets: ["latin"], weight: ["400", "700", "800", "900"] });
export const nunitoSans = Nunito_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });
export const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
export const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });
export const openSans = Open_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
export const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

// Font mapping
export const fontMapping = {
  'Manrope': manrope.className,
  'Poppins': poppins.className,
  'Libre Baskerville': libreBaskerville.className,
  'Almarai': almarai.className,
  'Young Serif': youngSerif.className,
  'Bitter': bitter.className,
  'Sansita': sansita.className,
  'Nunito Sans': nunitoSans.className,
  'Inter': inter.className,
  'Roboto': roboto.className,
  'Open Sans': openSans.className,
  'Montserrat': montserrat.className,
} as const;

export function getFontClass(fontName: string): string {
  return fontMapping[fontName as keyof typeof fontMapping] || '';
} 