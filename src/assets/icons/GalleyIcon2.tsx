const GalleryIcon2 = (props: { isSelected: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="3" height="3" rx="1" fill="#6B788E" />
    <rect x="10" y="5" width="3" height="3" rx="1" fill={props.isSelected ? "url(#paint1_linear_103_1113)" : "#6B788E"} />
    <rect y="10" width="3" height="3" rx="1" fill={props.isSelected ? "url(#paint1_linear_103_1113)" : "#6B788E"} />
    <rect x="5" width="3" height="3" rx="1" fill={props.isSelected ? "url(#paint1_linear_103_1113)" : "#6B788E"} />
    <rect y="5" width="3" height="3" rx="1" fill={props.isSelected ? "url(#paint1_linear_103_1113)" : "#6B788E"} />
    <rect x="5" y="10" width="3" height="3" rx="1" fill={props.isSelected ? "url(#paint1_linear_103_1113)" : "#6B788E"} />
    <rect x="10" width="3" height="3" rx="1" fill={props.isSelected ? "url(#paint1_linear_103_1113)" : "#6B788E"} />
    <rect x="5" y="5" width="3" height="3" rx="1" fill={props.isSelected ? "url(#paint1_linear_103_1113)" : "#6B788E"} />
    <rect x="10" y="10" width="3" height="3" rx="1" fill={props.isSelected ? "url(#paint1_linear_103_1113)" : "#6B788E"} />
    <linearGradient id="paint0_linear_103_1113" x1="-0.524642" y1="-0.43803" x2="8.04271" y2="1.29581" gradientUnits="userSpaceOnUse">
      <stop stopColor="#00D1FF" />
      <stop offset="1" stopColor="#1E41F7" />
    </linearGradient>
  </svg>
)

export default GalleryIcon2;