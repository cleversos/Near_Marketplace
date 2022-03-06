const StatsIcon = (props: { isSelected?: boolean }) => (


  <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 1H9V19H13V1Z" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 6H17V19H21V6Z" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 11H1V19H5V11Z" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

)

export default StatsIcon;
