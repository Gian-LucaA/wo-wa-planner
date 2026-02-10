import * as React from 'react';
import { Button, ButtonGroup, DialogContent, DialogTitle, FormControl, FormLabel, Input } from '@mui/joy';
import UsersSelector from '../usersSelector';
import ImageUploader from '../imageUploader';

export default function Loader() {
  const [newPlace, setNewPlace] = React.useState({ name: '', location: '', users: [] });

  function handleFieldChange(field: string, value: any): void {
    setNewPlace((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleCreateNewPlace(newPlace: { name: string; location: string; users: never[] }) {
    setNewPlace({ name: '', location: '', users: [] });
  }

  function setOpen(_open: boolean): void {}
  return (
    <div>
      <DialogTitle id="modal-title">Neuen Ort hinzufügen</DialogTitle>
      <DialogContent>Fülle die Informationen aus um einen neuen Ort hinzuzufügen.</DialogContent>
      <div style={{ margin: '20px' }} />
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Namen eingeben ..." onChange={(e) => handleFieldChange('name', e.target.value)} />
      </FormControl>
      <div style={{ margin: '20px' }} />
      <FormControl>
        <FormLabel>Ort</FormLabel>
        <Input placeholder="Ort eingeben ..." onChange={(e) => handleFieldChange('location', e.target.value)} />
      </FormControl>
      <div style={{ margin: '20px' }} />
      <FormControl>
        <FormLabel>Nutzer</FormLabel>
        <UsersSelector onChange={(users) => handleFieldChange('users', users)} />
      </FormControl>
      <div style={{ margin: '20px' }} />
      <FormControl>
        <FormLabel>Bild</FormLabel>
        <ImageUploader />
      </FormControl>
      <div style={{ margin: '20px' }} />
      <ButtonGroup spacing={1} color="primary">
        <Button onClick={() => setOpen(false)} variant="outlined">
          Abbrechen
        </Button>
        <Button
          variant="solid"
          disabled={newPlace.name === '' || newPlace.location === ''}
          onClick={() => {
            handleCreateNewPlace(newPlace);
          }}
        >
          Speichern
        </Button>
      </ButtonGroup>
    </div>
  );
}
