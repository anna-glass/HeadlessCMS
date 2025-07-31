export interface Theme {
  id: string;
  name: string;
  fontHeading: string;
  fontBody: string;
  colorPrimary: string;
  colorSecondary: string;
  colorTertiary: string;
  colorLight: string;
  colorDark: string;
  radius: string;
}

export const themes: Theme[] = [
  {
    id: 'slate',
    name: 'Slate',
    fontHeading: 'Manrope',
    fontBody: 'Poppins',
    colorPrimary: '#F5F5F5',
    colorSecondary: '#D9D9D9',
    colorTertiary: '#797979',
    colorLight: '#FFFFFF',
    colorDark: '#000000',
    radius: '0px'
  },
  {
    id: 'clay',
    name: 'Clay',
    fontHeading: 'Libre Baskerville',
    fontBody: 'Almarai',
    colorPrimary: '#ECE4DA',
    colorSecondary: '#B9A590',
    colorTertiary: '#574C3F',
    colorLight: '#F6F3EC',
    colorDark: '#36302A',
    radius: '0px'
  },
  {
    id: 'mist',
    name: 'Mist',
    fontHeading: 'Sansita',
    fontBody: 'Nunito Sans',
    colorPrimary: '#E6DCC8',
    colorSecondary: '#EBFC72',
    colorTertiary: '#AEC0AB',
    colorLight: '#F4F3E8',
    colorDark: '#212E21',
    radius: '5px'
  },
  {
    id: 'dawn',
    name: 'Dawn',
    fontHeading: 'Young Serif',
    fontBody: 'Bitter',
    colorPrimary: '#EDD286',
    colorSecondary: '#7BB5B2',
    colorTertiary: '#34659B',
    colorLight: '#EAE6DD',
    colorDark: '#2D2D2A',
    radius: '50px'
  }
] 