import React, { useState, useEffect, ChangeEvent } from 'react'
import CoverIcon from '@assets/images/groups-cover-icon.svg'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from 'src/types'
import { Link, RouteComponentProps } from 'react-router-dom'
import selectors from '@selectors/index'
import CircularProgress from '@material-ui/core/CircularProgress'
import queryString from 'query-string'
import loadImage from 'blueimp-load-image'
import { getGroupAvatarUrl, getGroupCoverUrl } from '@services/avatarUrl'
import {
  ErrorMessage,
  ButtonContained,
  ButtonOutlined,
  UploadInput,
  EditCoverWrapper,
  EditCoverIconWrapper,
  EditCoverAddButton,
  EditCoverAddButtonWrapper,
  EditsAvatar,
  EditsAvatarWrapper,
  EditFormWrapper,
  EditFieldWrapper,
  EditFieldPlaceholder,
  EditInputField,
  EditTextareaField,
  EditButtonsWrapper,
  GroupCard,
  PageBarTitle,
} from '@view/shared/styles'
import {
  CreateGroupContainer,
  GroupFounctionContainer,
  AvatarsNote,
  // RadioStyled,
  // FormControlLabelStyled,
  // RadiosWrapper,
} from './../components/styles'
import UserForInvite from '../components/UserForInvite'
import { v4 as uuidv4 } from 'uuid'
import { Member } from '../components/Member'
import DeleteGroupDialog from '../components/DeleteGroupDialog'

interface Props extends RouteComponentProps {
  isGroupEditedSuccessfully: boolean
  errorMessage: string
  myGroups: ApiTypes.Groups.RecievedGroup[]
  coverUploadLink: ApiTypes.UploadLink | null
  avatarUploadLink: ApiTypes.UploadLink | null
  groupDetails: ApiTypes.Groups.GroupDetails | null
  friends: ApiTypes.Friends.Friend[] | null

  editGroupSuccess: (value: boolean) => void
  onEditGroup: (data: ApiTypes.Groups.EditGroup) => void
  onGetMyGroupsRequest: () => void
  onGetCoverUploadLinkRequest: (data: ApiTypes.UploadLinkRequest) => void
  onSetCoverRequest: (data: ApiTypes.Groups.Image) => void
  onGetAvatarUploadLinkRequest: (data: ApiTypes.UploadLinkRequest) => void
  onSetAvatarRequest: (data: ApiTypes.Groups.Image) => void
}

