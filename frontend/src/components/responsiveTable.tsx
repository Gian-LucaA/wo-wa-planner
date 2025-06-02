'use client';

import React from 'react';
import { Box, Table, Typography } from '@mui/joy';
import { useTheme } from '@mui/joy/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface Field<T> {
  label: string;
  render: (item: T) => React.ReactNode;
  necessary?: boolean; // Only used in mobile/card view
}

interface Props<T> {
  data: T[];
  headerField: Field<T>;
  infoFields: Field<T>[];
  footerField?: Field<T>;
  buttons?: (item: T) => React.ReactNode[];
  emptyText?: string;
}

function ResponsiveTableList<T>({
  data,
  headerField,
  infoFields,
  footerField,
  buttons,
  emptyText = 'Keine Daten verfügbar.',
}: Props<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <>
        {data.length === 0 ? (
          <Typography sx={{ mt: 4 }}>{emptyText}</Typography>
        ) : (
          data.map((item, index) => (
            <Box
              key={index}
              sx={{
                border: '1px solid #ccc',
                borderRadius: 10,
                p: 2,
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>
                    {headerField.render(item)}
                  </Typography>

                  {infoFields
                    .filter((field) => field.necessary !== false)
                    .map((field, idx) => (
                      <Typography key={idx}>{field.render(item)}</Typography>
                    ))}
                </Box>

                {footerField && <Typography sx={{ mt: 2 }}>{footerField.render(item)}</Typography>}
              </Box>

              {buttons && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'end',
                  }}
                >
                  {buttons(item).map((btn, idx) => (
                    <span key={idx}>{btn}</span>
                  ))}
                </Box>
              )}
            </Box>
          ))
        )}
      </>
    );
  }

  // Desktop: Full Table
  return (
    <Table hoverRow>
      <thead>
        <tr>
          <th>{headerField.label}</th>
          {infoFields.map((field, idx) => (
            <th key={idx}>{field.label}</th>
          ))}
          {footerField && <th>{footerField.label}</th>}
          {buttons && <th>Aktionen</th>}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={10} align="center">
              {emptyText}
            </td>
          </tr>
        ) : (
          data.map((item, idx) => (
            <tr key={idx}>
              <td>{headerField.render(item)}</td>
              {infoFields.map((field, i) => (
                <td key={i}>{field.render(item)}</td>
              ))}
              {footerField && <td>{String(footerField.render(item)).replace(/^Erstellt am:\s*/, '')}</td>}
              {buttons && (
                <td>
                  {buttons(item).map((btn, i) => (
                    <span key={i}>{btn}</span>
                  ))}
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default ResponsiveTableList;
