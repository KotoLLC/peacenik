import React, { useState, useEffect, ChangeEvent } from 'react'
import RadioGroup from '@material-ui/core/RadioGroup'
import AvatarIcon from '@assets/images/groups-avatar-icon.svg'
import CoverIcon from '@assets/images/groups-cover-icon.svg'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from 'src/types'
import { Link, RouteComponentProps } from 'react-router-dom'
import selectors from '@selectors/index'
import CircularProgress from '@material-ui/core/CircularProgress'
import loadImage from 'blueimp-load-image'
import { ErrorMessage, ButtonContained, ButtonOutlined } from '@view/shared/styles'
import {
  CreateGroupContainer,
  CoverWrapper,
  CoverIconWrapper,
  AddCoverButton,
  AddCoverButtonWrapper,
  CreateGroupAvatar,
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
  EmptyScrenWrapper,
  EmptyGroupsText,
  EmptyGroupsTextWrapper,
  EmptyGroupsIconWrapper,
  EmptyGroupsTextLink,
  UploadInput,
} from './../components/styles'

interface Props extends RouteComponentProps {
  isGroupAddedSuccessfully: boolean
  errorMessage: string
  coverUploadLink: ApiTypes.UploadLink | null
  avatarUploadLink: ApiTypes.UploadLink | null
  ownedHubs: string[]

  addGroupSucces: (value: boolean) => void
  onAddGroup: (data: ApiTypes.Groups.AddGroup) => void
  onGetCoverUploadLinkRequest: (data: ApiTypes.Groups.UploadLinkRequest) => void
  onSetCoverRequest: (data: ApiTypes.Groups.Image) => void
  onGetAvatarUploadLinkRequest: (data: ApiTypes.Groups.UploadLinkRequest) => void
  onSetAvatarRequest: (data: ApiTypes.Groups.Image) => void
}

