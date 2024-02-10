import LoginContent from "../components/LoginContent/LoginContent";

export const metadata = {
    title: 'Al-DARWAZA | LOGIN',
    description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    icons: {
        icon: '/logo-white.svg'
    }
};
const LoginPage = () => {

    return (
        <LoginContent/>
    );
};

export default LoginPage;
