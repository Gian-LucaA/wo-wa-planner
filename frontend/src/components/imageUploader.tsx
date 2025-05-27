import * as React from 'react';
import { Button, Input, SvgIcon } from '@mui/joy';
import { styled } from '@mui/joy';
import { useUploadImage } from '../hooks/useUploadImage';

export default function ImageUploader() {
  const [file, setFile] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const place_id = 'id';
    const success = await useUploadImage(place_id, file);

    if (success) {
      console.log('Upload successful');
    } else {
      console.error('Upload failed');
    }
  };

  React.useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  return (
    <>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="solid" component="span">
          Upload
        </Button>
      </label>
    </>
  );
}
