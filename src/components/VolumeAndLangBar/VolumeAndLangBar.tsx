import React, { useState } from 'react';
import BodyText from '../BodyText/BodyText';
import './VolumeAndLangBar.scss';

interface VolumeAndLangBarProps {
  dailyVolume: number;
  totalVolume: number;
}

const langOptions = [
  {
      name: "English",
      img: require('../../assets/images/english.png')
  }
]

const VolumeAndLangBar = (props: VolumeAndLangBarProps) => {
  const [selectedLang, setSelectedLang] = useState(langOptions[0].name);
  return(
    <div className="volume-and-lang-container">
      <div className="volumes">
          <BodyText light>
              Vol 24h: 
              <span
                  className= "green"
              >
                  {props.dailyVolume} Ⓝ
              </span>
          </BodyText>
          <BodyText light>
              Total Vol:
              <span
                  className="green"
              >
                  {props.dailyVolume} Ⓝ
              </span>
          </BodyText>
      </div>
      <div className="language-select">
          <img
              src={langOptions.find(lang => lang.name === selectedLang)?.img}
              alt={selectedLang}
          />
          <select value={selectedLang}  onChange = {(event)=>setSelectedLang(event.target.value)}>
              {
                  langOptions.map((lang, i) => (
                      <option key={lang.name} value={lang.name}>{lang.name}</option>
                  ))
              }
              <option></option>
          </select>
      </div>
  </div>
  )
}

export default VolumeAndLangBar;