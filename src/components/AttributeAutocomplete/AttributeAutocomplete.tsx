import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import "./AttributeAutocomplete.scss"

export default function AttributeAutocomplete(props: { options: any }) {
  const { options } = props;
  console.log(options, "props.otiops")
  return (
    <div className="attribute-autocomplete">
      <Autocomplete
        multiple
        options={options.value}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label={options.name}
          />
        )}
      />
    </div>
  );
}
