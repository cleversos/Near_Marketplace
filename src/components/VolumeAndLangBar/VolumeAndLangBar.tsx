import { Connection } from "near-api-js";
import React, { useContext, useEffect, useState } from "react";
import ConnectionProvider, {
  ConnectionContext,
} from "../../contexts/connection";
import { ContractContext } from "../../contexts/contract";
import BodyText from "../BodyText/BodyText";
import "./VolumeAndLangBar.scss";

interface VolumeAndLangBarProps {
  dailyVolume: number;
  totalVolume: number;
}

const langOptions = [
  {
    name: "English",
    img: require("../../assets/images/english.png"),
  },
];

const VolumeAndLangBar = (props: VolumeAndLangBarProps) => {
  const [dailyVolume, setDailyVolume] = useState();
  const [totalVolume, setTotalVolume] = useState();
  const [selectedLang, setSelectedLang] = useState(langOptions[0].name);
  const { provider } = useContext(ConnectionContext);

  useEffect(() => {
    const getVolumes = async () => {
      if (!provider) return;

      const rawResult = await provider.query({
        request_type: "call_function",
        account_id: "guest-book.testnet",
        method_name: "getVolumes",
        args_base64: "e30=",
        finality: "optimistic",
      });
      // const res = JSON.parse(Buffer.from(rawResult.result).toString());
    };
    getVolumes();
  }, [provider]);

  return (
    <div className="volume-and-lang-container">
      <div className="volumes">
        <BodyText light>
          Vol 24h:
          <span className="green">{props.dailyVolume} Ⓝ</span>
        </BodyText>
        <BodyText light>
          Total Vol:
          <span className="green">{props.dailyVolume} Ⓝ</span>
        </BodyText>
      </div>
      <div className="language-select">
        <img
          src={langOptions.find((lang) => lang.name === selectedLang)?.img}
          alt={selectedLang}
        />
        <select
          value={selectedLang}
          onChange={(event) => setSelectedLang(event.target.value)}
        >
          {langOptions.map((lang, i) => (
            <option key={lang.name} value={lang.name}>
              {lang.name}
            </option>
          ))}
          <option></option>
        </select>
      </div>
    </div>
  );
};

export default VolumeAndLangBar;
