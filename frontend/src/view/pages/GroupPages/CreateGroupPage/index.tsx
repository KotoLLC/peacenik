import React, { useState, useEffect } from 'react'
import RadioGroup from '@material-ui/core/RadioGroup'
import { PageLayout } from '@view/shared/PageLayout'
import AvatarIcon from '@assets/images/groups-avatar-icon.svg'
import CoverIcon from '@assets/images/groups-cover-icon.svg'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from 'src/types'
import { Link, RouteComponentProps } from 'react-router-dom'
import selectors from '@selectors/index'
import CircularProgress from '@material-ui/core/CircularProgress'
import { ErrorMessage, ButtonContained, ButtonOutlined } from '@view/shared/styles'
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
  RadioStyled,
  FormControlLabelStyled,
  RadiosWrapper,
} from './styles'

interface Props extends RouteComponentProps {
  isGroupAddedSuccessfully: boolean
  errorMessage: string

  addGroupSucces: (value: boolean) => void
  onAddGroup: (data: ApiTypes.Groups.AddGroup) => void
}

const CreateGroupPage: React.FC<Props> = (props) => {
  const { 
    onAddGroup, 
    isGroupAddedSuccessfully, 
    addGroupSucces, 
    history, 
    errorMessage, 
  } = props

  const [isRequested, setRequested] = useState<boolean>(false)
  const [isPublic, setPublic] = useState<boolean>(false)
  const [groupName, setGroupName] = useState<string>('')
  const [groupDescription, setGroupDescription] = useState<string>('')
  const [invalideMessage, setInvalideMessage] = useState<string>('')

  const isDataValid = (): boolean => {

    if (!groupName) {
      setInvalideMessage('Group name is necessarily')
      return false
    }

    if (!groupDescription.length) {
      setInvalideMessage('Group description is necessarily')
      return false
    }

    return true
  }

  const onSubmit = (event) => {
    event.preventDefault()

    if (isDataValid()) {

      const data = {
        name: groupName,
        description: groupDescription,
        is_public: isPublic,
        avatar_id: '',
        background_id: '',
      }

      onAddGroup(data)
      setRequested(true)
    }

  }

  useEffect(() => {
    if (isGroupAddedSuccessfully) {
      setRequested(false)
      history.push('/groups')
      addGroupSucces(false)
    }

    if (errorMessage) {
      setRequested(false)
    }
  }, [isGroupAddedSuccessfully, errorMessage])

  return (
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
          <FieldWrapper className="radios" onSubmit={onSubmit}>
            <FieldPlaceholder className="radios">Group Type</FieldPlaceholder>
            <RadioGroup aria-label="publicity" name="publicity">
              <RadiosWrapper>
                <FormControlLabelStyled
                  onClick={() => setPublic(false)}
                  value="private"
                  control={<RadioStyled checked={!isPublic} size="small" color="primary" />}
                  label={<div className="title">Private <span className="title-note">Invitation only</span></div>} />
                <FormControlLabelStyled
                  onClick={() => setPublic(true)}
                  value="public"
                  control={<RadioStyled checked={isPublic} size="small" color="primary" />}
                  label={<div className="title">Public <span className="title-note">Listed for all users</span></div>} />
              </RadiosWrapper>
            </RadioGroup>
          </FieldWrapper>
          <FieldWrapper>
            <FieldPlaceholder>Group Name</FieldPlaceholder>
            <InputField value={groupName} onChange={(event) => setGroupName(event.target.value)} />
          </FieldWrapper>
          <FieldWrapper>
            <FieldPlaceholder>Description</FieldPlaceholder>
            <TextareaField value={groupDescription} onChange={(event) => setGroupDescription(event.target.value)} />
          </FieldWrapper>
          {invalideMessage && <ErrorMessage>{invalideMessage}</ErrorMessage>}
          <ButtonsWrapper>
            <Link to="/groups">
              <ButtonOutlined>Cancel</ButtonOutlined>
            </Link>
            <ButtonContained disabled={isRequested} onClick={onSubmit}>
              {isRequested ? <CircularProgress size={20} color={'inherit'} /> : 'Save'}
            </ButtonContained>
          </ButtonsWrapper>
        </FormWrapper>
      </CreateGroupContainer>
    </PageLayout>
  )
}

type StateProps = Pick<Props, 'isGroupAddedSuccessfully' | 'errorMessage'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isGroupAddedSuccessfully: selectors.groups.isGroupAddedSuccessfully(state),
  errorMessage: selectors.common.errorMessage(state),
})

type DispatchProps = Pick<Props, 'onAddGroup' | 'addGroupSucces'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onAddGroup: (data: ApiTypes.Groups.AddGroup) => dispatch(Actions.groups.addGroupRequest(data)),
  addGroupSucces: (value: boolean) => dispatch(Actions.groups.addGroupSucces(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupPage)
