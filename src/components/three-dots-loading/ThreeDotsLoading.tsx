import { Spin } from 'antd';

const ThreeDotsLoading = () => {
  return (
    <Spin
      indicator={
        <>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </>
      }
    />
  );
};

export default ThreeDotsLoading;
