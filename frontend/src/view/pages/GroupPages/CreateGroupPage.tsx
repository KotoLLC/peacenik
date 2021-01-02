import React from 'react'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import Button from '@material-ui/core/Button'
import {
  PageTitle,
  FormWrapper,
  TextFieldStyled,
  FormControlStyled,
  FormButton,
  FormButtonsWrapper,
} from './styles'

export const CreateGroupPage = () => (
  <>
    <PageTitle>Create Group</PageTitle>
    <FormWrapper>
      <FormControlStyled>
        <RadioGroup aria-label="publicity" name="publicity">
          <FormControlLabel value="private" control={<Radio />} label="Private (Invitation only)" />
          <FormControlLabel value="public" control={<Radio />} label="Public (Listed for all users)" />
        </RadioGroup>
      </FormControlStyled>
      <TextFieldStyled
        label="Tell us about yourself"
        multiline
        rows={4}
        variant="outlined"
      />
      <TextFieldStyled
        label="Group name"
        variant="outlined"
      />
      <TextFieldStyled
        label="Group description"
        variant="outlined"
        multiline
        rows={4}
      />
      <FormButtonsWrapper>
        <FormButton variant="contained">Cancel</FormButton>
        <FormButton variant="contained" color="primary">Save</FormButton>
      </FormButtonsWrapper>
    </FormWrapper>

  </>
)
