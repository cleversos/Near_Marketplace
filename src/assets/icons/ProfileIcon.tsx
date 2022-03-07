const ProfileIcon = (props: { isSelected?: boolean }) => (

  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 17.5C19 16.719 19 17 19 17C19 15.9391 18.6313 14.9217 17.9749 14.1716C17.3185 13.4214 16.4283 13 15.5 13H8.5C7.57174 13 6.6815 13.4214 6.02513 14.1716C5.36875 14.9217 5 15.9391 5 17C5 17 5 16.719 5 17.5" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 10C13.6569 10 15 8.65685 15 7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7C9 8.65685 10.3431 10 12 10Z" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

)

export default ProfileIcon