import React from 'react'
import { connect } from 'react-redux'
import { ApiTypes } from 'src/types'
import Actions from '@store/actions'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import { ListItemTextStyled } from './styles'
import {
  ListItemIconStyled,
  ErrorMessage,
  MenuItemWrapper,
} from '@view/shared/styles'
import { ModalDialog } from '@view/shared/ModalDialog'
import {
  ModalButtonsGroup,
  ModalCancelButton,
  ModalAllowButton,
  TextFieldWrapper,
  TextFieldLabel,
  TextareaStyled,
} from '@view/shared/ModalDialog/styles'

interface Props {
  message: string
  id: string
  sourceHost: string
  onComplainContent: (data: ApiTypes.Feed.ReportMessageHub) => void
}

const ComplainContentDialog: React.SFC<Props> = (props) => {
  const [isOpen, setOpen] = React.useState<boolean>(false)
  const [description, setDescription] = React.useState<string>('')
  const [isError, setError] = React.useState<boolean>(false)
  const { onComplainContent, id, sourceHost } = props

  const onComplane = () => {
    if (!Boolean(description)) {
      setError(true)
    } else {
      onComplainContent({
        host: sourceHost,
        body: {
          message_id: id,
          report: description,
        }
      })
      setOpen(false)
      setError(false)
    }
  }

  console.log('description', description)

  return (
    <>
      <MenuItemWrapper onClick={() => setOpen(true)}>
        <ListItemIconStyled>
          <ErrorOutlineIcon fontSize="small" />
        </ListItemIconStyled>
        <ListItemTextStyled primary="Report" />
      </MenuItemWrapper>
      <ModalDialog
        title="Report"
        isModalOpen={isOpen}
        setOpenModal={() => setOpen(false)}
      >
        <TextFieldWrapper>
          <TextFieldLabel>Tell us why is this content offensive?</TextFieldLabel>
          <TextareaStyled
            rows={4}
            onChange={(event) => setDescription(event.target.value)}
            defaultValue={description}
          />
          {isError && <ErrorMessage>The message cannot be empty</ErrorMessage>}
        </TextFieldWrapper>
        <ModalButtonsGroup>
          <ModalCancelButton className="grey" onClick={() => setOpen(false)}>
            Cancel
          </ModalCancelButton>
          <ModalAllowButton onClick={onComplane}>Report</ModalAllowButton>
        </ModalButtonsGroup>
      </ModalDialog>
    </>
  )
}

type DispatchProps = Pick<Props, 'onComplainContent'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onComplainContent: (data: ApiTypes.Feed.ReportMessageHub) => dispatch(Actions.feed.reportFeedMessageHubRequest(data)),
})

export default connect(null, mapDispatchToProps)(ComplainContentDialog)