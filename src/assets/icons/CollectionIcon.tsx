const CollectionIcon = (props: { isSelected?: boolean }) => (

  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 23C9.10457 23 10 22.1046 10 21C10 19.8954 9.10457 19 8 19C6.89543 19 6 19.8954 6 21C6 22.1046 6.89543 23 8 23Z" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 23C21.1046 23 22 22.1046 22 21C22 19.8954 21.1046 19 20 19C18.8954 19 18 19.8954 18 21C18 22.1046 18.8954 23 20 23Z" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.67 6H23L21.32 14.39C21.2286 14.8504 20.9781 15.264 20.6125 15.5583C20.2468 15.8526 19.7893 16.009 19.32 16H8.75C8.26168 16.0041 7.78873 15.8295 7.42031 15.509C7.05189 15.1884 6.81347 14.7442 6.75 14.26L5.23 2.74C5.16697 2.25924 4.93142 1.81774 4.5672 1.49767C4.20298 1.17759 3.73488 1.00073 3.25 1L1 1" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default CollectionIcon;


