import * as React from 'react';
import SelectUnstyled, {
  SelectUnstyledProps,
  selectUnstyledClasses,
} from '@mui/base/SelectUnstyled';
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled';
import PopperUnstyled from '@mui/base/PopperUnstyled';
import { styled } from '@mui/system';
import DollarIcon from '../../assets/icons/DollarIcon';

const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  100: '#E7EBF0',
  200: '#E0E3E7',
  300: '#CDD2D7',
  400: '#B2BAC2',
  500: '#A0AAB4',
  600: '#6F7E8C',
  700: '#3E5060',
  800: '#2D3843',
  900: '#1A2027',
};

const StyledButton = styled('button')(
  ({ theme }) => `
  font-size: 0.875rem;
  box-sizing: border-box;
  min-height: calc(1.5em + 22px);
  min-width: calc(100% - 30px);
  background: #090619;
  border: none;
  border-radius: 5px;
  padding: 10px;
  text-align: left;
  line-height: 1.5;
  color: #757575;

  &:hover {
    background: #090619a6;
    border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &.${selectUnstyledClasses.focusVisible} {
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[100]};
  }

  &.${selectUnstyledClasses.expanded} {
    &::after {
      content: '▴';
    }
  }

  &::after {
    content: '▾';
    float: right;
  }
  `,
);

const StyledListbox = styled('ul')(
  ({ theme }) => `
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 5px;
  min-width: calc(100% - 30px);
  margin: 5px 0;
  background: #090619;
  border: none;
  border-radius: 5px;
  color: #757575;
  overflow: auto;
  outline: 0px;
  border: 1px solid #ccc;
  `,
);

const StyledOption = styled(OptionUnstyled)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 0.45em;
  cursor: default;
  min-width: calc(100% - 30px);

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionUnstyledClasses.selected} {
    background-color: #090619a6;
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionUnstyledClasses.highlighted} {
    background-color: #090619a6;
    color: #757575;
  }

  &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
    background-color: #090619a6;
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionUnstyledClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &:hover:not(.${optionUnstyledClasses.disabled}) {
    background-color: #090619a6;
    color: #757575;
  }
  `,
);

const StyledPopper = styled(PopperUnstyled)`
  z-index: 1;
`;

const Paragraph = styled('p')(
  ({ theme }) => `
  font-size: 0.875rem;
  margin: 10px 0;
  color: ${theme.palette.mode === 'dark' ? grey[400] : grey[700]};
  `,
);

function CustomSelect(props: SelectUnstyledProps<number>) {
  const components: SelectUnstyledProps<number>['components'] = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} components={components} />;
}

export default function PriceSelect(props: { options: any, minValue: string, maxValue: string, setPriceRange: Function }) {
  const [value, setValue] = React.useState<number | null>(props.options[0].symbol);

  const resolveIcon = (icon: string) => {
    switch (icon) {
      case "USD":
        return <DollarIcon />
      case "NEAR":
        return "Ⓝ"
      default:
        break
    }
  }
  const handleChange = (e) => {
    setValue(e)
    props.setPriceRange({
      currency: e,
      min: props.minValue,
      max: props.maxValue
    })
  }
  return (
    <div className="price-select-box">
      <span style={{ width: 20 }}>{resolveIcon(value.toString())}</span>
      <CustomSelect value={value} onChange={(e) => handleChange(e)}>
        {props.options.map((item, key) => (
          <StyledOption value={item.symbol} key={key}>{item.currency}</StyledOption>
        ))}
      </CustomSelect>
    </div>
  );
}