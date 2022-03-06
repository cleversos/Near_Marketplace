import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import "./AttributeAutocomplete.scss"
let _ = require("lodash")
export default function AttributeAutocomplete(props: {
  options: any,
  originData: any,
  fixFilterData: Function,
  attdFilterData: any
}) {
  const { options, originData } = props;
  const handleChange = (attr: any) => {
    let index = _.findIndex(originData, { name: options.name })
    let tmpArry = props.attdFilterData
    if (attr.length !== 0) {
      tmpArry.splice(index, 1, { name: options.name, value: attr });
    } else {
      tmpArry.splice(index, 1, { name: options.name, value: options.value });
    }
    console.log(props.attdFilterData)
    props.fixFilterData(tmpArry)
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
