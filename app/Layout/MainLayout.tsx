import '@ant-design/v5-patch-for-react-19';
import { App } from 'antd';
import { ReactNode } from 'react';
import AuthProvider from "../components/auth/SessionProvider";

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <App message={{ maxCount: 1 }} notification={{ placement: 'top' }}>
      <AuthProvider>{children}</AuthProvider>
    </App>
  )
}

export default MainLayout