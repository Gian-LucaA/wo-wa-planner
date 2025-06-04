'use client';

import * as React from 'react';
import { AspectRatio, Card, CardContent, CardOverflow, Typography } from '@mui/joy';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import theme from '@/theme';

interface PlaceCardProps {
  add?: boolean;
  name: string;
  location: string;
  imgPath?: string;
  id?: string;
  currentlyOccupied: boolean;
  onClick?: () => void;
}

export default function PlaceCard({
  add,
  name,
  location,
  // img,
  id,
  currentlyOccupied,
  onClick,
}: PlaceCardProps) {
  return (
    <Card
      orientation="horizontal"
      variant="plain"
      color="neutral"
      style={{
        backgroundColor: 'var(--custom-bg)',
      }}
      sx={{
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        width: 280,
      }}
      onClick={onClick}
      key={id}
    >
      {add ? (
        <CardOverflow variant="soft" color="success">
          <AspectRatio ratio="1" sx={{ width: 90 }} color="success">
            <AddRoundedIcon color="success" />
          </AspectRatio>
        </CardOverflow>
      ) : (
        <CardOverflow>
          <AspectRatio ratio="1" sx={{ width: 90 }}>
            <img
              src="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90"
              srcSet="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90&dpr=2 2x"
              loading="lazy"
              alt=""
            />
          </AspectRatio>
        </CardOverflow>
      )}

      <CardContent
        style={{
          background: 'rgba(0,0,0,0)',
        }}
      >
        <Typography sx={{ fontWeight: 'md' }}>{name}</Typography>
        <Typography level="body-sm" style={{ lineHeight: 1 }}>
          {location}
        </Typography>
      </CardContent>
      {!add &&
        (currentlyOccupied ? (
          <CardOverflow
            variant="soft"
            color="danger"
            sx={{
              px: 0.2,
              writingMode: 'vertical-rl',
              justifyContent: 'center',
              fontSize: 'xs',
              fontWeight: 'xl',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              borderLeft: '1px solid',
              borderColor: 'divider',
            }}
          >
            Belegt
          </CardOverflow>
        ) : (
          <CardOverflow
            variant="soft"
            color="success"
            sx={{
              px: 0.2,
              writingMode: 'vertical-rl',
              justifyContent: 'center',
              fontSize: 'xs',
              fontWeight: 'xl',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              borderLeft: '1px solid',
              borderColor: 'divider',
            }}
          >
            Frei
          </CardOverflow>
        ))}
    </Card>
  );
}
