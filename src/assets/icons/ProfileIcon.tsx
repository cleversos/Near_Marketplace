const ProfileIcon = (props: { isSelected?: boolean }) => (
  <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 14C17.7956 14 18.5587 14.3161 19.1213 14.8787C19.6839 15.4413 20 16.2044 20 17V17.715C20 21.292 15.79 24 10 24C4.21 24 0 21.433 0 17.715V17C0 16.2044 0.316071 15.4413 0.87868 14.8787C1.44129 14.3161 2.20435 14 3 14H17ZM17 15.5H3C2.62727 15.5 2.2679 15.6388 1.99189 15.8892C1.71589 16.1397 1.54303 16.484 1.507 16.855L1.5 17V17.715C1.5 20.389 4.889 22.5 10 22.5C14.926 22.5 18.355 20.395 18.495 17.876L18.5 17.715V17C18.5 16.6273 18.3612 16.2679 18.1108 15.9919C17.8603 15.7159 17.516 15.543 17.145 15.507L17 15.5ZM10 0C10.7879 -1.17411e-08 11.5681 0.155195 12.2961 0.456723C13.0241 0.758251 13.6855 1.20021 14.2426 1.75736C14.7998 2.31451 15.2417 2.97595 15.5433 3.7039C15.8448 4.43185 16 5.21207 16 6C16 6.78793 15.8448 7.56815 15.5433 8.2961C15.2417 9.02405 14.7998 9.68549 14.2426 10.2426C13.6855 10.7998 13.0241 11.2417 12.2961 11.5433C11.5681 11.8448 10.7879 12 10 12C8.4087 12 6.88258 11.3679 5.75736 10.2426C4.63214 9.11742 4 7.5913 4 6C4 4.4087 4.63214 2.88258 5.75736 1.75736C6.88258 0.632141 8.4087 2.37122e-08 10 0V0ZM10 1.5C8.80653 1.5 7.66193 1.97411 6.81802 2.81802C5.97411 3.66193 5.5 4.80653 5.5 6C5.5 7.19347 5.97411 8.33807 6.81802 9.18198C7.66193 10.0259 8.80653 10.5 10 10.5C11.1935 10.5 12.3381 10.0259 13.182 9.18198C14.0259 8.33807 14.5 7.19347 14.5 6C14.5 4.80653 14.0259 3.66193 13.182 2.81802C12.3381 1.97411 11.1935 1.5 10 1.5V1.5Z" fill={props.isSelected ? "white" : "#B3B9C4"} />
  </svg>

)

export default ProfileIcon
