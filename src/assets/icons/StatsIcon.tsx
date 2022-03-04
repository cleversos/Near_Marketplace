const StatsIcon = (props: { isSelected?: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.37145 9.20166V16.0618" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.0382 5.91907V16.0618" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.6285 12.8268V16.0618" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path fillRule="evenodd" clipRule="evenodd" d="M15.6857 1H6.31429C3.04762 1 1 3.31208 1 6.58516V15.4148C1 18.6879 3.0381 21 6.31429 21H15.6857C18.9619 21 21 18.6879 21 15.4148V6.58516C21 3.31208 18.9619 1 15.6857 1Z" stroke={props.isSelected ? "white" : "#B3B9C4"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default StatsIcon;