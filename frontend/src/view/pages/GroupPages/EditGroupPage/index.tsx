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
import queryString from 'query-string'
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
} from './../CreateGroupPage/styles'

interface Props extends RouteComponentProps {
  isGroupEditedSuccessfully: boolean
  errorMessage: string
  myGroups: ApiTypes.Groups.RecievedGroup[]

  editGroupSuccess: (value: boolean) => void
  onEditGroup: (data: ApiTypes.Groups.EditGroup) => void
  onGetMyGroupsRequest: () => void
}

const EditGroupPage: React.FC<Props> = (props) => {
  const { 
    onEditGroup, 
    editGroupSuccess, 
    onGetMyGroupsRequest,
    isGroupEditedSuccessfully, 
    history, 
    location,
    errorMessage, 
    myGroups,
  } = props

  const url = location.search
  const params = queryString.parse(url)
  const groupId = params.id ? params.id : ''

  const currentGroup = myGroups?.length && myGroups.filter(item => item.group.id === groupId)[0]
  const initialGroup = currentGroup ? currentGroup.group : null

  const [isRequested, setRequested] = useState<boolean>(false)
  const [isPublic, setPublic] = useState<boolean>(initialGroup ? initialGroup.is_public : false)
  const [groupName, setGroupName] = useState<string>(initialGroup ? initialGroup.name : '')
  const [groupDescription, setGroupDescription] = useState<string>(initialGroup ? initialGroup.description : '')
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
        group_id: initialGroup?.id ? initialGroup?.id : '',
        description: groupDescription,
        description_changed: true,
        is_public: isPublic,
        is_public_changed: true,
        avatar_id: '',
        avatar_changed: true,
        background_id: '',
        background_changed: true,
      }

      onEditGroup(data)
      setRequested(true)
    }

  }

  useEffect(() => {

    if (!initialGroup) {
      onGetMyGroupsRequest()
    }

    if (isGroupEditedSuccessfully) {
      setRequested(false)
      history.push('/groups')
      editGroupSuccess(false)
    }

    if (errorMessage) {
      setRequested(false)
    }

    if (initialGroup) {
      // setPublic(isPublic ? isPublic : initialGroup.is_public)
      setGroupName(groupName ? groupName : initialGroup.name)
      setGroupDescription(groupDescription ? groupDescription : initialGroup.description)
    }

  }, [
    isGroupEditedSuccessfully, 
    errorMessage, 
    myGroups,
    isPublic,
    groupDescription,
    initialGroup,
  ])

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
            <InputField disabled value={groupName} onChange={(event) => setGroupName(event.target.value)} />
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

type StateProps = Pick<Props, 'isGroupEditedSuccessfully' | 'errorMessage' | 'myGroups'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isGroupEditedSuccessfully: selectors.groups.isGroupEditedSuccessfully(state),
  errorMessage: state.common.errorMessage,
  myGroups: selectors.groups.myGroups(state),
})

type DispatchProps = Pick<Props, 'onEditGroup' | 'editGroupSuccess' | 'onGetMyGroupsRequest'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onEditGroup: (data: ApiTypes.Groups.EditGroup) => dispatch(Actions.groups.editGroupRequest(data)),
  editGroupSuccess: (value: boolean) => dispatch(Actions.groups.editGroupSuccess(value)),
  onGetMyGroupsRequest: () => dispatch(Actions.groups.getMyGroupsRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditGroupPage)
