const ItemsIcon = (props: {isSelected?: boolean}) => (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 0C5.44772 0 5 0.447715 5 1C5 1.55228 5.44772 2 6 2V0ZM19 2C19.5523 2 20 1.55228 20 1C20 0.447715 19.5523 0 19 0V2ZM6 6C5.44772 6 5 6.44772 5 7C5 7.55228 5.44772 8 6 8V6ZM19 8C19.5523 8 20 7.55228 20 7C20 6.44772 19.5523 6 19 6V8ZM6 12C5.44772 12 5 12.4477 5 13C5 13.5523 5.44772 14 6 14V12ZM19 14C19.5523 14 20 13.5523 20 13C20 12.4477 19.5523 12 19 12V14ZM1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2V0ZM1.01 2C1.56228 2 2.01 1.55228 2.01 1C2.01 0.447715 1.56228 0 1.01 0V2ZM1 6C0.447715 6 0 6.44772 0 7C0 7.55228 0.447715 8 1 8V6ZM1.01 8C1.56228 8 2.01 7.55228 2.01 7C2.01 6.44772 1.56228 6 1.01 6V8ZM1 12C0.447715 12 0 12.4477 0 13C0 13.5523 0.447715 14 1 14V12ZM1.01 14C1.56228 14 2.01 13.5523 2.01 13C2.01 12.4477 1.56228 12 1.01 12V14ZM6 2H19V0H6V2ZM6 8H19V6H6V8ZM6 14H19V12H6V14ZM1 2H1.01V0H1V2ZM1 8H1.01V6H1V8ZM1 14H1.01V12H1V14Z" fill={props.isSelected ? "url(#paint0_linear_266_51)" : "#dbdbdba6"}/>
<defs>
<linearGradient id="paint0_linear_266_51" x1="-0.748808" y1="-0.314091" x2="27.5479" y2="6.04883" gradientUnits="userSpaceOnUse">
<stop stop-color="#00D1FF"/>
<stop offset="1" stop-color="#1E41F7"/>
</linearGradient>
</defs>
</svg>
)

export default ItemsIcon;