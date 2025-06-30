import React from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';

interface RecordableButtonProps extends ButtonProps {
  record: (msg: string) => void;
  desc: string;
}

export const RecordableButton: React.FC<RecordableButtonProps> = ({ record, desc, onClick, ...rest }) => {
  return (
    <Button
      {...rest}
      onClick={(e) => {
        record(desc);
        onClick?.(e);
      }}
    />
  );
}; 