'use client';

import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
          <Typography align="center" sx={{ mt: 4 }}>
            {emptyText}
          </Typography>
        ) : (
          data.map((item, index) => (
            <Box
              key={index}
              sx={{
                border: '1px solid #ccc',
                borderRadius: 2,
                p: 2,
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                gap: 2,
              }}
            >
              {/* Left content: header, info, footer */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    {headerField.render(item)}
                  </Typography>

                  {infoFields
                    .filter((field) => field.necessary !== false)
                    .map((field, idx) => (
                      <Typography key={idx} variant="body2" color="text.secondary">
                        {field.render(item)}
                      </Typography>
                    ))}
                </Box>

                {footerField && (
                  <Typography variant="caption" color="text.disabled" sx={{ mt: 2 }}>
                    {footerField.render(item)}
                  </Typography>
                )}
              </Box>

              {/* Right content: buttons */}
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
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{headerField.label}</TableCell>
            {infoFields.map((field, idx) => (
              <TableCell key={idx}>{field.label}</TableCell>
            ))}
            {footerField && <TableCell>{footerField.label}</TableCell>}
            {buttons && <TableCell>Aktionen</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} align="center">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{headerField.render(item)}</TableCell>
                {infoFields.map((field, i) => (
                  <TableCell key={i}>{field.render(item)}</TableCell>
                ))}
                {footerField && (
                  <TableCell>{String(footerField.render(item)).replace(/^Erstellt am:\s*/, '')}</TableCell>
                )}
                {buttons && (
                  <TableCell>
                    {buttons(item).map((btn, i) => (
                      <span key={i}>{btn}</span>
                    ))}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResponsiveTableList;
