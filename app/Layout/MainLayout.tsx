import '@ant-design/v5-patch-for-react-19';
import { ReactNode } from 'react';
import AuthProvider from "../components/auth/SessionProvider";

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div >
      <AuthProvider>{children}</AuthProvider>
    </div>
  )
}

export default MainLayout