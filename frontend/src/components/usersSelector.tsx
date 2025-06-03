import { useFetchUsers } from '@/services/useFetchUsers';
import { User } from '@/types/User';
import { Autocomplete } from '@mui/joy';
import * as React from 'react';

export default function UsersSelector({ onChange }: { onChange: (users: User[]) => void }) {
  const [searched, setSearched] = React.useState<string>('');
  const [loading, isLoading] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<User[] | any[]>([{ username: 'Bitte fange an zu tippen.' }]);

  React.useEffect(() => {
    if (searched === '') {
      setUsers([{ username: 'Bitte fange an zu tippen.' }]);
      return;
    }
    const fetchUsers = async () => {
      if (typeof searched === 'string') {
        const users = await useFetchUsers(searched);
        setUsers(users);
        isLoading(false);
      }
    };

    fetchUsers();
  }, [searched]);

  return (
    <>
      <Autocomplete
        placeholder="Benutzer hinzufügen"
        options={users}
        getOptionLabel={(option) => {
          if (option.email) {
            return option.username + ' (' + option.email + ')';
          } else {
            return option.username;
          }
        }}
        getOptionDisabled={(option) => option.username === 'Bitte fange an zu tippen.'}
        isOptionEqualToValue={(option, value) =>
          option.username === value.username && option.email === value.email && option.user_tag === value.user_tag
        }
        multiple
        loading={loading}
        onInputChange={(event, value) => {
          isLoading(true);
          setSearched(value);
        }}
        onChange={(event, value) => {
          isLoading(true);
          onChange(value as User[]);
        }}
      />
    </>
  );
}
