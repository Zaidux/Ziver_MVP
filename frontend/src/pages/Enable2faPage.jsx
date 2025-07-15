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

{/* 2FA Setup Dialog */}
      <Dialog open={show2FASetup} onClose={handleClose2FADialog}>
        <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
        <DialogContent>
          <DialogContentText>
            1. Scan the QR code with your authenticator app (e.g., Google Authenticator).
          </DialogContentText>
          {twoFAInfo?.qr_code_uri && <img src={twoFAInfo.qr_code_uri} alt="2FA QR Code" style={{ margin: '16px auto', display: 'block' }} />}
          <DialogContentText sx={{ mt: 2 }}>
            2. Enter the 6-digit code from your app to verify and activate 2FA.
          </DialogContentText>
          <TextField
            autoFocus margin="dense" id="2fa-code" label="Verification Code" type="text"
            fullWidth variant="standard" value={twoFACode}
            onChange={(e) => setTwoFACode(e.target.value)}
            inputProps={{ maxLength: 6 }}
          />
          {twoFAError && <Alert severity="error" sx={{ mt: 2 }}>{twoFAError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2FADialog}>Cancel</Button>
          <Button onClick={handleVerifyAndEnable2FA} variant="contained">Verify & Activate</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}