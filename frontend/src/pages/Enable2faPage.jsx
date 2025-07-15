import { getMyProfile, linkWallet, generate2FA, enable2FA } from '../api/services';

// 2FA State
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFAInfo, setTwoFAInfo] = useState(null);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAError, setTwoFAError] = useState('');

// --- 2FA Handlers ---
  const handleEnable2FAClick = async () => {
    setTwoFAError('');
    try {
      const data = await generate2FA();
      setTwoFAInfo(data);
      setShow2FASetup(true);
    } catch (err) {
      setTwoFAError(err.response?.data?.detail || 'Failed to start 2FA setup.');
    }
  };

  const handleVerifyAndEnable2FA = async () => {
    if (!twoFACode || !twoFAInfo?.secret_key) return;
    setTwoFAError('');
    try {
      await enable2FA(twoFAInfo.secret_key, twoFACode);
      alert('2FA enabled successfully!');
      setShow2FASetup(false);
      setTwoFAInfo(null);
      setTwoFACode('');
      fetchProfile(); // Refetch profile to update 2FA status
    } catch (err) {
      setTwoFAError(err.response?.data?.detail || 'Failed to enable 2FA.');
    }
  };

  const handleClose2FADialog = () => {
    setShow2FASetup(false);
    setTwoFAInfo(null);
    setTwoFAError('');
    setTwoFACode('');
  };