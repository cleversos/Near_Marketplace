const GalleryIcon1 = (props: { isSelected?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="6" height="6" rx="1" fill={props.isSelected ? "url(#paint0_linear_103_1113)" : "#f3f3f3"} />
    <rect y="8" width="6" height="6" rx="1" fill={props.isSelected ? "url(#paint1_linear_103_1113)" : "#f3f3f3"} />
    <rect x="8" width="6" height="6" rx="1" fill={props.isSelected ? "url(#paint2_linear_103_1113)" : "#f3f3f3"} />
    <rect x="8" y="8" width="6" height="6" rx="1" fill={props.isSelected ? "url(#paint3_linear_103_1113)" : "#f3f3f3"} />
    <defs>
      <linearGradient id="paint0_linear_103_1113" x1="-0.524642" y1="-0.43803" x2="8.04271" y2="1.29581" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00D1FF" />
        <stop offset="1" stopColor="#1E41F7" />
      </linearGradient>
      <linearGradient id="paint1_linear_103_1113" x1="-0.524642" y1="7.56197" x2="8.04271" y2="9.29581" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00D1FF" />
        <stop offset="1" stopColor="#1E41F7" />
      </linearGradient>
      <linearGradient id="paint2_linear_103_1113" x1="7.47536" y1="-0.43803" x2="16.0427" y2="1.29581" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00D1FF" />
        <stop offset="1" stopColor="#1E41F7" />
      </linearGradient>
      <linearGradient id="paint3_linear_103_1113" x1="7.47536" y1="7.56197" x2="16.0427" y2="9.29581" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00D1FF" />
        <stop offset="1" stopColor="#1E41F7" />
      </linearGradient>
    </defs>
  </svg>
)

export default GalleryIcon1;