const CreateGroupPage: React.FC<Props> = (props) => {
  const {
    onAddGroup,
    isGroupAddedSuccessfully,
    addGroupSucces,
    history,
    errorMessage,
    coverUploadLink,
    avatarUploadLink,
    onGetAvatarUploadLinkRequest,
    onSetAvatarRequest,
    onGetCoverUploadLinkRequest,
    onSetCoverRequest,
    ownedHubs,
  } = props

  const [isRequested, setRequested] = useState<boolean>(false)
  const [isPublic, setPublic] = useState<boolean>(true)
  const [groupName, setGroupName] = useState<string>('')
  const [groupDescription, setGroupDescription] = useState<string>('')
  const [invalideMessage, setInvalideMessage] = useState<string>('')
  const [isAvatarFileUploaded, setAvatarUploadedFile] = useState<boolean>(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isCoverFileUploaded, setCoverUploadedFile] = useState<boolean>(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverFileObjectUrl, setCoverFileObjectUrl] = useState<string>('')

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
        avatar_id: avatarUploadLink ? avatarUploadLink?.blob_id : '',
        background_id: coverUploadLink ? coverUploadLink?.blob_id : '',
      }

      onAddGroup(data)
      setRequested(true)
    }

  }

  useEffect(() => {
    if (isGroupAddedSuccessfully) {
      setRequested(false)
      history.push('/groups/my')
      addGroupSucces(false)
    }

    if (errorMessage) {
      setRequested(false)
    }

    if (avatarUploadLink && avatarFile && !isAvatarFileUploaded) {
      const { form_data } = avatarUploadLink
      const data = new FormData()

      for (let key in form_data) {
        data.append(key, form_data[key])
      }

      data.append('file', avatarFile, avatarFile?.name)

      onSetAvatarRequest({
        link: avatarUploadLink?.link,
        form_data: data,
      })

      setAvatarUploadedFile(true)
    }

    if (coverUploadLink && coverFile && !isCoverFileUploaded) {
      const { form_data } = coverUploadLink
      const data = new FormData()

      for (let key in form_data) {
        data.append(key, form_data[key])
      }

      data.append('file', coverFile, coverFile?.name)

      onSetCoverRequest({
        link: coverUploadLink?.link,
        form_data: data,
      })

      setCoverUploadedFile(true)
    }

  }, [
    isGroupAddedSuccessfully,
    errorMessage,
    coverUploadLink,
    avatarUploadLink,
  ])

  const onAvatarFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setAvatarUploadedFile(false)

    const uploadedFile = event.target.files
    if (uploadedFile && uploadedFile[0]) {

      onGetAvatarUploadLinkRequest({
        content_type: uploadedFile[0].type,
        file_name: uploadedFile[0].name,
      })

      /* tslint:disable */
      loadImage(
        uploadedFile[0],
        function (img, data) {
          if (data.imageHead && data.exif) {
            // Reset Exif Orientation data:
            loadImage.writeExifData(data.imageHead, data, 'Orientation', 1)
            img.toBlob(function (blob) {
              loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
                setAvatarFile(newBlob)
              })
            }, 'image/jpeg')
          } else {
            setAvatarFile(uploadedFile[0])
          }
        },
        { meta: true, orientation: true, canvas: true }
      )
      /* tslint:enable */

    }
  }

  const onCoverFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setCoverUploadedFile(false)

    const uploadedFile = event.target.files
    if (uploadedFile && uploadedFile[0]) {

      onGetCoverUploadLinkRequest({
        content_type: uploadedFile[0].type,
        file_name: uploadedFile[0].name,
      })

      /* tslint:disable */
      loadImage(
        uploadedFile[0],
        function (img, data) {
          if (data.imageHead && data.exif) {
            // Reset Exif Orientation data:
            loadImage.writeExifData(data.imageHead, data, 'Orientation', 1)
            img.toBlob(function (blob) {
              loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
                setCoverFile(newBlob)
                setCoverFileObjectUrl(URL.createObjectURL(newBlob))
              })
            }, 'image/jpeg')
          } else {
            setCoverFile(uploadedFile[0])
            setCoverFileObjectUrl(URL.createObjectURL(uploadedFile[0]))
          }
        },
        { meta: true, orientation: true, canvas: true }
      )
      /* tslint:enable */

    }
  }

  const renderAvatar = () => {
    if (avatarFile) {
      return (
        <CreateGroupAvatar src={URL.createObjectURL(avatarFile)} />
      )
    }

    return (
      <CreateGroupAvatar>
        <img className="avatar-icon" src={AvatarIcon} alt="" />
      </CreateGroupAvatar>
    )
  }

  const isHubsOwnerCheck = (): boolean => {
    return ownedHubs.length ? true : false
  }

  const renderForm = () => (
    <CreateGroupContainer>
      <CoverWrapper resource={(coverFile) ? coverFileObjectUrl : ''}>
        <label>
          <CoverIconWrapper>
            <img src={CoverIcon} alt="icon" />
          </CoverIconWrapper>
          <AddCoverButtonWrapper>
            <AddCoverButton>Add cover picture</AddCoverButton>
          </AddCoverButtonWrapper>
          <UploadInput
            type="file"
            id="cover"
            name="cover"
            onChange={onCoverFileUpload}
            accept="image/*"
          />
        </label>
      </CoverWrapper>
      <AvatarsBlock>
        <label>
          {renderAvatar()}
          <UploadInput
            type="file"
            id="file"
            name="file"
            onChange={onAvatarFileUpload}
            accept="image/*"
          />
        </label>
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
  )

  const renderEmptyScreen = () => (
    <EmptyScrenWrapper>
      <EmptyGroupsIconWrapper>
        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M0 0H24V24H0V0Z" stroke="black" strokeOpacity="0.0117647" strokeWidth="0" />
          <path className="groug-icon" fillRule="evenodd" clipRule="evenodd" d="M12.5058 10C14.4457 10 16 8.43667 16 6.5C16 4.56333 14.4457 3 12.5058 3C10.5659 3 9 4.56333 9 6.5C9 8.43667 10.5659 10 12.5058 10ZM12.5 12C10.0036 12 5 13.56 5 16.6667V21H20V16.6667C20 13.56 14.9964 12 12.5 12Z" />
          <path className="groug-icon" fillRule="evenodd" clipRule="evenodd" d="M6.65043 12.0504C4.01921 12.3403 0 13.8823 0 16.6667V21H3.5V16.6667C3.5 14.7154 4.8094 13.1264 6.65043 12.0504ZM5 21H15V16.6667C15 14.423 12.3903 12.9861 10 12.3609C7.60969 12.9861 5 14.423 5 16.6667V21ZM8.72695 3.21773C8.34739 3.07691 7.9361 3 7.50584 3C5.56594 3 4 4.56333 4 6.5C4 8.43667 5.56594 10 7.50584 10C7.9361 10 8.34739 9.92309 8.72695 9.78227C7.96248 8.90462 7.5 7.7572 7.5 6.5C7.5 5.2428 7.96248 4.09538 8.72695 3.21773ZM10.0029 4.04651C9.3822 4.67756 9 5.54322 9 6.5C9 7.45678 9.3822 8.32244 10.0029 8.95349C10.6207 8.32244 11 7.45678 11 6.5C11 5.54322 10.6207 4.67756 10.0029 4.04651Z" />
          <path className="groug-icon" fillRule="evenodd" clipRule="evenodd" d="M21.5 21H24V16.6667C24 14.3446 21.2047 12.8867 18.7503 12.2983C20.3777 13.3643 21.5 14.8602 21.5 16.6667V21ZM9 21V16.6667C9 14.2653 11.9896 12.788 14.5 12.241C17.0104 12.788 20 14.2653 20 16.6667V21H9ZM16.0999 9.97692C16.2331 9.99217 16.3685 10 16.5058 10C18.4457 10 20 8.43667 20 6.5C20 4.56333 18.4457 3 16.5058 3C16.3685 3 16.2331 3.00783 16.0999 3.02308C16.9676 3.92215 17.5 5.1474 17.5 6.5C17.5 7.8526 16.9676 9.07785 16.0999 9.97692ZM14.5039 9.37576C15.4103 8.74425 16 7.69295 16 6.5C16 5.30705 15.4103 4.25575 14.5039 3.62424C13.5942 4.25575 13 5.30705 13 6.5C13 7.69295 13.5942 8.74425 14.5039 9.37576Z" />
        </svg>
      </EmptyGroupsIconWrapper>
      <EmptyGroupsTextWrapper>
        <EmptyGroupsText>
          Sorry! You can’t create new group. Your hub does not support groups. <EmptyGroupsTextLink to="/hubs">
            Visit the hub page</EmptyGroupsTextLink> in your profile to create a hub with group support.
      </EmptyGroupsText>
      </EmptyGroupsTextWrapper>
    </EmptyScrenWrapper>
  )

  return (
    <>
      {isHubsOwnerCheck() ? renderForm() : renderEmptyScreen()}
    </>
  )
}