const EditGroupPage: React.FC<Props> = (props) => {
  const {
    groupDetails,
    friends,
    onEditGroup,
    editGroupSuccess,
    onGetMyGroupsRequest,
    isGroupEditedSuccessfully,
    history,
    location,
    errorMessage,
    myGroups,
    coverUploadLink,
    avatarUploadLink,
    onGetAvatarUploadLinkRequest,
    onSetAvatarRequest,
    onGetCoverUploadLinkRequest,
    onSetCoverRequest,
  } = props

  const url = location.search
  const params = queryString.parse(url)
  const groupId = params.id ? params.id : ''

  const currentGroup = myGroups?.length && myGroups.filter(item => item.group.id === groupId)[0]
  const initialGroup = currentGroup ? currentGroup.group : null

  const [isRequested, setRequested] = useState<boolean>(false)
  // const [isPublic, setPublic] = useState<boolean>(initialGroup ? initialGroup.is_public : false)
  const [groupName, setGroupName] = useState<string>(initialGroup ? initialGroup.name : '')
  const [groupDescription, setGroupDescription] = useState<string>(initialGroup ? initialGroup.description : '')
  const [invalideMessage, setInvalideMessage] = useState<string>('')
  const [isAvatarFileUploaded, setAvatarUploadedFile] = useState<boolean>(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isCoverFileUploaded, setCoverUploadedFile] = useState<boolean>(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverFileObjectUrl, setCoverFileObjectUrl] = useState<string>('')

  const filterFriendsForInvite = () => {
    return friends?.filter((item) =>
      !Boolean(
        groupDetails?.members?.some(
          member => member.id === item.user.id
        )
      )
    )
  }

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
        // is_public: isPublic,
        // is_public_changed: true,
        avatar_id: avatarUploadLink ? avatarUploadLink?.blob_id : '',
        avatar_changed: avatarUploadLink ? true : false,
        background_id: coverUploadLink ? coverUploadLink?.blob_id : '',
        background_changed: coverUploadLink ? true : false,
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
      editGroupSuccess(false)
      history.push('/groups/my')
    }

    if (errorMessage) {
      setRequested(false)
    }

    if (initialGroup) {
      // setPublic(isPublic ? isPublic : initialGroup.is_public)
      setGroupName(groupName ? groupName : initialGroup.name)
      setGroupDescription(groupDescription ? groupDescription : initialGroup.description)
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
    isGroupEditedSuccessfully,
    errorMessage,
    myGroups,
    // isPublic,
    groupDescription,
    initialGroup,
    coverUploadLink,
    avatarUploadLink,
  ])

  if (!groupDetails) return null
  const { group, members, status, invites } = groupDetails

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
        <EditsAvatar src={URL.createObjectURL(avatarFile)} />
      )
    }

    return (
      <EditsAvatar src={initialGroup?.id ? getGroupAvatarUrl(initialGroup?.id) : ''} />
    )
  }

  return (
    <>
      <CreateGroupContainer>
        <EditCoverWrapper resource={(coverFile) ? coverFileObjectUrl : getGroupCoverUrl(initialGroup?.id!)}>
          <label>
            <EditCoverIconWrapper>
              <img src={CoverIcon} alt="icon" />
            </EditCoverIconWrapper>
            <EditCoverAddButtonWrapper>
              <EditCoverAddButton>Add cover picture</EditCoverAddButton>
            </EditCoverAddButtonWrapper>
            <UploadInput
              type="file"
              id="cover"
              name="cover"
              onChange={onCoverFileUpload}
              accept="image/*"
            />
          </label>
        </EditCoverWrapper>
        <EditsAvatarWrapper>
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
        </EditsAvatarWrapper>
        <EditFormWrapper>
          <EditFieldWrapper className="radios" onSubmit={onSubmit}>
            {/* <FieldPlaceholder className="radios">Group Type</FieldPlaceholder>
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
            </RadioGroup> */}
          </EditFieldWrapper>
          <EditFieldWrapper>
            <EditFieldPlaceholder>Group Name</EditFieldPlaceholder>
            <EditInputField disabled value={groupName} onChange={(event) => setGroupName(event.target.value)} />
          </EditFieldWrapper>
          <EditFieldWrapper>
            <EditFieldPlaceholder>Description</EditFieldPlaceholder>
            <EditTextareaField value={groupDescription} onChange={(event) => setGroupDescription(event.target.value)} />
          </EditFieldWrapper>
          {invalideMessage && <ErrorMessage>{invalideMessage}</ErrorMessage>}
          <EditButtonsWrapper>
            <Link to="/groups">
              <ButtonOutlined>Cancel</ButtonOutlined>
            </Link>
            <ButtonContained disabled={isRequested} onClick={onSubmit}>
              {isRequested ? <CircularProgress size={20} color={'inherit'} /> : 'Save'}
            </ButtonContained>
          </EditButtonsWrapper>
        </EditFormWrapper>
      </CreateGroupContainer>

      <GroupFounctionContainer>
        <GroupCard>
          <PageBarTitle>Invite friends</PageBarTitle>
          {filterFriendsForInvite()?.map(item => <UserForInvite
            groupId={group?.id}
            key={uuidv4()}
            {...item}
          />)}
          {/* <ViewMoreButton>View more</ViewMoreButton> */}
        </GroupCard>
        <GroupCard>
          <PageBarTitle>Members ({members?.length})</PageBarTitle>
          {Boolean(members?.length) && members.map(item => (
            <Member
              groupId={group?.id}
              isAdminLayout={true}
              key={uuidv4()}
              {...item}
            />
          ))}
          {/* <ViewMoreButton>View more</ViewMoreButton> */}
        </GroupCard>
      </GroupFounctionContainer>

      <GroupFounctionContainer>
        <DeleteGroupDialog
          groupId={group?.id}
        />
      </GroupFounctionContainer>
    </>
  )
}

type StateProps = Pick<Props,
  | 'isGroupEditedSuccessfully'
  | 'errorMessage'
  | 'myGroups'
  | 'coverUploadLink'
  | 'avatarUploadLink'
  | 'groupDetails'
  | 'friends'
>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isGroupEditedSuccessfully: selectors.groups.isGroupEditedSuccessfully(state),
  errorMessage: selectors.common.errorMessage(state),
  myGroups: selectors.groups.myGroups(state),
  coverUploadLink: selectors.groups.coverUploadLink(state),
  avatarUploadLink: selectors.groups.avatarUploadLink(state),
  groupDetails: selectors.groups.groupDetails(state),
  friends: selectors.friends.friends(state),
})

type DispatchProps = Pick<Props,
  | 'onEditGroup'
  | 'editGroupSuccess'
  | 'onGetMyGroupsRequest'
  | 'onGetCoverUploadLinkRequest'
  | 'onSetCoverRequest'
  | 'onGetAvatarUploadLinkRequest'
  | 'onSetAvatarRequest'
>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onEditGroup: (data: ApiTypes.Groups.EditGroup) => dispatch(Actions.groups.editGroupRequest(data)),
  editGroupSuccess: (value: boolean) => dispatch(Actions.groups.editGroupSuccess(value)),
  onGetMyGroupsRequest: () => dispatch(Actions.groups.getMyGroupsRequest()),
  onGetCoverUploadLinkRequest: (data: ApiTypes.UploadLinkRequest) =>
    dispatch(Actions.groups.getGroupCoverUploadLinkRequest(data)),
  onSetCoverRequest: (data: ApiTypes.Groups.Image) => dispatch(Actions.groups.setGroupCoverRequest(data)),
  onGetAvatarUploadLinkRequest: (data: ApiTypes.UploadLinkRequest) =>
    dispatch(Actions.groups.getAvatarUploadLinkRequest(data)),
  onSetAvatarRequest: (data: ApiTypes.Groups.Image) => dispatch(Actions.groups.setAvatarRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditGroupPage)
