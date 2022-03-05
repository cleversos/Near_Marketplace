const CollectionIcon = (props: { isSelected?: boolean }) => (

  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M5.42245 17.8203C5.84445 17.8203 6.18745 18.1633 6.18745 18.5853C6.18745 19.0073 5.84445 19.3493 5.42245 19.3493C5.00045 19.3493 4.65845 19.0073 4.65845 18.5853C4.65845 18.1633 5.00045 17.8203 5.42245 17.8203Z" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path fillRule="evenodd" clipRule="evenodd" d="M16.6749 17.8203C17.0969 17.8203 17.4399 18.1633 17.4399 18.5853C17.4399 19.0073 17.0969 19.3493 16.6749 19.3493C16.2529 19.3493 15.9099 19.0073 15.9099 18.5853C15.9099 18.1633 16.2529 17.8203 16.6749 17.8203Z" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0.75 1.25L2.83 1.61L3.793 13.083C3.871 14.018 4.652 14.736 5.59 14.736H16.502C17.398 14.736 18.158 14.078 18.287 13.19L19.236 6.632C19.353 5.823 18.726 5.099 17.909 5.099H3.164" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.1255 8.79504H14.8985" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default CollectionIcon;