type StateProps = Pick<Props,
  | 'isGroupAddedSuccessfully'
  | 'errorMessage'
  | 'coverUploadLink'
  | 'avatarUploadLink'
  | 'ownedHubs'
>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isGroupAddedSuccessfully: selectors.groups.isGroupAddedSuccessfully(state),
  errorMessage: selectors.common.errorMessage(state),
  coverUploadLink: selectors.groups.coverUploadLink(state),
  avatarUploadLink: selectors.groups.avatarUploadLink(state),
  ownedHubs: selectors.profile.ownedHubs(state),
})

type DispatchProps = Pick<Props,
  | 'onAddGroup'
  | 'addGroupSucces'
  | 'onGetCoverUploadLinkRequest'
  | 'onSetCoverRequest'
  | 'onGetAvatarUploadLinkRequest'
  | 'onSetAvatarRequest'
>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onAddGroup: (data: ApiTypes.Groups.AddGroup) => dispatch(Actions.groups.addGroupRequest(data)),
  addGroupSucces: (value: boolean) => dispatch(Actions.groups.addGroupSucces(value)),
  onGetCoverUploadLinkRequest: (data: ApiTypes.Groups.UploadLinkRequest) =>
    dispatch(Actions.groups.getCoverUploadLinkRequest(data)),
  onSetCoverRequest: (data: ApiTypes.Groups.Image) => dispatch(Actions.groups.setCoverRequest(data)),
  onGetAvatarUploadLinkRequest: (data: ApiTypes.Groups.UploadLinkRequest) =>
    dispatch(Actions.groups.getAvatarUploadLinkRequest(data)),
  onSetAvatarRequest: (data: ApiTypes.Groups.Image) => dispatch(Actions.groups.setAvatarRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupPage)
