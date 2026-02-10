'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useGetUsers } from '@/services/useGetUsers';
import SideBar from '@/components/sideBar';
import UserEditor from '@/components/UserEditor';
import styles from './page.module.css';
import { useUpdateUser } from '@/services/useUpdateUser';
import { Snackbar } from '@mui/joy';
import { User } from '@/types/User';

export default function Page() {
  const pathname = usePathname();
  const user_id = pathname.split('/').pop();

  const [isLoading, setIsLoading] = React.useState(true);

  const [user, setUser] = React.useState<User | null>(null);
  const [showSnack, setShowSnack] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');
  const [success, setSuccess] = React.useState(true);

  React.useEffect(() => {
    const fetchUsers = async () => {
      if (typeof user_id === 'string') {
        const users = await useGetUsers(user_id);
        setUser(users[0]);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user_id]);

  const handleSave = async () => {
    if (user) {
      const success = await useUpdateUser(user._id.$oid, user.username, user.user_tag, user.email, user.color);
      setSuccess(success);
      if (success) {
        setSnackText('Nutzer erfolgreich aktualisiert.');
      } else {
        setSnackText('Fehler beim Aktualisieren des Nutzers.');
      }
      setShowSnack(true);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Snackbar
        open={showSnack}
        onClose={() => setShowSnack(false)}
        key="updateSnack"
        color={success ? 'success' : 'danger'}
        variant="solid"
      >
        {snackText}
      </Snackbar>
      <SideBar showBackButton showSaveButton onSave={handleSave} buttons={[]} />
      <div className={styles.content}>
        <UserEditor
          user={user}
          setUser={(u) =>
            setUser(
              u
                ? {
                    ...u,
                    _id: {
                      $oid:
                        typeof u._id === 'string'
                          ? u._id
                          : u._id && typeof (u._id as any).$oid === 'string'
                          ? (u._id as any).$oid
                          : '',
                    },
                  }
                : null,
            )
          }
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
