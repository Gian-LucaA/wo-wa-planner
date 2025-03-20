'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Bookings from '@/components/Bookings/bookings';
import { Card } from '@mui/joy';
import styles from './page.module.css';

export default function Page() {
  const pathname = usePathname();
  const place_id = pathname.split('/').pop();

  return (
    <>
      <Card variant="outlined" size="md" className={styles.card}>
        <Bookings />
      </Card>
    </>
  );
}
