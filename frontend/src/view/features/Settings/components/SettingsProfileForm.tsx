import React, { ChangeEvent, FormEvent } from 'react';
import { connect } from 'react-redux';
import selectors from '@selectors/index';
import Actions from '@store/actions';
import { StoreTypes, ApiTypes } from 'src/types';
import CoverIcon from '@assets/images/groups-cover-icon.svg';
import CircularProgress from '@material-ui/core/CircularProgress';
import PersonIcon from '@material-ui/icons/Person';
import FaceIcon from '@material-ui/icons/Face';
import MailIcon from '@material-ui/icons/Mail';
import Checkbox from '@material-ui/core/Checkbox';
import { getAvatarUrl, getProfileCoverUrl } from '@services/avatarUrl';
import { validate } from '@services/validation';
import loadImage from 'blueimp-load-image';
import { history } from '@view/routes';
import {
  EditCoverWrapper,
  EditCoverIconWrapper,
  EditCoverAddButton,
  EditCoverAddButtonWrapper,
  EditCoverLabel,
  UploadInput,
  EditsAvatar,
  EditsAvatarWrapper,
  EditButtonsWrapper,
  ErrorMessage,
  CheckboxLabel,
  ButtonContained,
} from '@view/shared/styles';
import {
  SettingsFormWrapper,
  SettingsFieldWrapper,
  SettingsFieldPlaceholder,
  TextFieldStyled,
  CheckboxFieldWrapper,
  ButtonContainedStyled,
} from './styles';

interface Props {
  userName: string;
  userFullName: string;
  userEmail: string;
  userId: string;
  userHideIdentity: boolean;
  avatarUploadLink: ApiTypes.UploadLink | null;
  coverUploadLink: ApiTypes.UploadLink | null;
  profileErrorMessage: string;

  onGetUploadLink: (value: ApiTypes.Profile.UploadLinkRequest) => void;
  onSetAvatar: (data: ApiTypes.Profile.Avatar) => void;
  onEditProfile: (data: ApiTypes.Profile.EditProfile) => void;
  onGetProfile: () => void;
  onGetProfileCoverUploadLink: (value: ApiTypes.UploadLinkRequest) => void;
  onSetProfileCover: (data: ApiTypes.Attachment) => void;
}

type FieldsType = 'email' | '';

interface State {
  email: string | null;
  isRequestSend: boolean;
  errorMessage: string;
  isAvatarFileUploaded: boolean;
  isCoverFileUploaded: boolean;
  hideIdentity: boolean;
  avatarFile: File | null;
  coverFile: File | null;
  fullName: string;
  noValideField: FieldsType;
  isCurrentPasswordVisible: boolean;
  isNewPasswordVisible: boolean;
}

class SettingsProfileForm extends React.PureComponent<Props, State> {
  state = {
    email: null,
    isRequestSend: false,
    errorMessage: '',
    isAvatarFileUploaded: false,
    isCoverFileUploaded: false,
    avatarFile: null,
    coverFile: null,
    fullName: this.props?.userFullName || '',
    hideIdentity: this.props?.userHideIdentity,
    noValideField: '' as FieldsType,
    isCurrentPasswordVisible: false,
    isNewPasswordVisible: false,
  };

  onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      email: event.currentTarget.value.trim(),
    });
  };

  onFullNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      fullName: event.currentTarget.value,
    });
  };

  onHideIdentityChange = (value: boolean) => {
    this.setState({
      hideIdentity: value,
    });
  };

  onValidate = (): boolean => {
    const { email } = this.state;

    if (!email) {
      this.setState({
        errorMessage: "The email can't be empty",
        noValideField: 'email',
      });
      return false;
    }

    if (email && !validate.isEmailValid(email!)) {
      this.setState({
        errorMessage: 'Incorrect email',
        noValideField: 'email',
      });
      return false;
    }

    return true;
  };

  onFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    const { email, fullName, hideIdentity } = this.state;
    const {
      avatarUploadLink,
      userEmail,
      onEditProfile,
      userFullName,
      userHideIdentity,
      coverUploadLink,
    } = this.props;

    if (!this.onValidate()) return;

    let avatarData = {};
    let coverData = {};
    let emailData = {};
    let fullNameData = {};
    let hideIdentityData = {};

    if (avatarUploadLink?.blob_id) {
      avatarData = {
        avatar_changed: true,
        avatar_id: avatarUploadLink.blob_id,
      };
    }

    if (coverUploadLink?.blob_id) {
      coverData = {
        background_changed: true,
        background_id: coverUploadLink.blob_id,
      };
    }

    if (email !== userEmail) {
      emailData = {
        email_changed: true,
        email: email,
      };
    }

    if (fullName !== userFullName) {
      fullNameData = {
        full_name_changed: true,
        full_name: fullName,
      };
    }

    if (userHideIdentity !== hideIdentity) {
      hideIdentityData = {
        hide_identity_changed: true,
        hide_identity: hideIdentity,
      };
    }

    const data = {
      ...emailData,
      ...avatarData,
      ...fullNameData,
      ...hideIdentityData,
      ...coverData,
    };
    onEditProfile(data);

    this.setState({
      isRequestSend: true,
      errorMessage: '',
      noValideField: '',
    });
  };

  onAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const { onGetUploadLink } = this.props;

    this.setState({
      isAvatarFileUploaded: false,
    });

    const file = event.target.files;

    if (file && file[0]) {
      onGetUploadLink({
        content_type: file[0].type,
        file_name: file[0].name,
      });

      const self = this;

      /* tslint:disable */
      loadImage(
        file[0],
        function (img, data) {
          if (data.imageHead && data.exif) {
            // Reset Exif Orientation data:
            loadImage.writeExifData(data.imageHead, data, 'Orientation', 1);
            img.toBlob(function (blob) {
              loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
                self.setState({
                  avatarFile: newBlob,
                });
              });
            }, 'image/jpeg');
          } else {
            self.setState({
              avatarFile: file[0],
            });
          }
        },
        { meta: true, orientation: true, canvas: true }
      );
      /* tslint:enable */
    }
  };

  onCoverUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const { onGetProfileCoverUploadLink } = this.props;

    this.setState({
      isCoverFileUploaded: false,
    });

    const file = event.target.files;

    if (file && file[0]) {
      onGetProfileCoverUploadLink({
        content_type: file[0].type,
        file_name: file[0].name,
      });

      const self = this;

      /* tslint:disable */
      loadImage(
        file[0],
        function (img, data) {
          if (data.imageHead && data.exif) {
            // Reset Exif Orientation data:
            loadImage.writeExifData(data.imageHead, data, 'Orientation', 1);
            img.toBlob(function (blob) {
              loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
                self.setState({
                  coverFile: newBlob,
                });
              });
            }, 'image/jpeg');
          } else {
            self.setState({
              coverFile: file[0],
            });
          }
        },
        { meta: true, orientation: true, canvas: true }
      );
      /* tslint:enable */
    }
  };

  onCurrentPasswordOpen = (value: boolean) => {
    this.setState({
      isCurrentPasswordVisible: value,
    });
  };

  onNewPasswordOpen = (value: boolean) => {
    this.setState({
      isNewPasswordVisible: value,
    });
  };

  static getDerivedStateFromProps(newProps: Props, prevState: State) {
    if (newProps?.avatarUploadLink && prevState?.avatarFile) {
      const { form_data } = newProps?.avatarUploadLink;
      const data = new FormData();

      for (let key in form_data) {
        data.append(key, form_data[key]);
      }

      data.append('file', prevState?.avatarFile, prevState?.avatarFile.name);

      newProps.onSetAvatar({
        link: newProps?.avatarUploadLink.link,
        form_data: data,
      });

      return {
        isAvatarFileUploaded: true,
      };
    }

    if (newProps?.coverUploadLink && prevState?.coverFile) {
      const { form_data } = newProps?.coverUploadLink;
      const data = new FormData();

      for (let key in form_data) {
        data.append(key, form_data[key]);
      }

      data.append('file', prevState?.coverFile, prevState?.coverFile.name);

      newProps.onSetProfileCover({
        link: newProps?.coverUploadLink.link,
        form_data: data,
      });

      return {
        isAvatarFileUploaded: true,
      };
    }

    if (newProps.profileErrorMessage) {
      return {
        errorMessage: newProps.profileErrorMessage,
      };
    }

    if (prevState.email) {
      return {
        email: prevState.email,
      };
    }

    if (prevState.email === null && newProps.userEmail) {
      return {
        email: newProps.userEmail,
      };
    }

    return null;
  }

  renderAvatar = () => {
    const { avatarFile } = this.state;
    const { userName, userId } = this.props;

    if (avatarFile) {
      return (
        <EditsAvatar src={URL.createObjectURL(avatarFile)} alt={userName} />
      );
    }

    return <EditsAvatar src={getAvatarUrl(userId)} alt={userName} />;
  };

  componentDidMount() {
    this.props.onGetProfile();
  }

  render() {
    const { userName, userId } = this.props;

    const {
      errorMessage,
      email,
      noValideField,
      fullName,
      isRequestSend,
      hideIdentity,
      coverFile,
    } = this.state;

    return (
      <>
        <EditCoverWrapper
          resource={
            coverFile
              ? URL.createObjectURL(coverFile)
              : getProfileCoverUrl(userId)
          }
        >
          <EditCoverLabel>
            <EditCoverIconWrapper>
              <img src={CoverIcon} alt='icon' />
            </EditCoverIconWrapper>
            <EditCoverAddButtonWrapper>
              <EditCoverAddButton>Add cover picture</EditCoverAddButton>
            </EditCoverAddButtonWrapper>
            <UploadInput
              type='file'
              id='coverFile'
              name='coverFile'
              onChange={this.onCoverUpload}
              accept='image/x-png,image/gif,image/jpeg'
            />
          </EditCoverLabel>
        </EditCoverWrapper>
        <EditsAvatarWrapper>
          <label htmlFor='avataFile'>
            <UploadInput
              type='file'
              id='avataFile'
              name='avatarFile'
              onChange={this.onAvatarUpload}
              accept='image/x-png,image/gif,image/jpeg'
            />
            {this.renderAvatar()}
          </label>
          <ButtonContained
            onClick={() => {
              history.push('/profile/user?id=' + userId);
            }}
          >
            View Profile
          </ButtonContained>
        </EditsAvatarWrapper>
        <SettingsFormWrapper onSubmit={this.onFormSubmit}>
          <SettingsFieldWrapper>
            <SettingsFieldPlaceholder>Full name</SettingsFieldPlaceholder>
            <TextFieldStyled
              variant='outlined'
              id='fullName'
              value={fullName || ''}
              onChange={this.onFullNameChange}
              InputProps={{
                startAdornment: <PersonIcon />,
              }}
            />
          </SettingsFieldWrapper>
          <SettingsFieldWrapper>
            <SettingsFieldPlaceholder>Username</SettingsFieldPlaceholder>
            <TextFieldStyled
              variant='outlined'
              value={`@${userName}`}
              disabled
              InputProps={{
                startAdornment: <FaceIcon />,
              }}
            />
          </SettingsFieldWrapper>
          <SettingsFieldWrapper>
            <SettingsFieldPlaceholder>Email</SettingsFieldPlaceholder>
            <TextFieldStyled
              variant='outlined'
              id='email'
              type={'text'}
              value={email || ''}
              error={noValideField === 'email' ? true : false}
              onChange={this.onEmailChange}
              InputProps={{
                startAdornment: <MailIcon />,
              }}
            />
          </SettingsFieldWrapper>
          <CheckboxFieldWrapper>
            <CheckboxLabel
              control={
                <Checkbox
                  checked={hideIdentity}
                  onChange={(event) =>
                    this.onHideIdentityChange(event.target.checked)
                  }
                  name='rememberMe'
                  color='primary'
                />
              }
              label='Hide my profile. Only your friends can see real name and profile page'
            />
          </CheckboxFieldWrapper>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <EditButtonsWrapper>
            <ButtonContainedStyled
              disabled={isRequestSend}
              onClick={this.onFormSubmit}
            >
              {isRequestSend ? (
                <CircularProgress size={20} color={'inherit'} />
              ) : (
                'Save changes'
              )}
            </ButtonContainedStyled>
          </EditButtonsWrapper>
        </SettingsFormWrapper>
      </>
    );
  }
}

