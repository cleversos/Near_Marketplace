import * as React from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import "./CollectionAutoComplete.scss";
import { IconLoader } from '../IconLoader';
import { createBrowserHistory } from "history"


const filterOptions = createFilterOptions({
  stringify: (option: CollectionType) => option.name,
});

export default function CollectionAutoComplete(props: { collections: any }) {
  const [options, setOptions] = React.useState()
  const history = createBrowserHistory()

  React.useEffect(() => {
    let newArray: any = []
    for (let item of props.collections) {
      newArray.push({

      })
    }
    setOptions(newArray)
  }, [])
  return (
    <div className="autocomplete-search-box">
      <IconLoader icon='search' />
      <Autocomplete
        onKeyDown={(event: any) => {
          if (event.key === 'Enter') {
            // Prevent's default 'Enter' behavior.
            event.isDefaultPrevented();
            const target = props.collections.filter((obj: any) => {
              return obj.name === event.target.value
            })
            console.log(target, "this target")
            history.replace(`/collection/${target[0].collectionId}/${target[0].tokenType}`)
            window.location.reload()
          }
        }}
        sx={{
          '& input': {
            fontSize: 12,
            width: 400,
            color: "#dbdbdba6",
          },
        }}
        style={{
          background: "#000 !important"
        }}
        options={props.collections}
        autoComplete={true}
        autoHighlight={true}
        getOptionLabel={(option: CollectionType) => option.name}
        filterOptions={filterOptions}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <input type="text" {...params.inputProps} />
          </div>
        )}
      />
    </div>
  )
}

interface CollectionType {
  bannerImageUrl: string
  collectionId: string
  description: string
  isVerified: false
  links: {}
  name: string
  profileImageUrl: string
  royalty: 5
  tokenType: string
}