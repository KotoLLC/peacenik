import React, { useState, useEffect, ChangeEvent } from 'react'
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
import loadImage from 'blueimp-load-image'
import { ErrorMessage, ButtonContained, ButtonOutlined } from '@view/shared/styles'
import { UploadInput } from './../styles'
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
  coverUploadLink: ApiTypes.UploadLink | null
  avatarUploadLink: ApiTypes.UploadLink | null

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
      history.push('/groups')
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
                setAvatarFile(newBlob)
              })
            }, 'image/jpeg')
          } else {
            setCoverFile(uploadedFile[0])
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
        <AvatarStyled>
          <img src={URL.createObjectURL(avatarFile)} alt="" />
        </AvatarStyled>
      )
    }

    return (
      <AvatarStyled>
        <img src={AvatarIcon} alt="" />
      </AvatarStyled>
    )
  }

  return (
    <PageLayout>
      <CreateGroupContainer>
        <CoverWrapper resource={(coverFile) ? URL.createObjectURL(coverFile) : ''}>
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
    </PageLayout>
  )
}

type StateProps = Pick<Props,
  | 'isGroupAddedSuccessfully'
  | 'errorMessage'
  | 'coverUploadLink'
  | 'avatarUploadLink'
>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isGroupAddedSuccessfully: selectors.groups.isGroupAddedSuccessfully(state),
  errorMessage: selectors.common.errorMessage(state),
  coverUploadLink: selectors.groups.coverUploadLink(state),
  avatarUploadLink: selectors.groups.avatarUploadLink(state),
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
