'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Card } from '@mui/joy';
import styles from './page.module.css';

export default function Page() {
  const pathname = usePathname();
  const place_id = pathname.split('/').slice(0, -1).pop();

  return (
    <>
      <Card variant="outlined" size="md" className={styles.card}>
        Hi, How are you? place_id: {place_id}
      </Card>
    </>
  );
}
