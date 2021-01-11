import React from 'react'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import { PageLayout } from '@view/shared/PageLayout'
import AvatarIcon from '@assets/images/groups-avatar-icon.svg'
import CoverIcon from '@assets/images/groups-cover-icon.svg'
import {
  CreateGroupContainer,
  CoverWrapper,
  CoverIconWrapper,
  AddCoverButton,
  AddCoverButtonWrapper,
  AvatarStyled,
  AvatarsBlock,
  AvatarsNote,
  FormWrapper,
  FieldWrapper,
  FieldPlaceholder,
  InputField,
  TextareaField,
  ButtonsWrapper,
  ButtonContained,
  ButtonOutlined,
  RadioStyled,
  FormControlLabelStyled,
  RadiosWrapper,
} from './styles'

export const CreateGroupPage = () => (
  <PageLayout>
    <CreateGroupContainer>
      <CoverWrapper>
        <CoverIconWrapper>
          <img src={CoverIcon} alt="icon" />
        </CoverIconWrapper>
        <AddCoverButtonWrapper>
          <AddCoverButton>Add cover picture</AddCoverButton>
        </AddCoverButtonWrapper>
      </CoverWrapper>
      <AvatarsBlock>
        <AvatarStyled>
          <img src={AvatarIcon} alt="icon" />
        </AvatarStyled>
        <AvatarsNote>Upload jpg or png file. Up to 1 MB</AvatarsNote>
      </AvatarsBlock>
      <FormWrapper>
        <FieldWrapper className="radios">
          <FieldPlaceholder className="radios">Group Type</FieldPlaceholder>
          <RadioGroup aria-label="publicity" name="publicity">
            <RadiosWrapper>
              <FormControlLabelStyled
                value="private"
                control={<RadioStyled size="small" color="primary" />}
                label={<div className="title">Private <span className="title-note">Invitation only</span></div>} />
              <FormControlLabelStyled
                value="public"
                control={<RadioStyled size="small" color="primary" />}
                label={<div className="title">Public <span className="title-note">Listed for all users</span></div>} />
            </RadiosWrapper>
          </RadioGroup>
        </FieldWrapper>
        <FieldWrapper>
          <FieldPlaceholder>Group Name</FieldPlaceholder>
          <InputField />
        </FieldWrapper>
        <FieldWrapper>
          <FieldPlaceholder>Description</FieldPlaceholder>
          <TextareaField />
        </FieldWrapper>
        <ButtonsWrapper>
          <ButtonOutlined>Cancel</ButtonOutlined>
          <ButtonContained>Save</ButtonContained>
        </ButtonsWrapper>
      </FormWrapper>
    </CreateGroupContainer>
  </PageLayout>
)
