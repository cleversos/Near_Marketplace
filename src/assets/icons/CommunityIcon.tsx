const CommunityIcon = (props: { isSelected?: boolean }) => (

  <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 19V17C17 15.9391 16.5786 14.9217 15.8284 14.1716C15.0783 13.4214 14.0609 13 13 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17L1 19" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 9C11.2091 9 13 7.20914 13 5C13 2.79086 11.2091 1 9 1C6.79086 1 5 2.79086 5 5C5 7.20914 6.79086 9 9 9Z" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 18.9999V16.9999C22.9993 16.1136 22.7044 15.2527 22.1614 14.5522C21.6184 13.8517 20.8581 13.3515 20 13.1299" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 1.12988C16.8604 1.35015 17.6231 1.85054 18.1677 2.55215C18.7124 3.25377 19.008 4.11669 19.008 5.00488C19.008 5.89307 18.7124 6.756 18.1677 7.45761C17.6231 8.15922 16.8604 8.65961 16 8.87988" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default CommunityIcon;

