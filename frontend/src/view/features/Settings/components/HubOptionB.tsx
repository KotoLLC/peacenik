import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import {
  HubSettingsBlock,
  HubOptionTitle,
  HubFieldWrapper,
  HubFieldLabel,
  HubFieldInput,
  HubFieldNote,
  SelectStyled,
  SelectFieldWrapper,
} from './styles'
import {
  CheckboxLabel,
  ButtonContained,
} from '@view/shared/styles'

export const HubOptionB = React.memo(() => {
  return (
    <HubSettingsBlock>
      <HubOptionTitle>
        Option B: create a hub
      </HubOptionTitle>
      <p>This option is for software nerds only. If you're lost - go with Option A.</p>
      <HubFieldWrapper>
        <HubFieldLabel>
          1. Run the installation on Ubunty (18.04+)
        </HubFieldLabel>
        <HubFieldInput value="$ bash -c «$(wget-O-http://github.com/script.sh)»" />
        <ButtonContained>Copy</ButtonContained>
      </HubFieldWrapper>
      <HubFieldWrapper>
        <HubFieldLabel>
          2. Configure DNS for your server and enter a domain name
        </HubFieldLabel>
        <HubFieldInput value="" />
      </HubFieldWrapper>
      <HubFieldWrapper>
        <HubFieldLabel>
          3. Activate your hub
        </HubFieldLabel>
        <HubFieldNote>
          <b>Important:</b> violations of the Peacenik code of conduct may result in deactivation of your hub.
        </HubFieldNote>
        <SelectFieldWrapper>
        <CheckboxLabel
          className="general"
          control={
            <Checkbox
              // checked={false}
              // onChange={(event) => this.onHideIdentityChange(event.target.checked)}
              name="acceptRules"
              color="primary"
            />
          }
          label="I understand"
        />
        <SelectStyled
          variant="outlined"
          // open={open}
          // onClose={handleClose}
          // onOpen={handleOpen}
          // value={age}
          // onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </SelectStyled>
        <ButtonContained>Activate</ButtonContained>
        </SelectFieldWrapper>
      </HubFieldWrapper>
    </HubSettingsBlock>
  )
})