declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.webp'

declare module '*.less' {
  interface Style {
    [propName: string]: string
  }
  const style: Style
  export default style
}