import React from 'react';
import * as MdIcons from 'react-icons/md';

export const DynamicIcon = ({ iconName }) => {

  const IconComponent = MdIcons[iconName];
  
  
  if (!IconComponent) {
    return <MdIcons.MdHelpCenter style={{ fontSize: '20px' }} />;
  }

  return <IconComponent style={{ fontSize: '20px' }} />;
};
