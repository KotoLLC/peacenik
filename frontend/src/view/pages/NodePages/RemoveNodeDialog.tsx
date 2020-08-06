import React from 'react'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import { CommonTypes, ApiTypes } from './../../../types'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import {
  DialogTextWrapper,
  DialogTextLeft,
  DialogTextRight,
  DialogTitleStyled,
  DialogContentStyled,
} from '@view/shared/styles'

interface Props extends CommonTypes.NodeTypes.Node {
  onRemoveNode: (data: ApiTypes.Nodes.RemoveNode) => void
}

const RemoveNodeDialog: React.SFC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)
  const { onRemoveNode, domain, author, created, description, id } = props

  const onRemove = () => {
    onRemoveNode({ node_id: id })
    setOpen(false)
  }

  return (
    <div>
      <IconButton onClick={() => setOpen(true)} color="secondary">
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitleStyled id="alert-dialog-title">You really want to remove this node?</DialogTitleStyled>
        <DialogContentStyled>
          <DialogTextWrapper>
            <DialogTextLeft>IP / Domain:</DialogTextLeft>
            <DialogTextRight>{domain}</DialogTextRight>
          </DialogTextWrapper>
          <DialogTextWrapper>
            <DialogTextLeft>Requested by:</DialogTextLeft>
            <DialogTextRight>{author}</DialogTextRight>
          </DialogTextWrapper>
          <DialogTextWrapper>
            <DialogTextLeft>Requested:</DialogTextLeft>
            <DialogTextRight>{moment(created).format('DD, MMMM YYYY, h:mm a')}</DialogTextRight>
          </DialogTextWrapper>
          <DialogTextWrapper>
            <DialogTextLeft>Description:</DialogTextLeft>
            <DialogTextRight>{description}</DialogTextRight>
          </DialogTextWrapper>
        </DialogContentStyled>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="secondary" onClick={onRemove} autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

type DispatchProps = Pick<Props, 'onRemoveNode'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onRemoveNode: (data: ApiTypes.Nodes.RemoveNode) => dispatch(Actions.nodes.removeNodeRequest(data)),
})

export default connect(null, mapDispatchToProps)(RemoveNodeDialog)