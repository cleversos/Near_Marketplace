const JobIcon = (props: { isSelected?: boolean }) => (

  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.804199 13.4769C0.804199 13.4769 0.946199 15.2149 0.979199 15.7629C1.0232 16.4979 1.3072 17.3189 1.7812 17.8889C2.4502 18.6969 3.2382 18.9819 4.2902 18.9839C5.5272 18.9859 14.5222 18.9859 15.7592 18.9839C16.8112 18.9819 17.5992 18.6969 18.2682 17.8889C18.7422 17.3189 19.0262 16.4979 19.0712 15.7629C19.1032 15.2149 19.2452 13.4769 19.2452 13.4769" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.49609 3.32949V2.95849C6.49609 1.73849 7.48409 0.750488 8.70409 0.750488H11.2861C12.5051 0.750488 13.4941 1.73849 13.4941 2.95849L13.4951 3.32949" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.99512 14.6782V13.3842" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path fillRule="evenodd" clipRule="evenodd" d="M0.75 6.38905V9.85605C2.668 11.1211 4.966 12.0071 7.488 12.3581C7.79 11.2571 8.783 10.4501 9.99 10.4501C11.178 10.4501 12.191 11.2571 12.473 12.3681C15.005 12.0171 17.312 11.1311 19.24 9.85605V6.38905C19.24 4.69505 17.877 3.33105 16.183 3.33105H3.817C2.123 3.33105 0.75 4.69505 0.75 6.38905Z" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

)

export default JobIcon;
