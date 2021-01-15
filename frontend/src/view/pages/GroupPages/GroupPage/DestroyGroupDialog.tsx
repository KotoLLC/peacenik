import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { DialogTitleStyled, ButtonContained } from '@view/shared/styles'
import { CustomDialog } from '@view/shared/CustomDialog'
import { DangerZoneWrapper, DangerZoneTitle } from './styles'

const DestroyGroupDialog = () => {
  const [open, setOpen] = React.useState(false)

  const onDestroy = () => {
    setOpen(false)
  }

  return (
    <DangerZoneWrapper>
      <DangerZoneTitle>Danger Zone</DangerZoneTitle>
      <ButtonContained onClick={() => setOpen(true)} className="small gray">Destroy</ButtonContained>
      {/* <CustomDialog>hello</CustomDialog>       */}
    </DangerZoneWrapper>
  )
}

export default connect(null, null)(DestroyGroupDialog)