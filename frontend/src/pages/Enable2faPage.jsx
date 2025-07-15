import { getMyProfile, linkWallet, generate2FA, enable2FA } from '../api/services';

// 2FA State
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFAInfo, setTwoFAInfo] = useState(null);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAError, setTwoFAError] = useState('');