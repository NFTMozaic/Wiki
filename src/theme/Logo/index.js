import React from 'react';
import OriginalLogo from '@theme-original/Logo';

export default function LogoWrapper(props) {
  return (
    <OriginalLogo
      {...props}
      logo={{
        ...props.logo,
        href: 'https://nftmozaic.com/',
        target: '_blank',
        alt: 'NFTMozaic Logo',
      }}
    />
  );
}
