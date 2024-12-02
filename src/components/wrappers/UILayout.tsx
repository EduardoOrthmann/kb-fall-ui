'use client';

import { Layout } from 'antd';
import { Header, Content } from 'antd/es/layout/layout';
import Link from 'next/link';
import Image from 'next/image';
import TSystemsLogo from '../../../public/images/T-SYSTEMS-LOGO2013.svg';
import AuthButton from '../auth-button/AuthButton';
import ChatAside from '../chat-aside/ChatAside';

const UILayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/">
            <Image
              src={TSystemsLogo}
              alt="logo"
              width={120}
              height={70}
              style={{ filter: 'invert(1) brightness(100) contrast(1)' }}
            />
          </Link>
          <div className="text-lg font-bold">Real-time Chat</div>
        </div>
        <AuthButton />
      </Header>
      <Layout>
        <ChatAside />
        <Content
          style={{
            padding: '30px 50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UILayout;

