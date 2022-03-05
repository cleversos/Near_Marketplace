const AuctionsIcon = (props: { isSelected?: boolean }) => (

  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6.43994V9.76994" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
    <path d="M12.02 2C8.34002 2 5.36002 4.98 5.36002 8.66V10.76C5.36002 11.44 5.08002 12.46 4.73002 13.04L3.46002 15.16C2.68002 16.47 3.22002 17.93 4.66002 18.41C9.44002 20 14.61 20 19.39 18.41C20.74 17.96 21.32 16.38 20.59 15.16L19.32 13.04C18.97 12.46 18.69 11.43 18.69 10.76V8.66C18.68 5 15.68 2 12.02 2Z" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
    <path d="M15.33 18.8198C15.33 20.6498 13.83 22.1498 12 22.1498C11.09 22.1498 10.25 21.7698 9.65004 21.1698C9.05004 20.5698 8.67004 19.7298 8.67004 18.8198" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeMiterlimit="10" />
  </svg>
)

export default AuctionsIcon;
