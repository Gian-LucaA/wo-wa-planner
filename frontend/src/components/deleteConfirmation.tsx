import * as React from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Input } from '@mui/joy';

interface DeleteDialogModalProps {
  showDeleteDialog: boolean;
  setShowDeleteDialog: (value: boolean) => void;
  confirmation?: string;
  handleDeleteConfirmed: () => void;
  message?: string;
}

export default function DeleteDialogModal({
  showDeleteDialog,
  setShowDeleteDialog,
  confirmation,
  handleDeleteConfirmed,
  message = 'Möchtest du diesen Eintrag wirklich löschen?',
}: DeleteDialogModalProps) {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [isInputValid, setIsInputValid] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <Modal
        open={showDeleteDialog}
        onClose={() => {
          setInputValue('');
          setIsInputValid(false);
          setShowDeleteDialog(false);
        }}
      >
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div style={{ whiteSpace: 'pre-line' }}>{message}</div>
            {confirmation && (
              <>
                <b style={{ marginTop: '10px' }}>{confirmation}</b>
                <Input
                  placeholder="Bitte tippe den Namen ein."
                  color="danger"
                  value={inputValue}
                  onChange={(event) => {
                    setInputValue(event.target.value);
                    setIsInputValid(event.target.value === confirmation);
                  }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="danger"
              onClick={() => {
                setInputValue('');
                setIsInputValid(false);
                setShowDeleteDialog(false);
                handleDeleteConfirmed();
              }}
              disabled={!isInputValid && !!confirmation}
            >
              Eintrag löschen
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => {
                setInputValue('');
                setIsInputValid(false);
                setShowDeleteDialog(false);
              }}
            >
              Abbrechen
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
