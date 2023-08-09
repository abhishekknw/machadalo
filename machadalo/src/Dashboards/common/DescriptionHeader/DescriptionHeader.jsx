import React from 'react';

export default function DescriptionHeader(props) {
  const { data } = props;
  const styles = {
    main: {
      position: 'sticky',
      top: 0,
      'z-index': 9,
      background: '#5f76e8',
      padding: '10px',
      borderRadius: '0px',
      display: 'flex',
      gap: '15px',
      color: '#fff',
      'overflow-x': 'auto',
      'justify-content': 'center',
      fontSize: '16px',
    },
    label: {
      'font-weight': 600,
    },
    item: {
      display: 'flex',
      gap: '6px',
    },
  };
  return (
    <div className="mb-2" style={styles.main}>
      {data &&
        data.map((item, index) => {
          return (
            <div className="" style={styles?.item} key={index}>
              <span className="" style={styles.label}>
                {item?.label}:-
              </span>
              <span className="status-data">{item?.value}</span>
            </div>
          );
        })}
    </div>
  );
}
