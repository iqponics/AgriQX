import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { authApi } from '../api/authApi';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
    const { confirmationCode } = useParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const navigate = useNavigate();
    const { fetchData } = useApi();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                if (confirmationCode) {
                    await fetchData(authApi.confirmEmail(confirmationCode), 'GET');
                }
                setStatus('success');
                setTimeout(() => {
                    navigate('/login'); // Redirect to login after verification
                }, 4000);
            } catch {
                setStatus('error');
            }
        };

        verifyEmail();
    }, [confirmationCode, fetchData, navigate]);

    return (
        <div className="min-h-screen bg-[#F0FDF4] flex flex-col items-center justify-center pt-20 px-4">
            <div className="max-w-[480px] w-full bg-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-green-50 text-center flex flex-col items-center">
                <Link to="/" className="mb-6 hover:opacity-80 transition-opacity">
                    <img
                        src="/IQponics.png"
                        alt="Green Life Ponics"
                        className="h-20 w-auto object-contain"
                    />
                </Link>

                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-poppins">
                    Email Verification
                </h1>

                <div className="mt-8 flex flex-col items-center justify-center min-h-[160px]">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="h-16 w-16 text-green-500 animate-spin mb-4" />
                            <p className="text-gray-500 font-medium text-lg">
                                Verifying your email address...
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                Please wait a moment while we confirm your details.
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4 animate-bounce" />
                            <p className="text-gray-900 font-bold text-xl">
                                Email Verified Successfully!
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                You will be redirected to the login page shortly...
                            </p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className="h-16 w-16 text-red-500 mb-4" />
                            <p className="text-gray-900 font-bold text-xl">
                                Verification Failed
                            </p>
                            <p className="text-gray-500 text-sm mt-2 mb-6">
                                The verification link may be invalid or has expired. Please try registering again or contact support.
                            </p>
                            <Link
                                to="/signup"
                                className="w-full flex items-center justify-center py-4 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-500/30"
                            >
                                Return to Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;