import '../styles/globals.css';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';

export default function MyApp({ Component, pageProps }) {
    return (
        <RecoilRoot>
            <RecoilNexus />
            <Component {...pageProps} />
        </RecoilRoot>
    )
}