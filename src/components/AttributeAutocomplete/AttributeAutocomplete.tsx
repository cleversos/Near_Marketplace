import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import "./AttributeAutocomplete.scss"
let _ = require("lodash")
export default function AttributeAutocomplete(props: {
  options: any,
  originData: any,
  setAttdFilterData: Function
}) {
  const { options, originData } = props;
  const handleChange = (attr: any) => {
    let index = _.findIndex(originData, { name: options.name })
    if (attr.length !== 0) {
      originData.splice(index, 1, { name: options.name, value: attr });
    } else {
      originData.splice(index, 1, { name: options.name, value: options.value });
    }
    props.setAttdFilterData(originData)
  }
  return (
    <div className="attribute-autocomplete">
      <Autocomplete
        multiple
        options={options.value}
        onChange={(e, attr: any) => {
          handleChange(attr)
        }}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ color: "#fff" }}
            label={options.name}
          />
        )}
      />
    </div>
  );
}