type StateProps = Pick<
  Props,
  | 'userName'
  | 'userFullName'
  | 'userEmail'
  | 'userHideIdentity'
  | 'avatarUploadLink'
  | 'userId'
  | 'profileErrorMessage'
  | 'coverUploadLink'
>;
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userName: selectors.profile.userName(state),
  userFullName: selectors.profile.userFullName(state),
  userEmail: selectors.profile.userEmail(state),
  userHideIdentity: selectors.profile.userHideIdentity(state),
  avatarUploadLink: state.profile.avatarUploadLink,
  userId: selectors.profile.userId(state),
  profileErrorMessage: selectors.profile.profileErrorMessage(state),
  coverUploadLink: selectors.profile.coverUploadLink(state),
});

type DispatchProps = Pick<
  Props,
  | 'onGetUploadLink'
  | 'onSetAvatar'
  | 'onEditProfile'
  | 'onGetProfile'
  | 'onGetProfileCoverUploadLink'
  | 'onSetProfileCover'
>;
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetUploadLink: (value: ApiTypes.Profile.UploadLinkRequest) =>
    dispatch(Actions.profile.getUploadLinkRequest(value)),
  onSetAvatar: (data: ApiTypes.Profile.Avatar) =>
    dispatch(Actions.profile.setAvatarRequest(data)),
  onEditProfile: (data: ApiTypes.Profile.EditProfile) =>
    dispatch(Actions.profile.editProfileRequest(data)),
  onGetProfile: () => dispatch(Actions.profile.getProfileRequest()),
  onGetProfileCoverUploadLink: (value: ApiTypes.UploadLinkRequest) =>
    dispatch(Actions.profile.getProfileCoverLinkRequest(value)),
  onSetProfileCover: (data: ApiTypes.Attachment) =>
    dispatch(Actions.profile.setProfileCoverRequest(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsProfileForm);
