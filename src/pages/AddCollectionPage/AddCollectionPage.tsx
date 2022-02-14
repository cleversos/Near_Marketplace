import React, { useContext, useState } from "react"
import BodyText from "../../components/BodyText/BodyText"
import Button from "../../components/Button/Button"
import InputBox from "../../components/InputBox/InputBox"
import { ConnectionContext } from "../../contexts/connection"
import { ContractContext } from "../../contexts/contract"

import "./AddCollectionPage.scss"

const AddCollectionPage = () => {
  const { contract } = useContext(ContractContext)
  const { wallet } = useContext(ConnectionContext)
  const [input, setInput] = useState({
    name: "",
    bannerImageUrl: "",
    profileImageUrl: "",
    description: "",
    royalty: "",
    discord: "",
    twitter: "",
    website: "",
    telegram: "",
    instagram: "",
    medium: "",
  })

  const onInputChange = (event: any) => {
    const { value, name } = event.target
    if (!value) return
    setInput((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const onSubmit = async () => {
    try {
      if (!contract || !wallet) return
      await contract.addCollection({
        nft_contract_id: "desmarket.hashdaan.testnet",
        token_type: String, //don't know what exactly goes here
        name: input.name,
        isVerified: false,
        bannerImageUrl: input.bannerImageUrl,
        profileImageUrl: input.profileImageUrl,
        creator: "AccountId",
        description: input.description,
        royalty: input.royalty,
        discord: input.discord,
        twitter: input.twitter,
        website: input.website,
        telegram: input.telegram,
        instagram: input.instagram,
        medium: input.medium,
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="add-collection-page">
      <div className="head">
        <BodyText bold className="page-title">
          Add new collection
        </BodyText>
        <BodyText light>
          The top NFTs on OpenSea, ranked by volume, floor price and other
          statistics.{" "}
        </BodyText>
      </div>

      <div className="form">
        <InputBox
          name="name"
          value={input.name}
          placeholder="Name of collection"
          onInputChange={onInputChange}
        />
        <InputBox
          name="bannerImageUrl"
          value={input.bannerImageUrl}
          placeholder="Banner image url"
          onInputChange={onInputChange}
        />
        <InputBox
          name="profileImageUrl"
          value={input.profileImageUrl}
          placeholder="Profile image url"
          onInputChange={onInputChange}
        />
        <InputBox
          name="description"
          value={input.description}
          placeholder="Description"
          onInputChange={onInputChange}
        />
        <BodyText bold className="section-label">
          Links
        </BodyText>
        <div className="links-container">
          <InputBox
            name="website"
            value={input.website}
            placeholder="Website"
            icon="website"
            onInputChange={onInputChange}
          />
          <InputBox
            name="discord"
            value={input.discord}
            placeholder="Discord"
            icon="discord"
            onInputChange={onInputChange}
          />
          <InputBox
            name="twitter"
            value={input.twitter}
            placeholder="Twitter"
            icon="twitter"
            onInputChange={onInputChange}
          />
          <InputBox
            name="telegram"
            value={input.telegram}
            placeholder="Telegram"
            icon="telegram"
            onInputChange={onInputChange}
          />
          <InputBox
            name="medium"
            value={input.medium}
            placeholder="Medium"
            icon="medium"
            onInputChange={onInputChange}
          />
          <InputBox
            name="instagram"
            value={input.instagram}
            placeholder="Instagram"
            icon="instagram"
            onInputChange={onInputChange}
          />
        </div>

        <BodyText bold className="section-label">
          Royalty
        </BodyText>
        <InputBox
          name="royalty"
          value={input.royalty}
          placeholder="eg 2.5"
          onInputChange={onInputChange}
        />
      </div>

      <Button title="Save" onClick={onSubmit} />
    </div>
  )
}

export default AddCollectionPage
