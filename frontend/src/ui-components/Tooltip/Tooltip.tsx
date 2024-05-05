import React from 'react';

const CustomTooltip = (props: { content: string }) => {
  const { content } = props;
  return (
    <div style={{ position: 'absolute', display: 'inline-block' }}>
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          padding: '10px',
          borderRadius: '4px',
          zIndex: 1,
          fontSize: '10px',
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default CustomTooltip;
