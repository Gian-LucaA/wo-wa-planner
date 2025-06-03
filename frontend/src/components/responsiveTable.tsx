'use client';

import React from 'react';
import { Box, Table, Typography, IconButton } from '@mui/joy';
import { useTheme } from '@mui/joy/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface Field<T> {
  label: string;
  render: (item: T) => React.ReactNode;
  key?: keyof T;
  necessary?: boolean; // Only used in mobile/card view
  showLabel?: boolean;
}

interface Props<T> {
  data: T[];
  headerField: Field<T>;
  infoFields: Field<T>[];
  footerField?: Field<T>;
  buttons?: (item: T) => React.ReactNode[];
  emptyText?: string;
  sortField?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: keyof T) => void;
}

function ResponsiveTableList<T>({
  data,
  headerField,
  infoFields,
  footerField,
  buttons,
  emptyText = 'Keine Daten verfügbar.',
  sortField,
  sortDirection,
  onSort,
}: Props<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderSortLabel = (field: keyof T) => {
    if (!onSort) return null;
    const isActive = sortField === field;
    return (
      <IconButton size="sm" onClick={() => onSort(field)}>
        {isActive ? sortDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon /> : <ArrowDropDownIcon />}
      </IconButton>
    );
  };

  if (isMobile) {
    return (
      <>
        {/* Sortierleiste für Mobile */}
        {onSort && (
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            {infoFields
              .filter((field) => field.key)
              .map((field, idx) => {
                const isActive = sortField === field.key;
                return (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => field.key && onSort(field.key)}
                  >
                    <Typography fontWeight={isActive ? 'bold' : 'normal'}>{field.label}</Typography>
                    {field.key &&
                      isActive &&
                      (sortDirection === 'asc' ? (
                        <ArrowDropUpIcon fontSize="small" />
                      ) : (
                        <ArrowDropDownIcon fontSize="small" />
                      ))}
                  </Box>
                );
              })}
          </Box>
        )}

        {/* Mobile Cards */}
        {data.length === 0 ? (
          <Typography sx={{ mt: 4 }}>{emptyText}</Typography>
        ) : (
          data.map((item, index) => (
            <Box
              key={index}
              sx={{
                borderRadius: 10,
                p: 2,
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                gap: 2,
                backgroundColor: 'var(--background)',
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
                      <Typography key={idx}>
                        {field.showLabel && <strong style={{ marginRight: 4 }}>{field.label}:</strong>}
                        {field.render(item)}
                      </Typography>
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
          <th style={{ alignContent: 'center' }}>{headerField.label}</th>
          {infoFields.map((field, idx) => (
            <th key={idx} style={{ cursor: field.key && onSort ? 'pointer' : 'default', alignContent: 'center' }}>
              <Box display="flex" alignItems="center">
                {field.label}
                {field.key && renderSortLabel(field.key)}
              </Box>
            </th>
          ))}
          {footerField && <th style={{ alignContent: 'center' }}>{footerField.label}</th>}
          {buttons && <th style={{ alignContent: 'center' }}>Aktionen</th>}
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
            <tr key={idx} style={{ backgroundColor: 'var(--background)' }}>
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
