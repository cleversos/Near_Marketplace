const ActivityIcon = (props: { isSelected?: boolean }) => (
  <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 10H17L14 19L8 1L5 10H1" stroke={props.isSelected ? "url(#paint0_linear_266_521)" : "#dbdbdba6"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="paint0_linear_266_521" x1="-0.748808" y1="-0.314091" x2="27.5479" y2="6.04883" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00D1FF" />
        <stop offset="1" stopColor="#1E41F7" />
      </linearGradient>
    </defs>
  </svg>
)

export default ActivityIcon;