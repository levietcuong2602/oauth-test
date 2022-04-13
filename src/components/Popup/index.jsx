import React from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { StyledPopup } from './index.style';

const Popup = (props) => {
  const { t } = useTranslation(['common']);
  const {
    open,
    onOk,
    onClose,
    title = t('note'),
    okMessage = t('confirm'),
    cancelMessage = t('cancel'),
    content = t('cannotUndoAfterConfirm'),
  } = props;

  const handleOk = () => {
    onOk();
    onClose();
  };

  return (
    <StyledPopup
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box>
        <Box className="close-icon" display="flex" justifyContent="flex-end">
          <IconButton
            aria-label="close"
            className="close-button"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box paddingX={3} pb={2} className="content-container">
          <Box>
            <img src="/img/note.svg" alt="" />
          </Box>
          <Box>
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-description"
                className="content"
              >
                {content}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleOk} variant="contained" color="primary">
                {okMessage}
              </Button>
              <Button onClick={onClose} variant="outlined" color="primary">
                {cancelMessage}
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </Box>
    </StyledPopup>
  );
};

export default Popup;
